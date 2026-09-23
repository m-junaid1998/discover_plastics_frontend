import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { validateEmptyObject } from "../utils/helper";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../utils/toast";

const signUpSchema = z.object({
  firstname: z.string().min(1, "First name required"),
  lastname: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { registerUser, googleLoginUser, isAuthLoading } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSuccess = () => {
    reset();
    navigate("/");
  };

  const onSubmit = (data: SignUpForm) => {
    const { confirmPassword, ...registerPayload } = data;
    registerUser(validateEmptyObject(registerPayload), { onSuccess: handleSuccess });
  };

  return (
    <div className="mt-auto flex items-center justify-center p-4 bg-[var(--color-bg-light)]">
      <div className="w-full max-w-md p-4 rounded-3xl bg-white border border-[var(--color-border)] shadow-xl space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif text-[var(--color-text-dark)]">Create an Account</h1>
          <p className="text-xs text-[var(--color-muted)]">Join us to start exploring premium collections</p>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={(cred) => cred.credential && googleLoginUser(cred.credential, { onSuccess: handleSuccess })}
            onError={() => toast.error("Google Auth", "Sign Up Failed")}
            shape="pill"
          />
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[var(--color-border)]" />
          <span className="absolute bg-white px-3 text-[10px] font-bold text-[var(--color-muted)] uppercase">or email</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="First Name" placeholder="Musa" {...register("firstname")} error={errors.firstname?.message} leftIcon={<User className="w-4 h-4 text-[var(--color-muted)]" />} className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]" />
            <FormInput label="Last Name" placeholder="Sheikh" {...register("lastname")} error={errors.lastname?.message} leftIcon={<User className="w-4 h-4 text-[var(--color-muted)]" />} className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]" />
          </div>
          <FormInput label="Email Address" type="email" placeholder="name@gmail.com" {...register("email")} error={errors.email?.message} leftIcon={<Mail className="w-4 h-4 text-[var(--color-muted)]" />} className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]" />
          <FormInput label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} leftIcon={<Lock className="w-4 h-4 text-[var(--color-muted)]" />} className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]" />
          <FormInput label="Confirm Password" type="password" placeholder="••••••••" {...register("confirmPassword")} error={errors.confirmPassword?.message} leftIcon={<Lock className="w-4 h-4 text-[var(--color-muted)]" />} className="!bg-[var(--color-card-bg)] !border-[var(--color-border)] text-[var(--color-text-dark)]" />
          <Button type="submit" disabled={isAuthLoading} className="w-full !py-3 text-xs font-bold rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-50 cursor-pointer">
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">{isAuthLoading ? "Creating Account..." : "Create Account"}{!isAuthLoading && <ArrowRight className="w-4 h-4 shrink-0" />}</span>
          </Button>
        </form>
        <p className="text-center text-xs text-[var(--color-muted)]">Already have an account? <Link to="/login" className="font-bold text-[var(--color-accent)]">Sign in</Link></p>
      </div>
    </div>
  );
};

export default SignUp;