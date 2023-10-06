import { collection, getFirestore, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';


//const apiKey = "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"; // Reemplaza "TU_API_KEY_AQUI" con tu clave API real

const getOpenAIKey = async (userId) => {
    const db = getFirestore();
    const businessCollection = collection(db, 'Business');
    const q = query(businessCollection, where('userId', '==', userId));
  
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const businessData = querySnapshot.docs[0].data();
        return businessData.openaikey;
      } else {
        console.error('No se encontró un documento con ese userId.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la openaikey:', error);
      return null;
    }
  };

const saveTokenUsage = async (usage, userId) => {
    const db = getFirestore();

    try {
        // Crear un nuevo documento en la colección "Tokenusage"
        const tokenUsageRef = collection(db, 'Tokenusage');
        await addDoc(tokenUsageRef, {
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
          userId: userId,
          timestamp: serverTimestamp()
        });
        console.log('Token usage guardado exitosamente en Firebase.');
      } catch (error) {
        console.error('Error al guardar token usage en Firebase:', error);
      }
  };

export const CallOpenAIOutline = async (title, keyword, buyerpersona_prompt, userId) => {
    const systemPrompt = buyerpersona_prompt;
    const userPrompt = `Crea el outline para un contenido con el título: ${title}. La keyword es: ${keyword}`;
    const apiKey = await getOpenAIKey(userId);
    const url = "https://api.openai.com/v1/chat/completions";
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": userPrompt}
        ],
        "temperature": 0.3
      })
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      const outline = data.choices[0].message.content;
      console.log(data.usage);
      await saveTokenUsage(data.usage, userId);

      
      return outline;
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      return [];
    }
};

export const CallOpenAIContent = async (title, keyword, outline, buyerpersona_prompt, content_prompt, userId) => {
  const systemPrompt = buyerpersona_prompt;
  const userPrompt = `Crea el contenido de blog con el título: ${title}. La keyword principal es: ${keyword}. Y el outline del contenido es: ${outline}. Los detalles importantes son que ${content_prompt}. `;
  const apiKey = await getOpenAIKey(userId);
  const url = "https://api.openai.com/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role": "system", "content": systemPrompt},
        {"role": "user", "content": userPrompt}
      ],
      "temperature": 0.3
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    //console.log(options);

    const outline = data.choices[0].message.content;
    console.log(data.usage);
    await saveTokenUsage(data.usage, userId);

    
    return outline;
  } catch (error) {
    console.error('Error al llamar a OpenAI:', error);
    return [];
  }
};

export const CallOpenAITitle = async (keyword, titlePrompt, userId) => {
    const systemPrompt = `You will be asked to create titles for some blog posts ${titlePrompt}`;
    const userPrompt = `Dame tres ideas de un título para blog con la keyword: ${keyword}`;
    const apiKey = await getOpenAIKey(userId);
    const url = "https://api.openai.com/v1/chat/completions";
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": userPrompt}
        ],
        "temperature": 0.3
      })
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      const titleIdea = data.choices[0].message.content;
      console.log(data.usage);
      await saveTokenUsage(data.usage, userId);


      // Dividir la respuesta en títulos individuales usando una expresión regular
      const matchedTitles = titleIdea.match(/\d+\.\s+"([^"]+)"/g);
      const titles = matchedTitles ? matchedTitles.map(title => title.replace(/\d+\.\s+"/, "").replace(/"$/, "").trim()) : [];

      return titles;
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      return [];
    }
};