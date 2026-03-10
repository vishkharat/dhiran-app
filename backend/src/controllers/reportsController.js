import Customer from "../models/Customer.js";
import Dhiran from "../models/Dhiran.js";
import Payment from "../models/Payment.js";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

export const downloadCustomerLedger = async (req, res) => {
  try {

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const dhirans = await Dhiran.find({ customer: customer._id }).sort({
      createdAt: 1,
    });

    // ✅ FIX 1 (bufferPages added)
    const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ledger-${customer.name}.pdf`
    );

    doc.pipe(res);

    // ===== PATH SETUP =====

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const fontPath = path.join(__dirname, "../fonts/NotoSansGujarati-Regular.ttf");
    const logoPath = path.join(__dirname, "../assets/logo.png");

    doc.font(fontPath);

    // ===== HEADER WITH LOGO =====

    try {
      doc.image(logoPath, 40, 40, { width: 60 });
    } catch {}

    doc.fontSize(20).text("BHAGVATI JEWELLERS", 120, 40);
    doc.fontSize(11).text("MAIN MARKET, NAVAVAS (DANTA) - 385120", 120, 65);
    doc.text("Mobile: 9574208413", 120, 80);

    doc.moveDown(3);

    doc.fontSize(16).text("CUSTOMER LEDGER", { align: "center", underline: true });

    doc.moveDown();

    // ===== CUSTOMER DETAILS =====

    doc.fontSize(11);

    doc.text(`Customer Name: ${customer.name}`);
    doc.text(`Mobile: ${customer.mobile}`);
    doc.text(`Address: ${customer.address || "-"}`);

    doc.moveDown();

    let dhiranNumber = 1;

    for (const d of dhirans) {

      doc.moveDown();

      doc.fontSize(13).text(`Dhiran ${dhiranNumber} (${d.status})`, { underline: true });

      const startDate = d.startDate || d.createdAt;

      doc.fontSize(10);
      doc.text(`Dhiran Amount: Rs. ${d.amount}`);
      doc.text(`Interest Rate: ${d.interestRate}%`);
      doc.text(`Start Date: ${new Date(startDate).toLocaleDateString()}`);
      doc.text(`Purity: ${d.purity || "-"}`);
      doc.text(`Weight: ${d.weight || 0} grams`);
      doc.text(`Description: ${d.description || "-"}`);

      doc.moveDown();

      // ===== TABLE HEADER =====

      let y = doc.y;

      const tableLeft = 40;
      const colDate = 50;
      const colParticular = 120;
      const colInterest = 320;
      const colPrincipal = 400;
      const colBalance = 480;

      doc.fontSize(11);

      doc.rect(tableLeft, y, 530, 20).stroke();

      doc.text("Date", colDate, y + 5);
      doc.text("Particular", colParticular, y + 5);
      doc.text("Interest", colInterest, y + 5);
      doc.text("Principal", colPrincipal, y + 5);
      doc.text("Balance", colBalance, y + 5);

      y += 20;

      let balance = d.amount;

      // ===== DHIRAN START =====

      doc.rect(tableLeft, y, 530, 20).stroke();

      doc.text(new Date(startDate).toLocaleDateString(), colDate, y + 5);
      doc.text("Dhiran Start", colParticular, y + 5);
      doc.text("-", colInterest, y + 5);
      doc.text(`Rs. ${d.amount}`, colPrincipal, y + 5);
      doc.text(`Rs. ${balance}`, colBalance, y + 5);

      y += 20;

      const payments = await Payment.find({ dhiran: d._id }).sort({
        paymentDate: 1,
      });

      let totalPrincipal = 0;
      let totalInterest = 0;

      for (const p of payments) {

        const principal = p.principalPaid || 0;
        const interest = p.interestPaid || 0;

        const amount = principal + interest;

        totalPrincipal += principal;
        totalInterest += interest;

        balance -= principal;

        // ===== PAYMENT ROW =====

        doc.rect(tableLeft, y, 530, 20).stroke();

        doc.text(new Date(p.paymentDate).toLocaleDateString(), colDate, y + 5);
        doc.text("Payment", colParticular, y + 5);
        doc.text(`Rs. ${interest}`, colInterest, y + 5);
        doc.text(`Rs. ${principal}`, colPrincipal, y + 5);
        doc.text(`Rs. ${balance}`, colBalance, y + 5);

        y += 20;

        // ===== GUJARATI NOTE =====

        doc.fontSize(9);

        doc.text(`આ દિવસે તમે ₹${amount} ચુકવ્યા.`, colParticular, y);
        y += 12;

        doc.text(`તેમાંથી ₹${interest} વ્યાજમાં કપાયા.`, colParticular, y);
        y += 12;

        doc.text(`₹${principal} મૂડીમાં જમા થયા.`, colParticular, y);
        y += 12;

        doc.text(`હજુ ચૂકવવાની મૂડી: ₹${balance}`, colParticular, y);

        y += 15;

        doc.fontSize(11);

        if (y > 720) {
          doc.addPage();
          y = 60;
        }

      }

      const totalPaid = totalPrincipal + totalInterest;
      const remainingPrincipal = d.amount - totalPrincipal;

      doc.moveDown();

      doc.text(`Total Principal Paid: Rs. ${totalPrincipal}`);
      doc.text(`Total Interest Paid: Rs. ${totalInterest}`);
      doc.text(`Total Paid: Rs. ${totalPaid}`);
      doc.text(`Remaining Principal: Rs. ${remainingPrincipal}`);

      doc.moveDown();

      dhiranNumber++;

    }

    // ===== PAGE NUMBER FOOTER =====

    const range = doc.bufferedPageRange();

    for (let i = range.start; i < range.start + range.count; i++) {

      doc.switchToPage(i);

      doc.fontSize(9).text(
        `Page ${i + 1 - range.start} of ${range.count}`,
        0,
        doc.page.height - 30,
        { align: "center" }
      );

    }

    doc.end();

  } catch (error) {

    console.log(error);

    // ✅ FIX 2 (headers already sent error)
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }

  }
};