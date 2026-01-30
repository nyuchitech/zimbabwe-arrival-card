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
  Receipt,
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
    roles: ["TRAVELER", "IMMIGRATION", "GOVERNMENT", "ZIMRA", "ADMIN"],
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
    href: "/zimra",
    label: "ZIMRA",
    icon: Receipt,
    roles: ["ZIMRA", "ADMIN"],
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
    roles: ["GOVERNMENT", "ZIMRA", "ADMIN"],
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

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg font-medium transition-colors",
              mobile
                ? "px-4 py-4 text-base min-h-[56px]"
                : "px-4 py-2 text-base",
              isActive
                ? "bg-zim-green text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon className={cn(mobile ? "h-6 w-6" : "h-5 w-5")} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 min-h-[48px]">
              <div className="w-10 h-10 bg-zim-green rounded-full flex items-center justify-center">
                <span className="text-white text-base font-bold">ZW</span>
              </div>
              <span className="font-bold text-lg hidden sm:block text-gray-900">
                Zimbabwe Arrival Card
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLinks />
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {userRole && (
              <Badge className={cn("hidden sm:inline-flex text-sm px-3 py-1", getRoleBadgeColor(userRole))}>
                {getRoleDisplayName(userRole)}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-zim-green text-white text-base font-semibold">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-semibold leading-none text-gray-900">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-sm leading-none text-gray-600 mt-1">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="py-3 px-4">
                  <Link href="/profile" className="cursor-pointer text-base">
                    <Settings className="mr-3 h-5 w-5" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 py-3 px-4 text-base"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-12 w-12">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
