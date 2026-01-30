"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Shield,
  Building,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getRoleDisplayName, getRoleBadgeColor } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import type { Role } from "@/generated/prisma/client";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
    roles: ["TRAVELER", "IMMIGRATION", "GOVERNMENT", "ADMIN"],
  },
  {
    href: "/arrival-card/new",
    label: "New Arrival Card",
    icon: FileText,
    roles: ["TRAVELER"],
  },
  {
    href: "/immigration",
    label: "Immigration",
    icon: Shield,
    roles: ["IMMIGRATION", "ADMIN"],
  },
  {
    href: "/government",
    label: "Government",
    icon: Building,
    roles: ["GOVERNMENT", "ADMIN"],
  },
  {
    href: "/admin",
    label: "Administration",
    icon: Settings,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/users",
    label: "User Management",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["GOVERNMENT", "ADMIN"],
  },
];

export function NavHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role as Role | undefined;

  const filteredNavItems = navItems.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const NavLinks = () => (
    <>
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-zim-green text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zim-green rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">ZW</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">
                Zimbabwe Arrival Card
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLinks />
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {userRole && (
              <Badge className={cn("hidden sm:inline-flex", getRoleBadgeColor(userRole))}>
                {getRoleDisplayName(userRole)}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-zim-green text-white">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
