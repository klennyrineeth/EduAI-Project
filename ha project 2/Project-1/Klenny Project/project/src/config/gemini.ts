import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Initialize OpenAI for image generation
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Create a model instance for text generation
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Create a model instance for image understanding
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

// Validate API keys
const validateAPIKeys = () => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not set. Please add VITE_GEMINI_API_KEY to your .env file.');
  }
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set. Please add VITE_OPENAI_API_KEY to your .env file.');
  }
};

export const generateAIContent = async (prompt: string) => {
  try {
    validateAPIKeys();
    
    // Check if the prompt contains a base64 image
    if (prompt.includes('data:image')) {
      // Extract the base64 image and the text prompt
      const [textPrompt, base64Image] = prompt.split(': ');
      
      // Create image part for Gemini vision model
      const imagePart = {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: 'image/jpeg'
        }
      };

      // Use vision model for image analysis
      const result = await visionModel.generateContent([textPrompt, imagePart]);
      const response = await result.response;
      return response.text();
    } else {
      // Use text model for regular text prompts
      const result = await textModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error('Error in generateAIContent:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate AI content: ${error.message}`);
    }
    throw new Error('Failed to generate AI content. Please check your API keys and try again.');
  }
};

export const generateAIImage = async (prompt: string) => {
  try {
    validateAPIKeys();

    // Remove base64 image data if present to avoid token limit issues
    const cleanPrompt = prompt.includes('data:image') 
      ? prompt.split(': ')[0] 
      : prompt;

    // Enhanced prompt for better educational visualizations
    const enhancedPrompt = `Create a detailed educational visualization for: ${cleanPrompt}. 
    Requirements:
    - Clear and professional design
    - Suitable for educational purposes
    - High visual clarity and readability
    - Include relevant educational elements
    - Use appropriate colors and contrast
    Make it engaging and informative for students.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    if (!response.data?.[0]?.url) {
      throw new Error('No image URL received from OpenAI');
    }

    return response.data[0].url;
  } catch (error) {
    console.error('Error in generateAIImage:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing OpenAI API key. Please check your .env file.');
      }
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('Failed to generate image. Please try again.');
  }
}; 