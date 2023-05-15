const Order = require("../models/order");
const RequestError = require("../utils/error");

class OrderService {
  _orders;

  constructor() {
    this._orders = Order;
  }

  async getAll() {
    const orders = await this._orders.find().populate('certificateFile').populate('client');
    return orders;
  }

  async getById(id) {
    const order = await this._orders.findById(id).populate('certificateFile').populate('client');
    if (!order) throw new RequestError("Užsakymas nerastas", 404);
    return order;
  }

  async post(order) {
    const createdOrder = new this._orders(order);
    await createdOrder.save().populate('client');
    
    return createdOrder;
  }

  async put(id, order) {
    const oldOrder = await this._orders.findById(id);
    if (oldOrder === null) throw new RequestError("Užsakymas nerastas", 404);

    Object.assign(oldOrder, order);
    await oldOrder.save();
    await oldOrder.populate('certificateFile').populate('client');

    return oldOrder;
  }

  async delete(id) {
    const order = await this._orders.findByIdAndDelete(id).populate('certificateFile').populate('client');
    if (!order) throw new RequestError("Užsakymas nerastas", 404);

    return order;
  }
}

module.exports = OrderService;
