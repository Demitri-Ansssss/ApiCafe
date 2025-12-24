// routes/makananRoutes.js

const express = require("express");
const router = express.Router();
const Makanan = require("../models/MenuMakanan");

// 1. GET ALL: Mengambil semua data makanan (READ)
router.get("/", async (req, res) => {
  try {
    const makanan = await Makanan.find();
    res.status(200).json(makanan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET ONE: Mengambil satu data berdasarkan ID (READ)
router.get("/:id", async (req, res) => {
  try {
    const makanan = await Makanan.findById(req.params.id);
    if (makanan == null) {
      return res.status(404).json({ message: "Makanan tidak ditemukan" });
    }
    res.status(200).json(makanan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. POST: Menambahkan data makanan baru (CREATE)
router.post("/", async (req, res) => {
  const makanan = new Makanan({
    Nama: req.body.Nama,
    Deskripsi: req.body.Deskripsi,
    Harga: req.body.Harga,
    Kategori: req.body.Kategori,
    Gambar: req.body.Gambar,
  });

  try {
    const newMakanan = await makanan.save();
    res.status(201).json(newMakanan); // 201 Created
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request jika validasi gagal
  }
});

// 4. PUT/PATCH: Memperbarui data makanan (UPDATE)
router.patch("/:id", async (req, res) => {
  try {
    const updatedMakanan = await Makanan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: mengembalikan dokumen yang sudah diupdate
    );

    if (updatedMakanan == null) {
      return res.status(404).json({ message: "Makanan tidak ditemukan" });
    }

    res.status(200).json(updatedMakanan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE: Menghapus data makanan (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedMakanan = await Makanan.findByIdAndDelete(req.params.id);

    if (deletedMakanan == null) {
      return res.status(404).json({ message: "Makanan tidak ditemukan" });
    }

    res.status(200).json({ message: "Makanan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
