import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

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

    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );

    if (!fs.existsSync(fontPath)) {
      throw new Error("Font file not found at " + fontPath);
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));

    doc.font(fontPath);

    doc.fontSize(18).text("Trains Cafe", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(14).text("Vendor Settlement Invoice", {
      align: "center",
    });

    doc.moveDown(2);
    doc.fontSize(12);

    doc.text(`Vendor Name: ${data.vendorName}`);
    doc.text(
      `Settlement Period: ${data.startDate} → ${data.endDate}`
    );

    doc.moveDown();

    doc.text(`Online Amount: ₹${data.onlineAmount ?? 0}`);
    doc.text(`COD Amount: ₹${data.codAmount ?? 0}`);
    doc.text(`Vendor Share: ₹${data.vendorShare ?? 0}`);
    doc.text(`Cafe Share: ₹${data.cafeShare ?? 0}`);
    doc.text(`Tax: ₹${data.tax ?? 0}`);

    doc.moveDown();
    doc.fontSize(13).text(
      `Net Payable: ₹${data.settlementAmount ?? 0}`,
      { underline: true }
    );

    doc.moveDown();
    doc.fontSize(12).text(`Status: ${data.status ?? "-"}`);

    doc.moveDown(3);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "This is a system generated invoice. No signature required.",
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
        message: error.message || "Invoice generation failed",
      }),
      { status: 500 }
    );
  }
}
