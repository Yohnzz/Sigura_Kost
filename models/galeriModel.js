// filepath: f:\UUK\models\galeriModel.js
const mongoose = require("mongoose");

const galeriSchema = new mongoose.Schema(
  {
    kost_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kost",
      required: true
    },
    nama: {
      type: String,
      default: "Galeri Kamar"
    },
    foto: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Galeri_Kamar", galeriSchema);