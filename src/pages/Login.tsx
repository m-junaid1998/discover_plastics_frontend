import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../utils/toast";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, googleLoginUser, isAuthLoading } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const handleAuthRedirect = (res: any) => {
    reset(); 
    navigate(res?.role === "admin" ? "/admin" : "/");
  };

  const onSubmit = (data: LoginForm) => {
    loginUser(data, { onSuccess: handleAuthRedirect });
  };

  return (
    <div className="h-dvh flex items-center justify-center p-4 bg-[var(--color-bg-light)]">
      <div className="w-full max-w-md p-4 rounded-3xl bg-white border border-[var(--color-border)] shadow-xl space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif text-[var(--color-text-dark)]">Sign In</h1>
          <p className="text-xs text-[var(--color-muted)]">Enter your details to access your account</p>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={(cred) => cred.credential && googleLoginUser(cred.credential, { onSuccess: handleAuthRedirect })}
            onError={() => toast.error("Google Auth", "Login Failed")}
            shape="pill"
          />
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[var(--color-border)]" />
          <span className="absolute bg-white px-3 text-[10px] font-bold text-[var(--color-muted)] uppercase">or email</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <FormInput label="Email Address" type="email" placeholder="name@gmail.com" {...register("email")} error={errors.email?.message} leftIcon={<Mail className="w-4 h-4 text-[var(--color-muted)]" />} className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]" />
          <FormInput label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} leftIcon={<Lock className="w-4 h-4 text-[var(--color-muted)]" />} className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]" />
          <Button type="submit" disabled={isAuthLoading} className="w-full !py-3 text-xs font-bold rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-50">
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">{isAuthLoading ? "Signing In..." : "Sign In"}{!isAuthLoading && <ArrowRight className="w-4 h-4 shrink-0" />}</span>
          </Button>
        </form>

        <p className="text-center text-xs text-[var(--color-muted)]">Don't have an account? <Link to="/signup" className="font-bold text-[var(--color-accent)]">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;