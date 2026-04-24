"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    if (!password || password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const tokenData = await authService.register(name, email, password);
      localStorage.setItem("token", tokenData.access_token);

      const userProfile = await userService.getMe();
      setAuth(userProfile, tokenData.access_token);

      toast.success(`Welcome to LearnHub, ${userProfile.name}!`);
      router.push("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <BookOpen size={26} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Start learning for free today
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
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
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
            />

            <Button type="submit" loading={loading} fullWidth size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          By registering you join as a{" "}
          <span className="text-zinc-500">Student</span>. Admins can promote
          you to Teacher.
        </p>
      </div>
    </div>
  );
}