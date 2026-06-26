import { readdir, exists } from 'node:fs/promises'; // unlink
import { join } from 'node:path';
import { t } from 'elysia';

const PUBLIC_DIR = join(import.meta.dirname, '../public');

export default function (app) {

	app.get('/api/file/list', async({ query: { folder }, set }) => {
		try {
			const files = await readdir(join(PUBLIC_DIR, folder));
			return { success: true, data: files };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: ex.message };
		}
	});

	app.get('/api/file/check', async ({ query: { file }, set }) => {
		try {
			const filePath = join(PUBLIC_DIR, file);
			const isExist = await exists(filePath);

			return { success: true, result: isExist };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: ex.message };
		}
	});

	app.get('/api/file/download', async ({ query: { file }, set }) => {
		try {
			const filePath = join(PUBLIC_DIR, file);
			const isExist = await exists(filePath);

			if (!isExist) {
				set.status = 404;
				return { error: 'File không tồn tại' };
			}

			// Bun.file() tự động xử lý stream và content-type rất tối ưu
			return Bun.file(filePath);
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: ex.message };
		}
	});

	app.post('/api/file/upload', async ({ body: { file }, set }) => {
		try {
			const filePath = join(PUBLIC_DIR, file.name);
			
			// Bun.write() ghi file cực nhanh từ thực thể File/Blob
			await Bun.write(filePath, file);

			set.status = 201;
			return {
				success: true,
				message: 'Upload file thành công',
				fileName: file.name,
				size: file.size
			};
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

	// app.post('/api/file/delete', async ({ query: { file }, set }) => {
	// 	try {
	// 		const filePath = join(PUBLIC_DIR, file);
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