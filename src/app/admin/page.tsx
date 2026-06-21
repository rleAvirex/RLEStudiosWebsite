import { db } from '@/lib/db'
import {
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

async function getStats() {
  try {
    const [orders, products, reviews, newsletterSubs, promoCodes] = await Promise.all([
      db.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      db.product.findMany(),
      db.review.findMany(),
      db.newsletterSubscriber.findMany(),
      db.promoCode.findMany(),
    ])

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
    const totalItemsSold = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    )
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    const avgRating =
      products.length > 0
        ? products.reduce((s, p) => s + p.rating, 0) / products.length
        : 0

    // Top selling products
    const productSales: Record<string, { name: string; count: number; revenue: number }> = {}
    for (const order of orders) {
      for (const item of order.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.name, count: 0, revenue: 0 }
        }
        productSales[item.productId].count += item.quantity
        productSales[item.productId].revenue += item.price * item.quantity
      }
    }
    const topProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)

    // Promo code usage
    const promoUsage = promoCodes
      .filter((p) => p.usesCount > 0)
      .sort((a, b) => b.usesCount - a.usesCount)

    return {
      orders,
      products,
      reviews,
      newsletterSubs,
      promoCodes,
      totalRevenue,
      totalItemsSold,
      avgOrderValue,
      avgRating,
      topProducts,
      promoUsage,
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return null
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Failed to load admin data.</p>
      </div>
    )
  }

  const {
    orders,
    products,
    reviews,
    newsletterSubs,
    promoCodes,
    totalRevenue,
    totalItemsSold,
    avgOrderValue,
    avgRating,
    topProducts,
    promoUsage,
  } = stats

  const statCards = [
    {
      label: 'Total Revenue',
      value: `€${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: '+12.5%',
      trend: 'up',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      icon: ShoppingBag,
      change: '+8.2%',
      trend: 'up',
    },
    {
      label: 'Items Sold',
      value: totalItemsSold.toString(),
      icon: Package,
      change: '+15.3%',
      trend: 'up',
    },
    {
      label: 'Avg Order Value',
      value: `€${avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      change: '-2.1%',
      trend: 'down',
    },
    {
      label: 'Products',
      value: products.length.toString(),
      icon: Package,
      change: '0%',
      trend: 'neutral',
    },
    {
      label: 'Reviews',
      value: reviews.length.toString(),
      icon: Star,
      change: '+23.1%',
      trend: 'up',
    },
    {
      label: 'Newsletter Subs',
      value: newsletterSubs.length.toString(),
      icon: Users,
      change: '+5.7%',
      trend: 'up',
    },
    {
      label: 'Avg Rating',
      value: `${avgRating.toFixed(1)} / 5`,
      icon: Star,
      change: '+0.1',
      trend: 'up',
    },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              RLE Studios — Store overview and analytics
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
            Live Data
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                      stat.trend === 'up'
                        ? 'text-green-500'
                        : stat.trend === 'down'
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                    {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Top Selling Products
            </h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sales yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topProducts.map(([id, data], i) => (
                  <div key={id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{data.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {data.count} sold · €{data.revenue.toFixed(2)} revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              Recent Orders
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{order.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} items · {order.email}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">
                        €{order.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Promo codes */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Promo Code Usage
          </h2>
          {promoUsage.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No promo codes used yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {promoCodes.map((promo) => (
                <div
                  key={promo.id}
                  className="p-3 rounded-lg bg-background border border-border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm font-bold text-primary">
                      {promo.code}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {promo.usesCount} uses
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {promo.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
