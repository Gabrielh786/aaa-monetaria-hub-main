import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFeaturedProducts } from '@/hooks/use-products';
import { useCartStore } from '@/lib/cart-store';

export default function ProductGrid({ searchQuery }: { searchQuery?: string }) {
  const { data: products, isLoading } = useFeaturedProducts();

  const filtered = (products || []).filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="container py-12 text-center text-muted-foreground">Carregando produtos...</div>;

  return (
    <section id="colecao" className="container py-12">
      <h2 id="destaques" className="font-display text-3xl md:text-4xl text-foreground mb-8">EM DESTAQUE</h2>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCartStore();
  const sizes = product.available_sizes || [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');

  const handleBuy = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      name: product.name,
      size: selectedSize,
      price: product.price,
      imageUrl: product.image_url_capa,
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border flex flex-col">
      <div className="aspect-square bg-muted">
        <img src={product.image_url_capa} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-foreground text-sm">{product.name}</h3>
        {product.description && <p className="text-muted-foreground text-xs line-clamp-2">{product.description}</p>}

        {sizes.length > 0 && (
          <select
            value={selectedSize}
            onChange={e => setSelectedSize(e.target.value)}
            className="border border-border rounded px-2 py-1 text-xs bg-background text-foreground"
          >
            {sizes.map((s: string) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-foreground">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          <Button variant="default" size="sm" onClick={handleBuy} disabled={!selectedSize}>
            COMPRAR
          </Button>
        </div>
      </div>
    </div>
  );
}
