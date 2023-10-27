import React from 'react';
import ContentsDisplay from './ContentsDisplay';
import Layout from './Layout';
import KeywordPlanDisplay from './KeywordPlanDisplay';


const Contents = () => {
  return (
    <Layout>
      <KeywordPlanDisplay linkType="contents" />
    </Layout>
  );
};

export default Contents;
