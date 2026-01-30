export const generateInvoiceTemplate = (orderData) => {
  const gstValue =
    orderData.payment?.tax ?? Number((orderData.subTotal * 0.05).toFixed(2));

  const COMPANY_LOGO =
    "https://res.cloudinary.com/dsyk2x4cw/image/upload/v1769760261/trains-cafe/logo/crx6voyn8bavsmqkvayh.svg";

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
  body {
    font-family: "Segoe UI", Arial, sans-serif;
    padding: 40px;
    background: #fff3eb;
    color: #333;
  }

  .invoice {
    background: #ffffff;
    padding: 30px;
    max-width: 820px;
    margin: auto;
    border: 1px solid #f1c6ad;
  }

  /* ===== BRAND HEADER ===== */
  .company-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #d6872a;
    padding-bottom: 18px;
    margin-bottom: 25px;
  }

  .company-logo img {
    height: 65px;
  }

  .company-details {
    text-align: right;
    font-size: 13px;
    line-height: 1.6;
  }

  .company-name {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #d6872a;
  }

  h1 {
    text-align: center;
    color: #6f4d27;
    margin: 28px 0;
    font-size: 24px;
    letter-spacing: 0.5px;
  }

  .flex-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .flex-col {
    flex: 1;
  }

  .info-label {
    font-weight: 600;
    color: #6f4d27;
  }

  .section-title {
    background: #d6872a;
    color: #ffffff;
    padding: 9px 14px;
    font-weight: 700;
    font-size: 15px;
    margin: 30px 0 12px;
    letter-spacing: 0.4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  th, td {
    border: 1px solid #f1c6ad;
    padding: 9px 10px;
    font-size: 13px;
  }

  th {
    background-color: #fff3eb;
    font-weight: 700;
  }

  .right {
    text-align: right;
  }

  .totals td {
    font-weight: 700;
  }

  .totals:last-child td {
    background: #fff3eb;
    font-size: 14px;
  }

  .footer-note {
    font-size: 12px;
    margin-top: 40px;
    color: #888;
    text-align: center;
  }
</style>
</head>

<body>
<div class="invoice">

  <!-- ===== COMPANY HEADER ===== -->
  <div class="company-header">
    <div class="company-logo">
      <img src="${COMPANY_LOGO}" alt="Trainscafe Logo" />
    </div>

    <div class="company-details">
      <div class="company-name">TRAINSCAFE</div>
      GST No: 08BNJPJ7837H1ZK<br/>
      08, Paschim Vihar-D,<br/>
      302026 Jaipur (Raj)<br/>
      Contact: +91 8696963496<br/>
      Email : info@trainscafe.in

    </div>
  </div>

  <h1>Order Confirmation</h1>

  <div class="flex-row">
    <div class="flex-col">
      <div><span class="info-label">Order ID:</span> ${orderData?.order_id}</div>
      <div><span class="info-label">Order Date:</span> ${new Date(orderData?.createdAt).toLocaleDateString()}</div>
      <div><span class="info-label">Station:</span> ${orderData?.station?.name}</div>
      <div><span class="info-label">Status:</span> ${orderData?.status}</div>
    </div>

    <div class="flex-col right">
      <div><span class="info-label">Train No:</span> ${orderData?.train?.train_number}</div>
      <div><span class="info-label">Train PNR:</span> ${orderData?.train?.train_pnr}</div>
    </div>
  </div>

  <div class="section-title">Passenger Information</div>

  <div class="flex-row">
    <div class="flex-col">
      <div><span class="info-label">Name:</span> ${orderData?.user_details?.name}</div>
      <div><span class="info-label">Email:</span> ${orderData?.user_details?.email}</div>
      <div><span class="info-label">Mobile:</span> ${orderData?.user_details?.mobile}</div>
    </div>

    <div class="flex-col right">
      <div><span class="info-label">PNR:</span> ${orderData?.user_details?.pnr}</div>
      <div><span class="info-label">Coach:</span> ${orderData?.user_details?.coach}</div>
      <div><span class="info-label">Seat No:</span> ${orderData?.user_details?.seatNo}</div>
    </div>
  </div>

  <div class="section-title">Order Summary</div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Unit Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
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
        <td colspan="3" class="right">GST</td>
        <td>₹${gstValue.toFixed(2)}</td>
      </tr>
      <tr class="totals">
        <td colspan="3" class="right">Total</td>
        <td><strong>₹${orderData?.total?.toFixed(2)}</strong></td>
      </tr>
    </tfoot>
  </table>

  <div class="section-title">Payment Details</div>
  <p><strong>Payment Method:</strong> ${orderData?.payment?.method}</p>

  <p class="footer-note">
    This is a system-generated GST invoice. No signature required.
  </p>

</div>
</body>
</html>
`;
};
