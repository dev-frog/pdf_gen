const fs = require("fs");
const PDFDocument = require("pdfkit");

function generatePDF() {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Create a write stream to save the PDF
  const writeStream = fs.createWriteStream("company_address.pdf");
  doc.pipe(writeStream);

  // Set font size and style for the header
  doc.font("Helvetica-Bold").fontSize(24);

  // Header column 1 - Big name of the company
  const companyName = "Big Company Name";
  const companyNameWidth = doc.widthOfString(companyName);

  // Header column 2 - Address in a box
  const address = "123, Main Street\nCity, Country\nPostal Code";
  const addressWidth = doc.widthOfString(address);

  // Calculate the maximum width between the two columns
  const maxWidth = Math.max(companyNameWidth, addressWidth);

  // Set the header's height and width for the box
  const headerHeight = 80;
  const headerWidth = maxWidth + 40; // Extra padding of 40

  // Draw the header
  doc.rect(72, 72, headerWidth, headerHeight).stroke();
  doc.text(companyName, 72 + 20, 72 + 20);
  doc.text(address, 72 + 20, 72 + 20 + 30);

  // Save the PDF
  doc.end();
}

// Call the function to generate the PDF
generatePDF();
