import PDFDocument from "pdfkit/js/pdfkit.standalone";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.vendorName || !data.startDate || !data.endDate) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required invoice fields",
        }),
        { status: 400 }
      );
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));

    /* ===============================
       HEADER – BRANDING
    =============================== */

    doc
      .fillColor("#F36C21")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("TRAINScafe", { align: "center", letterSpacing: 1 });

    doc
      .moveDown(0.3)
      .fontSize(11)
      .fillColor("#D35400")
      .font("Helvetica")
      .text("Fresh Food on Your Seat", { align: "center" });

    doc.moveDown(0.5);

    doc
      .strokeColor("#F36C21")
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown(1.5);

    /* ===============================
       TITLE
    =============================== */

    doc
      .fillColor("#333")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Vendor Settlement Invoice", { align: "center" });

    doc.moveDown(2);

    /* ===============================
       BASIC DETAILS
    =============================== */

    doc.fontSize(12).font("Helvetica").fillColor("#333");

    doc.text(`Vendor Name: ${data.vendorName}`);
    doc.text(
      `Settlement Period: ${data.startDate}  →  ${data.endDate}`
    );

    doc.moveDown(1.2);

    /* ===============================
       AMOUNT DETAILS
    =============================== */

    const labelX = 50;
    const valueX = 350;

    const row = (label, value) => {
      doc
        .fillColor("#666")
        .text(label, labelX, doc.y)
        .fillColor("#000")
        .text(`₹ ${value || 0}`, valueX, doc.y, {
          align: "right",
          width: 150,
        });
      doc.moveDown(0.6);
    };

    row("Online Amount", data.onlineAmount);
    row("COD Amount", data.codAmount);
    row("Vendor Share", data.vendorShare);
    row("Trainscafe Share", data.cafeShare);
    row("GST", data.tax);

    doc.moveDown(1);

    /* ===============================
       NET PAYABLE
    =============================== */

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#F36C21")
      .text(`Net Payable: ₹ ${data.settlementAmount || 0}`, {
        align: "right",
        underline: true,
      });

    doc.moveDown(1.5);

    /* ===============================
       STATUS
    =============================== */

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#333")
      .text(`Settlement Status: ${data.settlementStatus || "-"}`);

    doc.moveDown(3);

    /* ===============================
       FOOTER
    =============================== */

    doc
      .fontSize(10)
      .fillColor("#888")
      .text(
        "This is a system generated GST invoice. No signature required.",
        { align: "center" }
      );

    doc.end();

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=vendor_settlement_invoice.pdf",
      },
    });
  } catch (error) {
    console.error("Invoice API Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
