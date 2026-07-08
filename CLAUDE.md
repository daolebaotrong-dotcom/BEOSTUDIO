# BEO STUDIO — Website

Tài liệu dự án cho Claude Code. Đọc file này trước khi chỉnh sửa để nắm nhanh toàn bộ web.

## Dự án là gì

Website giới thiệu **BEO STUDIO** — studio nhiếp ảnh bé sơ sinh, mẹ bầu & gia đình tại **Long Thành** và **Biên Hoà** (Đồng Nai).
Là trang web **tĩnh (static)** một trang (single page), build bằng **Vite** (vanilla HTML/CSS/JS, không dùng framework).

- **Số điện thoại / Zalo:** 0792 792 679
- **Repo GitHub:** https://github.com/daolebaotrong-dotcom/BEOSTUDIO
- **Deploy:** Hostinger (upload thư mục `dist/` vào `public_html/`)

## Cấu trúc thư mục

```
Web claude/
├── index.html          ← Toàn bộ nội dung & cấu trúc trang (chỉnh text ở đây)
├── src/
│   ├── style.css       ← Toàn bộ giao diện, màu sắc, bố cục, sáng/tối, responsive
│   └── main.js         ← JS: nút sáng/tối, menu mobile, hiệu ứng cuộn
├── public/
│   ├── favicon.svg     ← Icon tab trình duyệt
│   └── images/         ← 8 ảnh thật của studio (hero-main, hero-inset, gallery-1..6)
├── dist/               ← Bản build để deploy (tự tạo ra, KHÔNG sửa tay)
├── beo-studio-deploy.zip ← File nén sẵn sàng upload lên Hostinger
└── package.json        ← Cấu hình & lệnh chạy
```

## Chạy & build

```bash
npm install       # cài lần đầu (nếu chưa có node_modules)
npm run dev       # chạy thử ở máy, mở http://localhost:5173
npm run build     # tạo bản deploy trong thư mục dist/
```

Sau khi `npm run build`, deploy bằng cách upload **nội dung bên trong** `dist/` vào `public_html/` trên Hostinger (không upload cả thư mục `dist`).

## Các phần của trang (theo thứ tự trong index.html)

1. **Header / nav** — logo BEO STUDIO, menu, nút sáng/tối, nút số điện thoại
2. **Hero** — tiêu đề lớn "Con lớn từng ngày, khoảnh khắc ở lại mãi" + 2 ảnh khung vòm
3. **Strip** — dải số liệu (5.000+ gia đình, 2 chi nhánh, 7 ngày, 100%)
4. **Dịch vụ** (`#dich-vu`) — 3 gói: Bé sơ sinh, Gia đình, Mẹ bầu
5. **Bộ sưu tập** (`#portfolio`) — lưới 6 ảnh
6. **Quy trình** (`#quy-trinh`) — 4 bước
7. **Cảm nhận** (`#cam-nhan`) — 3 lời khách hàng
8. **CTA** — dải kêu gọi đặt lịch
9. **Footer** (`#lien-he`) — địa chỉ 2 chi nhánh, giờ mở cửa

## Cách chỉnh sửa thường gặp

### Đổi chữ / nội dung
Sửa trực tiếp trong **`index.html`**. Tìm đúng phần theo comment `<!-- ====== TÊN PHẦN ====== -->`.

### Đổi số điện thoại
Số `0792792679` xuất hiện nhiều chỗ trong `index.html` (link `tel:` và `zalo.me`). Thay tất cả.

### Đổi địa chỉ 2 chi nhánh
Trong `index.html`, phần `<!-- ====== FOOTER ====== -->`, sửa 2 khối `<address>`.
Hiện đang để chung chung — cần địa chỉ cụ thể (số nhà, đường, phường/xã).

### Thay hoặc thêm ảnh
1. Chép ảnh mới vào `public/images/` (đặt tên như `hero-main.jpg`, `gallery-1.jpg`...).
2. **Quan trọng — nén ảnh trước** để web nhẹ (ảnh gốc từ máy ảnh rất nặng):
   ```bash
   cd public/images
   sips -Z 1600 -s format jpeg -s formatOptions 78 TÊN.jpg --out TÊN.jpg
   ```
   Mục tiêu: mỗi ảnh khoảng 100–350 KB.
3. Nếu đổi tên khác, sửa `src="/images/..."` tương ứng trong `index.html`.
4. Nhớ điền `alt="..."` mô tả ảnh (tốt cho Google & người khiếm thị).

Ảnh gốc của studio nằm ở: `/Users/daolebaotrong/Public/SSD/HÌNH GIA ĐÌNH & BABY/` (đang ưu tiên thư mục con `2026/`).

### Đổi màu sắc
Toàn bộ màu nằm ở đầu `src/style.css` trong `:root` (chế độ sáng) và khối `[data-theme="dark"]` (chế độ tối).
Bảng màu chính: kem `--milk`, kem đậm `--cream`, hồng `--rose`, đất nung `--clay` (điểm nhấn), nâu than `--ink` (chữ).

## Chế độ sáng/tối

- Nút chuyển nằm ở thanh nav (icon mặt trăng ↔ mặt trời).
- Tự theo cài đặt hệ thống lần đầu, sau đó nhớ lựa chọn của người dùng (lưu `localStorage` key `beo-theme`).
- Logic ở `src/main.js`; bảng màu tối ở `src/style.css`.

## Git — lưu & đẩy lên GitHub

Đã đăng nhập sẵn bằng `gh` CLI (tài khoản `daolebaotrong-dotcom`).

```bash
git add -A
git commit -m "Mô tả thay đổi"
git push
```

## Quy ước & lưu ý

- **Ngôn ngữ trang:** tiếng Việt (`lang="vi"`), font **Playfair Display** (tiêu đề) + **Be Vietnam Pro** (nội dung), tải từ Google Fonts.
- **Phong cách:** tối giản, sang, tông kem/hồng/đất nung; điểm nhấn signature là **khung ảnh hình vòm** (`--radius-arch`). Giữ đúng tinh thần này khi thêm phần mới.
- **Đừng sửa** thư mục `dist/` bằng tay — nó được tạo lại mỗi lần `npm run build`.
- Sau khi build lại, muốn cập nhật file zip deploy:
  ```bash
  cd dist && zip -r -q ../beo-studio-deploy.zip . && cd ..
  ```
- Trả lời & giao tiếp với chủ dự án bằng **tiếng Việt**.

## Việc còn tồn (TODO)

- [ ] Cập nhật **địa chỉ chính xác** 2 chi nhánh Long Thành & Biên Hoà.
- [ ] **Deploy lên Hostinger** (upload `dist/` hoặc `beo-studio-deploy.zip` vào `public_html/`).
- [ ] Cân nhắc thêm: bản đồ Google Maps, link Facebook fanpage (chupanhchobethoinoilongthanh), bảng giá.
