import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    isRead: {
        type: Boolean,
        default: false
    },
    isCleard: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        fullname: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'paypal'],
        default: 'paypal'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    paypalOrderId: String
}, { timestamps: true });


export default mongoose.model("Order", orderSchema);