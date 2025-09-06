import React, { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../services/api'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
    totalQuantity: 0
  })
  const [loading, setLoading] = useState(false)

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await cartAPI.getCartItems()
      setCartItems(response.cartItems || [])
      setCartSummary(response.summary || {
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
        totalQuantity: 0
      })
    } catch (error) {
      console.error('Error fetching cart items:', error)
      setCartItems([])
      setCartSummary({
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
        totalQuantity: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Load cart on mount
  useEffect(() => {
    fetchCartItems()
  }, [])

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true)
      await cartAPI.addToCart(product.id, quantity)
      // Refresh cart after adding
      await fetchCartItems()
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      setLoading(true)
      if (newQuantity <= 0) {
        // Find the product ID for this cart item to remove it
        const cartItem = cartItems.find(item => item.id === cartItemId)
        if (cartItem) {
          await removeItem(cartItem.productId)
        }
      } else {
        await cartAPI.updateCartItem(cartItemId, newQuantity)
        await fetchCartItems()
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId) => {
    try {
      setLoading(true)
      await cartAPI.removeFromCart(productId)
      await fetchCartItems()
    } catch (error) {
      console.error('Error removing cart item:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      // Remove all items one by one (since there's no clear all endpoint)
      await Promise.all(cartItems.map(item => cartAPI.removeFromCart(item.productId)))
      await fetchCartItems()
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshCart = () => {
    return fetchCartItems()
  }

  const value = {
    cartItems,
    cartSummary,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
    // Legacy compatibility methods
    getCartTotal: () => cartSummary.subtotal,
    getCartItemCount: () => cartSummary.totalQuantity
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}