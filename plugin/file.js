import { readdir, exists } from 'node:fs/promises'; // unlink
import { join } from 'node:path';

export default function() {

	// Reference
	let t = lib.elysia.t;

	const publicFolder = join(process.cwd(), 'public');

	// Lấy danh sách PATH
	let listPath = [];
	for (let key in process.env) {
		if (key.startsWith('PATH_'))
			listPath.push(process.env[key]);
	}
	let fooCheckPath = (path) => {

	};

	// Define API
	app.get('/api/file-list', async ({ query, set }) => {
		try {

			const { folder } = query;

			if (!folder)
				return { success: false, message: 'Thiếu tham số folder' };

			const fullPath = join(publicFolder, folder);

			if (!await exists(fullPath)) {
				set.status = 300;
				return { success: false, message: `Folder không tồn tại: ${fullPath}` };
			}

			const files = await readdir(fullPath);

			return { success: true, result: files };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: ex.message };
		}
	});
	app.get('/api/file-check', async ({ query, set }) => {
		try {
			const { file } = query;
			const filePath = join(publicFolder, file);
			const isExist = await exists(filePath);

			return { success: true, result: isExist };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: ex.message };
		}
	});
	app.get('/api/file-download', async ({ query, set }) => {
		try {
			const { file } = query;
			const filePath = join(publicFolder, file);
			const isExist = await exists(filePath);

			if (!isExist)
				return { success: false, message: 'File không tồn tại' };

			return Bun.file(filePath);
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: ex.message };
		}
	});
	app.post('/api/file-upload', async ({ body: { file }, set }) => {
		try {
			const filePath = join(publicFolder, file.name);

			// Bun.write() ghi file cực nhanh từ thực thể File/Blob
			await Bun.write(filePath, file);

			set.status = 201;
			return { success: true, fileName: file.name, size: file.size };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, error: ex.message };
		}
	}, {
		// Validate dữ liệu truyền lên bắt buộc phải có file (gửi qua Form Data)
		body: t.Object({
			file: t.File()
		})
	});
	// app.post('/api/file-delete', async ({ query: { file }, set }) => {
	// 	try {
	// 		const filePath = join(publicFolder, file);
	// 		const isExist = await exists(filePath);

	// 		if (!isExist) {
	// 			set.status = 404;
	// 			return { success: false, message: 'File không tồn tại' };
	// 		}

	// 		await unlink(filePath);
	// 		return { success: true, message: `Đã xóa file ${filename} thành công` };
	// 	}
	// 	catch (ex) {
	// 		set.status = 500;
	// 		return { success: false, message: ex.message };
	// 	}
	// });
}