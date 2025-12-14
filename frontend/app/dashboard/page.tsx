'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { apiClient } from '@/lib/api';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    DollarSign,
    LogOut,
    Menu,
    X,
    Store,
    Heart,
    Bell,
    User as UserIcon,
    ChevronDown,
    Plus,
    Minus,
    Trash2,
    Star,
    Search,
    TrendingUp,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useSales } from '@/hooks/useSales';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { DashboardData, Product } from '@/types';

interface NavButtonProps {
    icon: React.ReactNode;
    label: string;
    badge: number;
    active: boolean;
    onClick: () => void;
}

const NavButton = ({ icon, label, badge, active, onClick }: NavButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all relative ${active
            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
    >
        {icon}
        <span>{label}</span>
        {badge > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {badge}
            </span>
        )}
    </button>
);

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [currentView, setCurrentView] = useState<'dashboard' | 'products' | 'pdv'>('products');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { products, loading } = useProducts({ search: searchTerm });
    const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, toggleWishlist, isInWishlist } = useStore();
    const { createSale, loading: saleLoading } = useSales();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const loadDashboard = useCallback(async () => {
        try {
            const { data } = await apiClient.getDashboard();
            setDashboardData(data);
        } catch (err) {
            console.error('Erro ao carregar dashboard:', err);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const timer = setTimeout(() => {
                loadDashboard();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, loadDashboard]);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast.success('Produto adicionado ao carrinho!');
    };

    const handleFinalizeSale = async () => {
        const result = await createSale(undefined, 'CREDIT');
        if (result.success) {
            setCurrentView('dashboard');
            loadDashboard();
        }
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">TechStore Pro</h1>
                                <p className="text-xs text-white/60">Olá, {user.name}</p>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-2">
                            <NavButton
                                icon={<ShoppingBag className="w-5 h-5" />}
                                label="Loja"
                                badge={0}
                                active={currentView === 'products'}
                                onClick={() => setCurrentView('products')}
                            />
                            <NavButton
                                icon={<ShoppingCart className="w-5 h-5" />}
                                label="PDV"
                                badge={getCartCount()}
                                active={currentView === 'pdv'}
                                onClick={() => setCurrentView('pdv')}
                            />
                            <NavButton
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                label="Dashboard"
                                badge={0}
                                active={currentView === 'dashboard'}
                                onClick={() => setCurrentView('dashboard')}
                            />
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-all">
                                <Bell className="w-5 h-5" />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <ChevronDown className="w-4 h-4 hidden md:block" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-white font-semibold">{user.name}</p>
                                            <p className="text-white/60 text-xs">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="w-full px-4 py-3 text-left text-white hover:bg-white/10 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-white"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <nav className="lg:hidden mt-4 pb-2 flex flex-col gap-2">
                            <NavButton
                                icon={<ShoppingBag className="w-5 h-5" />}
                                label="Loja"
                                badge={0}
                                active={currentView === 'products'}
                                onClick={() => {
                                    setCurrentView('products');
                                    setMobileMenuOpen(false);
                                }}
                            />
                            <NavButton
                                icon={<ShoppingCart className="w-5 h-5" />}
                                label="PDV"
                                badge={getCartCount()}
                                active={currentView === 'pdv'}
                                onClick={() => {
                                    setCurrentView('pdv');
                                    setMobileMenuOpen(false);
                                }}
                            />
                            <NavButton
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                label="Dashboard"
                                badge={0}
                                active={currentView === 'dashboard'}
                                onClick={() => {
                                    setCurrentView('dashboard');
                                    setMobileMenuOpen(false);
                                }}
                            />
                        </nav>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Products View */}
                {currentView === 'products' && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                                />
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="text-center py-12 text-white">Carregando produtos...</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product: Product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all shadow-xl group"
                                    >
                                        <div className="relative aspect-square bg-white/5">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {product.oldPrice && (
                                                <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                                </div>
                                            )}
                                            <button
                                                onClick={() => toggleWishlist(product.id)}
                                                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all"
                                            >
                                                <Heart
                                                    className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>

                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor(product.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-600'
                                                            }`}
                                                    />
                                                ))}
                                                <span className="text-white/60 text-xs ml-1">({product.reviews})</span>
                                            </div>

                                            {product.oldPrice && (
                                                <p className="text-white/40 text-sm line-through">
                                                    R$ {product.oldPrice.toFixed(2)}
                                                </p>
                                            )}
                                            <p className="text-2xl font-bold text-white mb-3">
                                                R$ {product.price.toFixed(2)}
                                            </p>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Adicionar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PDV View */}
                {currentView === 'pdv' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-white mb-6">Caixa - PDV</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {products.slice(0, 6).map((product: Product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all"
                                    >
                                        <div className="flex gap-3">
                                            <div className="relative w-20 h-20 bg-white/5 rounded-lg overflow-hidden shrink-0">
                                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-white text-lg font-bold">R$ {product.price.toFixed(2)}</p>
                                                <p className="text-white/60 text-xs">{product.stock} em estoque</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <ShoppingCart className="w-6 h-6" />
                                    Carrinho ({getCartCount()})
                                </h2>

                                {cart.length === 0 ? (
                                    <div className="text-center py-12 text-white/40">
                                        <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                        <p>Carrinho vazio</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                                            {cart.map((item) => (
                                                <div key={item.id} className="bg-white/5 rounded-lg p-3">
                                                    <div className="flex gap-3 mb-2">
                                                        <div className="relative w-12 h-12 bg-white/5 rounded overflow-hidden shrink-0">
                                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-white text-sm font-medium line-clamp-1">{item.name}</h4>
                                                            <p className="text-white/60 text-xs">R$ {item.price.toFixed(2)}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2 bg-white/10 rounded-lg">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="p-1 hover:bg-white/10"
                                                            >
                                                                <Minus className="w-4 h-4 text-white" />
                                                            </button>
                                                            <span className="text-white font-semibold px-3">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="p-1 hover:bg-white/10"
                                                            >
                                                                <Plus className="w-4 h-4 text-white" />
                                                            </button>
                                                        </div>
                                                        <p className="text-white font-semibold">
                                                            R$ {(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-white/20 pt-4 space-y-3">
                                            <div className="flex justify-between text-white text-2xl font-bold">
                                                <span>Total</span>
                                                <span>R$ {getCartTotal().toFixed(2)}</span>
                                            </div>

                                            <button
                                                onClick={handleFinalizeSale}
                                                disabled={saleLoading}
                                                className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                {saleLoading ? 'Finalizando...' : 'Finalizar Venda'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Dashboard View */}
                {currentView === 'dashboard' && dashboardData && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Dashboard</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-green-400 text-sm font-semibold">+12.5%</span>
                                </div>
                                <h3 className="text-white/70 text-sm mb-1">Receita Total</h3>
                                <p className="text-3xl font-bold text-white">
                                    R$ {dashboardData.totalRevenue.toFixed(2)}
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl">
                                        <ShoppingCart className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-green-400 text-sm font-semibold">+8.2%</span>
                                </div>
                                <h3 className="text-white/70 text-sm mb-1">Total de Vendas</h3>
                                <p className="text-3xl font-bold text-white">{dashboardData.totalSales}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-linear-to-r from-purple-500 to-purple-600 rounded-xl">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-green-400 text-sm font-semibold">+5.1%</span>
                                </div>
                                <h3 className="text-white/70 text-sm mb-1">Ticket Médio</h3>
                                <p className="text-3xl font-bold text-white">R$ {dashboardData.avgTicket.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                )}
            </main>
        </div>
    );
}