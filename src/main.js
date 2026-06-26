
// Load biến môi trường từ .env
import { config } from 'dotenv';
config();

// Tạo Server HTTP
import { Elysia } from 'elysia';
const app = new Elysia();

// 1. Phục vụ file tĩnh từ thư mục /public
import { staticPlugin } from '@elysiajs/static';
app.use(staticPlugin({ assets: 'public', prefix: '/' }));

// Route cơ bản
app.get('/', () => "Server chính JS đang chạy!");
app.get('/ping', () => "pong");

// Khởi tạo Plugin
import loadPlugins from './plugin';
await loadPlugins(app);

// 3. Khởi chạy Server
let port = Number(process.env.PORT || '3000');
app.listen(port, () => {
	console.log(`🦊 Server Bun (JS) đang chạy tại: http://localhost:${port}`);
});
