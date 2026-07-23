# BEO STUDIO — Tài liệu dự án (control center)

> File này được Claude Code **tự động đọc** khi mở session mới trong thư mục này.
> Mục đích: để mỗi lần chỉnh sửa web, Claude (và bạn) nắm ngay toàn bộ bối cảnh.
> Ngôn ngữ làm việc: **tiếng Việt**.

---

## 1. Tóm tắt nhanh (đọc cái này trước)

- **Web:** trang giới thiệu studio nhiếp ảnh bé sơ sinh / mẹ bầu / gia đình.
- **Live:** https://beostudio.top
- **Album ảnh khách:** https://beostudio.top/album/baby
- **Loại web:** trang tĩnh dựng bằng **Vite** + HTML/CSS/JS thuần (KHÔNG React/Vue).
- **Deploy:** push code lên nhánh `main` trên GitHub → **Hostinger tự động build & deploy** sau ~1–2 phút.
- **Repo GitHub:** https://github.com/daolebaotrong-dotcom/BEOSTUDIO
- **Thư mục dự án cố định trên máy:** `~/Documents/CLAUDE/beostudio-web`

### ⭐ Thiết kế hiện tại (bản redesign 2026-07)
- Trang chủ đã được **dựng lại theo phong cách luxury của MJN Studio** (https://mjnstudio.com) — tham chiếu thiết kế, KHÔNG sao chép ảnh/logo/câu chữ gốc của MJN.
- **Bố cục 13 section:** hero slideshow → dịch vụ nổi bật → bộ sưu tập (section tối) → bảng giá → kid concept CTA → số liệu → giá trị → trải nghiệm → cảm nhận → quy trình → chi nhánh → tin tức/blog → footer.
- Xem chi tiết token màu & font ở **mục 3**.

### Quy trình chuẩn khi muốn sửa web
```
1. Sửa file trong thư mục này
2. Chạy thử: npm run dev  → mở http://localhost:5173
3. git add + git commit
4. git push origin main   → website tự cập nhật sau 1–2 phút
```

### ⚠️ Nếu dùng Claude Desktop / Cowork (không phải phiên CLI/terminal này)

Claude Desktop chạy ở **"local agent mode"** — tạo/sửa file trong một bản sao **riêng** nằm ở
`~/Library/Application Support/Claude/local-agent-mode-sessions/.../outputs/`, **không tự commit/push**.
Kết quả: thấy "đã sửa xong" trên Desktop nhưng web thật **không cập nhật** cho tới khi copy file
vào `~/Documents/CLAUDE/beostudio-web` và `git push`.

→ Luôn copy 3 file `index.html`, `src/style.css`, `src/main.js` từ outputs vào repo, chạy
`git status` để xác nhận có thay đổi, rồi mới commit & push. Kiểm tra phân nhánh bằng
`git fetch && git log --oneline origin/main` trước khi push.

---

## 2. Cấu trúc dự án

```
beostudio-web/
├── index.html              # Trang chủ (toàn bộ nội dung — 13 section)
├── vite.config.js          # Multi-page build: khai báo mọi trang HTML dùng chung /src/style.css + /src/main.js
├── dich-vu/                # Trang dịch vụ theo chi nhánh (SEO địa phương, kiểu mjnstudio.com/dich-vu/...)
│   ├── chup-anh-cho-be-long-thanh/index.html
│   └── chup-anh-cho-be-bien-hoa/index.html
├── src/
│   ├── style.css           # CSS + design tokens (tông luxury sáng, có dark mode tuỳ chọn)
│   └── main.js             # JS: slideshow hero, lọc gallery theo tab, dropdown menu, theme toggle, scroll reveal
├── public/                 # File tĩnh, copy nguyên xi khi build
│   ├── favicon.svg
│   ├── images/             # Ảnh trang chủ (hero-main, hero-inset, gallery-1..6)
│   └── album/
│       └── baby/
│           ├── index.html  # TRANG ALBUM (masonry + lightbox, tự chứa CSS/JS)
│           └── photos/     # Ảnh album: 1.jpg, 2.jpg ...
├── package.json
└── CLAUDE.md               # (file này)
```

⚠️ **Trang trong `dich-vu/` KHÔNG tự chứa CSS như trang album** — chúng dùng chung `/src/style.css` + `/src/main.js` với trang chủ, giống hệt cách `index.html` gốc làm. Muốn Vite build ra đúng cả 3 trang thì **bắt buộc phải giữ `vite.config.js`** (khai báo `build.rollupOptions.input` liệt kê từng trang) — nếu file này bị xoá hoặc ghi đè, `npm run build` sẽ chỉ build `index.html` và 2 trang dịch vụ sẽ biến mất khỏi bản deploy. Thêm trang dịch vụ mới (chi nhánh khác) thì nhớ thêm cả entry tương ứng vào `vite.config.js`.

- **Trang chủ** = `index.html` + `src/style.css` + `src/main.js`.
- **Trang album** = `public/album/baby/index.html` — file độc lập, tự chứa CSS + JS.

---

## 3. Bảng màu & font (design tokens — bản luxury MJN)

Định nghĩa trong `src/style.css` phần `:root`.

### Màu (tông sáng luxury)
| Token | Giá trị | Ý nghĩa |
|-------|---------|---------|
| `--bg` | `#ffffff` | nền chính (trắng) |
| `--bg-soft` | `#faf7f2` | section xen kẽ |
| `--cream` | `#f5f0e7` | nền thẻ kem (số liệu, gói nổi bật) |
| `--noir` | `#17130f` | section tối điểm nhấn + footer |
| `--ink` | `#2a2320` | chữ / tiêu đề chính |
| `--ink-soft` | `#7c7268` | chữ phụ |
| `--gold` | `#c9a878` | nhấn chính — vàng champagne |
| `--gold-deep` | `#b3915f` | vàng đậm (hover, số liệu) |
| `--gold-script` | `#cbaf86` | màu chữ script |

- **Font tiêu đề (serif):** Cormorant Garamond — mảnh, chữ HOA, giãn chữ rộng.
- **Font kicker (script):** Great Vibes — màu vàng champagne, đặt trên mỗi tiêu đề section.
- **Font nội dung:** Be Vietnam Pro (đủ dấu tiếng Việt).
- **Dark mode:** tuỳ chọn qua nút toggle; mặc định **sáng**. Lưu ở `localStorage['beo-theme']`.

### Mẫu header mỗi section (giữ nhất quán khi thêm nội dung)
```html
<header class="section-head section-head--center">
  <p class="script">Kicker script vàng</p>
  <h2>Tiêu đề serif (CSS tự viết hoa)</h2>
  <span class="rule"></span>            <!-- gạch vàng ngắn -->
  <p class="section-note">Mô tả xám...</p>
</header>
```

### Dấu hiệu nhận diện thiết kế
- Section tối `.section-dark` có **chữ cái mờ khổng lồ** (`.watermark`, chữ "B") làm nền.
- Nút `.btn` viền mảnh, chữ HOA giãn cách; nút "Bảng giá" trên nav dạng pill.
- Thẻ dịch vụ `.featured-card` là khối lớn tông kem/xám/be **xếp so le** (card 2 lệch xuống).

---

## 4. Chạy & phát triển tại máy

```bash
cd ~/Documents/CLAUDE/beostudio-web
npm install        # chỉ cần lần đầu
npm run dev        # mở http://localhost:5173
```

⚠️ Test album ở local mở thẳng: `http://localhost:5173/album/baby/index.html`
(mở thư mục `/album/baby/` có thể hiện nhầm trang chủ ở dev server).

---

## 5. Deploy

- **Cách deploy duy nhất:** `git push origin main`. Hostinger nối GitHub, tự chạy `npm run build` và đưa lên `public_html`.
- Thời gian: ~1–2 phút. Kiểm tra: `curl -sI https://beostudio.top` (mong đợi `HTTP/2 200`).

---

## 6. Truy cập server (SSH)

```bash
ssh hostinger
```
Thông tin (trong `~/.ssh/config`, key `~/.ssh/hostinger_ed25519`):
- Host/IP: `145.79.25.155` · Port: `65002` · User: `u969385986`
- Thư mục web: `~/domains/beostudio.top/public_html/`

---

## 7. Album ảnh khách

**Link chia sẻ:** https://beostudio.top/album/baby

- Trang tự dò ảnh trong `photos/` theo số thứ tự: `1.jpg`, `2.jpg`… (hỗ trợ `.jpg .jpeg .png .webp`).
- (Nâng cao) `photos/list.json` chứa mảng tên file để kiểm soát thứ tự thủ công.

### Chủ studio tự thêm ảnh (không cần code)
hPanel → File Manager → `public_html/album/baby/photos/` → upload `7.jpg, 8.jpg…` → tải lại trang.

> ⚠️ Ảnh upload thủ công qua File Manager **có thể bị xoá khi deploy lại từ GitHub**. An toàn tuyệt đối:
> commit ảnh vào repo (`public/album/baby/photos/`).

### Tạo album mới
Copy `public/album/baby/` → `public/album/<tên>/`, xoá ảnh cũ, sửa tiêu đề. Link: `beostudio.top/album/<tên>`.

---

## 8. Các "bẫy" đã biết (gotchas)

1. **Local agent mode không push** (xem mục 1): file sửa nằm ở outputs riêng, phải copy vào repo.
2. **Geo-blocking:** CDN Hostinger đang "Allow only specific countries" → chỉ Việt Nam. Khách nước ngoài bị 403.
   Chỉnh: hPanel → Websites → beostudio.top → Performance → CDN → Manage → "Traffic blocking".
3. **File upload thủ công có thể mất khi deploy** (xem mục 7).
4. **Album directory URL ở dev** (xem mục 4).

---

## 9. Thông tin thương hiệu

- **Tên:** BEO STUDIO
- **Dịch vụ:** chụp bé sơ sinh (0–30 ngày), gia đình, mẹ bầu (tuần 28–34).
- **Khu vực:** Long Thành & Biên Hoà (Đồng Nai). 2 chi nhánh.
- **Hotline / Zalo:** 0792 792 679
- **Messenger:** m.me/chupanhchobethoinoilongthanh
- **Giọng văn:** dịu dàng, ấm áp, hướng tới cha mẹ; nhấn vào cảm xúc & khoảnh khắc.

### Nội dung mẫu cần chủ studio cập nhật (đang là placeholder)
- Bảng giá 4 gói (Beo Sun / Star / Moon / Luxury) — thay giá & nội dung thật.
- 3 bài blog phần "Tin tức & concept".
- Danh sách "Hạng mục khác".
- Ảnh: hero slide 2–3 đang mượn `gallery-4/gallery-6` — thay ảnh dọc đẹp hơn nếu có.

---

## 10. Việc thường làm — tra nhanh

| Muốn làm gì | Sửa ở đâu |
|-------------|-----------|
| Đổi chữ/nội dung trang chủ | `index.html` |
| Đổi màu, font, khoảng cách | `src/style.css` (phần `:root` tokens) |
| Sửa bảng giá | section `#bang-gia` trong `index.html` |
| Đổi ảnh hero / gallery | thay file trong `public/images/` (giữ tên) |
| Sửa hiệu ứng slideshow / lọc gallery | `src/main.js` |
| Sửa giao diện album | `public/album/baby/index.html` |
| Thêm/bớt ảnh trong album | thư mục `photos/` (File Manager hoặc commit) |
| Mở/khoá truy cập theo quốc gia | hPanel → CDN → Traffic blocking |
| Đưa thay đổi lên web | `git push origin main` |
