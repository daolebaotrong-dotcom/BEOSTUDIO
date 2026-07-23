// Cloudflare Worker — cầu nối OAuth GitHub cho Decap CMS (/admin) của BEO STUDIO.
// Deploy qua dash.cloudflare.com → Workers & Pages → Create Worker → dán code này.
// Cần đặt 2 biến môi trường (Settings → Variables, đánh dấu "Encrypt"):
//   GITHUB_CLIENT_ID     — Client ID của GitHub OAuth App
//   GITHUB_CLIENT_SECRET — Client Secret của GitHub OAuth App
// GitHub OAuth App tạo tại: https://github.com/settings/developers
//   Homepage URL:            https://beostudio.top/admin/
//   Authorization callback:  https://<worker-url>.workers.dev/callback

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const SCOPE = "repo,user";

function randomState() {
  return crypto.randomUUID();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      const state = randomState();
      const redirectUri = `${url.origin}/callback`;
      const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
      authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set("redirect_uri", redirectUri);
      authorizeUrl.searchParams.set("scope", SCOPE);
      authorizeUrl.searchParams.set("state", state);
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Thiếu mã code từ GitHub.", { status: 400 });
      }

      const tokenRes = await fetch(GITHUB_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenRes.json();

      if (tokenData.error || !tokenData.access_token) {
        return new Response(
          `Lỗi lấy access token: ${tokenData.error_description || tokenData.error || "unknown"}`,
          { status: 400 }
        );
      }

      const payload = JSON.stringify({
        token: tokenData.access_token,
        provider: "github",
      });

      // Trang này tự đóng popup và gửi token về cho Decap CMS đang chờ ở cửa sổ chính.
      const html = `<!doctype html>
<html><body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:${payload.replace(/'/g, "\\'")}',
        e.origin
      );
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
Đăng nhập thành công, đang đóng cửa sổ này...
</body></html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("BEO CMS OAuth proxy — dùng /auth để đăng nhập.", {
      status: 200,
    });
  },
};
