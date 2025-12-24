// routes/makananRoutes.js

const express = require("express");
const router = express.Router();
const Camilan = require("../models/MenuCamilan");

// 1. GET ALL: Mengambil semua data makanan (READ)
router.get("/", async (req, res) => {
  try {
    const camilan = await Camilan.find();
    res.status(200).json(camilan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET ONE: Mengambil satu data berdasarkan ID (READ)
router.get("/:id", async (req, res) => {
  try {
    const camilan = await Camilan.findById(req.params.id);
    if (camilan == null) {
      return res.status(404).json({ message: "Camilan tidak ditemukan" });
    }
    res.status(200).json(camilan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. POST: Menambahkan data makanan baru (CREATE)
router.post("/", async (req, res) => {
  const camilan = new Camilan({
    Nama: req.body.Nama,
    Deskripsi: req.body.Deskripsi,
    Harga: req.body.Harga,
    Kategori: req.body.Kategori,
    Gambar: req.body.Gambar,
  });

  try {
    const newCamilan = await camilan.save();
    res.status(201).json(newCamilan); // 201 Created
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request jika validasi gagal
  }
});

// 4. PUT/PATCH: Memperbarui data makanan (UPDATE)
router.patch("/:id", async (req, res) => {
  try {
    const updatedCamilan = await Camilan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: mengembalikan dokumen yang sudah diupdate
    );

    if (updatedCamilan == null) {
      return res.status(404).json({ message: "Camilan tidak ditemukan" });
    }

    res.status(200).json(updatedCamilan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE: Menghapus data makanan (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedCamilan = await Camilan.findByIdAndDelete(req.params.id);

    if (deletedCamilan == null) {
      return res.status(404).json({ message: "Camilan tidak ditemukan" });
    }

    res.status(200).json({ message: "Camilan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
