// Payment integration with Paystack

const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://betadomotweb-production.up.railway.app'
    : 'http://localhost:8080';

export interface InitializePaymentRequest {
  customer_email: string;
  customer_phone: string;
  customer_name: string;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    product_id: string;
    product_slug: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_method: string;
}

export interface InitializePaymentResponse {
  order_id: string;
  order_number: string;
  payment_reference: string;
  authorization_url: string;
  access_code: string;
}

export interface VerifyPaymentResponse {
  status: 'success' | 'failed';
  order_id?: string;
  order_number?: string;
  amount?: number;
  message?: string;
}

/**
 * Initialize payment with backend
 */
export async function initializePayment(
  data: InitializePaymentRequest
): Promise<InitializePaymentResponse> {
  console.log('[Payment] Initializing payment:', data);

  const response = await fetch(`${API_BASE_URL}/orders/initialize-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[Payment] Initialization failed:', error);
    throw new Error(`Payment initialization failed: ${error}`);
  }

  const result = await response.json();
  console.log('[Payment] Initialization successful:', result);
  return result;
}

/**
 * Verify payment status
 */
export async function verifyPayment(
  reference: string
): Promise<VerifyPaymentResponse> {
  console.log('[Payment] Verifying payment:', reference);

  const response = await fetch(
    `${API_BASE_URL}/orders/verify-payment?reference=${reference}`
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('[Payment] Verification failed:', error);
    throw new Error(`Payment verification failed: ${error}`);
  }

  const result = await response.json();
  console.log('[Payment] Verification result:', result);
  return result;
}

/**
 * Open Paystack payment popup
 */
export function openPaystackPopup(
  authorizationUrl: string,
  onSuccess: () => void,
  onClose: () => void
) {
  console.log('[Payment] Opening Paystack popup');

  // Redirect to Paystack checkout
  window.location.href = authorizationUrl;
}
