import { config } from 'dotenv';
import { Hono } from 'hono';
import { serveStatic, createBunWebSocket } from 'hono/bun';

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
const app = new Hono();
const { upgradeWebSocket, websocket } = createBunWebSocket();
globalThis.app = app;
globalThis.mem = {};
globalThis.lib.hono.upgradeWebSocket = upgradeWebSocket;

// Route cơ bản
app.get('/', (c) => c.redirect('/home', 301));

// Khởi tạo Plugin
await loadPlugins();

// Start Tray
await trayicon();

// Ẩn console
if (process.env.DEBUG != 'true')
	hiddenConsole(true);

// File tĩnh từ thư mục /public
let pathPublic = process.env.PATH_PUBLIC || 'public';
app.use('/*', serveStatic({ root: pathPublic }));

// Khởi chạy Server
let port = Number(process.env.PORT || '3000');
Bun.serve({
	port,
	fetch: app.fetch,
	websocket: websocket
});
console.log(`🦊 Server Bun (JS) đang chạy tại: http://localhost:${port}`);
