// build.ts
import { join } from "path";
import { cpSync, mkdirSync, existsSync } from "fs";

console.log("🚀 Đang bắt đầu quá trình build ứng dụng...");

// 1. Cấu hình Bun Build
const result = await Bun.build({
	entrypoints: ["./src/main.js"], // File chạy chính của ứng dụng của bạn
	outdir: "./dist",               // Thư mục chứa kết quả xuất ra
	naming: "server.[ext]",         // Giữ nguyên tên file gốc
	target: "bun",                  // Đặt target là node hoặc bun tùy thuộc vào code của bạn
	compile: true,                  // BẬT tính năng biên dịch thành file .exe đơn lẻ
	minify: true,                   // Nén code để giảm dung lượng
	external: [
		// "@duckdb/*",
		// "@duckdb/node-api",
		// "@duckdb/node-bindings",
		// "@duckdb/node-bindings-win32-x64",
	],
});

if (!result.success) {
	console.error("❌ Build thất bại:");
	console.error(result.logs);
	process.exit(1);
}

// console.log("✨ Biên dịch file EXE thành công tại thư mục ./dist !");

// const srcNodeModules = join(process.cwd(), "node_modules", "@duckdb");
// const destNodeModules = join(process.cwd(), "dist", "node_modules", "@duckdb");

// if (existsSync(srcNodeModules)) {
// 	console.log("📂 Đang sao chép native bindings của DuckDB sang thư mục dist...");
// 	mkdirSync(join(process.cwd(), "dist", "node_modules"), { recursive: true });
// 	cpSync(srcNodeModules, destNodeModules, { recursive: true });
// 	console.log("✅ Đã chuẩn bị xong thư mục phân phối (dist)!");
// } else {
// 	console.warn("⚠️ Không tìm thấy @duckdb trong node_modules. Hãy chắc chắn bạn đã chạy `bun install`.");
// }