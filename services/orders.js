// export const placeOrder = async (
//     vendor,
//     station,
//     train,
//     payment,
//     cart,
//     user_details
// ) => {
//     try {
//         const response = await fetch("/api/orders/place-order", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 vendor: vendor,
//                 station: station,
//                 train: train,
//                 payment: payment,
//                 cart: cart,
//                 user_details: user_details
//             }),
//         });

//         const result = await response.json();

//         if (response.ok && result.success) {
//             return result;
//         } else {
//             throw new Error(result.message || "Failed to place order.");
//         }
//     } catch (error) {
//         throw error;
//     }
// }

export const placeOrder = async (
    vendor,
    station,
    train,
    payment,
    cart,
    user_details,
couponCode,   // 👈 add kiya
discount 
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
 couponCode: couponCode,  // 👈 add kiya
 discount: discount       
            }),
        });

        const result = await response.json();

        console.log("API response:", response);
        console.log("Parsed result:", result);

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


// export const placeOrder = async (
//     vendor,
//     station,
//     train,
//     payment,
//     cart,
//     user_details,
//     couponCode,   // 👈 add kiya
//     discount      // 👈 add kiya
// ) => {
//     try {
//         const response = await fetch("/api/orders/place-order", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 vendor: vendor,
//                 station: station,
//                 train: train,
//                 payment: payment,
//                 cart: cart,
//                 user_details: user_details,
//                 couponCode: couponCode,  // 👈 add kiya
//                 discount: discount       // 👈 add kiya
//             }),
//         });

//         const result = await response.json();

//         console.log("API response:", response);
//         console.log("Parsed result:", result);

//         if (response.ok && result.success) {
//             return result;
//         } else {
//             throw new Error(result.message || "Failed to place order.");
//         }
//     } catch (error) {
//         console.error("Error in placeOrder:", error);
//         throw error;
//     }
// };
