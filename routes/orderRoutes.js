const { Router } = require("express");
const OrderService = require("../services/orderService");
const authenticateAccess = require("../utils/auth");

const orderRouter = Router();
const orderService = new OrderService();

orderRouter.get("/", authenticateAccess, async (req, res) => {
  try {
    const { id, role } = req.user;
    const orders = await orderService.getAll({ role, id, search: req.query.search });
    res.json(orders);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

orderRouter.post("/", authenticateAccess, async (req, res) => {
  try {
    const order = req.body;
    const createdOrder = await orderService.post(order);
    res.json(createdOrder);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

orderRouter.get("/:id", authenticateAccess, async (req, res) => {
  try {
    const order = await orderService.getById(req.params.id);
    res.json(order);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

//Update by ID Method
orderRouter.put("/:id", authenticateAccess, async (req, res) => {
  try {
    const order = req.body;
    const updatedOrder = await orderService.put(req.params.id, order);
    res.json(updatedOrder);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

orderRouter.delete("/:id", authenticateAccess, async (req, res) => {
  try {
    const deletedOrder = await orderService.delete(req.params.id);
    res.json(deletedOrder);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

module.exports = orderRouter;
