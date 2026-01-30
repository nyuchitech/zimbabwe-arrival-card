import { AppShell } from "@/components/dashboard/app-shell";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
