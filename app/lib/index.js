export const cartCalculation = (cart, coupon = null, extraDiscount = null) => {
  console.log(extraDiscount, "extra-Discount");
  if (!Array.isArray(cart) || !cart.length) {
    throw new Error("Invalid cart data");
  }

  try {
    let subTotal = 0;
    let tax = 0;
    let couponDiscount = 0;
    let manualDiscount = 0;
    let total = 0;

    cart.forEach((item) => {
      subTotal += parseInt(item.price, 10) * parseInt(item.quantity, 10);
    });

    if (coupon) {
      if (coupon.discount.type === "percentage") {
        couponDiscount = (parseInt(coupon.discount.value, 10) / 100) * subTotal;
      } else {
        couponDiscount = parseInt(coupon.discount.value, 10);
      }
    }

    if (extraDiscount && !isNaN(extraDiscount)) {
      manualDiscount = (parseFloat(extraDiscount) / 100) * subTotal;
    }

    tax = subTotal * 0.05;

    total = subTotal + tax - couponDiscount - manualDiscount;

    return {
      subTotal,
      tax,
      couponDiscount,
      adminDiscountAmount: manualDiscount,
      discount: couponDiscount + manualDiscount,
      total,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
