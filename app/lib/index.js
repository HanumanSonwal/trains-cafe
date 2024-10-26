export const cartCalculation = (cart, coupon = null) => {

    if (!Array.isArray(cart) || !cart.length) {
        throw new Error("Invalid cart data");
    }
    try {
        
    let subTotal = 0;
    let total = 0;
    let tax = 0;
    let discount = 0;  

    cart.forEach((item) => {
        subTotal += parseInt(item.price, 10) * parseInt(item.quantity, 10);
    });
        
    if (coupon) {
        if(coupon.discount.type === 'percentage') {
            discount = (parseInt(coupon.discount.value, 10) / 100) * subTotal;
        } else {
            discount = coupon.discount.value;
        }
    }

    tax = subTotal * 0.05;

    total = subTotal + tax - discount;

    return {
        subTotal,
        tax,
        total,
        discount
    };
    } catch (error) {
        throw new Error(error.message);
    }

 }