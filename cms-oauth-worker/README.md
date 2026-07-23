# Đăng nhập CMS (Decap CMS) qua GitHub — hướng dẫn setup 1 lần

Trang quản trị nội dung nằm ở **https://beostudio.top/cms/**. Để đăng nhập được, cần 2 việc — chỉ làm 1 lần:

## Bước 1 — Tạo GitHub OAuth App

1. Vào https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**.
2. Điền:
   - **Application name**: `BEO STUDIO CMS`
   - **Homepage URL**: `https://beostudio.top/cms/`
   - **Authorization callback URL**: `https://<TÊN-WORKER-CỦA-ANH>.workers.dev/callback` (điền ở bước 2 xong quay lại điền chỗ này)
3. Bấm **Register application**.
4. Copy **Client ID**.
5. Bấm **Generate a new client secret** → copy **Client Secret** (chỉ hiện 1 lần, lưu lại ngay).

## Bước 2 — Deploy Cloudflare Worker

1. Vào https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**.
2. Đặt tên worker, ví dụ `beo-cms-auth` (URL sẽ là `beo-cms-auth.<subdomain>.workers.dev`).
3. Vào **Edit code**, xoá hết code mẫu, dán toàn bộ nội dung file `worker.js` (cùng thư mục với file này) vào.
4. **Deploy**.
5. Vào **Settings → Variables and Secrets** của worker này, thêm 2 biến (chọn kiểu **Secret**, không phải Text thường):
   - `GITHUB_CLIENT_ID` = Client ID ở bước 1
   - `GITHUB_CLIENT_SECRET` = Client Secret ở bước 1
6. Lưu, quay lại GitHub OAuth App (bước 1) điền đúng **Authorization callback URL** = `https://<url-worker-thật>/callback`.

## Bước 3 — Báo lại cho Claude Code

Gửi cho mình URL worker thật (dạng `https://beo-cms-auth.xxxx.workers.dev`), mình sẽ cập nhật vào
`public/cms/config.yml` (giá trị `base_url`) và push lên — từ đó `/cms/` đăng nhập được.

## Kiểm tra

Sau khi xong, mở https://beostudio.top/cms/, bấm **Login with GitHub**, cho phép truy cập —
nếu vào được màn hình quản trị (thấy 3 mục: Bộ sưu tập ảnh / Bảng giá / Cảm nhận khách hàng) là thành công.
