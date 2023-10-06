import React from 'react';
import KeywordsCreate from './KeywordsCreate';
import KeywordsDisplay from './KeywordsDisplay';
import Layout from './Layout';


const Keywords = () => {
  return (
    <Layout>

      <KeywordsCreate />
      <KeywordsDisplay />
    </Layout>
  );
};

export default Keywords;
