import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { LogOut, Settings, User } from "lucide-react";

const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const initials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`.toUpperCase();

  return (
    <div className="mt-auto bg-[var(--color-bg-light)] text-[var(--color-text-dark)] px-4 p-6 sm:px-6 flex items-center justify-center">
      <main className="w-full max-w-xl bg-white border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-xl">
        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[var(--color-border)]">
              <div className="w-14 h-14 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] font-bold text-lg uppercase shrink-0 shadow-inner">
                {initials || <User className="w-6 h-6 text-[var(--color-accent)]" />}
              </div>
              <div className="overflow-hidden min-w-0">
                <h3 className="font-serif font-bold text-lg text-[var(--color-text-dark)] truncate">{user?.firstname} {user?.lastname}</h3>
                <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">{user?.email}</p>
              </div>
            </div>

            {user?.role === "admin" && (
              <button onClick={() => navigate("/admin")} className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-border)] text-xs sm:text-sm font-semibold text-[var(--color-text-dark)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all group cursor-pointer">
                <Settings className="w-4 h-4 text-[var(--color-accent)] group-hover:rotate-45 transition-transform shrink-0" />
                <span>Admin Panel</span>
              </button>
            )}
            <div className="pt-2 flex justify-center">
              <button onClick={() => { dispatch(logout()); navigate("/"); }} className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-red-50 border border-red-200 text-[var(--color-danger)] hover:bg-red-100 transition-all text-xs font-bold min-w-[150px] cursor-pointer">
                <LogOut className="w-4 h-4" /> <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-accent)]/30 flex items-center justify-center mx-auto text-[var(--color-accent)]"><User className="w-8 h-8" /></div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="font-serif font-bold text-xl text-[var(--color-text-dark)]">Welcome Guest</h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">Please sign in to manage your premium collections and profile settings.</p>
            </div>
            <div className="pt-2 max-w-xs mx-auto space-y-3">
              <Link to="/login" className="flex w-full items-center justify-center px-4 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md">Sign In</Link>
              <div className="text-xs text-[var(--color-muted)]">Don't have an account? <Link to="/signup" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-bold ml-1">Sign Up</Link></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProfile;