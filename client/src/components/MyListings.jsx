import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import Navbar from './Navbar'

export default function MyListings() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  
  const navigate = useNavigate()

  const fetchMyProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProducts(true) // Get user's products only
      setProducts(response.products || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      setDeletingId(productId)
      await productAPI.deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg">Loading your listings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">Manage your products on EcoFinds</p>
          </div>
          <Button onClick={() => navigate('/add-product')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-gray-400 text-lg mb-4">No listings yet</div>
              <p className="text-gray-500 mb-6">
                Start by adding your first product to the marketplace
              </p>
              <Button onClick={() => navigate('/add-product')} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm">No Image</p>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg truncate">{product.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    {formatPrice(product.price)}
                  </p>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {getConditionName(product.conditionId)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex items-center gap-1 flex-1"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="flex items-center gap-1 flex-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      {deletingId === product.id ? '...' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}