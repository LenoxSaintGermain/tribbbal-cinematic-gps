
import { GoogleGenAI, Type } from "@google/genai";
import { Scene } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSceneNarrative(sceneContent: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a museum curator for a high-end digital gallery. Analyze this cinematic scene content: "${sceneContent}". 
      
      Generate a "Curator's Analysis" package containing:
      1. A "curatorNote": An interpretive, art-critic style voice (max 30 words).
      2. "objectSpecs": Imaginative museum-label details appropriate for the medium (edition, year, format, dimensions, price).
      3. "context": Three layers of depth - Cultural Anchor (place/movement), Technical Choice (process), and Relevance (why now).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            curatorNote: { type: Type.STRING },
            objectSpecs: {
              type: Type.OBJECT,
              properties: {
                edition: { type: Type.STRING, description: "e.g. 'Edition of 12' or 'Unique State'" },
                year: { type: Type.STRING },
                format: { type: Type.STRING, description: "e.g. 'Archival Pigment Print' or '4K Digital Master'" },
                dimensions: { type: Type.STRING },
                price: { type: Type.STRING },
                isAvailable: { type: Type.BOOLEAN }
              },
              required: ["edition", "year", "format", "dimensions", "price"]
            },
            context: {
              type: Type.OBJECT,
              properties: {
                culturalAnchor: { type: Type.STRING, description: "The lineage or movement this belongs to" },
                technicalChoice: { type: Type.STRING, description: "Why this specific camera/medium was used" },
                relevance: { type: Type.STRING, description: "Why this work matters in this cultural moment" }
              },
              required: ["culturalAnchor", "technicalChoice", "relevance"]
            }
          },
          required: ["curatorNote", "objectSpecs", "context"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Narrative Error:", error);
    return null;
  }
}

export async function generatePersonalizedIntro(userName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a cinematic greeting for ${userName}. Max 5 words. Atmospheric and mysterious.`,
    });
    return response.text || "The sequence begins.";
  } catch {
    return "The scene begins.";
  }
}

export async function generatePostInsights(postContent: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this social media post content: "${postContent}". 
      Provide a cinematic vibe summary, 3 relevant hashtags (without #), a UI layout suggestion, and a hex color palette of 4 colors that match the mood.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibeSummary: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            uiSuggestion: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["vibeSummary", "tags", "uiSuggestion", "colorPalette"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return null;
  }
}

/**
 * God Mode: Simulates a high-fidelity cinematic scene from a prompt.
 * Generates metadata with Pro, then generates visual with Flash Image or Veo.
 */
export async function simulateCinematicScene(userPrompt: string): Promise<Scene | null> {
  try {
    const isVideoRequested = userPrompt.toLowerCase().includes('video') || 
                             userPrompt.toLowerCase().includes('clip') || 
                             userPrompt.toLowerCase().includes('motion');

    // Step 1: Generate Metadata & Detailed GenAI Prompt
    const metaResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Design a high-fidelity cinematic social media post metadata based on this intent: "${userPrompt}".
      Include director name (African diaspora themed), a poetic narrative, vibe, location, and camera gear.
      Define the cinematic tone, pacing (slow/medium/fast), primary emotion, and cinematic intent.
      Also provide a highly detailed GenAI prompt (max 75 words) that captures this aesthetic perfectly for ${isVideoRequested ? 'video' : 'image'} generation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            directorName: { type: Type.STRING },
            directorHandle: { type: Type.STRING },
            narrative: { type: Type.STRING },
            vibe: { type: Type.STRING },
            location: { type: Type.STRING },
            camera: { type: Type.STRING },
            score: { type: Type.STRING },
            genPrompt: { type: Type.STRING },
            pacing: { type: Type.STRING, description: "pacing of the scene: slow, medium, or fast" },
            tone: { type: Type.STRING },
            primaryEmotion: { type: Type.STRING },
            cinematicIntent: { type: Type.STRING },
            world: { type: Type.STRING, description: "The world this belongs to: WATCH, CREATE, COLLECT, CONNECT, or BUILD" }
          },
          required: ["directorName", "directorHandle", "narrative", "vibe", "genPrompt", "pacing", "tone", "primaryEmotion", "cinematicIntent", "world"]
        }
      }
    });

    const meta = JSON.parse(metaResponse.text || '{}');

    let mediaUrl = "";
    let mediaType: 'image' | 'video' = isVideoRequested ? 'video' : 'image';

    if (isVideoRequested) {
      // Use Veo for video generation
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic film, high grain, 35mm style, ${meta.genPrompt}`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });
      
      // Polling for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        mediaUrl = `${downloadLink}&key=${process.env.API_KEY}`;
      } else {
        throw new Error("Video generation failed");
      }
    } else {
      // Use Flash Image for image generation
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: `Cinematic film still, high grain, 35mm, anamorphic, ${meta.genPrompt}` }],
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          mediaUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!mediaUrl) throw new Error("Media generation failed");

    // Populate all required Scene properties to fix TypeScript error
    return {
      id: `sim-${Date.now()}`,
      modality: isVideoRequested ? 'video' : 'photo',
      world: (meta.world as any) || 'WATCH',
      director: {
        id: `dir-${Math.random()}`,
        name: meta.directorName,
        handle: meta.directorHandle,
        avatar: `https://picsum.photos/seed/${meta.directorHandle}/100`,
        isOnline: true
      },
      narrative: meta.narrative,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      timestamp: 'Just now',
      vibe: meta.vibe,
      pacing: (meta.pacing as any) || 'medium',
      tone: meta.tone || 'Cinematic',
      primaryEmotion: meta.primaryEmotion || 'Wonder',
      cinematicIntent: meta.cinematicIntent || 'To inspire the observer.',
      type: isVideoRequested ? 'motion' : 'stills',
      metadata: {
        location: meta.location,
        score: meta.score,
        camera: meta.camera
      }
    };

  } catch (error) {
    console.error("Simulation Error:", error);
    return null;
  }
}
