const API_BASE_URL = 'http://localhost:5001'

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = localStorage.getItem('auth_token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Authentication API calls
export const authAPI = {
  login: async (email, password) => {
    return makeRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  signup: async (userData) => {
    return makeRequest('/user/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  logout: async () => {
    return makeRequest('/user/logout', {
      method: 'POST',
    })
  },
}

// User profile API calls
export const userAPI = {
  getProfile: async () => {
    return makeRequest('/user/profile')
  },

  updateProfile: async (userData) => {
    return makeRequest('/user/update-profile', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },
}

// Product API calls
export const productAPI = {
  createProduct: async (productData) => {
    return makeRequest('/product/create-product', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  getProducts: async (isUserListing = false, productId = null) => {
    const params = new URLSearchParams()
    if (isUserListing) params.append('isUserListing', 'true')
    if (productId) params.append('productId', productId)
    
    const queryString = params.toString()
    return makeRequest(`/product/read-products${queryString ? '?' + queryString : ''}`)
  },

  updateProduct: async (productId, productData) => {
    return makeRequest(`/product/update-product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  deleteProduct: async (productId) => {
    return makeRequest('/product/delete-product', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    })
  },
}

// Cart API calls
export const cartAPI = {
  getCartItems: async () => {
    return makeRequest('/cart/cartitems')
  },

  addToCart: async (productId, quantity = 1) => {
    return makeRequest('/cart/cartitems', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
  },

  updateCartItem: async (cartItemId, quantity) => {
    // TODO: Add PUT /cart/cartitems/:id endpoint to your backend
    // For now, this will throw an error - you need to implement these endpoints
    return makeRequest(`/cart/cartitems/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  removeFromCart: async (productId) => {
    return makeRequest('/cart/delete', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
  },
}

// Checkout API calls
export const checkoutAPI = {
  checkout: async (shippingAddress = null, paymentMethod = null) => {
    return makeRequest('/checkout/proceed', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentMethod }),
    })
  },

  getPurchaseHistory: async () => {
    return makeRequest('/checkout/history')
  },

  getOrderDetails: async (orderId) => {
    return makeRequest(`/checkout/history/${orderId}`)
  },
}

// Health check API
export const healthAPI = {
  check: async () => {
    return makeRequest('/user/health')
  },
}