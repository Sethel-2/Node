import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { RequestError } from "../utils/error.js";
import { generateRandomId } from "../utils/ids.js";

export class OrderService {
  _orders;
  _users;

  constructor() {
    this._orders = Order;
    this._users = User;
  }

  async getAll({ role, id, search = "", page, from, to }) {
    const itemsPerPage = 15;
    const isCertificator = role === "certificator";
    const clients = search
      ? await this._users.find({
          fullName: { $regex: search, $options: "i" },
        })
      : [];
    if (search && !clients) return [];

    const query = {};
    if (search) query.client = { $in: clients }
    if (from) query.createdAt = { ...query.createdAt, $gte: from };
    if (to) query.createdAt = { ...query.createdAt, $lte: to };

    const orders = (
      await this._orders
        .find(query, undefined, {
          skip: itemsPerPage * page,
          limit: itemsPerPage + 1,
        })
        .populate("certificateFile")
        .populate("additionalFiles")
        .populate("client", "-passwordHash")
    )
      // If request is made by certificator return all orders, else return orders that only belong to the client making the request
      .filter((order) =>
        isCertificator ? true : order.client._id.toString() === id
      );

    const nextPageExists = orders.length === itemsPerPage + 1
    if (nextPageExists) orders.pop()
    return { orders, nextPageExists };
  }

  async getById(id) {
    const order = await this._orders
      .findById(id)
      .populate("certificateFile")
      .populate("additionalFiles")
      .populate("client", "-passwordHash");
    if (!order) throw new RequestError("Užsakymas nerastas", 404);
    return order;
  }

  async post(order) {
    const createdOrder = new this._orders(order);
    await createdOrder.populate("client", "-passwordHash");
    createdOrder.number = generateRandomId(10);
    await createdOrder.save();

    return createdOrder;
  }

  async put(id, order) {
    const oldOrder = await this._orders.findById(id);
    if (oldOrder === null) throw new RequestError("Užsakymas nerastas", 404);

    if (typeof order.client !== "string") delete order.client;
    Object.assign(oldOrder, order);
    await oldOrder.save();

    const newOrder = await this._orders
      .findById(id)
      .populate("certificateFile")
      .populate("additionalFiles")
      .populate("client", "-passwordHash");
    return newOrder;
  }

  async delete(id) {
    const order = await this._orders
      .findByIdAndDelete(id)
      .populate("certificateFile")
      .populate("additionalFiles")
      .populate("client", "-passwordHash");
    if (!order) throw new RequestError("Užsakymas nerastas", 404);

    return order;
  }
}
