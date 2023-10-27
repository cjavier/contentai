import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import { CallOpenAIOutline } from './OpenAI';


export const handleOutlineCreation = async (keywordPlanId, keywordId, titleId, currentUser, setKeywordPlans, keywordPlans) => {
    try {
      const db = getFirestore();
  
      // 1. Obtener la keyword, el título y el buyerpersonaid
      const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);
      const keyword = keywordPlan.keywords.find(k => k.id === keywordId);
      const titleObj = keyword.titles.find(t => t.id === titleId);
      const buyerPersonaId = keywordPlan.buyerpersonaid;
  
      // 2. Obtener el buyerpersona_prompt usando el buyerPersonaId
      const buyerPersonaDoc = await getDoc(doc(db, 'buyerpersonas', buyerPersonaId)); // Asumiendo que la colección se llama 'buyerPersonas'
      const buyerpersona_prompt = buyerPersonaDoc.data().buyerpersona_prompt;
  
      // 3. Llamar a la función CallOpenAIOutline con el título, la keyword y el buyerpersona_prompt
      const outline = await CallOpenAIOutline(titleObj.title, keyword.keyword, buyerpersona_prompt, currentUser.uid);
  
      // 4. Recibir el outline y guardarlo en la propiedad outline del título correspondiente en Firestore
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
      await updateDoc(titleRef, {
        outline: outline
      });
  
      console.log('Outline creado exitosamente.');
  
      // Actualizar el estado local para reflejar el cambio
      setKeywordPlans(prevKeywordPlans => {
        return prevKeywordPlans.map(kp => {
          if (kp.id === keywordPlanId) {
            kp.keywords = kp.keywords.map(k => {
              if (k.id === keywordId) {
                k.titles = k.titles.map(t => {
                  if (t.id === titleId) {
                    t.outline = outline;
                  }
                  return t;
                });
              }
              return k;
            });
          }
          return kp;
        });
      });
  
    } catch (error) {
      console.error('Error al crear el outline:', error);
    }
  };

export const handleContentCreation = async (keywordPlanId, keywordId, titleId, currentUser) => {
    try {
      const userId = currentUser.uid; // Asegúrate de que currentUser y uid estén definidos correctamente
  
      // 1. Realizar la solicitud al servidor
      const response = await fetch(`https://contentai-backend.onrender.com/createcontent?userId=${userId}&keywordPlanId=${keywordPlanId}&keywordId=${keywordId}&titleId=${titleId}`, {
        method: 'POST',
      });
  
      // 2. Verificar si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} - ${response.statusText}`);
      }
  
      // 3. Leer la respuesta del servidor
      const result = await response.text();
      console.log(result);
  
    } catch (error) {
      console.error('Error al crear el contenido:', error);
    }
  };


export const handleAllContentsCreation = async (keywordPlanId, currentUser) => {
  try {

    // Hacer la llamada al servidor para crear todos los contenidos
    const response = await fetch(`https://contentai-backend.onrender.com/createallcontent?userId=${currentUser.uid}&keywordPlanId=${keywordPlanId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al crear contenidos en el servidor');
    }

    console.log('Contenidos en proceso de creación.');
    return { status: 'ok', message: 'Contenidos en proceso de creación' };
  } catch (error) {
    console.error('Error al crear contenidos para todos los títulos:', error);
    return { status: 'error', message: 'Error al crear contenidos' };

  } 
};



export const handleAllOutlinesDelete = async (keywordPlanId, keywordPlans) => {
  try {

    const db = getFirestore();
    const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId, keywordPlans);
    let completed = 0;
    const total = keywordPlan.keywords.reduce((acc, keyword) => acc + keyword.titles.length, 0);

    for (const keyword of keywordPlan.keywords) {
      for (const title of keyword.titles) {
        if (title.outline) {  // Verifica si el título tiene un outline
          const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keyword.id, 'titles', title.id);
          await updateDoc(titleRef, {
            outline: ''  // Establece la propiedad outline a una cadena vacía
          });
          completed++;
        }
      }
    }
    return { status: 'ok', message: 'Outlines borrados exitosamente' };
    console.log('Outlines borrados exitosamente para todos los títulos que lo requerían.');
  } catch (error) {
    return { status: 'ok', message: 'Error al borrar los outlines' };
    console.error('Error al borrar todos los outlines:', error);
  } 
};