import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

// Trang tĩnh nhiều entry: trang chủ + các trang dịch vụ theo chi nhánh (SEO địa phương).
// Các trang này dùng chung /src/style.css + /src/main.js với trang chủ, không tự chứa CSS riêng.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: r('./index.html'),
        dichVuLongThanh: r('./dich-vu/chup-anh-cho-be-long-thanh/index.html'),
        dichVuBienHoa: r('./dich-vu/chup-anh-cho-be-bien-hoa/index.html'),
      },
    },
  },
})
