import React from 'react';
import PublishDisplay from './PublishDisplay';
import KeywordPlanDisplay from './KeywordPlanDisplay';
import Layout from './Layout';


const Publish = () => {
  return (
    <Layout>
      <KeywordPlanDisplay linkType="publish" />
    </Layout>
  );
};

export default Publish;