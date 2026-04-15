import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const PAYMENT_STATUSES = ['ESPERA', 'PAGO', 'CANCELADO'];
const DELIVERY_STATUSES = ['LOCAL', 'ENTREGUE'];

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  const cycleStat = (id: string, field: 'status_payment' | 'status_delivery', current: string | null) => {
    const list = field === 'status_payment' ? PAYMENT_STATUSES : DELIVERY_STATUSES;
    const idx = list.indexOf(current || list[0]);
    const next = list[(idx + 1) % list.length];
    updateStatus.mutate({ id, field, value: next });
  };

  if (isLoading) return <p className="text-muted-foreground">Carregando pedidos...</p>;

  return (
    <div>
      <h2 className="font-display text-3xl text-foreground mb-6">CONTROLE DE PEDIDOS</h2>
      {!orders?.length ? (
        <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4">Data & Comprador</th>
                <th className="pb-2 pr-4">Contato/Vend.</th>
                <th className="pb-2 pr-4">Itens do Pedido</th>
                <th className="pb-2 pr-4">Status Pagto</th>
                <th className="pb-2 pr-4">Status Entrega</th>
                <th className="pb-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const items = Array.isArray(order.order_items) ? order.order_items : [];
                return (
                  <tr key={order.id} className="border-b border-border">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-foreground">{order.buyer_name}</p>
                      <p className="text-muted-foreground text-xs">{fmtDate(order.created_at)}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-foreground">{order.buyer_contact_phone}</p>
                      <p className="text-muted-foreground text-xs">{order.seller_name}</p>
                    </td>
                    <td className="py-3 pr-4">
                      {items.map((item: any, idx: number) => (
                        <p key={idx} className="text-xs text-foreground">{item.qty}x {item.name} ({item.size}) — {fmt(item.price)}</p>
                      ))}
                      <p className="font-bold text-foreground mt-1">{fmt(order.total_price)}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => cycleStat(order.id, 'status_payment', order.status_payment)}
                        className={`px-2 py-1 rounded text-xs font-bold ${order.status_payment === 'PAGO' ? 'bg-green-100 text-green-800' : order.status_payment === 'CANCELADO' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {order.status_payment || 'ESPERA'}
                      </button>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => cycleStat(order.id, 'status_delivery', order.status_delivery)}
                        className={`px-2 py-1 rounded text-xs font-bold ${order.status_delivery === 'ENTREGUE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {order.status_delivery || 'LOCAL'}
                      </button>
                    </td>
                    <td className="py-3">
                      <Button variant="destructive" size="sm" onClick={() => deleteOrder.mutate(order.id)}>
                        <Trash2 className="w-3 h-3" />
                        EXCLUIR
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
