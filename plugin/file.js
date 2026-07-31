import { readdir, exists, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

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
	server.get('/api/file-list', async ({ query, set }) => {
		try {

			const { folder } = query;

			if (!folder) {
				set.status = 400;
				return 'Thiếu tham số folder';
			}

			if (!await exists(folder)) {
				set.status = 404;
				return `Folder không tồn tại: ${folder}`;
			}

			const items = await readdir(folder);

			let result = [];
			for (const item of items) {
				const fullPath = join(folder, item);
				const stats = await stat(fullPath);

				result.push({
					name: item,
					size: stats.size,
					date: stats.mtime,
					isFolder: stats.isDirectory(),
				});
			}

			return result;
		}
		catch (ex) {
			set.status = 500;
			return ex.message;
		}
	});
	server.get('/api/file-check', async ({ query, set }) => {
		try {
			const { file } = query;
			const filePath = join(publicFolder, file);
			return await exists(filePath);
		}
		catch (ex) {
			set.status = 500;
			return ex.message;
		}
	});
	server.get('/api/file-read', async ({ query, set }) => {
		try {
			const { folder, file } = query;
			const filePath = join(folder, file);
			const isExist = await exists(filePath);

			if (!isExist) {
				set.status = 404;
				return `File "${file}" không tồn tại`;
			}

			return Bun.file(filePath);
		}
		catch (ex) {
			set.status = 500;
			return ex.message;
		}
	});
	server.post('/api/file-write', async ({ request, query, body, set }) => {
		try {

			// Check Permission
			if (!auth.check(request)) {
				set.status = 403;
				return ex.message;
			}

			let { folder, confirm } = query;
			let { file } = body;

			const filePath = join(folder, file.name);

			// Kiểm tra tồn tại
			if (!confirm) {
				let isExists = await exists(filePath);
				if (isExists) {
					set.status = 400;
					return 'File đã tồn tại!';
				}
			}

			// Ghi file vào đĩa
			await Bun.write(filePath, file);

			// Return
			set.status = 201;
			return true;
		}
		catch (ex) {
			set.status = 500;
			return ex.message;
		}
	}, {
		// Validate dữ liệu truyền lên bắt buộc phải có file (gửi qua Form Data)
		body: t.Object({
			file: t.File()
		})
	});
	server.post('/api/file-writeText', async ({ request, query, body, set }) => {
		try {

			// Check Permission
			if (!auth.check(request)) {
				set.status = 403;
				return ex.message;
			}

			let { file, confirm } = query;
			let content = body;

			// Kiểm tra folder tồn tại
			const folderPath = dirname(file);
			if (!exists(folderPath))
				mkdir(folderPath, { recursive: true });

			// Kiểm tra tồn tại
			if (!confirm) {
				let isExists = await exists(file);
				if (isExists) {
					set.status = 400;
					return 'File đã tồn tại!';
				}
			}

			// Ghi file vào đĩa
			await Bun.write(file, content);

			// Return
			set.status = 201;
			return { fileName: file.name, size: file.size };
		}
		catch (ex) {
			set.status = 500;
			return ex.message;
		}
	});
	// server.post('/api/file-delete', async ({ query: { file }, set }) => {
	// 	try {
	// 		const filePath = join(publicFolder, file);
	// 		const isExist = await exists(filePath);

	//		if (!isExist) {
	//			set.status = 404;
	//			return 'File không tồn tại';
	//		}

	// 		await unlink(filePath);
	// 		return { success: true, message: `Đã xóa file ${filename} thành công` };
	// 	}
	// 	catch (ex) {
	// 		set.status = 500;
	// 		return ex.message;
	// 	}
	// });
}