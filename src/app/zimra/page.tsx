import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Globe,
  Briefcase,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";

export default async function ZimraDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["ZIMRA", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  // Get current date ranges
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Get customs-related statistics
  const [
    totalDeclarations,
    currencyDeclarations,
    goodsDeclarations,
    monthlyDeclarations,
    highValueDeclarations,
    topNationalities,
    purposeBreakdown,
    recentDeclarations,
  ] = await Promise.all([
    // Total arrival cards with customs declarations
    db.arrivalCard.count({
      where: {
        OR: [{ carryingCurrency: true }, { carryingGoods: true }],
      },
    }),
    // Currency declarations
    db.arrivalCard.count({
      where: { carryingCurrency: true },
    }),
    // Goods declarations
    db.arrivalCard.count({
      where: { carryingGoods: true },
    }),
    // Monthly declarations
    db.arrivalCard.count({
      where: {
        createdAt: { gte: startOfMonth },
        OR: [{ carryingCurrency: true }, { carryingGoods: true }],
      },
    }),
    // High value declarations (currency > $10,000 or goods > $5,000)
    db.arrivalCard.count({
      where: {
        OR: [
          { currencyAmount: { gte: 10000 } },
          { goodsValue: { gte: 5000 } },
        ],
      },
    }),
    // Top nationalities with declarations
    db.arrivalCard.groupBy({
      by: ["nationality"],
      where: {
        OR: [{ carryingCurrency: true }, { carryingGoods: true }],
      },
      _count: { nationality: true },
      _sum: { currencyAmount: true, goodsValue: true },
      orderBy: { _count: { nationality: "desc" } },
      take: 5,
    }),
    // Purpose of visit breakdown for declarers
    db.arrivalCard.groupBy({
      by: ["purposeOfVisit"],
      where: {
        OR: [{ carryingCurrency: true }, { carryingGoods: true }],
      },
      _count: { purposeOfVisit: true },
      orderBy: { _count: { purposeOfVisit: "desc" } },
      take: 5,
    }),
    // Recent declarations requiring attention
    db.arrivalCard.findMany({
      where: {
        OR: [
          { currencyAmount: { gte: 10000 } },
          { goodsValue: { gte: 5000 } },
        ],
        status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED"] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        referenceNumber: true,
        firstName: true,
        lastName: true,
        nationality: true,
        arrivalDate: true,
        carryingCurrency: true,
        currencyAmount: true,
        currencyType: true,
        carryingGoods: true,
        goodsDescription: true,
        goodsValue: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  // Calculate totals
  const totalCurrencyDeclared = await db.arrivalCard.aggregate({
    _sum: { currencyAmount: true },
    where: { carryingCurrency: true },
  });

  const totalGoodsValue = await db.arrivalCard.aggregate({
    _sum: { goodsValue: true },
    where: { carryingGoods: true },
  });

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

  const statusConfig = {
    SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-800" },
    UNDER_REVIEW: { label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
    APPROVED: { label: "Approved", color: "bg-green-100 text-green-800" },
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">ZIMRA Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Customs declarations and revenue analytics
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Declarations</CardTitle>
            <FileText className="h-4 w-4 text-zim-green" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeclarations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Arrivals with customs items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currency Declared</CardTitle>
            <DollarSign className="h-4 w-4 text-zim-yellow" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCurrencyDeclared._sum.currencyAmount)}
            </div>
            <p className="text-xs text-muted-foreground">{currencyDeclarations} declarations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goods Value</CardTitle>
            <Package className="h-4 w-4 text-blue-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalGoodsValue._sum.goodsValue)}
            </div>
            <p className="text-xs text-muted-foreground">{goodsDeclarations} declarations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Value Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highValueDeclarations}</div>
            <p className="text-xs text-muted-foreground">Requiring review</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyDeclarations}</div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleString("default", { month: "long" })} declarations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Currency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                currencyDeclarations > 0
                  ? (totalCurrencyDeclared._sum.currencyAmount || 0) / currencyDeclarations
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per declaration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Goods Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                goodsDeclarations > 0
                  ? (totalGoodsValue._sum.goodsValue || 0) / goodsDeclarations
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per declaration</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" aria-hidden="true" />
              Top Declaring Nationalities
            </CardTitle>
            <CardDescription>Countries with most customs declarations</CardDescription>
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
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency((item._sum.currencyAmount || 0) + (item._sum.goodsValue || 0))}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-zim-green/20 rounded-full w-16">
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
                        <span className="text-sm font-medium w-8 text-right">
                          {item._count.nationality}
                        </span>
                      </div>
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
              <Briefcase className="h-5 w-5" aria-hidden="true" />
              Purpose of Visit
            </CardTitle>
            <CardDescription>Declarations by travel purpose</CardDescription>
          </CardHeader>
          <CardContent>
            {purposeBreakdown.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data available</p>
            ) : (
              <div className="space-y-4">
                {purposeBreakdown.map((item, index) => (
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
                                (purposeBreakdown[0]?._count.purposeOfVisit || 1)) *
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

      {/* High Value Declarations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
            High Value Declarations
          </CardTitle>
          <CardDescription>
            Declarations over $10,000 currency or $5,000 goods value
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentDeclarations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
              <p>No high value declarations</p>
              <p className="text-sm">All declarations are within normal thresholds</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Traveler</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Goods</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeclarations.map((card) => {
                  const status = statusConfig[card.status as keyof typeof statusConfig];
                  const totalValue = (card.currencyAmount || 0) + (card.goodsValue || 0);
                  return (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium font-mono text-sm">
                        {card.referenceNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {card.firstName} {card.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(card.arrivalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{card.nationality}</TableCell>
                      <TableCell>
                        {card.carryingCurrency ? (
                          <span className="font-medium">
                            {formatCurrency(card.currencyAmount)} {card.currencyType}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {card.carryingGoods ? (
                          <div>
                            <span className="font-medium">{formatCurrency(card.goodsValue)}</span>
                            {card.goodsDescription && (
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {card.goodsDescription}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-zim-green">
                          {formatCurrency(totalValue)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {status && <Badge className={status.color}>{status.label}</Badge>}
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
