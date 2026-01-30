import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  TrendingUp,
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Target,
  BarChart3,
  Building,
  Calendar,
} from "lucide-react";
import { DashboardPageSkeleton } from "@/components/ui/dashboard-skeletons";

interface OfficerStats {
  id: string;
  name: string | null;
  email: string;
  borderPostName: string | null;
  totalProcessed: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  todayProcessed: number;
  weekProcessed: number;
}

async function OfficerPerformanceDashboard() {
  // Get current date ranges
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 7);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get all immigration officers and their stats
  const officers = await db.user.findMany({
    where: {
      role: "IMMIGRATION",
    },
    include: {
      borderPost: true,
      reviewedCards: {
        select: {
          id: true,
          status: true,
          reviewedAt: true,
        },
      },
    },
  });

  // Calculate stats for each officer
  const officerStats: OfficerStats[] = officers.map((officer) => {
    const totalProcessed = officer.reviewedCards.length;
    const approved = officer.reviewedCards.filter(
      (c) => c.status === "APPROVED"
    ).length;
    const rejected = officer.reviewedCards.filter(
      (c) => c.status === "REJECTED"
    ).length;
    const todayProcessed = officer.reviewedCards.filter(
      (c) => c.reviewedAt && new Date(c.reviewedAt) >= today
    ).length;
    const weekProcessed = officer.reviewedCards.filter(
      (c) => c.reviewedAt && new Date(c.reviewedAt) >= startOfWeek
    ).length;

    return {
      id: officer.id,
      name: officer.name,
      email: officer.email,
      borderPostName: officer.borderPost?.name || null,
      totalProcessed,
      approved,
      rejected,
      approvalRate: totalProcessed > 0 ? (approved / totalProcessed) * 100 : 0,
      todayProcessed,
      weekProcessed,
    };
  });

  // Sort by total processed (descending)
  const sortedOfficers = [...officerStats].sort(
    (a, b) => b.totalProcessed - a.totalProcessed
  );

  // Get border post stats
  const borderPosts = await db.borderPost.findMany({
    where: { isActive: true },
    include: {
      officers: {
        select: { id: true },
      },
      arrivalCards: {
        where: {
          status: { in: ["APPROVED", "REJECTED"] },
        },
        select: {
          status: true,
          reviewedAt: true,
        },
      },
    },
  });

  // Calculate overall stats
  const totalOfficers = officers.length;
  const totalProcessedToday = officerStats.reduce(
    (sum, o) => sum + o.todayProcessed,
    0
  );
  const totalProcessedWeek = officerStats.reduce(
    (sum, o) => sum + o.weekProcessed,
    0
  );
  const totalProcessedAll = officerStats.reduce(
    (sum, o) => sum + o.totalProcessed,
    0
  );
  const avgApprovalRate =
    officerStats.length > 0
      ? officerStats.reduce((sum, o) => sum + o.approvalRate, 0) /
        officerStats.length
      : 0;

  // Top performers
  const topByVolume = sortedOfficers.slice(0, 3);
  const topByApprovalRate = [...officerStats]
    .filter((o) => o.totalProcessed >= 10)
    .sort((a, b) => b.approvalRate - a.approvalRate)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/government/analytics">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Analytics
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Officer Performance</h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze immigration officer processing metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Officers
            </CardTitle>
            <Users className="h-4 w-4 text-zim-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOfficers}</div>
            <p className="text-xs text-muted-foreground">
              Immigration officers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processed Today
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcessedToday}</div>
            <p className="text-xs text-muted-foreground">
              {(totalProcessedToday / Math.max(totalOfficers, 1)).toFixed(1)}{" "}
              avg per officer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProcessedWeek.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Approval Rate
            </CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgApprovalRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all officers</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-zim-yellow" />
              Top Performers by Volume
            </CardTitle>
            <CardDescription>
              Officers with highest processing volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topByVolume.map((officer, index) => (
                <div
                  key={officer.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-amber-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">
                        {officer.name || officer.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {officer.borderPostName || "Unassigned"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {officer.totalProcessed.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">total cards</p>
                  </div>
                </div>
              ))}
              {topByVolume.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Top Performers by Approval Rate
            </CardTitle>
            <CardDescription>
              Officers with highest approval rates (min. 10 cards)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topByApprovalRate.map((officer, index) => (
                <div
                  key={officer.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-green-500"
                          : index === 1
                          ? "bg-green-400"
                          : "bg-green-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">
                        {officer.name || officer.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {officer.totalProcessed} cards processed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      {officer.approvalRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">approval rate</p>
                  </div>
                </div>
              ))}
              {topByApprovalRate.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No data available (requires min. 10 processed cards)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Officer Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Officers Performance
          </CardTitle>
          <CardDescription>
            Detailed performance metrics for all immigration officers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Officers</TabsTrigger>
              <TabsTrigger value="today">Today&apos;s Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer</TableHead>
                    <TableHead>Border Post</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Approved</TableHead>
                    <TableHead className="text-right">Rejected</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">This Week</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOfficers.map((officer) => (
                    <TableRow key={officer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {(officer.name || officer.email)
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {officer.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {officer.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {officer.borderPostName ? (
                          <Badge variant="outline">
                            <Building className="h-3 w-3 mr-1" />
                            {officer.borderPostName}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {officer.totalProcessed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-600">
                          {officer.approved.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-red-600">
                          {officer.rejected.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            officer.approvalRate >= 90
                              ? "bg-green-100 text-green-800"
                              : officer.approvalRate >= 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {officer.approvalRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {officer.weekProcessed.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedOfficers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No immigration officers found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="today">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer</TableHead>
                    <TableHead>Border Post</TableHead>
                    <TableHead className="text-right">
                      Processed Today
                    </TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOfficers
                    .filter((o) => o.todayProcessed > 0)
                    .sort((a, b) => b.todayProcessed - a.todayProcessed)
                    .map((officer) => (
                      <TableRow key={officer.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {(officer.name || officer.email)
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {officer.name || officer.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {officer.borderPostName || "Unassigned"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {officer.todayProcessed}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  {sortedOfficers.filter((o) => o.todayProcessed > 0)
                    .length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No activity recorded today
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Border Post Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Border Post Activity
          </CardTitle>
          <CardDescription>
            Processing activity by border post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Border Post</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Officers</TableHead>
                <TableHead className="text-right">Total Processed</TableHead>
                <TableHead className="text-right">Approved</TableHead>
                <TableHead className="text-right">Rejected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borderPosts.map((post) => {
                const approved = post.arrivalCards.filter(
                  (c) => c.status === "APPROVED"
                ).length;
                const rejected = post.arrivalCards.filter(
                  (c) => c.status === "REJECTED"
                ).length;
                return (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {post.officers.length}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {post.arrivalCards.length.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {approved.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {rejected.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {borderPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No border posts configured
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function OfficerPerformancePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Only GOVERNMENT and ADMIN can view officer performance
  if (!["GOVERNMENT", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <OfficerPerformanceDashboard />
    </Suspense>
  );
}
