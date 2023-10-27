import React from 'react';
import KeywordsCreate from './KeywordsCreate';
import KeywordPlanDisplay from './KeywordPlanDisplay';
import Layout from '../Layout/Layout';


const Keywords = () => {
  return (
    <Layout>

      <KeywordsCreate />
      <KeywordPlanDisplay linkType="keywords" />
    </Layout>
  );
};

export default Keywords;
