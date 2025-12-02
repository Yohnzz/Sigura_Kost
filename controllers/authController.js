const User = require("../models/adminModel");
const bcrypt = require("bcrypt");

const authController = {
  getRegister: (req, res) => {
    res.render("register");
  },
  getLogin:(req, res) => {
    res.render("login");
  },

  register: async (req, res) => {
    console.log("BODY =>", req.body);
        try {
            const { nama_user, username, password } = req.body;

            // Validasi field required
            if (!nama_user || !username || !password) {
                return res.status(400).send("Semua field harus diisi");
            }

            // Cek user sudah terdaftar
            const userExists = await User.findOne({ username });
            if (userExists) {
                return res.status(400).send("Username sudah terdaftar");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const admin = new User({
                nama: nama_user,
                username,
                password: hashedPassword
            });

            await admin.save();
            res.redirect('/auth/login');
        } catch (error) {
            console.log(error);
            res.status(500).send("Terjadi kesalahan: " + error.message);
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).send("Username atau password salah");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send("Username atau password salah");
            }

            req.session.user = {
                id: user._id,
                username: user.username,
                nama: user.nama_user,
                role: user.role
            };

            res.redirect('/kost');
        } catch (error) {
            console.log(error);
            res.status(500).send("Terjadi kesalahan");
        }
    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/auth/login');
    }
};

module.exports = authController;