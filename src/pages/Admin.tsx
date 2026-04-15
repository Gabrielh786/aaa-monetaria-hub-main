import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminInventory from '@/components/admin/AdminInventory';
import AdminStoreSetup from '@/components/admin/AdminStoreSetup';

const TABS = [
  { key: 'orders', label: 'Pedidos' },
  { key: 'inventory', label: 'Estoque' },
  { key: 'setup', label: 'Setup Loja' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function AdminPage() {
  const [tab, setTab] = useState<TabKey>('orders');

  return (
    <div className="min-h-screen bg-background">
      {/* Admin nav */}
      <nav className="bg-primary text-primary-foreground">
        <div className="container flex items-center h-12 gap-6">
          <span className="font-display text-lg tracking-wide mr-4">ADMIN</span>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm font-semibold tracking-wide transition-colors ${tab === t.key ? 'text-accent' : 'text-primary-foreground/70 hover:text-primary-foreground'}`}
            >
              {t.label}
            </button>
          ))}
          <Link to="/" className="ml-auto text-sm text-primary-foreground/70 hover:text-primary-foreground">Sair</Link>
        </div>
      </nav>

      <main className="container py-8">
        {tab === 'orders' && <AdminOrders />}
        {tab === 'inventory' && <AdminInventory />}
        {tab === 'setup' && <AdminStoreSetup />}
      </main>
    </div>
  );
}
