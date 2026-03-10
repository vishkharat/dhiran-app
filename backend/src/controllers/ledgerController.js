import Dhiran from "../models/Dhiran.js";
import Payment from "../models/Payment.js";
import PDFDocument from "pdfkit";


// ================= GET LEDGER =================
// @desc   Get ledger for single dhiran
// @route  GET /api/ledger/dhiran/:id

export const getDhiranLedger = async (req, res) => {

  try {

    const dhiran = await Dhiran.findById(req.params.id);

    if (!dhiran) {
      return res.status(404).json({
        message: "Dhiran not found"
      });
    }

    const payments = await Payment.find({
      dhiran: dhiran._id
    }).sort({ paymentDate: 1 });


    // TOTAL PAID
    let totalPrincipal = 0;
    let totalInterest = 0;

    payments.forEach((p) => {

      totalPrincipal += Number(p.principalPaid) || 0;
      totalInterest += Number(p.interestPaid) || 0;

    });

    const totalPaid = totalPrincipal + totalInterest;


    // INTEREST CALCULATION
    const months =
      (new Date() - new Date(dhiran.createdAt)) /
      (1000 * 60 * 60 * 24 * 30);

    const interest =
      (dhiran.amount * dhiran.interestRate * months) / 100;


    const remainingAmount =
      dhiran.amount + interest - totalPrincipal;


    res.json({
      dhiranId: dhiran._id,
      principal: dhiran.amount,
      interestRate: dhiran.interestRate,
      interest: Math.round(interest),
      totalPrincipal,
      totalInterest,
      totalPaid,
      remainingAmount: Math.round(remainingAmount),
      payments,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ================= LEDGER PDF =================
// @desc   Download ledger PDF
// @route  GET /api/ledger/pdf/:id

export const downloadLedgerPDF = async (req, res) => {

  try {

    const dhiran = await Dhiran.findById(req.params.id).populate("customer");

    if (!dhiran) {
      return res.status(404).json({
        message: "Dhiran not found"
      });
    }

    const payments = await Payment.find({
      dhiran: dhiran._id
    }).sort({ paymentDate: 1 });


    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ledger-${dhiran._id}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);


    // TITLE
    doc.fontSize(20).text("Customer Ledger", { align: "center" });

    doc.moveDown();


    // CUSTOMER INFO
    doc.fontSize(14).text(`Customer: ${dhiran.customer?.name || "-"}`);
    doc.text(`Mobile: ${dhiran.customer?.mobile || "-"}`);
    doc.moveDown();


    // DHIRAN INFO
    doc.text(`Dhiran Amount: ₹${dhiran.amount}`);
    doc.text(`Interest Rate: ${dhiran.interestRate}%`);
    doc.text(`Purity: ${dhiran.purity}`);
    doc.text(`Description: ${dhiran.description || "-"}`);

    doc.moveDown();


    doc.fontSize(16).text("Payment History");

    doc.moveDown();


    payments.forEach((p, index) => {

      doc.fontSize(12).text(
        `${index + 1}. Principal ₹${p.principalPaid} | Interest ₹${p.interestPaid} | Date: ${new Date(
          p.paymentDate
        ).toLocaleDateString()}`
      );

    });


    doc.end();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};