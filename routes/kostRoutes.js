const express = require("express");
const router = express.Router();
const kostController = require("../controllers/kostController");
const upload = require("../middleware/uploadImage");
const path = require("path");
const multer = require("multer");


    router.get("/tambah", kostController.getTambah);
    router.post("/add", upload.fields([
        { name: 'foto', maxCount: 1 },
        { name: 'fotosGaleri', maxCount: 10 }
    ]), kostController.addKamar);
    router.get("/edit/:id", kostController.getEditKamar);
    router.post("/update/:id", upload.fields([
        { name: 'foto', maxCount: 1 },
        { name: 'fotosGaleri', maxCount: 10 }
    ]), kostController.updateKamar);
    router.delete("/delete/:id", kostController.deleteKamar);
    router.delete("/galeri/:id", kostController.deleteGaleri);
    router.put("/galeri/:id", upload.single("foto"), kostController.updateGaleri);
    router.get("/", kostController.getAllKamar);
    


module.exports = router;
