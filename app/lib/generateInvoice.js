import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateInvoice(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const width = page.getWidth();
  let y = page.getHeight() - 50;

  const fontSize = 13;

  function text(txt, x, y, bold = false) {
    page.drawText(txt, {
      x,
      y,
      size: fontSize,
      font: bold ? boldFont : font,
      color: rgb(0, 0, 0),
    });
  }

  function drawLine(yPos) {
    page.drawLine({
      start: { x: 40, y: yPos },
      end: { x: width - 40, y: yPos },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  // ---------------------------
  // HEADER BOX
  // ---------------------------
  page.drawRectangle({
    x: 0,
    y: y - 40,
    width,
    height: 50,
    color: rgb(0.93, 0.93, 0.93),
  });

  text("SETTLEMENT INVOICE", 200, y - 20, true);
  y -= 70;

  // ---------------------------
  // VENDOR DETAILS
  // ---------------------------
  text("Vendor Information", 40, y, true);
  y -= 25;
  drawLine(y + 10);

  text(`Vendor Name:`, 40, y);
  text(`${data.vendor?.Vendor_Name || "-"}`, 180, y, true);
  y -= 20;

  text(`Commission:`, 40, y);
  text(`${data.vendor?.trainscafeCommision}%`, 180, y, true);
  y -= 30;

  // ---------------------------
  // DATE INFO
  // ---------------------------
  text("Settlement Duration", 40, y, true);
  y -= 25;
  drawLine(y + 10);

  text("Start Date:", 40, y);
  text(new Date(data.startDate).toLocaleDateString(), 180, y, true);
  y -= 20;

  text("End Date:", 40, y);
  text(new Date(data.endDate).toLocaleDateString(), 180, y, true);
  y -= 20;

  text("Paid:", 40, y);
  text(data.isPaid ? "Yes" : "No", 180, y, true);
  y -= 30;

  // ---------------------------
  // TABLE
  // ---------------------------
  text("Settlement Summary", 40, y, true);
  y -= 25;
  drawLine(y + 10);

  const fields = [
    ["Online Amount", data.onlineAmount],
    ["COD Amount", data.codAmount],
    ["Vendor Share", data.vendorShare],
    ["Cafe Share", data.cafeShare],
    ["Tax", data.tax],
    ["Cafe Net", data.cafeNet],
    ["Settlement Amount", data.settlementAmount],
    ["Settlement Status", data.settlementStatus],
  ];

  fields.forEach(([label, value]) => {
    text(label + ":", 40, y);
    text(String(value), 250, y, true);
    y -= 20;
  });

  y -= 20;
  drawLine(y);

  // ---------------------------
  // FOOTER
  // ---------------------------
  text("Thank you for using Trains Cafe Vendor Settlement System.", 40, 50);
  text("This is a system-generated invoice.", 40, 30);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
