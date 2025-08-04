import paypal from "../config/paypal.js";
import Order from "../models/Order.js";
// import productController from './productController.js';
import Product from "../models/Product.js";

export const createPaypalOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      const items = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
      });
    }
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5000/product-success",
        cancel_url: "http://localhost:5000/product-cancel",
      },
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
        },
      ],
    };


    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error(error.response);
        return res
          .status(500)
          .json({ message: "PayPal order creation failed" });
      }
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        totalAmount,
        paypalOrderId: payment.id,
      });
        await order.save();

        const approvalUrl = payment.links.find(
            (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({approvalUrl})
    });
  } catch (error) {
    res.status(500).json({ message: "Payment creation error", error: error.message });
  }
};


export const executePayPalPayment = async (req, res) => {
    const { paymentId,PayerID } = req.query;

try {
    const execute_payment_json = {
payer_id : PayerID,
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.error(error.response);
            return res.status(500).json({ message: "Payment execution failed" });

        }       

        const order = await Order.findOne({ paypalOrderId: paymentId });
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.isPaid = true;
        order.paidAt = new Date();
        await order.save();

        res.redirect("http://localhost:5000/payment-success");
    })
    
} catch (error) {
    res.status(500).json({ message: "Payment capture failed", error: error.message });
}
}