const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});
router.post("/create-product", authenticateToken, async (req, res) => {
  try {
    const { title, description, price, categoryId, conditionId, imageUrls,userId } = req.body;
    const product = await prisma.product.create({
      data: { title, description, price, categoryId, conditionId, imageUrls, userId: req.user.userId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        categoryId: true,
        conditionId: true,
        imageUrls: true,
        createdAt: true,
        userId: userId,
      },
    });
    res.json({ message: "Product created successfully", product });


  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/read-products", authenticateToken, async (req, res) => {
  try {
    // Get query parameters first - BEFORE using them!
    const productId = req.query.productId;
    const isUserListing = req.query.isUserListing;
    
    // If we have a specific product ID
    if (productId) {
      if (isUserListing === "true") {
        // Get product by ID, but only if it belongs to the current user
        const product = await prisma.product.findFirst({
          where: { 
            id: parseInt(productId),
            userId: req.user.userId 
          },
        });
        return res.json({ product });
      } else {
        // Get any product by ID (public view)
        const product = await prisma.product.findUnique({
          where: { id: parseInt(productId) },
        });
        return res.json({ product });
      }
    }
    
    // If no specific product ID, get list of products
    if (isUserListing === "true") {
      // Get only current user's products
      const products = await prisma.product.findMany({
        where: { userId: req.user.userId },
      });
      return res.json({ products });
    } else {
      // Get all products (public listing)
      const products = await prisma.product.findMany();
      return res.json({ products });
    }
  } catch (error) {
    console.error("Read products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/update-product/:productId", authenticateToken, async (req, res) => {
  try {
    // User should be only allowed to update the product if it belongs to them   
    const { productId } = req.params;
    const productIdInt = parseInt(productId);
    
    if (!productId || isNaN(productIdInt)) {
      return res.status(400).json({ error: "Valid Product ID is required" });
    }
    
    // First check if the product exists and belongs to the current user
    const existingProduct = await prisma.product.findFirst({
      where: { 
        id: productIdInt, 
        userId: req.user.userId 
      },
    });
    
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found or you don't have permission to update it" });
    }
    
    const { title, description, price, categoryId, conditionId, imageUrls } = req.body;
    
    // Build update data object (only include fields that are provided)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (conditionId !== undefined) updateData.conditionId = conditionId;
    if (imageUrls !== undefined) updateData.imageUrls = imageUrls;
    
    const updatedProduct = await prisma.product.update({
      where: { id: productIdInt },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        categoryId: true,
        conditionId: true,
        imageUrls: true,
        createdAt: true,
        userId: true,
      },
    });
    
    return res.json({ 
      message: "Product updated successfully",
      product: updatedProduct 
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete-product", authenticateToken, async (req, res) => {
    //get the product id from the json payload and only allow the user to delete the product if it belongs to them
    const { productId } = req.body;
    const productIdInt = parseInt(productId);
    if (!productId || isNaN(productIdInt)) {
      return res.status(400).json({ error: "Valid Product ID is required" });
    }
    const product = await prisma.product.findUnique({
      where: { id: productIdInt },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.userId !== req.user.userId) {
      return res.status(403).json({ error: "You are not allowed to delete this product" });
    }
    const deletedProduct = await prisma.product.delete({
      where: { id: productIdInt, userId: req.user.userId },
    });
    return res.json({ message: "Product deleted successfully", product: deletedProduct });
  } 
);

module.exports = router;