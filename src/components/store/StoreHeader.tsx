import { Search, ShoppingBag, User, LogOut, Settings } from 'lucide-react';
import { useStoreSettings } from '@/hooks/use-store-settings';
import { useCartStore } from '@/lib/cart-store';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StoreHeaderProps {
  onSearch?: (query: string) => void;
}

export default function StoreHeader({ onSearch }: StoreHeaderProps) {
  const { data: settings } = useStoreSettings();
  const { openCart, count } = useCartStore();
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.role === 'admin'));
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(search);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-accent text-accent-foreground text-center text-xs py-1.5 font-semibold tracking-widest">
        /// LANÇAMENTO EXCLUSIVO DA EQUIPE. RETIRADA PRESENCIAL. ///
      </div>

      {/* Main nav */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo Monetária" className="h-8 w-auto" />
            ) : (
              <span className="font-display text-xl tracking-wide">MONETÁRIA UFU</span>
            )}
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-sm tracking-wider">
            <a href="#destaques" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors uppercase">DESTAQUES</a>
            <a href="#colecao" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors uppercase">COLEÇÃO</a>
          </nav>

          {/* Search + Cart + User */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-primary-foreground/10 rounded-md px-3 h-8">
              <Search className="w-4 h-4 text-primary-foreground/60" />
              <input
                type="text"
                placeholder="BUSCAR EQUIPAMENTO..."
                className="bg-transparent border-none outline-none text-xs text-primary-foreground placeholder:text-primary-foreground/50 ml-2 w-40"
                value={search}
                onChange={(e) => { setSearch(e.target.value); onSearch?.(e.target.value); }}
              />
            </form>

            <button onClick={openCart} className="relative p-1 hover:opacity-80 transition-opacity">
              <ShoppingBag className="w-5 h-5" />
              {count() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count()}
                </span>
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:opacity-80 transition-opacity">
                  <User className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user ? `Olá, ${user.user_metadata.full_name || 'Usuário'}` : 'Minha Conta'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Painel Admin</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/auth')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Entrar / Cadastrar</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
