const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

router.get("/cartitems", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Get cart items with all the product and seller information needed for the frontend
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePictureUrl: true
              }
            },
            category: {
              select: {
                id: true,
                name: true
              }
            },
            condition: {
              select: {
                id: true,
                description: true
              }
            }
          }
        }
      }
    });

    // Calculate totals for the cart
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    const shipping = 5.99; // Fixed shipping cost - you can make this dynamic later
    const total = subtotal + shipping;

    // Format the response to match what your frontend needs
    const formattedCartItems = cartItems.map(item => ({
      // Cart item info
      id: item.id,
      quantity: item.quantity,
      
      // Product info
      productId: item.product.id,
      title: item.product.title,
      description: item.product.description,
      price: parseFloat(item.product.price),
      imageUrls: item.product.imageUrls,
      createdAt: item.product.createdAt,
      
      // Seller info
      seller: {
        id: item.product.user.id,
        name: `${item.product.user.firstName || ''} ${item.product.user.lastName || ''}`.trim(),
        firstName: item.product.user.firstName,
        lastName: item.product.user.lastName,
        profilePictureUrl: item.product.user.profilePictureUrl
      },
      
      // Category info (if exists)
      category: item.product.category ? {
        id: item.product.category.id,
        name: item.product.category.name
      } : null,
      
      // Condition info (if exists)
      condition: item.product.condition ? {
        id: item.product.condition.id,
        description: item.product.condition.description
      } : null,
      
      // Item subtotal
      itemSubtotal: parseFloat(item.product.price) * item.quantity
    }));

    res.json({ 
      cartItems: formattedCartItems,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: shipping,
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: "Could not fetch cart items" 
    });
  }
});

router.post("/cartitems", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    // First, let's check if the product actually exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    // If product doesn't exist, send a friendly error message
    if (!product) {
      return res.status(400).json({ 
        error: "Product not found", 
        message: `No product exists with ID ${productId}` 
      });
    }

    // Check if this item is already in the user's cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      // If item already exists, update the quantity instead of creating new
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        select: {
          id: true,
          userId: true,
          productId: true,
          quantity: true,
        },
      });
    } else {
      // Create new cart item since it doesn't exist
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, quantity },
        select: {
          id: true,
          userId: true,
          productId: true,
          quantity: true,
        },
      });
    }

    res.json({ cartItem });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: "Could not add item to cart" 
    });
  }
});

// DELETE /cartitems - Remove item from cart
router.post("/delete", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;

    // Validate that productId is provided
    if (!productId) {
      return res.status(400).json({
        error: "Missing product ID",
        message: "Product ID is required to remove item from cart"
      });
    }

    // Check if the cart item exists for this user
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    });

    if (!existingCartItem) {
      return res.status(404).json({
        error: "Item not found",
        message: `No item with product ID ${productId} found in your cart`
      });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: existingCartItem.id
      }
    });

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      removedItem: {
        id: existingCartItem.id,
        productId: productId,
        quantity: existingCartItem.quantity
      }
    });

  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not remove item from cart"
    });
  }
});

// PUT /cartitems - Update item quantity in cart
router.put("/cartitems", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        error: "Missing product ID",
        message: "Product ID is required to update cart item"
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: "Invalid quantity",
        message: "Quantity must be a positive number"
      });
    }

    // Check if the cart item exists for this user
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    });

    if (!existingCartItem) {
      return res.status(404).json({
        error: "Item not found",
        message: `No item with product ID ${productId} found in your cart`
      });
    }

    // Update the cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: existingCartItem.id
      },
      data: {
        quantity: quantity
      },
      select: {
        id: true,
        userId: true,
        productId: true,
        quantity: true,
      }
    });

    res.json({
      success: true,
      message: "Cart item updated successfully",
      cartItem: updatedCartItem
    });

  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not update cart item"
    });
  }
});

module.exports = router;