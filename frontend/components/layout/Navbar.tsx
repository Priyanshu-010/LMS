"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  GraduationCap,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import Badge from "@/components/ui/Badge";
import { getInitials } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/courses", label: "Courses", icon: BookOpen, always: true },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      auth: true,
    },
    {
      href: "/teacher/courses",
      label: "My Courses",
      icon: GraduationCap,
      roles: ["teacher", "admin"],
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Shield,
      roles: ["admin"],
    },
  ];

  const visibleLinks = navLinks.filter((link) => {
    if (link.always) return true;
    if (link.auth && !isAuthenticated) return false;
    if (link.roles && (!user || !link.roles.includes(user.role))) return false;
    return true;
  });

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-violet-400 font-bold text-lg"
          >
            <BookOpen size={22} />
            <span>LearnHub</span>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Badge label={user.role} variant="role" />
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800/80 transition-colors"
                >
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      width={100}
                      height={100}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="text-sm text-zinc-300">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* mobile hamburger */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#09090b] px-4 py-4 space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-zinc-800 mt-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                >
                  <User size={16} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm text-zinc-300 hover:text-zinc-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
