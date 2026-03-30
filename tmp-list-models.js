async function listModels() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY.trim();
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
       console.error("API Error:", JSON.stringify(data.error, null, 2));
       return;
    }

    const modelNames = (data.models || []).map(m => m.name);
    console.log("Found Models:", JSON.stringify(modelNames, null, 2));
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModels();
