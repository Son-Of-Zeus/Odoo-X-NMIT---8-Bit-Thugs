import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkoutAPI } from '../services/api'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Package, Calendar, ArrowRight, RotateCcw, Star } from 'lucide-react'
import Navbar from './Navbar'

export default function PreviousPurchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const response = await checkoutAPI.getPurchaseHistory()
      setPurchases(response.orders || [])
    } catch (err) {
      console.error('Error fetching purchases:', err)
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    if (!status) return 'Unknown'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg">Loading your purchase history...</div>
        </div>
      </div>
    )
  }

  if (purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Purchase History</h1>
          
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">No purchases yet</h2>
              <p className="text-gray-500 mb-6">
                Start shopping to see your purchase history here
              </p>
              <Button onClick={() => navigate('/')} className="flex items-center gap-2 mx-auto">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
            <p className="text-gray-600 mt-2">Track your eco-friendly purchases</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>

        <div className="space-y-6">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{purchase.orderNumber}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Ordered {formatDate(purchase.orderDate)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                        {getStatusText(purchase.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(purchase.totalPrice)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {purchase.itemCount} item{purchase.itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {purchase.items.map((item, index) => (
                  <div key={item.id} className={`p-6 ${index > 0 ? 'border-t' : ''}`}>
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.imageUrls && item.imageUrls.length > 0 ? (
                          <img 
                            src={item.imageUrls[0]} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {item.category?.name || 'Other'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Sold by {item.seller?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-lg font-semibold text-green-600">
                            {formatPrice(item.priceAtPurchase)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/product/${item.productId}`)}
                        >
                          View Product
                        </Button>
                        
                        {purchase.status === 'delivered' && (
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Review
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <RotateCcw className="h-3 w-3" />
                          Buy Again
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Delivery Info */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-between text-sm">
                    {purchase.status?.toLowerCase() === 'delivered' ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Package className="h-4 w-4" />
                        Delivered {purchase.deliveryDate ? formatDate(purchase.deliveryDate) : 'recently'}
                      </div>
                    ) : purchase.status?.toLowerCase() === 'shipped' ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Package className="h-4 w-4" />
                        Shipped - arriving soon
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="h-4 w-4" />
                        Order being processed
                      </div>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      Track Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}