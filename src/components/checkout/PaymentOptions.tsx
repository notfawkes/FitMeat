import React from 'react';
import GooglePayButton from '@google-pay/button-react';

interface PaymentOptionsProps {
  selectedPayment: string;
  onPaymentSelect: (method: string) => void;
  onPlaceOrder: (paymentMethod: string) => void;
  isProcessing: boolean;
  totalAmount: number;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  selectedPayment,
  onPaymentSelect,
  onPlaceOrder,
  isProcessing,
  totalAmount
}) => {

  const onGooglePayLoadPaymentData = (paymentData: any) => {
    console.log('load payment data', paymentData);
    onPlaceOrder('gpay');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#013220] mb-6">
        Payment Method
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            id="cod"
            name="payment"
            value="cod"
            checked={selectedPayment === 'cod'}
            onChange={(e) => onPaymentSelect(e.target.value)}
            className="w-5 h-5 text-[#50C878] focus:ring-[#50C878] border-gray-300"
          />
          <label htmlFor="cod" className="text-lg text-gray-700 cursor-pointer">
            Cash on Delivery
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            id="upi"
            name="payment"
            value="upi"
            checked={selectedPayment === 'upi'}
            onChange={(e) => onPaymentSelect(e.target.value)}
            className="w-5 h-5 text-[#50C878] focus:ring-[#50C878] border-gray-300"
          />
          <label htmlFor="upi" className="text-lg text-gray-700 cursor-pointer">
            UPI Payment
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            id="card"
            name="payment"
            value="card"
            checked={selectedPayment === 'card'}
            onChange={(e) => onPaymentSelect(e.target.value)}
            className="w-5 h-5 text-[#50C878] focus:ring-[#50C878] border-gray-300"
          />
          <label htmlFor="card" className="text-lg text-gray-700 cursor-pointer">
            Credit/Debit Card
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            id="gpay"
            name="payment"
            value="gpay"
            checked={selectedPayment === 'gpay'}
            onChange={(e) => onPaymentSelect(e.target.value)}
            className="w-5 h-5 text-[#50C878] focus:ring-[#50C878] border-gray-300"
          />
          <label htmlFor="gpay" className="text-lg text-gray-700 cursor-pointer">
            Google Pay
          </label>
        </div>
      </div>
      {selectedPayment === 'gpay' ? (
        <div className="mt-8">
          <GooglePayButton
            environment="TEST"
            paymentRequest={{
              apiVersion: 2,
              apiVersionMinor: 0,
              allowedPaymentMethods: [
                {
                  type: 'CARD',
                  parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                  },
                  tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                      gateway: 'example',
                      gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                  },
                },
              ],
              merchantInfo: {
                merchantId: '12345678901234567890',
                merchantName: 'FitMeats',
              },
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: totalAmount.toFixed(2),
                currencyCode: 'INR',
                countryCode: 'IN',
              },
            }}
            onLoadPaymentData={onGooglePayLoadPaymentData}
            buttonType="buy"
            buttonColor="black"
            buttonSizeMode="fill"
          />
        </div>
      ) : (
        <button
          onClick={() => onPlaceOrder(selectedPayment)}
          disabled={isProcessing}
          className={`w-full mt-8 py-4 px-6 rounded-lg text-white font-medium text-lg transition-colors ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#0B6E4F] hover:bg-[#50C878]'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      )}
    </div>
  );
}; 