# BEO STUDIO — Website

Website studio nhiếp ảnh bé sơ sinh, mẹ bầu & gia đình tại Long Thành và Biên Hoà (Đồng Nai).

- **Hotline / Zalo:** 0792 792 679
- **Stack:** Vite + HTML/CSS/JS thuần (static site)

## Chạy local

```bash
npm install
npm run dev      # mở http://localhost:5173
```

## Build production

```bash
npm run build    # kết quả nằm trong thư mục dist/
```

## Deploy lên Hostinger (shared hosting)

1. Chạy `npm run build` — toàn bộ site tĩnh nằm trong thư mục `dist/`.
2. Đăng nhập **hPanel** của Hostinger → **File Manager** (hoặc dùng FTP).
3. Vào thư mục `public_html/`, xoá file mặc định nếu có.
4. Upload **toàn bộ nội dung bên trong** thư mục `dist/` (không upload chính thư mục `dist`) vào `public_html/`.
5. Truy cập tên miền để kiểm tra.

> Cách khác: nén `dist/` thành `.zip`, upload lên `public_html/` rồi giải nén bằng File Manager cho nhanh.

## Thay ảnh thật

Các khung ảnh hiện là SVG giữ chỗ. Khi có ảnh thật của studio:

- Đặt ảnh vào thư mục `public/images/`
- Trong `index.html`, thay các khối `<svg>` bên trong `.arch` bằng `<img src="/images/ten-anh.jpg" alt="..." />`
