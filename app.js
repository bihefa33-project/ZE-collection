const GITHUB_USERNAME = "bihefa33-project";
const REPO_NAME = "ZE-collection";

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

const modal = document.getElementById("media-modal");
const closeModal = document.getElementById("close-modal");
const modalContainer = document.getElementById("modal-content-container");

// Render Daftar Folder Utama
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
  folderListEl.classList.add("hidden");
  galleryGridEl.innerHTML = "<p style='grid-column: span 3; text-align: center;'>Memuat media...</p>";
  galleryGridEl.classList.remove("hidden");
  
  titleEl.textContent = folder.name;
  backBtn.classList.remove("hidden");

  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/media/${folder.path}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Folder kosong atau tidak ditemukan");
    const files = await response.json();

    galleryGridEl.innerHTML = "";

    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      const isPhoto = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);

      if (isPhoto || isVideo) {
        const card = document.createElement("div");
        card.className = "media-card";

        let mediaEl;
        if (isPhoto) {
          mediaEl = document.createElement("img");
          mediaEl.src = file.download_url;
          mediaEl.loading = "lazy";
          mediaEl.onclick = () => showModal(file.download_url, "img");
        } else if (isVideo) {
          mediaEl = document.createElement("video");
          mediaEl.src = file.download_url;
          mediaEl.controls = true;
          mediaEl.playsInline = true;
          mediaEl.onclick = () => showModal(file.download_url, "video");
        }

        const downloadBtn = document.createElement("button");
        downloadBtn.className = "download-btn";
        downloadBtn.innerText = "↓ Download";
        downloadBtn.onclick = (e) => {
          e.stopPropagation();
          downloadFile(file.download_url, file.name, downloadBtn);
        };

        card.appendChild(mediaEl);
        card.appendChild(downloadBtn);
        galleryGridEl.appendChild(card);
      }
    });

    if (galleryGridEl.children.length === 0) {
      galleryGridEl.innerHTML = "<p style='grid-column: span 3; text-align: center;'>Folder ini kosong.</p>";
    }
  } catch (err) {
    galleryGridEl.innerHTML = `<p style='grid-column: span 3; text-align: center; color: #ef4444;'>${err.message}</p>`;
  }
}


// Fungsi Download Paksa Menggunakan Fetch Blob
async function downloadFile(url, fileName, button) {
  const originalText = button.innerText;
  button.innerText = "Mengunduh...";
  button.disabled = true;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    alert("Gagal mengunduh file, mencoba buka di tab baru...");
    window.open(url, '_blank');
  } finally {
    button.innerText = originalText;
    button.disabled = false;
  }
}

// Fungsi Pop-Up Preview
function showModal(url, type) {
  modalContainer.innerHTML = "";
  if (type === "img") {
    const img = document.createElement("img");
    img.src = url;
    modalContainer.appendChild(img);
  } else {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    modalContainer.appendChild(video);
  }
  modal.classList.remove("hidden");
}

// Tutup Modal Preview
closeModal.onclick = () => {
  modal.classList.add("hidden");
  modalContainer.innerHTML = "";
};

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modalContainer.innerHTML = "";
  }
};

// Navigasi Kembali ke Folder Utama
backBtn.onclick = () => {
  galleryGridEl.classList.add("hidden");
  galleryGridEl.innerHTML = "";
  folderListEl.classList.remove("hidden");
  backBtn.classList.add("hidden");
  titleEl.textContent = "ZE Collection";
};

// Inisialisasi awal
renderFolders();
