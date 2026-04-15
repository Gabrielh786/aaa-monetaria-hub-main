import { useState } from 'react';
import StoreHeader from '@/components/store/StoreHeader';
import HeroSection from '@/components/store/HeroSection';
import CategorySection from '@/components/store/CategorySection';
import ProductGrid from '@/components/store/ProductGrid';
import CartSidebar from '@/components/store/CartSidebar';
import StoreFooter from '@/components/store/StoreFooter';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader onSearch={setSearchQuery} />
      <HeroSection />
      <CategorySection />
      <ProductGrid searchQuery={searchQuery} />
      <CartSidebar />
      <StoreFooter />
    </div>
  );
};

export default Index;
