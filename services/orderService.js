const Order = require("../models/order");
const User = require("../models/user");
const RequestError = require("../utils/error");
const generateRandomId = require("../utils/ids");

class OrderService {
  _orders;
  _users;

  constructor() {
    this._orders = Order;
    this._users = User;
  }

  async getAll({ role, id, search = "" }) {
    const isCertificator = role === "certificator";
    const client = search ? await this._users.findOne({ fullName: { $regex: search, $options: 'i' } }) : null
    if (search && !client) return [];

    const orders = (
      await this._orders
        .find(search ? { client: client._id } : {})
        .populate("certificateFile")
        .populate("client", "-passwordHash")
    )
      // If request is made by certificator return all orders, else return orders that only belong to the client making the request
      .filter((order) => (isCertificator ? true : order.client._id.toString() === id));
    return orders;
  }

  async getById(id) {
    const order = await this._orders.findById(id).populate('certificateFile').populate('client', "-passwordHash");
    if (!order) throw new RequestError("Užsakymas nerastas", 404);
    return order;
  }

  async post(order) {
    const createdOrder = new this._orders(order);
    await createdOrder.populate('client', "-passwordHash");
    createdOrder.number = generateRandomId(10);
    await createdOrder.save()
    
    return createdOrder;
  }

  async put(id, order) {
    const oldOrder = await this._orders.findById(id);
    if (oldOrder === null) throw new RequestError("Užsakymas nerastas", 404);

    if (typeof order.client !== 'string') delete order.client
    Object.assign(oldOrder, order);
    await oldOrder.save();

    const newOrder = await this._orders.findById(id).populate('certificateFile').populate('client', "-passwordHash")
    return newOrder;
  }

  async delete(id) {
    const order = await this._orders.findByIdAndDelete(id).populate('certificateFile').populate('client', "-passwordHash");
    if (!order) throw new RequestError("Užsakymas nerastas", 404);

    return order;
  }
}

module.exports = OrderService;
