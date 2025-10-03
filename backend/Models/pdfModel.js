const mongoose = require("mongoose");
const { pdfSchema } = require("../Schemas/pdfSchema");

const Pdf = mongoose.model("Pdf", pdfSchema);

module.exports = { Pdf };
