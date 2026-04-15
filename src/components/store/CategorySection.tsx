import { useFeaturedProducts } from '@/hooks/use-products';

export default function CategorySection() {
  const { data: products } = useFeaturedProducts();
  const categories = [...new Set((products || []).map(p => p.category || 'GERAL'))];

  if (categories.length === 0) return null;

  return (
    <section className="container py-12">
      <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">COMPRE POR CATEGORIA</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <a
            key={cat}
            href="#colecao"
            className="px-5 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-md hover:bg-primary/80 transition-colors tracking-wide"
          >
            {cat}
          </a>
        ))}
      </div>
    </section>
  );
}
