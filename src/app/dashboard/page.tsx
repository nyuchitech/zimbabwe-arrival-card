import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const statusConfig = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Clock },
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-600", icon: Clock },
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const { role } = session.user;

  // Fetch user's arrival cards if they are a traveler
  let arrivalCards: Awaited<ReturnType<typeof db.arrivalCard.findMany>> = [];
  let stats = { total: 0, pending: 0, approved: 0, rejected: 0 };

  if (role === "TRAVELER") {
    arrivalCards = await db.arrivalCard.findMany({
      where: { travelerId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const allCards = await db.arrivalCard.findMany({
      where: { travelerId: session.user.id },
      select: { status: true },
    });

    stats = {
      total: allCards.length,
      pending: allCards.filter((c) =>
        ["DRAFT", "SUBMITTED", "UNDER_REVIEW"].includes(c.status)
      ).length,
      approved: allCards.filter((c) => c.status === "APPROVED").length,
      rejected: allCards.filter((c) => c.status === "REJECTED").length,
    };
  }

  // Redirect to role-specific dashboards for other roles
  if (role === "IMMIGRATION") {
    redirect("/immigration");
  }
  if (role === "GOVERNMENT") {
    redirect("/government");
  }
  if (role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {session.user.name || "Traveler"}</h1>
        <p className="text-muted-foreground mt-1">
          Manage your Zimbabwe arrival cards and travel documents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start a new arrival card or continue an existing one</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/arrival-card/new">
            <Button className="bg-zim-green hover:bg-zim-green/90">
              <Plus className="mr-2 h-4 w-4" />
              Create New Arrival Card
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Arrival Cards</CardTitle>
          <CardDescription>Your most recent arrival card submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {arrivalCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No arrival cards yet</p>
              <p className="text-sm">Create your first arrival card to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {arrivalCards.map((card) => {
                const status = statusConfig[card.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-zim-green/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-zim-green" />
                      </div>
                      <div>
                        <p className="font-medium">{card.referenceNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {card.firstName} {card.lastName} -{" "}
                          {new Date(card.arrivalDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                      <Link href={`/arrival-card/${card.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
