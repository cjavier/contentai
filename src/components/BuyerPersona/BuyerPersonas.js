import React from 'react';
import BuyerPersonasCreate from './BuyerPersonasCreate';
import BuyerPersonasDisplay from './BuyerPersonasDisplay';
import Layout from '../Layout/Layout';


const BuyerPersonas = () => {
  return (
    <Layout>

      <BuyerPersonasCreate />
      <BuyerPersonasDisplay />
    </Layout>
  );
};

export default BuyerPersonas;
