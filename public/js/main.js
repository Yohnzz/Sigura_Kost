async function openModal(id) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");
  modal.classList.remove("hidden");
  content.innerHTML = "Loading...";

  try {
    const res = await fetch(`/room/${id}`);
    if (!res.ok) throw new Error("gagal mengambil data");
    const data = await res.json();
    content.innerHTML = `
      <h2>Kamar ${data.roomNumber}</h2>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Harga:</strong> ${data.price ? "Rp " + data.price : "-"}</p>
      <p><strong>Penghuni:</strong> ${data.occupantName || "Tidak ada"}</p>
      <p>${data.description || ""}</p>
    `;
  } catch (err) {
    content.innerHTML = "<p>Error mengambil data</p>";
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
}

// close modal on escape or click outside
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
document.addEventListener("click", (e) => {
  const modal = document.getElementById("modal");
  if (!modal) return;
  if (!modal.classList.contains("hidden") && e.target === modal) closeModal();
});
