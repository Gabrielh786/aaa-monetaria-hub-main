import { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus } from 'lucide-react';

const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'ÚNICO'];

interface ProductForm {
  name: string;
  category: string;
  status: string;
  available_sizes: string[];
  price: string;
  description: string;
  image_url_capa: string;
  featured_on_home: boolean;
}

const emptyForm: ProductForm = {
  name: '', category: 'GERAL', status: 'DISPONÍVEL', available_sizes: [],
  price: '', description: '', image_url_capa: '', featured_on_home: false,
};

export default function AdminInventory() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const openNew = () => { setForm(emptyForm); setEditId(null); setModal(true); };
  const openEdit = (p: any) => {
    setForm({
      name: p.name, category: p.category || 'GERAL', status: p.status || 'DISPONÍVEL',
      available_sizes: p.available_sizes || [], price: String(p.price), description: p.description || '',
      image_url_capa: p.image_url_capa, featured_on_home: p.featured_on_home || false,
    });
    setEditId(p.id);
    setModal(true);
  };

  const toggleSize = (s: string) => {
    setForm(f => ({
      ...f,
      available_sizes: f.available_sizes.includes(s) ? f.available_sizes.filter(x => x !== s) : [...f.available_sizes, s],
    }));
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      category: form.category,
      status: form.status,
      available_sizes: form.available_sizes,
      price: parseFloat(form.price),
      description: form.description,
      image_url_capa: form.image_url_capa,
      featured_on_home: form.featured_on_home,
    };
    if (editId) {
      await updateProduct.mutateAsync({ id: editId, ...payload });
    } else {
      await createProduct.mutateAsync(payload);
    }
    setModal(false);
  };

  if (isLoading) return <p className="text-muted-foreground">Carregando estoque...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl text-foreground">GERENCIAR ESTOQUE</h2>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" /> NOVO EQUIPAMENTO</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pr-4">Produto</th>
              <th className="pb-2 pr-4">Categoria</th>
              <th className="pb-2 pr-4">Preço</th>
              <th className="pb-2 pr-4">Tamanhos</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Destaque</th>
              <th className="pb-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map(p => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-3 pr-4 font-semibold text-foreground">{p.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{p.category}</td>
                <td className="py-3 pr-4 text-foreground">{fmt(p.price)}</td>
                <td className="py-3 pr-4 text-muted-foreground text-xs">{(p.available_sizes || []).join(', ')}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === 'DISPONÍVEL' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{p.featured_on_home ? '⭐' : '—'}</td>
                <td className="py-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Edit className="w-3 h-3" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct.mutate(p.id)}><Trash2 className="w-3 h-3" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <div className="bg-background rounded-lg shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-2xl text-foreground">{editId ? 'EDITAR' : 'NOVO'} EQUIPAMENTO</h3>
            <input placeholder="Nome *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" />
            <input placeholder="Categoria" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" />
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground">
              <option value="DISPONÍVEL">DISPONÍVEL</option>
              <option value="ESGOTADO">ESGOTADO</option>
            </select>

            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Tamanhos disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map(s => (
                  <label key={s} className="flex items-center gap-1 text-sm text-foreground">
                    <input type="checkbox" checked={form.available_sizes.includes(s)} onChange={() => toggleSize(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <input placeholder="Preço *" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" />
            <textarea placeholder="Descrição" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" rows={3} />
            <input placeholder="Link da Imagem de Capa *" value={form.image_url_capa} onChange={e => setForm(f => ({ ...f, image_url_capa: e.target.value }))}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.featured_on_home} onChange={e => setForm(f => ({ ...f, featured_on_home: e.target.checked }))} />
              Exibir em destaque na home
            </label>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!form.name || !form.price || !form.image_url_capa}>
                {editId ? 'ATUALIZAR' : 'CRIAR'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
