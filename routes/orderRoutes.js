import { Router } from 'express'
import { OrderService } from '../services/orderService.js';
import { authenticateAccess, authenticateCertificator } from '../utils/auth.js'

export const orderRouter = Router();
const orderService = new OrderService();

orderRouter.get("/", authenticateAccess, async (req, res) => {
  try {
    const { id, role } = req.user;
    const search = req.query.search;
    const page = req.query.page || 1;
    const createdFrom = req.query.from ? new Date(parseInt(req.query.from)) : undefined;
    const createdTo = req.query.to ? new Date(parseInt(req.query.to)) : undefined;

    const { orders, nextPageExists } = await orderService.getAll({
      role,
      id,
      search,
      page: page - 1,
      from: createdFrom,
      to: createdTo,
    });
    res.json({ orders, nextPageExists });
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

orderRouter.post("/", authenticateCertificator, async (req, res) => {
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

orderRouter.put("/:id", authenticateCertificator, async (req, res) => {
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

orderRouter.delete("/:id", authenticateCertificator, async (req, res) => {
  try {
    const deletedOrder = await orderService.delete(req.params.id);
    res.json(deletedOrder);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});
