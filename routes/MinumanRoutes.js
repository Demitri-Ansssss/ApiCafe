// routes/makananRoutes.js

const express = require("express");
const router = express.Router();
const Minuman = require("../models/MenuMinuman");

// 1. GET ALL: Mengambil semua data makanan (READ)
router.get("/", async (req, res) => {
  try {
    const minuman = await Minuman.find();
    res.status(200).json(minuman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET ONE: Mengambil satu data berdasarkan ID (READ)
router.get("/:id", async (req, res) => {
  try {
    const minuman = await Minuman.findById(req.params.id);
    if (minuman == null) {
      return res.status(404).json({ message: "Minuman tidak ditemukan" });
    }
    res.status(200).json(minuman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. POST: Menambahkan data makanan baru (CREATE)
router.post("/", async (req, res) => {
  const minuman = new Minuman({
    nama: req.body.nama || req.body.Nama,
    deskripsi: req.body.deskripsi || req.body.Deskripsi,
    harga: req.body.harga || req.body.Harga,
    kategori: req.body.kategori || req.body.Kategori,
    gambar: req.body.gambar || req.body.Gambar,
  });

  try {
    const newMinuman = await minuman.save();
    res.status(201).json(newMinuman); // 201 Created
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request jika validasi gagal
  }
});

// 4. PUT/PATCH: Memperbarui data makanan (UPDATE)
router.patch("/:id", async (req, res) => {
  try {
    const updatedMinuman = await Minuman.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: mengembalikan dokumen yang sudah diupdate
    );

    if (updatedMinuman == null) {
      return res.status(404).json({ message: "Minuman tidak ditemukan" });
    }

    res.status(200).json(updatedMinuman);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE: Menghapus data makanan (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedMinuman = await Minuman.findByIdAndDelete(req.params.id);

    if (deletedMinuman == null) {
      return res.status(404).json({ message: "Minuman tidak ditemukan" });
    }

    res.status(200).json({ message: "Minuman berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
