import React from 'react';
import ContentsDisplay from './ContentsDisplay';
import Layout from '../Layout/Layout';
import ContentPlanDisplay from './ContentPlanDisplay';


const Contents = () => {
  return (
    <Layout>
      <ContentPlanDisplay linkType="contents" />
    </Layout>
  );
};

export default Contents;
