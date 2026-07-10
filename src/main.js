import { config } from 'dotenv';
import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';

import registerLibrary from './lib';
import loadPlugins from './plugin';
import trayicon from './tray';
import hiddenConsole from './utils/hideConsole';


// Load biến môi trường từ .env
config();

// Đăng ký thư viện
registerLibrary();

// Tạo Server HTTP
const app = new Elysia();
globalThis.app = app;

// 1. Phục vụ file tĩnh từ thư mục /public
let pathPublic = process.env.PATH_PUBLIC || 'public';
app.use(staticPlugin({ assets: pathPublic, prefix: '/', indexHTML: true }));

// Route cơ bản
app.get('/', () => new Response(null, { status: 301, headers: { 'Location': '/home' }}));

// Khởi tạo Plugin
await loadPlugins();

// Start Tray
await trayicon();

// Ẩn console
hiddenConsole(true);

// 3. Khởi chạy Server
let port = Number(process.env.PORT || '3000');
app.listen(port, () => {
	console.log(`🦊 Server Bun (JS) đang chạy tại: http://localhost:${port}`);
});
