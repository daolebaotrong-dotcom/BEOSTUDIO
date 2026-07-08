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
- **Deploy:** push code lên nhánh `main` trên GitHub → **Hostinger tự động build & deploy** sau ~1–2 phút. Không cần thao tác thủ công gì thêm.
- **Repo GitHub:** https://github.com/daolebaotrong-dotcom/BEOSTUDIO
- **Thư mục dự án cố định trên máy:** `~/Documents/CLAUDE/beostudio-web`

### Quy trình chuẩn khi muốn sửa web
```
1. Sửa file trong thư mục này
2. Chạy thử: npm run dev  → mở http://localhost:5173
3. git add + git commit
4. git push origin main   → website tự cập nhật sau 1–2 phút
```

---

## 2. Cấu trúc dự án

```
beostudio-web/
├── index.html              # Trang chủ (toàn bộ nội dung ở đây)
├── src/
│   ├── style.css           # CSS + design tokens (màu, font) — có dark/light
│   └── main.js             # JS trang chủ: đổi theme, menu mobile, hiệu ứng scroll
├── public/                 # File tĩnh, copy nguyên xi khi build
│   ├── favicon.svg
│   ├── images/             # Ảnh trang chủ (hero, gallery-1..6)
│   └── album/
│       └── baby/
│           ├── index.html  # TRANG ALBUM (masonry + lightbox, tự chứa CSS/JS)
│           └── photos/     # Ảnh trong album: 1.jpg, 2.jpg, 3.jpg ...
├── package.json
└── CLAUDE.md               # (file này)
```

- **Trang chủ** = `index.html` + `src/style.css` + `src/main.js`.
- **Trang album** = `public/album/baby/index.html` — **file độc lập, tự chứa CSS + JS**, không dùng chung với trang chủ. Sửa album chỉ đụng file này.

---

## 3. Bảng màu & font (design tokens)

Định nghĩa trong `src/style.css` (và lặp lại trong album để tự chứa):

| Token | Sáng | Ý nghĩa |
|-------|------|---------|
| `--milk` | `#faf6f0` | nền trang |
| `--cream` | `#f0e6d8` | nền section xen kẽ |
| `--rose` | `#e8c4bc` | hồng phấn |
| `--clay` | `#c4826b` | đất nung — màu nhấn chính |
| `--ink` | `#3b2f2c` | nâu than — chữ chính |

- **Font tiêu đề:** Playfair Display (serif)
- **Font nội dung:** Be Vietnam Pro
- **Dark mode:** tự theo hệ thống + nút chuyển; lưu lựa chọn ở `localStorage['beo-theme']`.
- **Dấu hiệu nhận diện:** khung "vòm" bo tròn phía trên (`border-radius: 999px 999px 0 0`).

Khi thêm nội dung mới, **giữ đúng các token này** để đồng bộ thương hiệu.

---

## 4. Chạy & phát triển tại máy

```bash
cd ~/Documents/CLAUDE/beostudio-web
npm install        # chỉ cần lần đầu
npm run dev        # mở http://localhost:5173
```

⚠️ **Lưu ý dev server:** khi mở `http://localhost:5173/album/baby/` (thư mục), Vite dev có thể hiển thị nhầm trang chủ. Để test album ở local, mở thẳng:
`http://localhost:5173/album/baby/index.html`.
Trên host thật thì `beostudio.top/album/baby/` chạy đúng (LiteSpeed tự mở index.html).

---

## 5. Deploy

- **Cách deploy duy nhất:** `git push origin main`. Hostinger nối GitHub, tự chạy `npm run build` và đưa lên `public_html`.
- Thời gian: ~1–2 phút sau khi push.
- Kiểm tra đã lên chưa: `curl -sI https://beostudio.top` (mong đợi `HTTP/2 200`).
- Không có bước build/upload thủ công nào khác.

---

## 6. Truy cập server (SSH)

Đã cấu hình sẵn alias trên máy — chỉ cần:
```bash
ssh hostinger
```
Thông tin (trong `~/.ssh/config`, key `~/.ssh/hostinger_ed25519`):
- Host/IP: `145.79.25.155`
- Port: `65002`
- User: `u969385986`
- Thư mục web: `~/domains/beostudio.top/public_html/`

