const GITHUB_USERNAME = "bihefa33-project";
const REPO_NAME = "ZE-collection";

// Daftar 11 Folder Utama
const folders = [
  { name: "Generate sendiri full NDS", path: "generate-sendiri-full-nds" },
  { name: "Generate publik full NDS", path: "generate-publik-full-nds" },
  { name: "Generate sendiri half NDS", path: "generate-sendiri-half-nds" },
  { name: "Generate publik half NDS", path: "generate-publik-half-nds" },
  { name: "AI edit sendiri", path: "ai-edit-sendiri" },
  { name: "AI edit publik", path: "ai-edit-publik" },
  { name: "AI edit random", path: "ai-edit-random" },
  { name: "Video AI sendiri", path: "video-ai-sendiri" },
  { name: "Video AI publik", path: "video-ai-publik" },
  { name: "Real jeketi", path: "real-jeketi" },
  { name: "Real random", path: "real-random" }
];

const folderListEl = document.getElementById("folder-list");
const galleryGridEl = document.getElementById("gallery-grid");
const backBtn = document.getElementById("back-btn");
const titleEl = document.getElementById("title");

// Render Daftar Folder saat aplikasi dimuat
function renderFolders() {
  folderListEl.innerHTML = "";
  folders.forEach(folder => {
    const card = document.createElement("div");
    card.className = "folder-card";
    card.innerHTML = `📁 ${folder.name}`;
    card.onclick = () => openFolder(folder);
    folderListEl.appendChild(card);
  });
}

// Buka isi folder via GitHub API
async function openFolder(folder) {
  // Sembunyikan daftar folder dan bersihkan isi galeri
  folderListEl.classList.add("hidden");
  galleryGridEl.innerHTML = "<p style='grid-column: span 3; text-align: center;'>Memuat media...</p>";
  galleryGridEl.classList.remove("hidden");
  
  titleEl.textContent = folder.name;
  backBtn.classList.remove("hidden");

  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/media/${folder.path}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Folder kosong atau belum dibuat");
    const files = await response.json();

    galleryGridEl.innerHTML = "";

    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      const isPhoto = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);

      if (isPhoto || isVideo) {
        const card = document.createElement("div");
        card.className = "media-card";

        let mediaHtml = "";
        if (isPhoto) {
          mediaHtml = `<img src="${file.download_url}" loading="lazy" alt="${file.name}">`;
        } else if (isVideo) {
          mediaHtml = `<video src="${file.download_url}" controls playsinline preload="metadata"></video>`;
        }

        card.innerHTML = `
          ${mediaHtml}
          <a href="${file.download_url}" download target="_blank" class="download-btn">⬇ Download</a>
        `;
        galleryGridEl.appendChild(card);
      }
    });

    if (galleryGridEl.children.length === 0) {
      galleryGridEl.innerHTML = "<p style='grid-column: span 3; text-align: center;'>Belum ada media di folder ini.</p>";
    }
  } catch (err) {
    galleryGridEl.innerHTML = `<p style='grid-column: span 3; text-align: center; color: #ef4444;'>${err.message}</p>`;
  }
}

// Navigasi Kembali ke Daftar Folder Utama
backBtn.onclick = () => {
  // Langsung sembunyikan galeri & kosongkan isinya
  galleryGridEl.classList.add("hidden");
  galleryGridEl.innerHTML = "";
  
  // Tampilkan kembali daftar folder
  folderListEl.classList.remove("hidden");
  backBtn.classList.add("hidden");
  titleEl.textContent = "ZE Collection";
};

// Inisialisasi awal
renderFolders();

