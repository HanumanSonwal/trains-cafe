export const cartCalculation = (cart, coupon = null, extraDiscount = null) => {
  if (!Array.isArray(cart) || !cart.length) {
    throw new Error("Invalid cart data");
  }

  try {
    let subTotal = 0;
    let couponDiscount = 0;
    let manualDiscount = 0;
    let tax = 0;
    let total = 0;

    cart.forEach((item, index) => {
      const itemPrice = item.Final_Price ?? item.price;

      if (itemPrice && item.quantity) {
        subTotal += parseFloat(itemPrice) * parseInt(item.quantity, 10);
      }
    });

    if (coupon) {
      if (coupon.discount.type === "percentage") {
        couponDiscount = (parseFloat(coupon.discount.value) / 100) * subTotal;
      } else {
        couponDiscount = parseFloat(coupon.discount.value);
      }
    }

    if (extraDiscount && !isNaN(extraDiscount)) {
      manualDiscount = (parseFloat(extraDiscount) / 100) * subTotal;
    }

    const afterDiscount = subTotal - couponDiscount - manualDiscount;

    tax = afterDiscount * 0.05;

    total = afterDiscount + tax;

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
