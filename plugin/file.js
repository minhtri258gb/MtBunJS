import { readdir, exists, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

export default function() {

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
	app.get('/api/file-list', async (c) => {
		try {

			const folder = c.req.query('folder');

			if (!folder)
				return c.text('Thiếu tham số folder', 400);

			if (!await exists(folder))
				return c.text(`Folder không tồn tại: ${folder}`, 404);

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

			return c.json(result);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
	app.get('/api/file-check', async (c) => {
		try {
			const file = c.req.query('file');
			const filePath = join(publicFolder, file);
			return await exists(filePath);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
	app.get('/api/file-read', async (c) => {
		try {
			const file = c.req.query('file');
			const isExist = await exists(file);

			if (!isExist)
			return c.text(`File "${file}" không tồn tại`, 404);

			return new Response(Bun.file(file));
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
	app.post('/api/file-write', async (c) => {
		try {

			// Check Permission
			// if (!auth.check(request)) {
			// 	set.status = 403;
			// 	return 'Bạn không có quyền thực hiện thao tác này!';
			// }

			const folder = c.req.query('folder');
			const confirm = c.req.query('confirm');
			const file = await c.req.blob();

			const filePath = join(folder, file.name);

			// Kiểm tra tồn tại
			if (!confirm) {
				let isExists = await exists(filePath);
				if (isExists)
					return c.text('File đã tồn tại!', 400);
			}

			// Ghi file vào đĩa
			await Bun.write(filePath, file);

			// Return
			return c.text('true');
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
	app.post('/api/file-writeText', async (c) => {
		try {

			// Check Permission
			// if (!auth.check(request)) {
			// 	set.status = 403;
			// 	return 'Bạn không có quyền thực hiện thao tác này!';
			// }

			const file = c.req.query('file');
			const confirm = c.req.query('confirm');
			const content = await c.req.text();

			// Kiểm tra folder tồn tại
			const folderPath = dirname(file);
			if (!exists(folderPath))
				mkdir(folderPath, { recursive: true });

			// Kiểm tra tồn tại
			if (!confirm) {
				let isExists = await exists(file);
				if (isExists)
					return c.text('File đã tồn tại!', 400);
			}

			// Ghi file vào đĩa
			await Bun.write(file, content);

			// Return
			return c.json({ fileName: file.name, size: file.size }, 201);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
	// app.post('/api/file-delete', async ({ query: { file }, set }) => {
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