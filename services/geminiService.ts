
import { GoogleGenAI, Type } from "@google/genai";
import { Scene } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate media (shared between simulate and remix)
async function generateMedia(prompt: string, type: 'image' | 'video'): Promise<string> {
  if (type === 'video') {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic film, high grain, 35mm style, ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    throw new Error("Video generation failed");
  } else {
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ text: `Cinematic film still, high grain, 35mm, anamorphic, ${prompt}` }],
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Image generation failed");
  }
}

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
 */
export async function simulateCinematicScene(userPrompt: string): Promise<Scene | null> {
  try {
    const isVideoRequested = userPrompt.toLowerCase().includes('video') || 
                             userPrompt.toLowerCase().includes('clip') || 
                             userPrompt.toLowerCase().includes('motion');

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
    const mediaType = isVideoRequested ? 'video' : 'image';
    const mediaUrl = await generateMedia(meta.genPrompt, mediaType);

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

/**
 * Remix Mode: Edits an existing scene based on user directives.
 * Now supports full attribute modification including URLs and Director details.
 */
export async function remixCinematicScene(currentScene: Scene, userPrompt: string): Promise<Scene | null> {
  try {
    const isMediaRegenRequested = userPrompt.toLowerCase().includes('generate') || 
                                  userPrompt.toLowerCase().includes('create visual') ||
                                  (userPrompt.toLowerCase().includes('change visual') && !userPrompt.includes('http'));

    const contents = `
      You are a cinematic reality engine. Modify this JSON scene object based on the user's directive.
      Current Scene JSON: ${JSON.stringify(currentScene)}
      User Directive: "${userPrompt}"
      
      Rules:
      1. YOU HAVE FULL WRITE ACCESS to every field.
      2. If the user provides a specific URL (http/https), put it in 'mediaUrl'.
      3. If the user wants to change the director, role, handle, or city, update the 'director' object.
      4. If the user wants to change labels like narrative, tone, or vibe, update them.
      5. If the user implies a modality change (e.g. "make it a product", "change to video"), update 'modality' and 'mediaType'.
      6. Only set 'genPrompt' if the user specifically asks to GENERATE a new visual via AI.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: { type: Type.STRING },
            vibe: { type: Type.STRING },
            tone: { type: Type.STRING },
            primaryEmotion: { type: Type.STRING },
            cinematicIntent: { type: Type.STRING },
            mediaUrl: { type: Type.STRING, nullable: true, description: "Direct URL override" },
            mediaType: { type: Type.STRING, enum: ['video', 'image'], nullable: true },
            modality: { type: Type.STRING, enum: ['film', 'video', 'photo', 'audio', 'product'], nullable: true },
            genPrompt: { type: Type.STRING, nullable: true },
            director: {
               type: Type.OBJECT,
               nullable: true,
               properties: {
                 name: { type: Type.STRING, nullable: true },
                 handle: { type: Type.STRING, nullable: true },
                 role: { type: Type.STRING, nullable: true },
                 city: { type: Type.STRING, nullable: true },
                 avatar: { type: Type.STRING, nullable: true }
               }
            },
            metadata: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                score: { type: Type.STRING },
                camera: { type: Type.STRING }
              }
            }
          },
          required: ["narrative", "vibe", "tone", "primaryEmotion", "cinematicIntent"]
        }
      }
    });

    const modifications = JSON.parse(response.text || '{}');
    
    let newMediaUrl = currentScene.mediaUrl;
    let newMediaType = modifications.mediaType || currentScene.mediaType;
    let newModality = modifications.modality || currentScene.modality;

    // 1. Check for Direct URL Override first
    if (modifications.mediaUrl) {
      newMediaUrl = modifications.mediaUrl;
    } 
    // 2. Check for Generative Request
    else if (modifications.genPrompt && isMediaRegenRequested) {
       try {
         newMediaUrl = await generateMedia(modifications.genPrompt, newMediaType);
       } catch (e) {
         console.warn("Media regen failed, keeping old media", e);
       }
    }

    // Merge Director Updates
    const mergedDirector = modifications.director ? {
      ...currentScene.director,
      ...modifications.director
    } : currentScene.director;

    // Merge updates
    return {
      ...currentScene,
      narrative: modifications.narrative,
      vibe: modifications.vibe,
      tone: modifications.tone,
      primaryEmotion: modifications.primaryEmotion,
      cinematicIntent: modifications.cinematicIntent,
      modality: newModality as any,
      mediaType: newMediaType as any,
      director: mergedDirector,
      metadata: {
        ...currentScene.metadata,
        ...modifications.metadata
      },
      mediaUrl: newMediaUrl
    };

  } catch (error) {
    console.error("Remix Error:", error);
    return null;
  }
}
