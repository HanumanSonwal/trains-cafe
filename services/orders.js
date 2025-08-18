export const placeOrder = async (
  vendor,
  station,
  train,
  payment,
  cart,
  user_details,
  couponCode = "",    
  discount = 0    
) => {
  try {
    const response = await fetch("/api/orders/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor,
        station,
        train,
        payment,
        cart,
        user_details,
        couponCode,   
        discount,  
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return result;
    } else {
      throw new Error(result.message || "Failed to place order.");
    }
  } catch (error) {
    console.error("Error in placeOrder:", error);
    throw error;
  }
};
