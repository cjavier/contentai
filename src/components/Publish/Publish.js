import React from 'react';
import PublishDisplay from './PublishDisplay';
import KeywordPlanDisplay from '../Keywords/KeywordPlanDisplay';
import Layout from '../Layout/Layout';


const Publish = () => {
  return (
    <Layout>
      <KeywordPlanDisplay linkType="publish" />
    </Layout>
  );
};

export default Publish;