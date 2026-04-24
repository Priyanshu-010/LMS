"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Shield,
  Plus,
  ListVideo,
  ClipboardList,
  User,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
  exact?: boolean;
}

const navItems: NavItem[] = [
  // shared
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student", "teacher", "admin"],
    exact: true,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "Browse Courses",
    href: "/courses",
    icon: BookOpen,
    roles: ["student", "teacher", "admin"],
  },

  // teacher
  {
    label: "My Courses",
    href: "/teacher/courses",
    icon: ListVideo,
    roles: ["teacher", "admin"],
  },
  {
    label: "Create Course",
    href: "/teacher/courses/create",
    icon: Plus,
    roles: ["teacher", "admin"],
  },

  // admin
  {
    label: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: ["admin"],
    exact: true,
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const visible = navItems.filter((item) => item.roles.includes(user.role));

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  // group items by section
  const shared = visible.filter((i) =>
    ["/dashboard", "/profile", "/courses"].includes(i.href),
  );
  const teacherItems = visible.filter((i) => i.href.startsWith("/teacher"));
  const adminItems = visible.filter((i) => i.href.startsWith("/admin"));

  const renderGroup = (label: string, items: NavItem[], color: string) => {
    if (items.length === 0) return null;
    return (
      <div>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-widest px-3 mb-2",
            color,
          )}
        >
          {label}
        </p>
        <div className="space-y-0.5">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer",
                  active
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70",
                )}
              >
                <item.icon
                  size={16}
                  className={active ? "text-violet-400" : "text-zinc-500"}
                />
                {item.label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "w-56 shrink-0 flex flex-col gap-6 py-6 px-3",
        "bg-zinc-950/60 border-r border-zinc-800/60 min-h-screen",
        className,
      )}
    >
      {/* user info */}
      <div className="px-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name}
                width={100}
                height={100}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-violet-400">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* nav groups */}
      {renderGroup("General", shared, "text-zinc-600")}
      {teacherItems.length > 0 &&
        renderGroup("Teaching", teacherItems, "text-blue-600/70")}
      {adminItems.length > 0 &&
        renderGroup("Admin", adminItems, "text-red-600/70")}
    </aside>
  );
}
