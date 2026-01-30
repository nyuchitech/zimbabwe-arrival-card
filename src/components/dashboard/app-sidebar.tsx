"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Building,
  Receipt,
  HelpCircle,
  QrCode,
  ChevronUp,
  User2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRoleDisplayName, getRoleBadgeColor } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import type { Role } from "@/generated/prisma/client";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Role[];
}

const mainNavItems: NavItem[] = [
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
];

const staffNavItems: NavItem[] = [
  {
    href: "/immigration",
    label: "Immigration",
    icon: Shield,
    roles: ["IMMIGRATION", "ADMIN"],
  },
  {
    href: "/immigration/scan",
    label: "Scan QR Code",
    icon: QrCode,
    roles: ["IMMIGRATION", "ADMIN"],
  },
  {
    href: "/government",
    label: "Government",
    icon: Building,
    roles: ["GOVERNMENT", "ADMIN"],
  },
  {
    href: "/government/analytics",
    label: "Analytics",
    icon: BarChart3,
    roles: ["GOVERNMENT", "ADMIN"],
  },
  {
    href: "/zimra",
    label: "ZIMRA",
    icon: Receipt,
    roles: ["ZIMRA", "ADMIN"],
  },
];

const adminNavItems: NavItem[] = [
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
];

const supportNavItems: NavItem[] = [
  {
    href: "/staff/help",
    label: "Help & Support",
    icon: HelpCircle,
    roles: ["IMMIGRATION", "GOVERNMENT", "ZIMRA", "ADMIN"],
  },
  {
    href: "/help",
    label: "Help & FAQ",
    icon: HelpCircle,
    roles: ["TRAVELER"],
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role as Role | undefined;

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => userRole && item.roles.includes(userRole));

  const mainItems = filterByRole(mainNavItems);
  const staffItems = filterByRole(staffNavItems);
  const adminItems = filterByRole(adminNavItems);
  const supportItems = filterByRole(supportNavItems);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zim-green text-white">
                  <span className="font-bold text-sm">ZW</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Zimbabwe</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Arrival Card
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Staff Navigation */}
        {staffItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Staff Portal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {staffItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Navigation */}
        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Support Navigation */}
        {supportItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-zim-green text-white">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <div className="px-2 py-1.5">
                  {userRole && (
                    <Badge
                      className={cn(
                        "text-xs",
                        getRoleBadgeColor(userRole)
                      )}
                    >
                      {getRoleDisplayName(userRole)}
                    </Badge>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User2 className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={userRole && userRole !== "TRAVELER" ? "/staff/help" : "/help"}
                    className="cursor-pointer"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
