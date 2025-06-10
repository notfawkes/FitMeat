interface GPayPaymentRequest {
  totalPrice: number;
  merchantName: string;
  merchantId: string;
  orderId: string;
}

declare global {
  interface Window {
    google: {
      payments: {
        api: {
          PaymentsClient: any;
          Button: any;
          ReadyToPayRequest: any;
          PaymentDataRequest: any;
        };
      };
    };
  }
}

export const initializeGPay = () => {
  const client = new window.google.payments.api.PaymentsClient({
    environment: 'TEST', // Change to 'PRODUCTION' for live environment
  });

  return client;
};

export const createGPayPaymentRequest = ({
  totalPrice,
  merchantName,
  merchantId,
  orderId,
}: GPayPaymentRequest) => {
  const paymentDataRequest: any = {
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
      merchantId: merchantId,
      merchantName: merchantName,
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: totalPrice.toString(),
      currencyCode: 'INR',
      countryCode: 'IN',
    },
    callbackIntents: ['PAYMENT_AUTHORIZATION'],
  };

  return paymentDataRequest;
};

export const isReadyToPay = async (client: any) => {
  const request: any = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
      },
    ],
  };

  try {
    const response = await client.isReadyToPay(request);
    return response.result;
  } catch (error) {
    console.error('Error checking GPay readiness:', error);
    return false;
  }
}; 