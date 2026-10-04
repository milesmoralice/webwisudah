# 📜 UI/UX Design System Rules — WIS(UDAH)

Dokumen ini adalah **pedoman wajib (Design Rules)** untuk pengembangan seluruh antarmuka dan komponen pada project portal berita **WIS(UDAH)**. Setiap halaman, komponen baru, maupun fitur interaktif yang akan dibuat di masa depan **wajib** mematuhi aturan-aturan yang tertulis di sini.

---

## 1. Identitas Brand & Filosofi Desain

* **Nama Media**: `WIS(UDAH)`  
  *(Penulisan resmi menggunakan huruf kapital dengan tanda kurung merah: `WIS(UDAH)`).*
* **Slogan / Tagline**: *"Kabar Tuntas Tanpa Basa-Basi • Jurnalisme Santai Tapi Tuntas"*
* **Art Style**: **Retro-Modern Neo-Brutalist Journalism**
* **Palet Warna Referensi**: *Cianne Studio* ([colour-theme-webnews.jpeg](file:///c:/Users/alysa/OneDrive/文件/news-project/docs/colour-theme-webnews.jpeg))
* **Esensi Visual**:
  - Memadukan wibawa koran cetak klasik (*editorial vintage*) dengan ketegasan media digital modern (*neo-brutalisme*).
  - Tampilan visual harus **taktil (terasa bisa disentuh)**, berani, berkarakter, dan ramah pembaca (*high readability*).

---

## 2. Palet Warna Resmi (Cianne Studio) & Semantic Tokens

Dilarang menggunakan warna *default* browser atau warna abu-abu generik. Selalu gunakan token warna berikut:

| Token Tailwind / CSS | Hex Code | Nama Referensi | Peruntukan Wajib |
| :--- | :--- | :--- | :--- |
| `var(--color-vermelho)` | `#BB240A` | **Vermelho Vívido** | Aksen brand, kurung siku logo `(UDAH)`, badge *Breaking/Sorotan Kilat*, tombol CTA utama (*Primary Button*), hover link utama. |
| `var(--color-azul)` | `#2B5CB8` | **Azul** | Tombol baca sekunder, badge kategori *Teknologi*, tautan artikel, status info terverifikasi. |
| `var(--color-areia)` | `#E5DBD1` | **Areia Clara** | Latar belakang header masthead, kontainer buletin email, kartu sekunder, border pemisah lembut. |
| `var(--color-amarelo)` | `#EDCC4D` | **Amarelo** | Pita *top-bar ticker*, badge *Pilihan Redaksi/Hot Picks*, counter statistik berita, sorotan teks (*highlight*). |
| `var(--color-cafe)` | `#623F1B` | **Café Torrado** | **Garis pembatas (border 2px–2.5px)** di seluruh komponen, teks judul/paragraf hangat, warna dasar *hard drop-shadow*. |
| `var(--color-cafe-dark)` | `#38200B` | **Café Deep Dark** | Background footer, teks heading paling pekat, kontras tinggi pengganti hitam pekat `#000000`. |
| `var(--canvas-bg)` | `#F7F3EE` | **Areia Paper Canvas** | **Background utama seluruh halaman** (memberikan kesan membaca kertas koran fisik berkualitas tinggi). |

---

## 3. Sistem Tipografi (Font Pairing Hierarchy)

Kombinasi font dirancang khusus untuk menciptakan harmoni neo-brutalisme retro:

```
[Space Grotesk]   ──> Judul Besar, Masthead Logo, Header Seksi (Chunky & Bold)
[Plus Jakarta Sans] ──> Teks Artikel, Paragraf, Excerpt Berita (Legibilitas Tinggi)
[JetBrains Mono]  ──> Metadata, Jam Terbit, Ticker, Label Stiker [BRACKETS]
```

### Aturan Penerapan Font:
1. **Headline & Masthead**:
   - Gunakan font **`Space Grotesk`** (`font-display`).
   - Selalu `font-extrabold` atau `font-bold`, *tracking-tight* atau *tracking-tighter*, dan disarankan huruf kapital (*uppercase*) untuk judul berita utama.
2. **Body Text / Konten Berita**:
   - Gunakan font **`Plus Jakarta Sans`** (`font-body`).
   - Warna teks artikel menggunakan `#38200B` atau `#623F1B` (jangan pernah gunakan `#000000` pekat agar mata tidak cepat lelah).
   - Ukuran minimum mobile `14px` (`text-sm`) dan desktop `16px` (`text-base`) dengan `leading-relaxed`.
3. **Metadata & Stiker Label**:
   - Gunakan font **`JetBrains Mono`** (`font-mono`).
   - Format penulisan wajib menyertakan tanda kurung siku, contoh: `[EDISI #01]`, `[ESTIMASI BACA: 3 MIN]`, `[TAGS]`, `[5 MENIT LALU]`.

---

## 4. Aturan Konstruksi Komponen Neo-Brutalist

### A. Garis Pembatas (Borders)
* **Wajib**: Setiap kartu, tombol, kontainer, dan seksi pemisah **HARUS** memiliki border solid berwarna `#623F1B` (*Café Torrado*).
* Ketebalan standar:
  - Kartu & Kontainer: `border-[2px]` atau `border-[2.5px]`.
  - Divider antar seksi: `border-b-[2.5px]` atau `border-b-[3px]`.
  - Stiker/Badge kecil: `border-[1.5px]`.

### B. Bayangan Keras (Hard Drop Shadows)
* **DILARANG KERAS** menggunakan bayangan kabur biasa (`box-shadow: 0 4px 6px rgba(...)`).
* **WAJIB** menggunakan bayangan padat (*hard shadow*) tanpa blur radius:
  - Kartu standar: `box-shadow: 4px 4px 0px #623F1B;` (class: `.brutal-card`)
  - Tombol standar: `box-shadow: 3px 3px 0px #623F1B;` (class: `.brutal-btn`)
  - Badge stiker: `box-shadow: 2px 2px 0px #623F1B;` (class: `.brutal-badge`)

### C. Efek Interaktif & Mikro-Animasi (Hover & Active States)
* **Hover Kartu (`.brutal-card`)**:
  - Bergerak sedikit ke kiri-atas: `transform: translate(-2px, -2px)`.
  - Bayangan memanjang: `box-shadow: 6px 6px 0px #623F1B`.
* **Hover & Klik Tombol (`.brutal-btn`)**:
  - *Hover*: `transform: translate(-1px, -1px)` dengan shadow `4px 4px 0px #623F1B`.
  - *Active / Klik*: Tombol menekan ke dalam `transform: translate(2px, 2px)` dan bayangan hilang `box-shadow: 0px 0px 0px`. Memberikan efek mekanikal seperti tombol fisik.
* **Running Marquee Ticker**:
  - Ticker berita kilat harus berjalan horizontal terus menerus (*infinite loop*), dan otomatis berhenti sejenak saat kursor diarahkan ke atasnya (*pause on hover*).

### D. Gambar Berita (Media Thumbnail)
* Setiap gambar harus dibungkus kontainer dengan border solid `#623F1B`.
* Gunakan rasio aspek konsisten: `aspect-[16/9]` untuk berita unggulan dan `aspect-[16/10]` untuk daftar berita.
* Sertakan efek stiker kategori di sudut kiri atas gambar.

### E. Komponen Kreatif Zine & Indie Newspaper
* **Tab Map Folder Fisik (`.folder-tab`)**: Navigasi kategori dirancang menyerupai tab map folder arsip dengan sudut atas melengkung (`rounded-t-lg`), menyatu langsung dengan batas atas bidang konten di bawahnya.
* **Selotip Washi Tape (`.washi-tape-yellow`, `.washi-tape-red`)**: Aksen pita perekat miring (`rotate(2.5deg)`) semi-transparan warna *Amarelo* atau *Vermelho* dengan tepi bergerigi putus-putus pada sudut buku booklet dan kartu berita.
* **Stempel Pos Retro (`.retro-stamp-round`, `.retro-stamp-slanted`)**: Badge stempel lingkaran pos merah atau stempel miring putus-putus (`rotate(-12deg)`) dengan teks penanda keaslian redaksi (misal `WIS(UDAH) TERVERIFIKASI 2026`).
* **Pita Garis Pos Udara (`.airmail-stripes`)**: Pola garis diagonal merah-biru (*retro airmail stripes*).

### F. Aksen Nyentrik Neo-Brutalist (Quirky Eccentric Details)
* **Pita Papan Catur Retro (`.checkerboard-strip`)**: Pita bermotif papan catur mikro warna cokelat tua dan kuning emas pada bagian atas navbar dan pembatas footer.
* **Bayangan Ganda Dua Warna (*Dual-Tone Offset Shadow*)**: Kartu hero utama menggunakan dua lapis bayangan offset tebal (`6px 6px 0px #623F1B, 12px 12px 0px #EDCC4D`) untuk memberikan kesan 3D retro yang berani dan nyentrik.
* **Memo Tempel Berperekat Pin Merah (📌)**: Kotak manifesto redaksi menggunakan format sticky note miring (`rotate(1deg)`) berwarna kuning *Amarelo* dengan ikon pin merah.
* **Garis Kupon Perforasi (`✂ - - - -`)**: Bagian atas kartu data & temuan menggunakan garis putus-putus ala karcis kliping koran retro.

---

## 5. Tata Letak Resmi Halaman Depan WIS(UDAH)

Struktur layout halaman depan mengadopsi struktur sekuensial yang konsisten dengan desain referensi resmi:

```
[1. Navbar]                WIS(UDAH)  |  Home  About  Cerita  Temuan  Kontak  |  🔍
─────────────────────────────────────────────────────────────────────────────────
[2. Giant Hero Banner]     [Vermelho Vívido #BB240A - Card 2.5px Border + 6px Shadow]
                           • Tag: WIS(UDAH) / TRANSISI LULUSAN
                           • Headline: "Membaca perjalanan [lulusan: Amarelo] menuju dunia kerja."
                           • 2 Pill Buttons: [Mulai membaca →] [Tentang WIS(UDAH)]
                           • Visual Kanan: Booklet miring "AFTER GRADUATION" + Stempel Bulat
─────────────────────────────────────────────────────────────────────────────────
[3. Category Subnav]       01 Cerita Lulusan  02 Dunia Kerja  03 Data & Temuan  04 Perspektif  05 Kontribusi
─────────────────────────────────────────────────────────────────────────────────
[4. Sub-Hero Manifesto]    "RUANG BACA WIS(UDAH)"
                           Kiri: "Setiap lulusan punya cerita."
                           Kanan: Paragraf pengantar misi editorial
─────────────────────────────────────────────────────────────────────────────────
[5. Cerita Pilihan]        Header: "Cerita pilihan" ──> [Lihat semua →]
                           Grid 3 Kartu Gambar Berlatar Gelap:
                           • Card 1: [CERITA UTAMA] • Num: 01
                           • Card 2: [PENGALAMAN]   • Num: 02
                           • Card 3: [PERSPEKTIF]   • Num: 03
─────────────────────────────────────────────────────────────────────────────────
[6. Middle Feature Banner] [Foto Mahasiswa/Ruang Diskusi - Dark Overlay]
                           • Tag: WIS(UDAH) / FEATURE
                           • Headline: "Perjalanan tidak selalu [lurus: Amarelo]."
                           • Pill Button: [Jelajahi temuan →]
─────────────────────────────────────────────────────────────────────────────────
[7. Data & Temuan]         Header: "Membaca angka, Mencari Potensi."
                           Grid 3 Kartu Berwarna Solid:
                           • Card 01 [Vermelho #BB240A]: Data Pengangguran
                           • Card 02 [Areia Clara #E5DBD1]: Data Lowongan Pekerjaan
                           • Card 03 [Azul #2B5CB8]: Kompetensi Industri
─────────────────────────────────────────────────────────────────────────────────
[8. Footer]                Logo WIS(UDAH) • Copyright 2026 • Nav Links
```

---

## 6. Golden Rules (Do's and Don'ts)

### ✅ WAJIB DILAKUKAN (DO):
1. **Gunakan warna kanvas kertas `#F7F3EE`** untuk latar belakang halaman, bukan putih murni `#ffffff`.
2. **Gunakan warna teks `#38200B` atau `#623F1B`** alih-alih warna hitam murni `#000000`.
3. **Format label dengan huruf kapital dan tanda kurung siku** ala mesin ketik retro (contoh: `[SOROTAN KILAT]`).
4. **Berikan border 2px `#623F1B` dan hard shadow** pada setiap kartu dan tombol agar konsistensi Neo-Brutalist terjaga 100%.
5. **Gunakan warna Amarelo (`#EDCC4D`) dan Vermelho (`#BB240A`) secara bergantian** untuk menciptakan ritme visual yang dinamis dan tidak monoton.

### ❌ DILARANG KERAS (DON'T):
1. **JANGAN** menggunakan bayangan halus/kabur (*soft blurry shadows* / blur filter).
2. **JANGAN** menggunakan border abu-abu tipis (seperti `border-gray-200` atau `border-zinc-300`).
3. **JANGAN** menggunakan sudut membulat berlebihan (*rounded-3xl* atau *rounded-full* pada kartu besar). Gunakan sudut tegas (`rounded-lg` atau `rounded-xl` maksimum).
4. **JANGAN** menggunakan warna biru/merah bawaan browser yang generik (`#ff0000`, `#0000ff`). Wajib memakai token resmi Cianne Studio (`#BB240A`, `#2B5CB8`).
5. **JANGAN** menghilangkan nama brand unik `WIS(UDAH)` dari header dan footer.

---

*Dokumen ini wajib dijadikan acuan saat menambahkan halaman detail artikel (`/article/[slug]`), halaman kategori, dashboard penulis, maupun komponen baru lainnya.*
