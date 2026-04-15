import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/hooks/use-store-settings';
import heroPlaceholder from '@/assets/hero-placeholder.jpg';

export default function HeroSection() {
  const { data: settings } = useStoreSettings();
  const heroImage = settings?.hero_image_url || heroPlaceholder;
  const heroTitle = settings?.hero_title || 'A FORÇA DA NOSSA EQUIPE.';

  return (
    <section className="bg-secondary">
      <div className="container py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Text */}
        <div className="flex-1 space-y-5 text-center md:text-left">
          <h1 className="font-display text-5xl md:text-7xl leading-none text-foreground">
            {heroTitle}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto md:mx-0">
            Chegou a nova linha oficial. Vista as cores, sinta o peso do manto e represente a nossa universidade em qualquer lugar.
          </p>
          <Button variant="hero" size="lg" asChild>
            <a href="#colecao">COMPRAR AGORA</a>
          </Button>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroImage}
            alt="Equipe Monetária UFU"
            className="rounded-lg shadow-xl max-w-full h-auto max-h-[400px] object-cover"
            width={600}
            height={400}
          />
        </div>
      </div>
    </section>
  );
}
