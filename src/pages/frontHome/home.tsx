// src/pages/Home.tsx
import { Link } from 'react-router';
import Header from '../../components/header/newHeader'; 
import ProductList from '../../components/products/products'; 
import Banner from '../../components/banner';

export default function Home() {
  return (
    <div>
      <Header />
        <main className=" px-4 sm:px-6 lg:px-8">
          <Banner />     
          <ProductList />
        </main>
    </div>
  );
}


