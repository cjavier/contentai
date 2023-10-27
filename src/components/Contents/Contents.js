import React from 'react';
import ContentsDisplay from './ContentsDisplay';
import Layout from '../Layout/Layout';
import KeywordPlanDisplay from '../Keywords/KeywordPlanDisplay';


const Contents = () => {
  return (
    <Layout>
      <KeywordPlanDisplay linkType="contents" />
    </Layout>
  );
};

export default Contents;
