const express = require("express");
const router = express.Router();

const userRoutes = require("./user/api.route");
const productRoutes = require("./product/api.route");

router.use("/user", userRoutes);
router.use("/product", productRoutes);
module.exports = router; 