const USERNAME = 'bihefa33-project';
const REPO = 'ZE-collection';

// Daftar Folder (Nama Tampilan & Nama Path Folder di GitHub)
const folders = [
  { name: ' Generate sendiri full NDS', path: 'media/generate_sendiri_full_nds' },
  { name: ' Generate publik full NDS', path: 'media/generate_publik_full_nds' },
  { name: ' Generate sendiri half NDS', path: 'media/generate_sendiri_half_nds' },
  { name: ' Generate publik half NDS', path: 'media/generate_publik_half_nds' },
  { name: ' AI edit sendiri', path: 'media/ai_edit_sendiri' },
  { name: ' AI edit publik', path: 'media/ai_edit_publik' },
  { name: ' AI edit random', path: 'media/ai_edit_random' },
  { name: ' Video AI sendiri', path: 'media/video_ai_sendiri' },
  { name: ' Video AI publik', path: 'media/video_ai_publik' },
  { name: ' Real jeketi', path: 'media/real_jeketi' },
  { name: ' Real random', path: 'media/real_random' }
];

const folderView = document.getElementById('folder-view');
const galleryView = document.getElementById('gallery-view');
const mediaGrid = document.getElementById('media-grid');
const backBtn = document.getElementById('back-btn');
const folderTitle = document.getElementById('current-folder-title');

const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');
const zoomTarget = document.getElementById('zoom-target');
const downloadBtn = document.getElementById('download-btn');

let panzoomInstance = null;

// Render Daftar Folder awal
function renderFolders() {
  folderView.innerHTML = '';
  folders.forEach(folder => {
    const card = document.createElement('div');
    card.className = 'folder-card';
    card.innerHTML = `📁 ${folder.name}`;
    card.onclick = () => loadFolderContent(folder);
    folderView.appendChild(card);
  });
}

// Otomatis baca file dari GitHub REST API tanpa daftar manual
async function loadFolderContent(folder) {
  folderView.classList.add('hidden');
  galleryView.classList.remove('hidden');
  folderTitle.innerText = folder.name;
  mediaGrid.innerHTML = '<p style="grid-column: span 3; text-align:center;">Memuat file...</p>';

  const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${folder.path}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Folder kosong atau belum dibuat');
    
    const files = await response.json();
    mediaGrid.innerHTML = '';

    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      const isVid = ['mp4', 'webm', 'mov'].includes(ext);

      if (isImg || isVid) {
        const item = document.createElement('div');
        item.className = 'media-item';

        if (isImg) {
          item.innerHTML = `<img src="${file.download_url}" loading="lazy">`;
          item.onclick = () => openLightbox(file.download_url, 'image');
        } else if (isVid) {
          item.innerHTML = `<video src="${file.download_url}#t=0.1" preload="metadata"></video>`;
          item.onclick = () => openLightbox(file.download_url, 'video');
        }
        mediaGrid.appendChild(item);
      }
    });

    if (mediaGrid.children.length === 0) {
      mediaGrid.innerHTML = '<p style="grid-column: span 3; text-align:center;">Tidak ada foto/video di folder ini.</p>';
    }
  } catch (err) {
    mediaGrid.innerHTML = `<p style="grid-column: span 3; text-align:center;">${err.message}</p>`;
  }
}

// Fitur Tombol Kembali (Menyembunyikan foto & video sepenuhnya)
backBtn.onclick = () => {
  galleryView.classList.add('hidden');
  folderView.classList.remove('hidden');
  mediaGrid.innerHTML = ''; // Reset media agar tidak muncul di bawah
};

// Buka Mode Zoom (Lightbox)
function openLightbox(url, type) {
  lightbox.classList.remove('hidden');
  zoomTarget.innerHTML = '';
  downloadBtn.href = url;

  let el;
  if (type === 'image') {
    el = document.createElement('img');
    el.src = url;
  } else {
    el = document.createElement('video');
    el.src = url;
    el.controls = true;
    el.autoplay = true;
    el.playsInline = true;
  }

  zoomTarget.appendChild(el);

  // Inisialisasi Pinch-to-Zoom dengan jari tangan (Panzoom Library)
  if (panzoomInstance) panzoomInstance.dispose();
  panzoomInstance = Panzoom(zoomTarget, {
    maxScale: 5,
    minScale: 1,
    contain: 'inside'
  });
}

// Tutup Lightbox
lightboxClose.onclick = () => {
  lightbox.classList.add('hidden');
  zoomTarget.innerHTML = '';
  if (panzoomInstance) panzoomInstance.dispose();
};

// Jalankan saat pertama dimuat
renderFolders();
