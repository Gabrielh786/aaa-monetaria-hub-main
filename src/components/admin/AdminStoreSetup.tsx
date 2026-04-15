import { useState, useEffect } from 'react';
import { useStoreSettings } from '@/hooks/use-store-settings';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminStoreSetup() {
  const { data: settings, refetch } = useStoreSettings();
  const [logoUrl, setLogoUrl] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logo_url || '');
      setHeroImageUrl(settings.hero_image_url || '');
      setHeroTitle(settings.hero_title || '');
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings?.id) return;
    setSaving(true);
    const { error } = await supabase.from('store_settings').update({
      logo_url: logoUrl,
      hero_image_url: heroImageUrl,
      hero_title: heroTitle,
    }).eq('id', settings.id);
    setSaving(false);
    if (error) {
      toast.error('Erro ao salvar configurações.');
    } else {
      toast.success('Configurações salvas com sucesso!');
      refetch();
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-3xl text-foreground mb-6">SETUP DA LOJA</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">URL da Logo Principal</label>
          <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground"
            placeholder="https://..." />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">URL da Imagem de Destaque (Hero)</label>
          <input value={heroImageUrl} onChange={e => setHeroImageUrl(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground"
            placeholder="https://..." />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Título Principal do Banner</label>
          <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
        </Button>
      </div>
    </div>
  );
}
