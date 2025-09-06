const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// POST /checkout - Create order from cart items
router.post("/proceed", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { shippingAddress, paymentMethod } = req.body; // Optional additional data

    // Get all cart items for the user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      }
    });

    // Check if cart is empty
    if (cartItems.length === 0) {
      return res.status(400).json({
        error: "Empty cart",
        message: "Cannot checkout with an empty cart"
      });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    // Add shipping cost
    const shipping = 5.99;
    const finalTotal = totalPrice + shipping;

    // Create the order using a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create the order
      const order = await prisma.order.create({
        data: {
          userId: userId,
          totalPrice: finalTotal
        }
      });

      // 2. Create order items from cart items
      const orderItems = await Promise.all(
        cartItems.map(cartItem =>
          prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              priceAtPurchase: cartItem.product.price
            }
          })
        )
      );

      // 3. Clear the user's cart
      await prisma.cartItem.deleteMany({
        where: { userId }
      });

      return { order, orderItems };
    });

    // Generate order number (you can customize this format)
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(result.order.id).padStart(3, '0')}`;

    res.json({
      success: true,
      message: "Order placed successfully!",
      order: {
        id: result.order.id,
        orderNumber: orderNumber,
        totalPrice: parseFloat(finalTotal.toFixed(2)),
        orderDate: result.order.orderDate,
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({
      error: "Checkout failed",
      message: "Could not process your order. Please try again."
    });
  }
});

// GET /checkout - Get user's purchase history (orders)
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Get all orders for the user with their items and product details
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
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
                }
              }
            }
          }
        }
      },
      orderBy: {
        orderDate: 'desc' // Most recent orders first
      }
    });

    // Format the orders to match your frontend mockup
    const formattedOrders = orders.map(order => {
      const orderNumber = `ORD-${new Date(order.orderDate).getFullYear()}-${String(order.id).padStart(3, '0')}`;
      
      // Calculate some order statistics
      const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      
      // Determine order status (you can make this more sophisticated)
      const daysSinceOrder = Math.floor((new Date() - new Date(order.orderDate)) / (1000 * 60 * 60 * 24));
      let status;
      if (daysSinceOrder <= 1) {
        status = 'Processing';
      } else if (daysSinceOrder <= 3) {
        status = 'Shipped';
      } else {
        status = 'Delivered';
      }

      return {
        id: order.id,
        orderNumber: orderNumber,
        orderDate: order.orderDate,
        totalPrice: parseFloat(order.totalPrice),
        status: status,
        itemCount: totalItems,
        items: order.orderItems.map(orderItem => ({
          id: orderItem.id,
          productId: orderItem.product.id,
          title: orderItem.product.title,
          description: orderItem.product.description,
          quantity: orderItem.quantity,
          priceAtPurchase: parseFloat(orderItem.priceAtPurchase),
          imageUrls: orderItem.product.imageUrls,
          category: orderItem.product.category ? {
            id: orderItem.product.category.id,
            name: orderItem.product.category.name
          } : null,
          seller: {
            id: orderItem.product.user.id,
            name: `${orderItem.product.user.firstName || ''} ${orderItem.product.user.lastName || ''}`.trim(),
            firstName: orderItem.product.user.firstName,
            lastName: orderItem.product.user.lastName,
            profilePictureUrl: orderItem.product.user.profilePictureUrl
          }
        }))
      };
    });

    res.json({
      orders: formattedOrders,
      totalOrders: orders.length
    });

  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({
      error: "Failed to fetch purchase history",
      message: "Could not retrieve your orders. Please try again."
    });
  }
});

// GET /checkout/:orderId - Get specific order details
router.get("/history/:orderId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const orderId = parseInt(req.params.orderId);

    // Get specific order with full details
    const order = await prisma.order.findFirst({
      where: { 
        id: orderId,
        userId: userId // Ensure user can only see their own orders
      },
      include: {
        orderItems: {
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
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
        message: "The requested order could not be found"
      });
    }

    // Format the order details
    const orderNumber = `ORD-${new Date(order.orderDate).getFullYear()}-${String(order.id).padStart(3, '0')}`;
    const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Determine order status
    const daysSinceOrder = Math.floor((new Date() - new Date(order.orderDate)) / (1000 * 60 * 60 * 24));
    let status;
    let deliveryDate = null;
    
    if (daysSinceOrder <= 1) {
      status = 'Processing';
    } else if (daysSinceOrder <= 3) {
      status = 'Shipped';
      // Estimate delivery date
      const estimatedDelivery = new Date(order.orderDate);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
      deliveryDate = estimatedDelivery;
    } else {
      status = 'Delivered';
      // Actual delivery date (estimated)
      const actualDelivery = new Date(order.orderDate);
      actualDelivery.setDate(actualDelivery.getDate() + 3);
      deliveryDate = actualDelivery;
    }

    const formattedOrder = {
      id: order.id,
      orderNumber: orderNumber,
      orderDate: order.orderDate,
      totalPrice: parseFloat(order.totalPrice),
      status: status,
      deliveryDate: deliveryDate,
      itemCount: totalItems,
      items: order.orderItems.map(orderItem => ({
        id: orderItem.id,
        productId: orderItem.product.id,
        title: orderItem.product.title,
        description: orderItem.product.description,
        quantity: orderItem.quantity,
        priceAtPurchase: parseFloat(orderItem.priceAtPurchase),
        itemTotal: parseFloat(orderItem.priceAtPurchase) * orderItem.quantity,
        imageUrls: orderItem.product.imageUrls,
        category: orderItem.product.category ? {
          id: orderItem.product.category.id,
          name: orderItem.product.category.name
        } : null,
        condition: orderItem.product.condition ? {
          id: orderItem.product.condition.id,
          description: orderItem.product.condition.description
        } : null,
        seller: {
          id: orderItem.product.user.id,
          name: `${orderItem.product.user.firstName || ''} ${orderItem.product.user.lastName || ''}`.trim(),
          firstName: orderItem.product.user.firstName,
          lastName: orderItem.product.user.lastName,
          profilePictureUrl: orderItem.product.user.profilePictureUrl
        }
      }))
    };

    res.json({ order: formattedOrder });

  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      error: "Failed to fetch order details",
      message: "Could not retrieve order information. Please try again."
    });
  }
});

module.exports = router;