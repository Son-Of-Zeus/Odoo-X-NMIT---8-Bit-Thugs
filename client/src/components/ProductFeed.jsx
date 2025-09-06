import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Plus, Search, ShoppingCart } from 'lucide-react'
import Navbar from './Navbar'

export default function ProductFeed() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Category mapping based on your backend structure
  const categoryMap = {
    1: 'Electronics',
    2: 'Clothing', 
    3: 'Furniture',
    4: 'Books',
    5: 'Sports',
    6: 'Home & Garden',
    7: 'Toys',
    8: 'Other'
  }
  
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (product) => {
    try {
      addToCart(product, 1)
      alert(`${product.title} added to cart!`)
    } catch (err) {
      alert('Error adding to cart. Please try again.')
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProducts(false) // Get all products
      const productsData = response.products || []
      setProducts(productsData)
      setFilteredProducts(productsData)
      
      // Extract unique categories from products using categoryMap
      const uniqueCategories = ['All']
      const seenCategories = new Set()
      
      productsData.forEach(product => {
        const categoryName = categoryMap[product.categoryId]
        if (categoryName && !seenCategories.has(categoryName)) {
          seenCategories.add(categoryName)
          uniqueCategories.push(categoryName)
        }
      })
      
      setCategories(uniqueCategories)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
      // Set empty arrays to prevent undefined errors
      setProducts([])
      setFilteredProducts([])
      setCategories(['All'])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const categoryName = categoryMap[product.categoryId]
        return categoryName === selectedCategory
      })
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchTerm, categoryMap])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EcoFinds Marketplace</h1>
            <p className="text-gray-600 mt-2">Discover sustainable second-hand treasures</p>
          </div>
          <Button onClick={() => navigate('/add-product')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div onClick={() => navigate(`/product/${product.id}`)}>
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {categoryMap[product.categoryId] || 'Uncategorized'}
                      </span>
                      <Button 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-lg">No products found</div>
              <p className="text-gray-500 mt-2">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to add a product!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}