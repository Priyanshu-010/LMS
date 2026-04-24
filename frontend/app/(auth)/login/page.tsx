"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { BookOpen, Mail, Lock } from "lucide-react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const tokenData = await authService.login(email, password);
      localStorage.setItem("token", tokenData.access_token);

      const userProfile = await userService.getMe();
      setAuth(userProfile, tokenData.access_token);

      toast.success(`Welcome back, ${userProfile.name}!`);

      if (userProfile.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <BookOpen size={26} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in to continue learning
          </p>
        </div>

        {/* card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Button type="submit" loading={loading} fullWidth size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}