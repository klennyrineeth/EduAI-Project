import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, RefreshCw, X, Link, Loader2, Pause, Maximize2 } from 'lucide-react';
import { generateAIContent, generateAIImage } from '../config/gemini';

export function LiveDemo() {
  const [isTraditional, setIsTraditional] = useState(true);
  const [content, setContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'text' | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullSize, setShowFullSize] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop any ongoing speech when component unmounts
      speechSynthesis.cancel();
    };
  }, []);

  const handlePlayPreview = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!isTraditional && aiContent) {
      const utterance = new SpeechSynthesisUtterance(aiContent);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        console.error('Speech synthesis error');
        setIsPlaying(false);
      };
      setIsPlaying(true);
      speechSynthesis.speak(utterance);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    
    // Create preview URL for the file
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Determine media type
    if (file.type.startsWith('image/')) {
      setMediaType('image');
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      setMediaType('text');
      // Read text file content
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newContent = e.target.value;
    setContent(newContent);
    setMediaType('text');
    setPreviewUrl(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlInput(newUrl);
    if (isValidUrl(newUrl)) {
      processUrlContent(newUrl);
    }
  };

  const handleToggle = async () => {
    // Only process if we're switching to AI view
    if (isTraditional) {
      setIsProcessingAI(true);
      try {
        let prompt = content;
        if (mediaType === 'image' && previewUrl) {
          // For images, we need to include the image data in our prompt
          const response = await fetch(previewUrl);
          const blob = await response.blob();
          const base64Image = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          prompt = `Analyze this educational image and generate an enhanced version with improvements: ${base64Image}`;
        }

        // Generate both AI content and image simultaneously
        const [aiResponse, imageUrl] = await Promise.all([
          generateAIContent(prompt),
          generateAIImage(prompt)
        ]);

        setAiContent(aiResponse || '');
        setAiImageUrl(imageUrl || null);
        
        // Switch to AI view after content is ready
        setIsTraditional(false);
      } catch (error) {
        console.error('Error generating AI content:', error);
        alert('Failed to generate AI content. Please try again.');
      } finally {
        setIsProcessingAI(false);
      }
    } else {
      // Switch back to traditional view immediately
      setIsTraditional(true);
    }
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const isImageUrl = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const processUrlContent = async (url: string) => {
    setIsProcessingAI(true);
    try {
      // Add CORS proxy if needed for external URLs
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      const processUrl = url.startsWith('http') ? `${corsProxy}${url}` : url;
      
      // First try to detect by URL extension
      if (isVideoUrl(url)) {
        setPreviewUrl(url); // Use original URL for video sources
        setMediaType('video');
        setContent(url);
        return true;
      } else if (isImageUrl(url)) {
        try {
          // Try to fetch the image to verify it's accessible
          const response = await fetch(processUrl);
          if (!response.ok) throw new Error('Failed to fetch image');
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
          setMediaType('image');
          setContent(url);
          return true;
        } catch (error) {
          console.error('Error fetching image:', error);
          // If fetch fails, try direct URL
          setPreviewUrl(url);
          setMediaType('image');
          setContent(url);
          return true;
        }
      }

      // If no extension match, try loading as image
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          setPreviewUrl(url);
          setMediaType('image');
          setContent(url);
          resolve(true);
        };
        img.onerror = () => {
          // Try as video
          const video = document.createElement('video');
          video.onloadeddata = () => {
            setPreviewUrl(url);
            setMediaType('video');
            setContent(url);
            resolve(true);
          };
          video.onerror = () => {
            resolve(false);
          };
          video.src = url;
        };
        img.src = url;
      });
    } catch (error) {
      console.error('Error processing URL:', error);
      return false;
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlMatch = urlInput.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      const url = urlMatch[0];
      if (isValidUrl(url)) {
        const success = await processUrlContent(url);
        if (!success) {
          alert('Please enter a valid image or video URL');
        }
      } else {
        alert('Please enter a valid URL');
      }
    } else {
      alert('Please enter a URL starting with http:// or https://');
    }
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const FullSizeModal = () => {
    if (!showFullSize) return null;

    // Prevent background scrolling when modal is open
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
    
    const currentUrl = !isTraditional ? aiImageUrl : previewUrl;
    const isCurrentImage = !isTraditional || mediaType === 'image';
    
    const handleClose = () => {
      setShowFullSize(false);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    };
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center overflow-y-auto p-4"
        onClick={handleBackdropClick}
      >
        <div className="relative bg-white rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh] w-full">
          <button
            onClick={handleClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-200 z-50"
          >
            <X size={32} />
          </button>
          <div className="overflow-auto max-h-[90vh] p-4">
            {isCurrentImage ? (
              <img
                src={currentUrl || ''}
                alt="Full size preview"
                className="w-full h-auto object-contain"
                style={{ maxHeight: 'calc(90vh - 2rem)' }}
              />
            ) : (
              <video
                src={currentUrl || ''}
                controls
                className="w-full h-auto max-h-[80vh]"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <FullSizeModal />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Experience the Transformation
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            See how AI transforms traditional content into interactive learning experiences
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Input Content</h2>
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Enter your educational content here..."
                className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.txt"
                  />
                  <form onSubmit={handleUrlSubmit} className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste an image/video URL..."
                      value={urlInput}
                      onChange={handleUrlChange}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button 
                      type="submit"
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors whitespace-nowrap"
                    >
                      <Link size={16} /> Load URL
                    </button>
                  </form>
                  
                  <button
                    onClick={async () => {
                      if (!content.trim()) {
                        alert('Please enter some text to generate AI content');
                        return;
                      }
                      setIsProcessingAI(true);
                      try {
                        const [aiResponse, imageUrl] = await Promise.all([
                          generateAIContent(content),
                          generateAIImage(content)
                        ]);
                        setAiContent(aiResponse || '');
                        setAiImageUrl(imageUrl || null);
                        setIsTraditional(false);
                      } catch (error) {
                        console.error('Error generating AI content:', error);
                        alert('Failed to generate AI content. Please try again.');
                      } finally {
                        setIsProcessingAI(false);
                      }
                    }}
                    disabled={isProcessingAI || !content.trim()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isProcessingAI ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        Generate AI
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-start">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors whitespace-nowrap"
                  >
                    <Upload size={16} /> Upload File
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Preview</h2>
            </div>
            
            <div className={`min-h-[24rem] rounded-lg flex flex-col items-center justify-center overflow-hidden p-4 ${
              isTraditional ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white'
            }`}>
              {isProcessingAI ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 size={24} className="animate-spin text-white" />
                  <p className="text-white text-sm">Generating AI content...</p>
                </div>
              ) : !isTraditional ? (
                // AI View
                <div className="w-full h-full overflow-auto space-y-4">
                  {aiImageUrl && (
                    <div className="flex flex-col items-center gap-2">
                      <img 
                        src={aiImageUrl} 
                        alt="AI-generated visualization" 
                        className="max-w-full h-auto rounded-lg shadow-lg cursor-pointer"
                        onClick={() => setShowFullSize(true)}
                      />
                      <button
                        onClick={() => setShowFullSize(true)}
                        className="text-sm text-white/80 hover:text-white flex items-center gap-1"
                      >
                        <Maximize2 size={14} />
                        Click to enlarge
                      </button>
                    </div>
                  )}
                  {aiContent && (
                    <pre className="whitespace-pre-wrap text-white">{aiContent}</pre>
                  )}
                  {!aiContent && !aiImageUrl && (
                    <p className="text-center opacity-70">AI-Enhanced View</p>
                  )}
                </div>
              ) : (
                // Traditional View
                <div className="w-full h-full overflow-auto space-y-4">
                  {mediaType === 'image' && previewUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <img 
                        src={previewUrl} 
                        alt="Content preview" 
                        className="max-w-full h-auto rounded-lg shadow-lg cursor-pointer"
                        onClick={() => setShowFullSize(true)}
                        onError={() => {
                          setPreviewUrl(null);
                          setMediaType(null);
                          alert('Failed to load image. Please try again.');
                        }}
                      />
                      {previewUrl && (
                        <button
                          onClick={() => setShowFullSize(true)}
                          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                        >
                          <Maximize2 size={16} />
                          Enlarge Image
                        </button>
                      )}
                    </div>
                  ) : mediaType === 'video' && previewUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <video 
                        src={previewUrl} 
                        controls 
                        className="max-w-full h-auto rounded-lg shadow-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                      <button
                        onClick={() => setShowFullSize(true)}
                        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                      >
                        <Maximize2 size={16} />
                        Enlarge Video
                      </button>
                    </div>
                  ) : content ? (
                    <pre className="whitespace-pre-wrap">{content}</pre>
                  ) : (
                    <p className="text-center opacity-70">Enter content or upload a file to begin</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Use the Demo</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter your educational content in the input area or upload a file</li>
            <li>Your content will appear in the preview section</li>
            <li>Click "Generate AI Content" to create AI-enhanced version</li>
            <li>The AI will generate both enhanced content and visualizations</li>
          </ol>
        </div>
      </div>
    </div>
  );
}