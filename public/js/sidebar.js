const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// فتح الـ Sidebar
openBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  overlay.style.display = "block";
});

// إغلاق الـ Sidebar
function closeSidebar() {
  sidebar.classList.remove("active");
  overlay.style.display = "none";
}

closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);
