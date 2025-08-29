# Kobebe Komik - Web Komik Progressive Web App

Progressive Web App (PWA) untuk membaca komik edukatif tentang bilangan bulat. Dibangun dengan HTML5, CSS3, dan JavaScript murni.

## 🎯 Fitur Utama

### ✨ Progressive Web App (PWA)
- **Installable**: Dapat diinstall seperti aplikasi native di semua perangkat
- **Offline Support**: Bekerja tanpa koneksi internet setelah diinstall
- **Responsive**: Tampilan optimal di desktop, tablet, dan smartphone
- **Fast Loading**: Caching otomatis untuk performa maksimal

### 📚 Fitur Komik
- **Comic Reader**: Interface pembaca komik yang user-friendly
- **Zoom Controls**: Kontrol zoom in/out untuk detail gambar
- **Page Navigation**: Navigasi halaman dengan tombol atau swipe gesture
- **Thumbnail Gallery**: Preview halaman dalam bentuk thumbnail
- **Fullscreen Mode**: Mode layar penuh untuk pengalaman membaca maksimal

### 🎨 Desain & UI/UX
- **Modern Design**: Desain modern dengan warna hijau tua dan biru dongker
- **Dark/Light Theme**: Toggle tema gelap dan terang
- **Smooth Animations**: Animasi halus dan transisi yang responsif
- **Touch Gestures**: Dukungan gesture touch untuk navigasi mobile

### 📱 Kompatibilitas
- **Cross-Platform**: Berfungsi di semua browser modern
- **Mobile First**: Dioptimalkan untuk pengalaman mobile
- **Accessibility**: Mendukung keyboard shortcuts dan screen reader

## 🚀 Teknologi yang Digunakan

- **HTML5**: Struktur semantik dan modern
- **CSS3**: Styling dengan flexbox, grid, dan custom properties
- **JavaScript ES6+**: Logika aplikasi dengan fitur modern
- **Service Worker**: Caching dan offline functionality
- **Web App Manifest**: Konfigurasi PWA
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Inter font family)

## 📁 Struktur Proyek

```
kobebe_komik/
├── index.html              # Halaman utama
├── styles.css              # Stylesheet utama
├── script.js               # JavaScript aplikasi
├── sw.js                   # Service Worker
├── manifest.json           # PWA Manifest
├── icons/                  # Folder ikon PWA
│   └── icon.png    # Ikon aplikasi
├── komik/                  # Folder konten komik
│   ├── Komik Bilangan Bulat.pdf
│   └── image_komik/
│       ├── Cover.jpg
│       ├── page 1.jpg
│       ├── page 2.jpg
│       └── ... (page 3-11.jpg)
└── README.md               # Dokumentasi ini
```

## 🎮 Cara Penggunaan

### Instalasi Local
1. Clone atau download folder project
2. Buka `index.html` di browser modern
3. Atau jalankan local server:
   ```bash
   # Python
   python -m http.server 8000

   # Node.js (dengan live-server)
   npx live-server

   # PHP
   php -S localhost:8000
   ```

### Install sebagai PWA
1. Buka website di browser
2. Klik ikon install di address bar, atau
3. Klik tombol "Install" di header aplikasi
4. Aplikasi akan tersimpan di home screen/desktop

## 🎯 Fitur-Fitur Detail

### 🏠 Halaman Beranda
- Hero section dengan cover komik
- Tombol quick action (Mulai Baca, Download PDF)
- Grid fitur unggulan
- Desain responsive dengan animasi

### 📖 Comic Reader
- **Navigation Controls**: Tombol Previous/Next
- **Page Counter**: Indikator halaman saat ini
- **Zoom Tools**: Zoom in/out, fit to width/height
- **Thumbnail Navigation**: Quick jump ke halaman tertentu
- **Modal View**: Fullscreen image viewer
- **Touch Gestures**: Swipe left/right untuk navigasi

### 📥 Download Section
- **PDF Download**: Download komik dalam format PDF
- **File Information**: Detail ukuran, format, jumlah halaman
- **Progress Indicator**: Loading animation saat download

### ℹ️ About Section
- **App Information**: Deskripsi aplikasi
- **Tech Stack**: Teknologi yang digunakan
- **Feature List**: Daftar lengkap fitur

## ⌨️ Keyboard Shortcuts

| Shortcut | Fungsi |
|----------|---------|
| `→` atau `Space` | Halaman selanjutnya |
| `←` | Halaman sebelumnya |
| `+` atau `=` | Zoom in |
| `-` | Zoom out |
| `F` | Toggle fullscreen |
| `T` | Toggle theme |
| `Esc` | Tutup modal |
| `1-4` | Navigasi ke section |

## 🎨 Kustomisasi Warna

Aplikasi menggunakan CSS Custom Properties untuk mudah dikustomisasi:

```css
:root {
    --primary-color: #1a472a;      /* Hijau tua */
    --secondary-color: #0f1419;    /* Biru dongker gelap */
    --accent-color: #2d5f3f;
    --accent-secondary: #1a2332;
    /* ... */
}
```

## 📱 Browser Support

### Desktop
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+

### Mobile
- ✅ Chrome Mobile 70+
- ✅ Safari iOS 12+
- ✅ Samsung Internet 10+
- ✅ Firefox Mobile 65+

## 🛠️ Development

### Prerequisites
- Browser modern dengan dukungan ES6+
- Web server untuk testing (optional)

### Local Development
```bash
# Clone project
git clone [repository-url]
cd kobebe_komik

# Jalankan local server
python -m http.server 8000

# Buka di browser
# http://localhost:8000
```

### Testing PWA
1. Buka Developer Tools
2. Tab Application/Storage
3. Check Service Worker dan Manifest
4. Test offline functionality
5. Test install prompt

## 🚀 Deployment

### GitHub Pages
1. Push ke GitHub repository
2. Enable GitHub Pages di Settings
3. Akses via: `https://username.github.io/kobebe_komik`

### Netlify
1. Drag & drop folder ke Netlify
2. Atau connect dengan Git repository
3. Auto deploy setiap push

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 Optimisasi Performance

- **Image Optimization**: Gunakan format WebP untuk gambar
- **Lazy Loading**: Implement lazy loading untuk gambar
- **Code Splitting**: Split JavaScript untuk loading yang lebih cepat
- **Compression**: Enable Gzip compression di server
- **CDN**: Gunakan CDN untuk asset statis

## 🐛 Troubleshooting

### Service Worker Issues
```javascript
// Clear cache
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
});

// Unregister service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
});
```

### Install Prompt Not Showing
- Pastikan HTTPS atau localhost
- Check PWA criteria di DevTools
- Manifest.json valid
- Service Worker terdaftar

## 📄 License

MIT License - Bebas digunakan untuk edukasi dan pengembangan.

## 👨‍💻 Developer

Dikembangkan untuk kebutuhan edukasi dengan fokus pada user experience dan performance.

## 📞 Support

Untuk bantuan atau pertanyaan:
- Buka issue di GitHub repository
- Email: [your-email]
- Documentation: README.md

---

**🎉 Selamat menggunakan Kobebe Komik! Semoga bermanfaat untuk pembelajaran yang menyenangkan.**
