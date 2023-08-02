const fs = require("fs");
const PDFDocument = require("pdfkit");
const csv = require("csv-parser");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

const inputFilePath = "payments.csv";
const outputFilePath = "payments.pdf";
const templateFilePath = "./templates/index.html";
const cssFilePath = "./templates/styles.css";

function calculateFee(amount) {
  const percentFee = amount * 0.03;
  const minFee = 0.5;
  return Math.max(percentFee, minFee);
}

async function generatePDF(data) {
  try {
    const htmlTemplate = fs.readFileSync(templateFilePath, "utf-8");
    const cssStyles = fs.readFileSync(cssFilePath, "utf-8");

    // Merge data with the template
    const template = handlebars.compile(htmlTemplate);
    const renderedHtml = template({ data, cssStyles });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(renderedHtml);

    // Generate PDF from the rendered HTML
    await page.pdf({ path: outputFilePath, format: "A4" });

    await browser.close();

    console.log("PDF generated successfully!");
  } catch (error) {
    console.log(error);
  }
}

const data = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const { id, Description, Created, Amount, Currency } = row;
    const fee = calculateFee(parseFloat(Amount));
    const description =
      Description.trim() === "" ? "Payment for bookings" : Description;

    data.push({
      id,
      Description: description,
      Created,
      Amount,
      Currency,
      Fee: fee.toFixed(2),
    });
  })
  .on("end", () => {
    // Generate the PDF with the combined data rows
    generatePDF(data);
  })
  .on("error", (error) => {
    console.error("Error reading the CSV file:", error);
  });
