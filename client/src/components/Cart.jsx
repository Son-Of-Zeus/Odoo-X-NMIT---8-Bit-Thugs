import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { checkoutAPI } from '../services/api'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Navbar from './Navbar'

export default function Cart() {
  const { cartItems, cartSummary, loading, updateQuantity, removeItem } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const navigate = useNavigate()


  const getSubtotal = () => {
    return cartSummary.subtotal || 0
  }

  const getShipping = () => {
    return cartSummary.shipping || 0
  }

  const getTotal = () => {
    return cartSummary.total || 0
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true)
      const result = await checkoutAPI.checkout()
      
      if (result.success) {
        alert(`Order placed successfully! Order #${result.order.orderNumber}`)
        navigate('/purchases') // Navigate to purchase history
      } else {
        alert('Checkout failed. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error.message || 'Checkout failed. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const getCategoryName = (categoryId) => {
    const categories = [
      'Electronics', 'Clothing', 'Furniture', 'Books', 
      'Sports', 'Home & Garden', 'Toys', 'Other'
    ]
    return categories[categoryId - 1] || 'Other'
  }

  const getConditionName = (conditionId) => {
    const conditions = {
      1: 'Like New',
      2: 'Very Good', 
      3: 'Good',
      4: 'Fair',
      5: 'Poor'
    }
    return conditions[conditionId] || 'Unknown'
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Start adding some eco-friendly finds to your cart
              </p>
              <Button onClick={() => navigate('/')} className="flex items-center gap-2 mx-auto">
                Continue Shopping
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.imageUrls && item.imageUrls.length > 0 ? (
                        <img 
                          src={item.imageUrls[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
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
                          {item.condition?.description || 'Good'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          Sold by {item.seller?.name || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-green-600 mt-2">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
              <p className="text-sm text-gray-500">
                {cartSummary.totalQuantity || 0} item{(cartSummary.totalQuantity || 0) !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{getShipping() > 0 ? formatPrice(getShipping()) : 'Free'}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(getTotal())}</span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full"
                  size="lg"
                >
                  {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Secure checkout powered by EcoFinds
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}