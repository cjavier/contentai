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

const saveTokenUsage = async (usage, userId, type) => {
    const db = getFirestore();

    try {
        // Crear un nuevo documento en la colección "Tokenusage"
        const tokenUsageRef = collection(db, 'Tokenusage');
        await addDoc(tokenUsageRef, {
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
          type: type,
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
    console.log(systemPrompt);
    const userPrompt = `Crea el outline para un contenido con el título: ${title}. La keyword es: ${keyword}. No pongas nada relacionado a ejemplos que requieran de información especifica del negocio ni casos de éxito particulares ni de ejemplos particulares.`;
    console.log(userPrompt);
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
        "temperature": 0.7
      })
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      const outline = data.choices[0].message.content;
      console.log(data.usage);
      await saveTokenUsage(data.usage, userId, "outline");

      
      return outline;
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      return [];
    }
};

export const CallOpenAIContent3 = async (title, keyword, outline, buyerpersona_prompt, content_prompt, userId) => {
  const systemPrompt = `${buyerpersona_prompt}. Los detalles importantes son que ${content_prompt}. No saludes a los lectores, no te despidas de ellos ni firmes los textos, No pongas ningun texto que requiera ser cambiado por el usuario.`;
  const userPrompt = `Crea el mejor contenido que puedas para un blog con el título: ${title}. La keyword principal es: ${keyword}. Y el outline del contenido es: ${outline}. `;
  console.log(systemPrompt);
  console.log(userPrompt);
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
      "temperature": 0.9
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    //console.log(options);

    const outline = data.choices[0].message.content;
    console.log(data.usage);
    await saveTokenUsage(data.usage, userId, "blog-content");

    
    return outline;
  } catch (error) {
    console.error('Error al llamar a OpenAI:', error);
    return [];
  }
};

export const CallOpenAIContent = async (title, keyword, outline, buyerpersona_prompt, content_prompt, userId) => {
  const systemPrompt = `${buyerpersona_prompt}. Los detalles importantes son que ${content_prompt}. No saludes a los lectores, no te despidas de ellos ni firmes los textos, No pongas ningun texto que requiera ser cambiado por el usuario.`;

  // Dividir el outline en secciones individuales
  const splitSections = outline.split(/^([IVXLCDM]+\.\s)/m);

const combinedSections = [];
for (let i = 1; i < splitSections.length; i += 2) {
  combinedSections.push(splitSections[i] + splitSections[i + 1]);
}

console.log(combinedSections);
  let fullContent = '';
  const apiKey = await getOpenAIKey(userId);
  const url = "https://api.openai.com/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
  };

  for (let section of combinedSections) {
    //const userPrompt = `Estoy creando un contenido de blog con el título: ${title}. La keyword principal es: ${keyword}. Y el outline del contenido es: ${outline}. Ahorita vamos a crear solo la sección ${section.trim()}, dame el texto únicamente para esa sección. No incluyas todos los subtitulos textualmente, crea el contenido de todos de manera coherente pero no es necesario que agregues el subtitulo textualmente, solo incluye en el texto textualmente de los subtitulos más relevantes.`;
    const userPrompt = `Estoy creando un contenido de blog con el título: ${title}. La keyword principal es: ${keyword}. Y el outline del contenido es: ${outline}. Ahorita vamos a crear solo la sección ${section.trim()}, dame el texto únicamente para esa sección.`;
    options.body = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role": "system", "content": systemPrompt},
        {"role": "user", "content": userPrompt}
      ],
      "temperature": 0.9
    });

    try {
      const response = await fetch(url, options);
      console.log(userPrompt);
      const data = await response.json();
      const sectionContent = data.choices[0].message.content;
      fullContent += sectionContent + "\n\n"; // Concatenar el contenido de cada sección
      await saveTokenUsage(data.usage, userId, "blog-content");
      console.log(data.usage);
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      return [];
    }
  }

  return fullContent.trim(); // Retornar el contenido completo
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
      await saveTokenUsage(data.usage, userId, "title");


      // Dividir la respuesta en títulos individuales usando una expresión regular
      const matchedTitles = titleIdea.match(/\d+\.\s+"([^"]+)"/g);
      const titles = matchedTitles ? matchedTitles.map(title => title.replace(/\d+\.\s+"/, "").replace(/"$/, "").trim()) : [];

      return titles;
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      return [];
    }
};