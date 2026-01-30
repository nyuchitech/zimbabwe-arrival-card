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
import {
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  Globe,
  Plane,
  Building,
  Calendar,
  BarChart3,
  Download,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { DashboardPageSkeleton } from "@/components/ui/dashboard-skeletons";

async function AnalyticsDashboard() {
  // Get current date ranges
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 7);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Get comprehensive statistics
  const [
    totalCards,
    weeklyCards,
    monthlyCards,
    lastMonthCards,
    yearlyCards,
    approvedCards,
    rejectedCards,
    pendingCards,
    totalTravelers,
    topNationalities,
    topPurposes,
    borderPosts,
    recentCards,
    dailyStats,
  ] = await Promise.all([
    db.trip.count(),
    db.trip.count({
      where: { createdAt: { gte: startOfWeek } },
    }),
    db.trip.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    db.trip.count({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    db.trip.count({
      where: { createdAt: { gte: startOfYear } },
    }),
    db.trip.count({ where: { status: "APPROVED" } }),
    db.trip.count({ where: { status: "REJECTED" } }),
    db.trip.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    }),
    db.user.count({ where: { role: "USER" } }),
    db.trip.groupBy({
      by: ["nationality"],
      _count: { nationality: true },
      orderBy: { _count: { nationality: "desc" } },
      take: 10,
    }),
    db.trip.groupBy({
      by: ["purposeOfVisit"],
      _count: { purposeOfVisit: true },
      orderBy: { _count: { purposeOfVisit: "desc" } },
    }),
    db.borderPost.findMany({
      include: {
        _count: {
          select: { trips: true },
        },
      },
      orderBy: { trips: { _count: "desc" } },
      take: 10,
    }),
    db.trip.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceNumber: true,
        firstName: true,
        lastName: true,
        nationality: true,
        status: true,
        createdAt: true,
        purposeOfVisit: true,
      },
    }),
    // Get daily stats for the past 30 days
    db.$queryRaw`
      SELECT
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Trip"
      WHERE "createdAt" >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    ` as Promise<{ date: Date; count: bigint }[]>,
  ]);

  const approvalRate = totalCards > 0 ? ((approvedCards / totalCards) * 100).toFixed(1) : "0";
  const rejectionRate = totalCards > 0 ? ((rejectedCards / totalCards) * 100).toFixed(1) : "0";
  const monthOverMonth = lastMonthCards > 0
    ? (((monthlyCards - lastMonthCards) / lastMonthCards) * 100).toFixed(1)
    : "0";
  const isGrowth = Number(monthOverMonth) >= 0;

  const purposeLabels: Record<string, string> = {
    TOURISM: "Tourism",
    BUSINESS: "Business",
    EMPLOYMENT: "Employment",
    STUDY: "Study",
    MEDICAL: "Medical",
    TRANSIT: "Transit",
    RETURNING_RESIDENT: "Returning Resident",
    OTHER: "Other",
  };

  const statusColors: Record<string, string> = {
    SUBMITTED: "bg-blue-100 text-blue-800",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/government">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Detailed statistics and insights for Zimbabwe arrival cards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Eye className="h-3 w-3 mr-1" />
            Read-Only View
          </Badge>
          <Link href="/government/analytics/officers">
            <Button className="bg-zim-green hover:bg-zim-green/90">
              <Users className="h-4 w-4 mr-2" />
              Officer Performance
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arrivals</CardTitle>
            <FileText className="h-4 w-4 text-zim-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            {isGrowth ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyCards.toLocaleString()}</div>
            <p className={`text-xs ${isGrowth ? "text-green-600" : "text-red-600"}`}>
              {isGrowth ? "+" : ""}{monthOverMonth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground">
              {approvedCards.toLocaleString()} approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCards}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyCards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyCards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{today.getFullYear()} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejection Rate</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {rejectedCards.toLocaleString()} rejected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTravelers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total travelers</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="nationalities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nationalities">By Nationality</TabsTrigger>
          <TabsTrigger value="purpose">By Purpose</TabsTrigger>
          <TabsTrigger value="borderPosts">By Border Post</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="nationalities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Arrivals by Nationality
              </CardTitle>
              <CardDescription>Top 10 visitor nationalities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topNationalities.map((item, index) => {
                  const percentage = totalCards > 0
                    ? ((item._count.nationality / totalCards) * 100).toFixed(1)
                    : "0";
                  return (
                    <div key={item.nationality} className="flex items-center">
                      <div className="w-8 text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.nationality}</span>
                          <span className="text-sm text-muted-foreground">
                            {item._count.nationality.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zim-green rounded-full transition-all"
                            style={{
                              width: `${
                                (item._count.nationality / (topNationalities[0]?._count.nationality || 1)) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purpose">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Arrivals by Purpose of Visit
              </CardTitle>
              <CardDescription>Distribution of visit purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {topPurposes.map((item) => {
                  const percentage = totalCards > 0
                    ? ((item._count.purposeOfVisit / totalCards) * 100).toFixed(1)
                    : "0";
                  return (
                    <div
                      key={item.purposeOfVisit}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {purposeLabels[item.purposeOfVisit] || item.purposeOfVisit}
                        </span>
                        <Badge variant="secondary">{percentage}%</Badge>
                      </div>
                      <div className="text-2xl font-bold text-zim-green">
                        {item._count.purposeOfVisit.toLocaleString()}
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-zim-yellow rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borderPosts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Arrivals by Border Post
              </CardTitle>
              <CardDescription>Activity at each entry point</CardDescription>
            </CardHeader>
            <CardContent>
              {borderPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>No border post data available</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Border Post</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Total Arrivals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borderPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.code}</Badge>
                        </TableCell>
                        <TableCell>{post.type}</TableCell>
                        <TableCell className="text-right font-medium">
                          {post._count.trips.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Submissions
              </CardTitle>
              <CardDescription>Latest arrival card submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {card.referenceNumber}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium">
                        {card.firstName} {card.lastName}
                      </TableCell>
                      <TableCell>{card.nationality}</TableCell>
                      <TableCell>
                        {purposeLabels[card.purposeOfVisit] || card.purposeOfVisit}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[card.status]}>
                          {card.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Daily Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Daily Arrivals Trend
          </CardTitle>
          <CardDescription>Submissions over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-48 gap-1">
            {dailyStats.slice(0, 30).reverse().map((stat, index) => {
              const maxCount = Math.max(...dailyStats.map(s => Number(s.count)));
              const height = maxCount > 0 ? (Number(stat.count) / maxCount) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 bg-zim-green/80 hover:bg-zim-green rounded-t transition-all cursor-pointer group relative"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${new Date(stat.date).toLocaleDateString()}: ${stat.count} arrivals`}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                    {Number(stat.count)} arrivals
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["GOVERNMENT", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}
