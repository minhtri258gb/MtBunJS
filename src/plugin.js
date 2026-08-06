import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export default async function loadPlugins() {

	const h_debug = false;

	// Tự động load các plugin .js từ thư mục /plugin
	const pluginDir = join(process.cwd(), 'plugin');

	if (!existsSync(pluginDir))
		mkdirSync(pluginDir);

	const files = readdirSync(pluginDir);

	h_debug && console.log("-----------------------------------------");
	h_debug && console.log("🚀 Đang khởi tạo hệ thống Plugin (JS)...");
	for (const file of files) {

		// Chỉ quét các file có đuôi .js
		if (file.endsWith('.js')) {
			const filePath = join(pluginDir, file);

			try {
				// Import động file JavaScript tại runtime
				const module = await import(filePath);

				if (typeof module.default === 'function') {
					module.default();
					h_debug && console.log(`✅ Đã load thành công plugin JS: ${file}`);
				}
				else
					h_debug && console.log(`⚠️ Bỏ qua ${file}: Không tìm thấy 'export default function'`);
			}
			catch (error) {
				console.error(`❌ Lỗi khi load plugin ${file}:\n`, error);
			}
		}
	}
	h_debug && console.log("-----------------------------------------");

}
