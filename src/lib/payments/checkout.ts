/**
 * Razorpay Client-Side Checkout Helper
 * Dynamically loads Razorpay checkout.js and opens the payment gateway
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(params: {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  itemTitle: string;
  user: {
    name?: string;
    email?: string;
    phone?: string;
  };
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay payment gateway failed to load. Please check your internet connection.");
    return;
  }

  const options = {
    key: params.keyId,
    amount: params.amount,
    currency: params.currency || "INR",
    name: "Prime Commerce Hub",
    description: params.itemTitle,
    image: "/images/prime-commerce-hub-logo.jpg",
    order_id: params.orderId,
    prefill: {
      name: params.user.name || "",
      email: params.user.email || "",
      contact: params.user.phone || "",
    },
    theme: {
      color: "#5B32D6",
    },
    handler: function (response: any) {
      params.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        if (params.onFailure) {
          params.onFailure({ dismissed: true });
        }
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
