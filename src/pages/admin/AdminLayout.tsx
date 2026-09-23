import { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingBag, Users, FolderTree, Package, Image, Settings,
Menu, LogOut, ExternalLink, Inbox, PanelLeftClose, PanelLeftOpen, GalleryThumbnails } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Categories", path: "/admin/categories", icon: FolderTree },
  { name: "Categories Image", path: "/admin/categoryimages", icon: GalleryThumbnails },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Contact", path: "/admin/contact", icon: Inbox },
  { name: "Media", path: "/admin/media", icon: Image },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { user } = useSelector((state: any) => state.auth);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileNav = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const userInitials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`.toUpperCase() || "AD";

  return (
    <div className="h-dvh w-full flex overflow-hidden bg-[var(--color-bg-light)] text-[var(--color-text-dark)] font-sans">
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[var(--color-primary)] text-white flex flex-col justify-between transition-all duration-300 ${
          isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            {isOpen && (
              <h1 className="font-serif text-sm font-bold uppercase truncate">
                Home N More <span className="text-[var(--color-accent)] italic font-normal">Studio</span>
              </h1>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg hover:bg-white/10 ml-auto text-white/80 hover:text-white cursor-pointer"
            >
              {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>
          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map(({ name, path, icon: Icon }) => {
              const isActive = pathname === path;
              return (
                <Link 
                  key={name} 
                  to={path} 
                  onClick={closeMobileNav} 
                  title={!isOpen ? name : ""} 
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors ${
                    isActive 
                      ? "bg-[var(--color-primary-hover)] text-white" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  } ${!isOpen ? "justify-center" : ""}`}
                >
                  <Icon size={20} className="shrink-0" />
                  {isOpen && <span className="truncate">{name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link 
            to="/" 
            onClick={closeMobileNav} 
            title={!isOpen ? "Store View" : ""} 
            className={`flex items-center gap-3.5 px-3 py-2.5 text-xs uppercase font-semibold text-[var(--color-bg-light)] rounded-xl hover:bg-[var(--color-primary-hover)] hover:text-white transition-colors ${!isOpen ? "justify-center" : ""}`}
          >
            <ExternalLink size={20} className="shrink-0" />
            {isOpen && <span>Store View</span>}
          </Link>

          <button 
            onClick={() => { closeMobileNav(); dispatch(logout()); }} 
            title={!isOpen ? "Logout" : ""} 
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 text-xs uppercase font-semibold text-red-400 rounded-xl hover:bg-red-500 hover:text-white cursor-pointer transition-colors ${!isOpen ? "justify-center" : ""}`}
          >
            <LogOut size={20} className="shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)] px-4 flex items-center justify-between shrink-0 z-30">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 text-gray-700 cursor-pointer"
          >
            <Menu size={24} />
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hidden sm:block">
            Admin Workspace
          </span>

          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs border border-[var(--color-accent)] ml-auto">
            {userInitials}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}