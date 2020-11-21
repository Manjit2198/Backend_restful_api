const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controller/order');

//handel incoming GET request to /orders
router.get('/', checkAuth, OrdersController.order_get_all);

router.post('/', checkAuth, OrdersController.order_create_order);

router.get('/:orderId', checkAuth, OrdersController.order_get_order);

router.delete('/:orderId', checkAuth, OrdersController.order_delete);


module.exports = router;
