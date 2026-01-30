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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Users,
} from "lucide-react";

const statusConfig = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Clock },
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-600", icon: Clock },
};

export default async function ImmigrationDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["IMMIGRATION", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  // Get statistics
  const [totalSubmitted, pendingReview, approvedToday, rejectedToday] = await Promise.all([
    db.arrivalCard.count({ where: { status: "SUBMITTED" } }),
    db.arrivalCard.count({ where: { status: "UNDER_REVIEW" } }),
    db.arrivalCard.count({
      where: {
        status: "APPROVED",
        reviewedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    db.arrivalCard.count({
      where: {
        status: "REJECTED",
        reviewedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  // Get pending arrival cards
  const pendingCards = await db.arrivalCard.findMany({
    where: {
      status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
    },
    orderBy: { submittedAt: "asc" },
    take: 10,
    include: {
      traveler: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Immigration Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Review and process arrival card submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmitted}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReview}</div>
            <p className="text-xs text-muted-foreground">Currently reviewing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedToday}</div>
            <p className="text-xs text-muted-foreground">Processed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedToday}</div>
            <p className="text-xs text-muted-foreground">Declined today</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Arrival Cards</CardTitle>
          <CardDescription>
            Cards awaiting review - sorted by submission date (oldest first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending arrival cards</p>
              <p className="text-sm">All submissions have been processed</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Traveler</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Arrival Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCards.map((card) => {
                  const status = statusConfig[card.status];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">
                        {card.referenceNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {card.firstName} {card.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {card.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{card.nationality}</TableCell>
                      <TableCell>
                        {new Date(card.arrivalDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {card.submittedAt
                          ? new Date(card.submittedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/immigration/review/${card.id}`}>
                          <Button size="sm" className="bg-zim-green hover:bg-zim-green/90">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
