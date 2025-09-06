const express = require("express");
const router = express.Router();

const userRoutes = require("./user/api.route");
const productRoutes = require("./product/api.route");
const cartRoutes = require("./cart/api.route");
const checkoutRoutes = require("./checkout/api.route");

router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes); // checkout routes are at root level

module.exports = router; 