import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ArrowLeft, ShoppingCart, Heart, Share2, MapPin, Calendar } from 'lucide-react'
import Navbar from './Navbar'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productAPI.getProducts(false, parseInt(id))
        setProduct(response.product)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      addToCart(product, 1)
      // Show success feedback
      alert('Added to cart successfully!')
      // Optionally navigate to cart
      // navigate('/cart')
    } catch (err) {
      alert('Error adding to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
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

  const getCategoryName = (categoryId) => {
    const categories = [
      'Electronics', 'Clothing', 'Furniture', 'Books', 
      'Sports', 'Home & Garden', 'Toys', 'Other'
    ]
    return categories[categoryId - 1] || 'Other'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg">Loading product...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Button>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 text-lg">
                {error || 'Product not found'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isOwner = user && product.userId === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img 
                  src={product.imageUrls[0]} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <p className="text-lg">No Image Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-4xl font-bold text-green-600 mb-4">
                {formatPrice(product.price)}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getCategoryName(product.categoryId)}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getConditionName(product.conditionId)}
                </span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Listed on {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!isOwner && (
                <>
                  <Button 
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    size="lg"
                    className="w-full flex items-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="lg" className="flex-1 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1 flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </>
              )}
              
              {isOwner && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-3">This is your listing</p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="flex-1"
                    >
                      Edit Listing
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/my-listings')}
                      className="flex-1"
                    >
                      View All My Listings
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {product.seller?.firstName?.[0] || 'S'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {product.seller?.firstName || 'EcoFinds Seller'}
                    </p>
                    <p className="text-sm text-gray-500">Member since 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}