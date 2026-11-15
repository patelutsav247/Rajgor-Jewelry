
const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required"
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: typeof email === "string" ? email.trim() : "",
      phone: typeof phone === "string" ? phone.trim() : "",
      subject: typeof subject === "string" ? subject.trim() : "",
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      id: contact._id
    });
  } catch (error) {
    console.error("Contact form error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to submit contact form"
    });
  }
});

module.exports = router;
