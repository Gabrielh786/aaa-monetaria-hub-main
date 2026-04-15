import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { useCreateOrder } from '@/hooks/use-orders';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SELLERS = ['LOYANNE', 'GABRIEL', 'ANA LÍDIA', 'AMANDA'];
const PAYMENT_METHODS = ['CARTÃO DE CRÉDITO (LINK)', 'PIX'];

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const createOrder = useCreateOrder();
  const [seller, setSeller] = useState('');
  const [payment, setPayment] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setBuyerName(profile.full_name || '');
          setBuyerPhone(profile.phone || '');
        }
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!seller || !payment || !buyerName || !buyerPhone) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await createOrder.mutateAsync({
        buyer_name: buyerName,
        buyer_contact_phone: buyerPhone,
        seller_name: seller,
        payment_method: payment,
        order_items: items.map(i => ({ name: i.name, size: i.size, qty: i.quantity, price: i.price, imageUrl: i.imageUrl })),
        total_price: total(),
      });
      clearCart();
      setBuyerName('');
      setBuyerPhone('');
      setSeller('');
      setPayment('');
      closeCart();
      toast.success('Pedido realizado com sucesso!');
    } catch {
      toast.error('Erro ao criar pedido.');
    }
  };

  if (!isOpen) return null;

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/40" onClick={closeCart} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-2xl text-foreground">CARRINHO.</h2>
          <button onClick={closeCart}><X className="w-5 h-5 text-foreground" /></button>
        </div>

        {/* Alert */}
        <div className="mx-4 mt-3 bg-accent text-accent-foreground text-xs font-semibold p-3 rounded">
          ATENÇÃO: RETIRADA PRESENCIAL NA SALA DA EQUIPE.
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 && <p className="text-muted-foreground text-sm">Seu carrinho está vazio.</p>}
          {items.map(item => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-3 border-b border-border pb-3">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded object-cover bg-muted" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-muted-foreground text-xs">TAM: {item.size}</p>
                <p className="font-semibold text-foreground">{fmt(item.price)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQuantity(item.productId, item.size, -1)} className="p-0.5 rounded border border-border hover:bg-muted"><Minus className="w-3 h-3" /></button>
                  <span className="text-xs font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, 1)} className="p-0.5 rounded border border-border hover:bg-muted"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
              <button onClick={() => removeItem(item.productId, item.size)} className="text-destructive hover:text-destructive/80">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Checkout form */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <input placeholder="Seu nome completo *" value={buyerName} onChange={e => setBuyerName(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" />
            <input placeholder="Telefone / WhatsApp *" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground" />
            <select value={seller} onChange={e => setSeller(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground">
              <option value="">SELECIONAR VENDEDOR...</option>
              {SELLERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={payment} onChange={e => setPayment(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground">
              <option value="">PAGAMENTO...</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <div className="flex items-center justify-between font-bold text-foreground">
              <span>TOTAL GERAL</span>
              <span>{fmt(total())}</span>
            </div>

            <Button variant="default" className="w-full" onClick={handleCheckout} disabled={createOrder.isPending}>
              {createOrder.isPending ? 'PROCESSANDO...' : 'AVANÇAR PARA PAGAMENTO'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
