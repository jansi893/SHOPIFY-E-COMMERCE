import Order from '../models/Order.js';
import { emitNotification } from '../utils/emitNotification.js';
import { getIo } from "../utils/socket.js";



export const createOrder = async (req, res) => {
    // Create a new order
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if
        (!items || items.length === 0) return res.status(400).json({ message: "No items in order" });

    try {
        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });
        const savedOrder = await order.save();

        //update stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });

            const io = getIo();

            //real time noti to user
            io.to(req.user._id.toString()).emit("orderPlaced", {
                orderId: savedOrder._id,
                message: "Your order has been placed successfully"
            })
            //admin dashboard noti
            io.emit("NewOrder", savedOrder);

            await emitNotification({
                io,
                to: req.user._id,
                from: req.user._id,
                type: order,
                message: "your order has been placed successfully",
                data: { orderId: savedOrder._id }
            })
        }

        res.status(201).json(savedOrder);

    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });

    }
}

//get all orders (admin only)

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

//get logged in user's orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders" });

    }
}

//get single order by id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized" });
        }
        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });

    }
}

//Mark order as delivered (admin only) 
export const markDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.isDelivered = true;
        order.deliveredAt = new Date();
        await order.save();

        res.status(200).json({ message: "Order marked as delivered" });

    } catch (error) {
        res.status(500).json({ message: "Delivery update failed" });

    }
}
