document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentSection = "dashboard";
  let allData = {
    makanan: [],
    minuman: [],
    camilan: [],
    history: [],
  };

  // DOM Elements
  const navItems = document.querySelectorAll(".nav-item");
  const contentArea = document.getElementById("content-area");
  const sectionTitle = document.getElementById("section-title");
  const modal = document.getElementById("modal-container");
  const itemForm = document.getElementById("item-form");
  const currentDateEl = document.getElementById("current-date");

  // Initialize
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  currentDateEl.textContent = new Date().toLocaleDateString("id-ID", options);

  // Fetch initial data
  fetchAllData();

  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const section = item.getAttribute("data-section");
      switchSection(section);
    });
  });

  function switchSection(section) {
    currentSection = section;
    navItems.forEach((i) => i.classList.remove("active"));
    document
      .querySelector(`.nav-item[data-section="${section}"]`)
      .classList.add("active");

    const titles = {
      dashboard: "Dashboard",
      makanan: "Kelola Makanan",
      minuman: "Kelola Minuman",
      camilan: "Kelola Camilan",
      history: "Riwayat Pesanan",
    };
    sectionTitle.textContent = titles[section];
    renderSection();
  }

  async function fetchAllData() {
    try {
      const [makanan, minuman, camilan, history] = await Promise.all([
        fetch("/MenuCafe/makanan").then((r) => r.json()),
        fetch("/MenuCafe/minuman").then((r) => r.json()),
        fetch("/MenuCafe/camilan").then((r) => r.json()),
        fetch("/history").then((r) => r.json()),
      ]);

      allData = { makanan, minuman, camilan, history };
      renderSection();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function renderSection() {
    if (currentSection === "dashboard") {
      renderDashboard();
    } else if (currentSection === "history") {
      renderHistory();
    } else {
      renderItemsTable();
    }
  }

  function renderDashboard() {
    contentArea.innerHTML = `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-icon stat-makanan"><i class="fas fa-utensils"></i></div>
                    <div class="stat-info">
                        <h3>Total Makanan</h3>
                        <p>${allData.makanan.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-minuman"><i class="fas fa-glass-whiskey"></i></div>
                    <div class="stat-info">
                        <h3>Total Minuman</h3>
                        <p>${allData.minuman.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-camilan"><i class="fas fa-cookie"></i></div>
                    <div class="stat-info">
                        <h3>Total Camilan</h3>
                        <p>${allData.camilan.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-orders"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-info">
                        <h3>Total Pesanan</h3>
                        <p>${allData.history.length}</p>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <div class="section-header">
                    <h2>Recent Orders</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allData.history
                          .slice(0, 5)
                          .map(
                            (order) => `
                            <tr>
                                <td>${order.customerName}</td>
                                <td class="price-tag">Rp ${order.total.toLocaleString()}</td>
                                <td><span class="status-btn">${
                                  order.status
                                }</span></td>
                                <td>${new Date(
                                  order.date
                                ).toLocaleDateString()}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        `;
  }

  function renderItemsTable() {
    const data = allData[currentSection];
    contentArea.innerHTML = `
            <div class="table-container">
                <div class="section-header">
                    <h2>Daftar ${
                      currentSection.charAt(0).toUpperCase() +
                      currentSection.slice(1)
                    }</h2>
                    <button class="btn btn-primary" onclick="openModal()">
                        <i class="fas fa-plus"></i> Tambah Item
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Nama</th>
                            <th>Harga</th>
                            <th>Kategori</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                          .map(
                            (item) => `
                            <tr>
                                <td><img src="${item.gambar}" alt="${
                              item.nama
                            }" class="item-img" onerror="this.src='https://placehold.co/50'"></td>
                                <td>
                                    <strong>${item.nama}</strong><br>
                                    <small style="color: var(--text-muted)">${item.deskripsi.substring(
                                      0,
                                      50
                                    )}...</small>
                                </td>
                                <td class="price-tag">Rp ${item.harga.toLocaleString()}</td>
                                <td>${item.kategori}</td>
                                <td>
                                    <button class="btn btn-action btn-edit" onclick="editItem('${
                                      item._id
                                    }')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-action btn-delete" onclick="deleteItem('${
                                      item._id
                                    }')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        `;
  }

  function renderHistory() {
    contentArea.innerHTML = `
            <div class="table-container">
                <div class="section-header">
                    <h2>History Transaksi</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allData.history
                          .map(
                            (order) => `
                            <tr>
                                <td>${order.customerName}</td>
                                <td style="font-size: 0.8rem">
                                    ${order.items
                                      .map((i) => `${i.nama} (x${i.qty})`)
                                      .join(", ")}
                                </td>
                                <td class="price-tag">Rp ${order.total.toLocaleString()}</td>
                                <td>${order.paymentMethod.toUpperCase()}</td>
                                <td>${new Date(
                                  order.date
                                ).toLocaleString()}</td>
                                <td>
                                    <button class="btn btn-action btn-delete" onclick="deleteHistory('${
                                      order._id
                                    }')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        `;
  }

  // Modal Logic
  window.openModal = (id = null) => {
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("item-form");
    form.reset();
    document.getElementById("item-id").value = "";

    if (id) {
      modalTitle.textContent = "Edit Item";
      const item = allData[currentSection].find((i) => i._id === id);
      document.getElementById("item-id").value = item._id;
      document.getElementById("item-nama").value = item.nama;
      document.getElementById("item-deskripsi").value = item.deskripsi;
      document.getElementById("item-harga").value = item.harga;
      document.getElementById("item-kategori").value = item.kategori;
      document.getElementById("item-gambar").value = item.gambar;
    } else {
      modalTitle.textContent = "Tambah Item";
    }
    modal.style.display = "flex";
  };

  const closeModal = () => {
    modal.style.display = "none";
  };

  document.getElementById("close-modal").onclick = closeModal;
  document.getElementById("cancel-btn").onclick = closeModal;

  // Form Handling
  itemForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("item-id").value;
    const payload = {
      nama: document.getElementById("item-nama").value,
      deskripsi: document.getElementById("item-deskripsi").value,
      harga: Number(document.getElementById("item-harga").value),
      kategori: document.getElementById("item-kategori").value,
      gambar: document.getElementById("item-gambar").value,
    };

    const url = id
      ? `/MenuCafe/${currentSection}/${id}`
      : `/MenuCafe/${currentSection}`;
    const method = id ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchAllData();
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Global Action Functions
  window.editItem = (id) => openModal(id);

  window.deleteItem = async (id) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    try {
      const res = await fetch(`/MenuCafe/${currentSection}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAllData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  window.deleteHistory = async (id) => {
    if (!confirm("Hapus riwayat pesanan ini?")) return;
    try {
      const res = await fetch(`/history/${id}`, { method: "DELETE" });
      if (res.ok) fetchAllData();
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };
});
