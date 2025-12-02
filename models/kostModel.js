const mongoose = require("mongoose");

const KostSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
    nama: {
      type: String,
      required: true
    },
    foto: {
      type: String,
      required: true
    },
    deskripsi: {
      type: String,
      default: ""
    },
    alamat: {
      type: String,
      required: true
    },
    telepon: {
      type: String,
      required: true
    },
    tipeKamar: {
      type: String,
      default: "standard"
    },
    luasKamar: {
      type: Number,
      default: 0
    },
    kapasitas: {
      type: Number,
      default: 1
    },
    harga: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["kosong", "terisi", "booking"],
      default: "kosong"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kost", KostSchema);
