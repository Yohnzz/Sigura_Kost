const Kost = require("../models/kostModel");
const Galeri = require("../models/galeriModel");

const kostController = {

  getKost : async (req, res) => {
    try {
        const kamar = await Kost.find({ admin_id: req.session.user.id }); 
        res.render("kost", { kamar });  
    } catch (err) {
        res.status(500).send(err.message);
    }
  },
  getTambah : (req, res) => {
    // Cek apakah admin sudah login
    if (!req.session.user) {
      return res.status(403).send("Anda harus login untuk menambah kamar");
    }
    res.render("tambahKamar");
  },

  getEdit : (req, res) => {
    res.render("editKamar");
  },

  addKamar : async (req, res) => {
        try {
            // Cek apakah admin sudah login
            if (!req.session.user) {
              return res.status(403).send("Anda harus login untuk menambah kamar");
            }

            const fotoUtama = req.files?.foto ? req.files.foto[0].path : null;
            const fotosGaleri = req.files?.fotosGaleri ? req.files.fotosGaleri.map(f => f.path) : [];

            
            let {
                namaKamar,
                harga,
                deskripsi,
                status,
                tipeKamar,
                luasKamar,
                kapasitas,
                teleponPemilik,
                alamatKost
            } = req.body;

            if (!fotoUtama) {
                return res.status(400).send("Gambar utama harus diupload!");
            }

            const kamarBaru = new Kost({
                admin_id: req.session.user.id,
                nama: namaKamar,
                foto: fotoUtama,
                deskripsi: deskripsi,
                alamat: alamatKost,
                telepon: teleponPemilik,
                tipeKamar,
                luasKamar,
                kapasitas,
                harga,
                status
            });

            const savedKost = await kamarBaru.save();

            if (fotosGaleri.length > 0) {
                const galeriData = fotosGaleri.map(foto => ({
                    kost_id: savedKost._id,
                    nama: `Galeri ${namaKamar}`,
                    foto: foto
                }));
                await Galeri.insertMany(galeriData);
            }

            res.redirect("/kost");
        } catch (error) {
            console.error("Error saat addKamar:", error);
            res.status(500).send("Terjadi kesalahan: " + error.message);
        }
    },


  getAllKamar : async (req, res) => {
    try {
      let kamarWithGaleri = [];
      
      // Jika admin login, tampilkan hanya kost milik admin
      if (req.session.user && req.session.user.id) {
        const kamar = await Kost.find({ admin_id: req.session.user.id });
        kamarWithGaleri = await Promise.all(kamar.map(async (k) => {
          const galeri = await Galeri.find({ kost_id: k._id });
          return {
            ...k.toObject(),
            galeri: galeri,
            namaKamar: k.nama,
            gambar: k.foto,
            alamatKost: k.alamat,
            teleponPemilik: k.telepon
          };
        }));
      } else {
        // Jika user biasa (tidak login), tampilkan semua kost
        const kamar = await Kost.find({});
        kamarWithGaleri = await Promise.all(kamar.map(async (k) => {
          const galeri = await Galeri.find({ kost_id: k._id });
          return {
            ...k.toObject(),
            galeri: galeri,
            namaKamar: k.nama,
            gambar: k.foto,
            alamatKost: k.alamat,
            teleponPemilik: k.telepon
          };
        }));
      }

      res.render("kost", { kamar: kamarWithGaleri, user: req.session.user || null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  editKamar : async (req, res) => {
    try {
      const { id } = req.params;
      const kamar = await Kost.findById(id);
      if (!kamar) {
        return res.status(404).send("Kamar tidak ditemukan");
      }
      res.render("editKamar", { kamar });
    } catch (error) {
      console.error("Error saat editKamar:", error);
      res.status(500).send("Terjadi kesalahan: " + error.message);
    }
  },
  getEditKamar : async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(403).send("Anda harus login untuk mengedit kamar");
      }

      const kamar = await Kost.findById(req.params.id);
      if (!kamar) {
        return res.status(404).send("Kamar tidak ditemukan");
      }

      // Cek apakah kamar milik admin yang login
      if (kamar.admin_id.toString() !== req.session.user.id.toString()) {
        return res.status(403).send("Anda tidak memiliki akses untuk mengedit kamar ini");
      }

      const galeri = await Galeri.find({ kost_id: kamar._id });

      res.render("editKamar", { kamar, galeri, user: req.session.user });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Terjadi kesalahan: " + error.message);
    }
  },

  updateKamar : async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(403).send("Anda harus login untuk mengupdate kamar");
      }

      const kamar = await Kost.findById(req.params.id);
      if (!kamar) {
        return res.status(404).send("Kamar tidak ditemukan");
      }

      if (kamar.admin_id.toString() !== req.session.user.id.toString()) {
        return res.status(403).send("Anda tidak memiliki akses untuk mengupdate kamar ini");
      }

      let {
        namaKamar,
        harga,
        deskripsi,
        status,
        tipeKamar,
        luasKamar,
        kapasitas,
        teleponPemilik,
        alamatKost
      } = req.body;

      // Update foto utama jika ada file baru
      if (req.files && req.files.foto) {
        kamar.foto = req.files.foto[0].path;
      }

      kamar.nama = namaKamar;
      kamar.harga = harga;
      kamar.deskripsi = deskripsi;
      kamar.status = status;
      kamar.tipeKamar = tipeKamar;
      kamar.luasKamar = luasKamar;
      kamar.kapasitas = kapasitas;
      kamar.telepon = teleponPemilik;
      kamar.alamat = alamatKost;

      await kamar.save();

      // Handle galeri tambahan jika ada
      if (req.files && req.files.fotosGaleri && req.files.fotosGaleri.length > 0) {
        const fotosGaleri = req.files.fotosGaleri.map(f => f.path);
        const galeriData = fotosGaleri.map(foto => ({
          kost_id: kamar._id,
          nama: `Galeri ${namaKamar}`,
          foto: foto
        }));
        await Galeri.insertMany(galeriData);
      }

      res.redirect("/kost");
    } catch (error) {
      console.error("Error saat updateKamar:", error);
      res.status(500).send("Terjadi kesalahan: " + error.message);
    }
  },

  deleteGaleri : async (req, res) => {
    try {
      const galeri = await Galeri.findById(req.params.id);
      if (!galeri) {
        return res.status(404).json({ error: "Galeri tidak ditemukan" });
      }

      const kost = await Kost.findById(galeri.kost_id);
      if (kost.admin_id.toString() !== req.session.user.id.toString()) {
        return res.status(403).json({ error: "Anda tidak memiliki akses" });
      }

      await Galeri.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // bagian dalam controllers/kostController.js
updateGaleri : async (req, res) => {
  try {
    const galeri = await Galeri.findById(req.params.id);
    if (!galeri) {
      return res.status(404).json({ error: "Galeri tidak ditemukan" });
    }

    const kost = await Kost.findById(galeri.kost_id);
    if (!kost) {
      return res.status(404).json({ error: "Kost terkait tidak ditemukan" });
    }

    if (kost.admin_id.toString() !== req.session.user.id.toString()) {
      return res.status(403).json({ error: "Anda tidak memiliki akses" });
    }

    // Pastikan ada file upload
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file yang diupload" });
    }

    const newFotoUrl = req.file.path || req.file.secure_url || null;

    if (!newFotoUrl) {
      return res.status(500).json({ error: "Gagal memperoleh URL file dari storage" });
    }

    // Update field foto dengan URL Cloudinary
    galeri.foto = newFotoUrl;
    await galeri.save();

    // Kembalikan JSON dengan url baru supaya frontend bisa langsung update src
    return res.json({ success: true, foto: newFotoUrl });
  } catch (error) {
    console.error("Error updateGaleri:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
},


  deleteKamar : async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(403).json({ error: "Anda harus login untuk menghapus kamar" });
      }

      const kamar = await Kost.findById(req.params.id);
      if (!kamar) {
        return res.status(404).json({ error: "Kamar tidak ditemukan" });
      }

      // Hapus semua galeri terlebih dahulu
      await Galeri.deleteMany({ kost_id: kamar._id });


      await Kost.findByIdAndDelete(req.params.id);

      res.json({ success: true });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  },
  

};

module.exports = kostController;
