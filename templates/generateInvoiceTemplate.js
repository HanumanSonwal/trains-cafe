export const generateInvoiceTemplate = (orderData) => {
  const taxValue =
    orderData.payment?.tax ?? Number((orderData.subTotal * 0.05).toFixed(2));

  const itemRows = orderData.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmation - ${orderData?.order_id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; background: #f6f6f6; color: #333; }
    .invoice { background: #fff; padding: 30px; max-width: 800px; margin: auto; border: 1px solid #ccc; }
    h1 { text-align: center; color: #d35400; margin-bottom: 30px; }
    .flex-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .flex-col { flex: 1; }
    .info-label { font-weight: bold; }
    .section-title { background: #d35400; color: white; padding: 8px 12px; font-weight: bold; font-size: 15px; margin: 30px 0 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; font-size: 13px; }
    th { background-color: #f2f2f2; }
    .right { text-align: right; }
    .totals td { font-weight: bold; }
    .footer-note { font-size: 12px; margin-top: 40px; color: #888; }
  </style>
</head>
<body>
  <div class="invoice">
    <h1>Order Confirmation</h1>

    <div class="flex-row">
      <div class="flex-col">
        <div><span class="info-label">Order ID:</span> ${
          orderData?.order_id
        }</div>
        <div><span class="info-label">Order Date:</span> ${new Date(
          orderData?.createdAt
        ).toLocaleDateString()}</div>
        <div><span class="info-label">Station:</span> ${
          orderData?.station?.name
        }</div>
        <div><span class="info-label">Status:</span> ${orderData?.status}</div>
      </div>
      <div class="flex-col right">
        <div><span class="info-label">Train No:</span> ${
          orderData?.train?.train_number
        }</div>
        <div><span class="info-label">Train PNR:</span> ${
          orderData?.train?.train_pnr
        }</div>
      </div>
    </div>

    <div class="section-title">Passenger Information</div>
    <div class="flex-row">
      <div class="flex-col">
        <div><span class="info-label">Name:</span> ${
          orderData?.user_details?.name
        }</div>
        <div><span class="info-label">Email:</span> ${
          orderData?.user_details?.email
        }</div>
        <div><span class="info-label">Mobile:</span> ${
          orderData?.user_details?.mobile
        }</div>
      </div>
      <div class="flex-col right">
        <div><span class="info-label">PNR:</span> ${
          orderData?.user_details?.pnr
        }</div>
        <div><span class="info-label">Coach:</span> ${
          orderData?.user_details?.coach
        }</div>
        <div><span class="info-label">Seat No:</span> ${
          orderData?.user_details?.seatNo
        }</div>
      </div>
    </div>
    ${
      orderData?.user_details?.instructions
        ? `<p><strong>Instructions:</strong> ${orderData.user_details.instructions}</p>`
        : ""
    }

    <div class="section-title">Order Summary</div>
    <table>
      <thead>
        <tr>
          <th style="width:50%">Description</th>
          <th style="width:15%">Unit Price</th>
          <th style="width:10%">Qty</th>
          <th style="width:25%">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
      <tfoot>
        <tr class="totals">
          <td colspan="3" class="right">Subtotal</td>
          <td>₹${orderData?.subTotal?.toFixed(2)}</td>
        </tr>
        <tr class="totals">
          <td colspan="3" class="right">Coupon Discount</td>
          <td>-₹${orderData?.couponAmount?.toFixed(2)}</td>
        </tr>
        <tr class="totals">
          <td colspan="3" class="right">Tax</td>
          <td>₹${taxValue.toFixed(2)}</td>
        </tr>
        <tr class="totals">
          <td colspan="3" class="right">Total</td>
          <td><strong>₹${orderData?.total?.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>

    <div class="section-title">Payment Details</div>
    <p><strong>Payment Method:</strong> ${orderData?.payment?.method}</p>

    <p class="footer-note">This is a system-generated confirmation. For queries, contact our support team.</p>
  </div>
</body>
</html>
  `;
};
