"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useAuthStore } from "@/lib/store";
import { signOutClient } from "@/lib/sign-out";

interface NavItem { id: string; label: string; href: string; badge?: string; badgeColor?: string; visible: boolean; order: number; }
interface UserItem { id: string; label: string; href: string; visible: boolean; order: number; }
interface MenuCfg { headerNav: NavItem[]; userMenu: UserItem[]; }

const FALLBACK_NAV: NavItem[] = [
  { id: "1", label: "Danh mục", href: "/danh-muc", visible: true, order: 1 },
  { id: "2", label: "Nâng cấp Prompt", href: "/nang-cap-prompt", badge: "AI", badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500", visible: true, order: 2 },
  { id: "3", label: "Khóa học", href: "/khoa-hoc", visible: true, order: 3 },
  { id: "4", label: "Blog", href: "/blog", visible: true, order: 4 },
  { id: "5", label: "Khuyến mãi", href: "/danh-muc?filter=sale", badge: "HOT", badgeColor: "bg-red-500", visible: true, order: 5 },
  { id: "6", label: "Trợ lý AI", href: "/tro-ly-ao", visible: true, order: 6 },
];
const FALLBACK_USER: UserItem[] = [
  { id: "u1", label: "Dashboard", href: "/dashboard", visible: true, order: 1 },
  { id: "u2", label: "Prompt đã mua", href: "/dashboard", visible: true, order: 2 },
  { id: "u3", label: "Ví của tôi", href: "/nap-tien", visible: true, order: 3 },
  { id: "u4", label: "Giới thiệu bạn bè", href: "/gioi-thieu-ban", visible: true, order: 4 },
  { id: "u5", label: "Thu nhập Seller", href: "/seller/thu-nhap", visible: true, order: 5 },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navItems, setNavItems] = useState<NavItem[]>(FALLBACK_NAV);
  const [userItems, setUserItems] = useState<UserItem[]>(FALLBACK_USER);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/menu-config", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        if (d?.headerNav) setNavItems(d.headerNav.filter((x: NavItem) => x.visible).sort((a: NavItem, b: NavItem) => a.order - b.order));
        if (d?.userMenu) setUserItems(d.userMenu.filter((x: UserItem) => x.visible).sort((a: UserItem, b: UserItem) => a.order - b.order));
      })
      .catch(() => {});
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/danh-muc?search=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              Prompt<span className="text-primary-600">VN</span>
            </span>
          </Link>

          {/* Desktop Nav — dynamic from API */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link key={item.id} href={item.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                {item.label}
                {item.badge && (
                  <span className={`${item.badgeColor || "bg-red-500"} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input type="text" placeholder="Tìm kiếm prompt..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(searchQuery); }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
              <button onClick={() => handleSearch(searchQuery)} className="absolute right-3 top-2.5 text-gray-400 hover:text-primary-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden p-2 text-gray-600 hover:text-primary-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/gio-hang" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {/* Dynamic user menu from API */}
                  {userItems.map(item => (
                    <Link key={item.id} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {item.label}
                    </Link>
                  ))}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={async () => { await signOutClient(); logout(); router.push("/"); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/dang-nhap"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <input type="text" placeholder="Tìm kiếm prompt..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(searchQuery); }}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" autoFocus />
              <button onClick={() => handleSearch(searchQuery)} className="absolute right-3 top-2.5 text-gray-400 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Mobile Menu — dynamic from API */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3">
            <nav className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link key={item.id} href={item.href}
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <span className={`${item.badgeColor || "bg-red-500"} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              {!isLoggedIn && (
                <Link href="/dang-nhap" className="px-3 py-2 mt-2 bg-primary-600 text-white text-center rounded-xl font-semibold">
                  Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
