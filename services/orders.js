export const placeOrder = async (
    vendor,
    station,
    train,
    payment,
    cart,
    user_details,
    couponCode
) => {
    try {
        const response = await fetch("/api/orders/place-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                vendor: vendor,
                station: station,
                train: train,
                payment: payment,
                cart: cart,
                user_details: user_details,
                couponCode :couponCode
            }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return result;
        } else {
            throw new Error(result.message || "Failed to place order.");
        }
    } catch (error) {
        throw error;
    }
}