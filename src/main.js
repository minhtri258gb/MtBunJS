import { config } from 'dotenv';
import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';

import registerLibrary from './lib';
import initAuthn from './auth';
import loadPlugins from './plugin';
import trayicon from './tray';
import hiddenConsole from './utils/hideConsole';


// Load biến môi trường từ .env
config();
process.env.PATH_SERVER = process.cwd().replaceAll('\\', '/');

// Đăng ký thư viện
registerLibrary();

// Init Authn
initAuthn();

// Tạo Server HTTP
const server = new Elysia();
globalThis.server = server;

// 1. Phục vụ file tĩnh từ thư mục /public
let pathPublic = process.env.PATH_PUBLIC || 'public';
server.use(staticPlugin({ assets: pathPublic, prefix: '/', indexHTML: true }));

// Route cơ bản
server.get('/', () => new Response(null, { status: 301, headers: { 'Location': '/home' }}));

// Khởi tạo Plugin
await loadPlugins();

// Start Tray
await trayicon();

// Ẩn console
if (process.env.DEBUG != 'true')
	hiddenConsole(true);

// 3. Khởi chạy Server
let port = Number(process.env.PORT || '3000');
server.listen(port, () => {
	console.log(`🦊 Server Bun (JS) đang chạy tại: http://localhost:${port}`);
});