Dùng để: kiểm tra file đã deploy, xem/sửa ảnh trực tiếp, debug.

---

## 7. Album ảnh khách — cách hoạt động

**Link chia sẻ:** https://beostudio.top/album/baby

- Trang tự động dò ảnh trong `photos/` theo **số thứ tự**: `1.jpg`, `2.jpg`, `3.jpg`…
  Hỗ trợ `.jpg .jpeg .png .webp`. Dừng khi gặp khoảng trống liên tục.
- (Nâng cao) Có thể đặt file `photos/list.json` chứa mảng tên file để kiểm soát thứ tự thủ công — nếu có, trang ưu tiên dùng nó.

### Cách CHỦ STUDIO tự thêm ảnh (không cần code)
Vào **hPanel → File Manager → `public_html/album/baby/photos/`** → upload ảnh đặt tên `7.jpg, 8.jpg…` (nối tiếp) → tải lại trang là hiện.

> ⚠️ **QUAN TRỌNG:** ảnh upload thủ công qua File Manager **có thể bị xoá khi web được deploy lại từ GitHub**. Deploy lại chỉ xảy ra khi có push code.
> → **Trước khi sửa/deploy web, nếu khách đã có ảnh upload thủ công, phải sao lưu ảnh trong `public_html/album/baby/photos/` (dùng `ssh hostinger`), rồi khôi phục sau khi deploy.**
> Cách an toàn tuyệt đối: commit ảnh vào repo (`public/album/baby/photos/`) — ảnh sẽ theo mỗi lần deploy, không bao giờ mất.

### Tạo thêm album mới cho khách/chủ đề khác
Nhân bản thư mục: copy `public/album/baby/` sang `public/album/<tên>/` (vd `gia-dinh`, `me-bau`), xoá ảnh cũ trong `photos/`, sửa tiêu đề trong `index.html`. Link mới: `beostudio.top/album/<tên>`.

---

## 8. Các "bẫy" đã biết (gotchas)

1. **Geo-blocking (chặn theo quốc gia):** web dùng CDN Hostinger với "Traffic blocking".
   - Hiện đang ở chế độ **"Allow only specific countries" và chỉ cho phép Việt Nam**.
   - → Khách **ở nước ngoài sẽ bị chặn (403 "Your country is not allowed")**.
   - Chỉnh tại: hPanel → Websites → beostudio.top → **Performance → CDN → Manage → tab "Traffic blocking"**. Muốn mở toàn cầu: chuyển sang "Block specific countries" và để trống.

2. **Album directory URL ở dev:** xem mục 4.

3. **File upload thủ công có thể mất khi deploy:** xem mục 7.

---

## 9. Thông tin thương hiệu (để viết nội dung đúng giọng)

- **Tên:** BEO STUDIO
- **Dịch vụ:** chụp bé sơ sinh (0–30 ngày), gia đình, mẹ bầu (tuần 28–34).
- **Khu vực:** Long Thành & Biên Hoà (Đồng Nai). 2 chi nhánh.
- **Hotline / Zalo:** 0792 792 679
- **Giọng văn:** dịu dàng, ấm áp, hướng tới cha mẹ; nhấn vào cảm xúc & khoảnh khắc.

---

## 10. Việc thường làm — tra nhanh

| Muốn làm gì | Sửa ở đâu |
|-------------|-----------|
| Đổi chữ/nội dung trang chủ | `index.html` |
| Đổi màu, font, khoảng cách | `src/style.css` (phần `:root` tokens) |
| Đổi ảnh hero / gallery trang chủ | thay file trong `public/images/` (giữ tên) |
| Sửa giao diện album | `public/album/baby/index.html` |
| Thêm/bớt ảnh trong album | thư mục `photos/` (File Manager hoặc commit vào repo) |
| Tạo album mới | copy `public/album/baby/` → đổi tên |
| Mở/khoá truy cập theo quốc gia | hPanel → CDN → Traffic blocking |
| Đưa thay đổi lên web | `git push origin main` |
