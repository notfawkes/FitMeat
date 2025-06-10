import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
  key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET || '',
});

// NOTE: Never use your Razorpay secret key in frontend code!
// Use only the public key here. Secret key should be used in backend only.

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const getRazorpayKey = () => RAZORPAY_KEY_ID;

// The rest of the payment logic (order creation, signature verification) should be handled on your backend.
// Here, you can fetch the order from your backend and use the key ID to open the Razorpay checkout popup.

export interface PaymentOptions {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    orderId: string;
    customerName: string;
  };
}

export const createPayment = async (options: PaymentOptions) => {
  try {
    const order = await razorpay.orders.create({
      amount: options.amount * 100, // Razorpay expects amount in paise
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
    });

    return order;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const verifyPayment = async (
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) => {
  try {
    const generatedSignature = razorpay.utils.generateSignature(
      razorpayOrderId + '|' + razorpayPaymentId,
      process.env.REACT_APP_RAZORPAY_KEY_SECRET || ''
    );

    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 