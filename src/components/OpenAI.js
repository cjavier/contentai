import { collection, getFirestore, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

//const apiKey = "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"; // Reemplaza "TU_API_KEY_AQUI" con tu clave API real
const getOpenAIConfig = async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/business/${userId}`);
    const businessData = response.data.business;

    if (!businessData) {
      console.error('No se encontró el documento de negocio para este userId.');
      return null;
    }

    return {
      openaiKey: businessData.openaikey,
      openaiModel: businessData.openaiModel // Obtener el modelo OpenAI preferido
    };
  } catch (error) {
    console.error('Error al obtener la configuración de OpenAI desde el backend:', error);
    return null;
  }
};


const getOpenAIKey = async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/business/${userId}`);
    const businessData = response.data.business;

    if (!businessData) {
      console.error('No se encontró el documento de negocio para este userId.');
      return null;
    }

    return businessData.openaikey;
  } catch (error) {
    console.error('Error al obtener la openaikey desde el backend:', error);
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
  const userPrompt = `Crea un outline de por lo menos 5 subtitulos para un contenido con el título: ${title}. La keyword principal es: ${keyword}. No pongas nada relacionado a ejemplos que requieran de información especifica del negocio ni casos de éxito particulares ni de ejemplos particulares.`;
    const apiKey = await getOpenAIKey(userId);
    const url = "https://api.openai.com/v1/chat/completions";
    const schema = {
      type: "object",
      properties: {
          subtitles: {
              type: "array",
              description: "Lista de 5 subtítulos optimizados para SEO",
              items: {
                  type: "object",
                  properties: {
                      h2: { type: "string", description: "Texto del subtítulo" },
                      description: { type: "string", description: "Descripción del contenido que puede contener el subtitulo para apoyar al SEO" },
                      h3_1: { type: "string", description: "Posible subtitulo secundario para SEO" },
                      h3_2: { type: "string", description: "Posible subtitulo secundario para SEO" },
                      h3_3: { type: "string", description: "Posible subtitulo secundario para SEO" },
                  },
                  required: ["text", "description", "h3_1", "h3_2", "h3_3"]
              }
          }
      },
      required: ["subtitles"]
  };
  
  

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
        functions: [
          {name: "get_movie_data", "parameters": schema}

        ],
        function_call: {name: "get_movie_data"},
        "temperature": 0.7
      })
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      let outline = data.choices[0].message.function_call.arguments;
      console.log(outline);
      console.log(data.usage);
      await saveTokenUsage(data.usage, userId, "outline");

    


    return outline;
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      return [];
    }
};




export const CallOpenAIContent = async (title, keyword, outline, buyerpersona_prompt, content_prompt, userId) => {
  const systemPrompt = `${buyerpersona_prompt}. Los detalles importantes son que ${content_prompt}. No saludes a los lectores, no te despidas de ellos ni firmes los textos, No pongas ningun texto que requiera ser cambiado por el usuario. Dame el resultado en formato HTML.`;

  // Parsear el outline
  const sections = outline.split(/<h2>/).slice(1).map(section => {
    const [title, ...content] = section.split(/<\/?h[23]>/);
    return { title: title.trim(), content: content.join('').trim() };
  });
  console.log('Número de secciones:', sections.length);
  sections.forEach((section, index) => {
    console.log(`Sección ${index + 1}:`, section.title);
    console.log('Contenido:', section.content);
  });

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

  for (let { title: sectionTitle, content } of sections) {
    const userPrompt = `Estoy creando un contenido de blog con el título: ${title}. La keyword principal es: ${keyword}. Ahorita vamos a crear la sección "${sectionTitle}", que incluye los siguientes puntos: ${content}. Dame el texto únicamente para esta sección en formato HTML.`;
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
      const data = await response.json();
      const sectionContent = data.choices[0].message.content;
      fullContent += `<h2>${sectionTitle}</h2>\n${sectionContent}\n`; // Concatenar el contenido de cada sección
      await saveTokenUsage(data.usage, userId, "blog-content");
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      return '';
    }
  }

  return fullContent.trim(); // Retornar el contenido completo
};


export const CallOpenAITitle = async (keyword, titlePrompt, userId) => {
  const systemPrompt = `Eres un experto en SEO, estoy a punto de pedirte ideas para títulos de blog con el objetivo de posicionarme en Google, ${titlePrompt}`;
  const userPrompt = `Dame dos ideas de un título para blog con la keyword: ${keyword}`;
  
  // Use getOpenAIConfig to retrieve both the API key and the model preference
  const { openaiKey, openaiModel } = await getOpenAIConfig(userId);
  if (!openaiKey || !openaiModel) {
      console.error('API Key or model not found.');
      return [];
  }

  const url = "https://api.openai.com/v1/chat/completions";
  const options = {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          "model": openaiModel, // Use the dynamically retrieved model
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
      console.log(data);

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
