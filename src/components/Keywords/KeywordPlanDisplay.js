import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom'; 
import Title from '../Titles/Title';
import { collection, getFirestore, getDocs, query, where, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';


export default function KeywordPlanDisplay({ linkType }) {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }

    const loadKeywordPlans = async () => {
      try {
        const db = getFirestore();
        const keywordPlansCollection = collection(db, 'keywordsplans');
        const q = query(keywordPlansCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const keywordPlansData = querySnapshot.docs.map(doc => ({ id: doc.id, planName: doc.data().planName }));
        setKeywordPlans(keywordPlansData);
      } catch (error) {
        console.error('Error al cargar los KeywordPlans:', error);
      }
    };

    loadKeywordPlans();
  }, [currentUser]);
  

  return (
    <Grid item xs={12}>
      {/* ... (otros componentes y diálogos) */}
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>
                <Link to={`/${linkType}/${keywordPlan.id}`}>{keywordPlan.planName}</Link>
            </Title>
            {/* ... (otros componentes y botones) */}
          </Paper>
        </Grid>
      ))}
      {/* ... (otros componentes y diálogos) */}
    </Grid>
  );
}