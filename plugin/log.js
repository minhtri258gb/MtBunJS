import { watch } from 'fs';
import { open, stat } from 'fs/promises';

/**
 * Mỗi file log đang được theo dõi sẽ có 1 entry ở đây.
 * - watcher: fs.watch handle theo dõi thay đổi trên file
 * - position: vị trí byte đã đọc tới (để lần sau chỉ đọc phần mới)
 * - clients: tập các kết nối websocket đang xem file này
 * - reading: cờ tránh đọc file chồng lấp nhau khi nhiều sự kiện change bắn liên tiếp
 */
export default function() {

	globalThis.app.logs = {
		clientFile: new Map(), // client -> path file
		fileWatches: new Map(), // path file -> entry theo dõi
	};

	const safeSend = function(ws, data) {
		try {
			ws.send(JSON.stringify(data));
		} catch {
			// client có thể đã đóng kết nối, bỏ qua
		}
	}

	// Đọc phần dữ liệu MỚI được ghi thêm vào file (từ entry.position tới hết file)
	const readNewContent = async function(filePath) {
		const entry = app.logs.fileWatches.get(filePath);
		if (!entry || entry.reading)
			return;

		entry.reading = true;
		try {
			const stats = await stat(filePath);

			// File bị ghi đè / xoay vòng (log rotate) -> size nhỏ hơn vị trí cũ => đọc lại từ đầu
			if (stats.size < entry.position) {
				entry.position = 0;
			}

			if (stats.size > entry.position) {
				const length = stats.size - entry.position;
				const buffer = Buffer.alloc(length);

				const handle = await open(filePath, "r");
				await handle.read(buffer, 0, length, entry.position);
				await handle.close();

				entry.position = stats.size;

				const text = buffer.toString("utf-8");
				const lines = text.split("\n").filter((l) => l.length > 0);

				if (lines.length > 0) {
					for (const client of entry.clients) {
						safeSend(client, { type: "data", path: filePath, lines });
					}
				}
			}
		} catch (err) {
			console.error(`Lỗi đọc file ${filePath}:`, err);
			for (const client of entry.clients) {
				safeSend(client, {
					type: "error",
					path: filePath,
					message: `Lỗi đọc file: ${(err).message}`,
				});
			}
		} finally {
			entry.reading = false;
		}
	}

	// Đăng ký 1 client theo dõi 1 file. Nếu file chưa có ai theo dõi thì tạo watcher mới.
	const watchFile = async function(filePath, ws) {
		let entry = app.logs.fileWatches.get(filePath);
		console.log('watchFile', filePath, entry)

		if (!entry) {
			let position = -1;
			try {
				const stats = await stat(filePath);
				// Bắt đầu tính từ cuối file hiện tại -> chỉ nhận thay đổi MỚI (kiểu tail -f)
				position = stats.size;
			} catch (err) {
				safeSend(ws, {
					type: "error",
					path: filePath,
					message: `Không mở được file: ${(err).message}`,
				});
				return;
			}

			const clients = new Set();
			const watcher = watch(filePath, (eventType) => {
				if (eventType === "change") readNewContent(filePath);
			});

			watcher.on("error", (err) => {
				console.error(`Watcher lỗi cho ${filePath}:`, err);
			});

			entry = { watcher, position, clients, reading: false };
			app.logs.fileWatches.set(filePath, entry);
			console.log(`[+] Bắt đầu theo dõi file: ${filePath}`);
		}

		entry.clients.add(ws);
		app.logs.clientFile.set(ws.id, filePath);
		console.log(`Client đang xem "${filePath}" (tổng ${entry.clients.size} client)`);

		safeSend(ws, { type: "watching", path: filePath });
	}

	// Hủy theo dõi cho 1 client (do đổi file hoặc ngắt kết nối).
	// Nếu sau khi bỏ client đó ra mà không còn client nào xem file -> tắt watcher, giải phóng tài nguyên.
	const unwatchFile = function(ws) {
		const filePath = app.logs.clientFile.get(ws.id);
		if (!filePath)
			return;

		const entry = app.logs.fileWatches.get(filePath);
		if (entry) {
			for (const client of entry.clients) {
				if (client.id === ws.id) {
					entry.clients.delete(client);
					break;
				}
			}
			// entry.clients.delete(ws);
			console.log(`Client rời "${filePath}" (còn lại ${entry.clients.size} client)`);

			if (entry.clients.size === 0) {
				entry.watcher.close();
				app.logs.fileWatches.delete(filePath);
				console.log(`[-] Không còn client nào xem "${filePath}", đã dừng theo dõi.`);
			}
		}

		app.logs.clientFile.delete(ws.id);
	}

	// Define WebSocket API
	server.ws('/logs', {

		// Xử lý khi client kết nối
		open(ws) {
			ws.send(JSON.stringify({ success: true }));
			console.log("Client kết nối WebSocket /logs");
		},

		// Xử lý khi nhận message từ client
		message(ws, raw) {
			let msg = '';
			try {
				msg = typeof raw === "string" ? JSON.parse(raw) : raw;
			} catch {
				safeSend(ws, { type: "error", message: "Message không hợp lệ (cần JSON)" });
				return;
			}

			if (msg?.type === "watch" && typeof msg.path === "string" && msg.path.trim()) {
				// Nếu client đang xem file khác thì bỏ theo dõi file cũ trước
				unwatchFile(ws);
				watchFile(msg.path.trim(), ws);
			} else if (msg?.type === "unwatch") {
				unwatchFile(ws);
				safeSend(ws, { type: "unwatched" });
			} else {
				safeSend(ws, { type: "error", message: "Không hiểu message" });
			}
		},

		// Xử lý khi client ngắt kết nối
		close(ws, code, message) {
			unwatchFile(ws);
			console.log("Client ngắt kết nối");
		},
	});
}