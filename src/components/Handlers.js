import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import { CallOpenAIOutline } from './OpenAI';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


export const handleOutlineCreation = async (keywordPlanId, keywordId, titleId, userId) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL;

    const response = await fetch(`${apiUrl}/createoutline?keywordPlanId=${keywordPlanId}&keywordId=${keywordId}&titleId=${titleId}&userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
      // Additional headers or configurations, if needed
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Outline created successfully');
    // Optionally, update your state or UI based on the response
  } catch (error) {
    console.error('Error creating outline:', error);
    // Handle error, update UI accordingly
  }
};

export const handleContentCreation = async (keywordPlanId, keywordId, titleId, currentUser) => {
    try {
      const userId = currentUser.uid; // Asegúrate de que currentUser y uid estén definidos correctamente
  
      // 1. Realizar la solicitud al servidor
      const response = await fetch(`${API_URL}/createcontent?userId=${userId}&keywordPlanId=${keywordPlanId}&keywordId=${keywordId}&titleId=${titleId}`, {
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
    const response = await fetch(`${API_URL}/createallcontent?userId=${currentUser.uid}&keywordPlanId=${keywordPlanId}`, {
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