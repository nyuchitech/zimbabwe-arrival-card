import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
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
import {
  FileText,
  Users,
  TrendingUp,
  Globe,
  Plane,
  Building,
  Calendar,
  BarChart3,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default async function GovernmentDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["GOVERNMENT", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  // Get current date ranges
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Get comprehensive statistics
  const [
    totalTrips,
    monthlyTrips,
    yearlyTrips,
    approvedTrips,
    pendingTrips,
    totalUsers,
    topNationalities,
    topPurposes,
    borderPosts,
  ] = await Promise.all([
    db.trip.count(),
    db.trip.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    db.trip.count({
      where: { createdAt: { gte: startOfYear } },
    }),
    db.trip.count({ where: { status: "APPROVED" } }),
    db.trip.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    }),
    db.user.count({ where: { role: "USER" } }),
    db.trip.groupBy({
      by: ["nationality"],
      _count: { nationality: true },
      orderBy: { _count: { nationality: "desc" } },
      take: 5,
    }),
    db.trip.groupBy({
      by: ["purposeOfVisit"],
      _count: { purposeOfVisit: true },
      orderBy: { _count: { purposeOfVisit: "desc" } },
      take: 5,
    }),
    db.borderPost.count(),
  ]);

  const approvalRate = totalTrips > 0 ? ((approvedTrips / totalTrips) * 100).toFixed(1) : 0;

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Government Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of Zimbabwe arrival card statistics and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/staff/help">
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </Link>
          <Link href="/government/analytics">
            <Button size="sm" className="bg-zim-green hover:bg-zim-green/90">
              <BarChart3 className="h-4 w-4 mr-2" />
              Detailed Analytics
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arrivals</CardTitle>
            <FileText className="h-4 w-4 text-zim-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrips.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyTrips.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleString("default", { month: "long" })} arrivals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyTrips.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{today.getFullYear()} arrivals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-zim-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground">Of all submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total travelers registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTrips}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Border Posts</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borderPosts}</div>
            <p className="text-xs text-muted-foreground">Active entry points</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Nationalities
            </CardTitle>
            <CardDescription>Most common visitor nationalities</CardDescription>
          </CardHeader>
          <CardContent>
            {topNationalities.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data available</p>
            ) : (
              <div className="space-y-4">
                {topNationalities.map((item, index) => (
                  <div key={item.nationality} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{item.nationality}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-zim-green/20 rounded-full w-24">
                        <div
                          className="h-full bg-zim-green rounded-full"
                          style={{
                            width: `${
                              (item._count.nationality / (topNationalities[0]?._count.nationality || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {item._count.nationality}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Purpose of Visit
            </CardTitle>
            <CardDescription>Why visitors come to Zimbabwe</CardDescription>
          </CardHeader>
          <CardContent>
            {topPurposes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data available</p>
            ) : (
              <div className="space-y-4">
                {topPurposes.map((item, index) => (
                  <div key={item.purposeOfVisit} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="font-medium">
                        {purposeLabels[item.purposeOfVisit] || item.purposeOfVisit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-zim-yellow/20 rounded-full w-24">
                        <div
                          className="h-full bg-zim-yellow rounded-full"
                          style={{
                            width: `${
                              (item._count.purposeOfVisit /
                                (topPurposes[0]?._count.purposeOfVisit || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {item._count.purposeOfVisit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
