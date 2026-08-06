import { readdir, exists, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

export default function() {

	// Define API
	server.get('/api/jstree', async ({ query, set }) => {
		try {

			let { folder } = query;

			if (!folder) {
				set.status = 400;
				return { id: 0 };
			}

			// Pre Process Input
			// if (folder[folder.length-1] != '/')
			// 	folder += '/';

			// Liệt kê bên trong folder
			let lstName = await readdir(folder);
			let lstFolder = [];
			let lstFile = [];
			for (let name of lstName) {
				let fullpath = join(folder, name);
				let stats = await stat(fullpath);
				let isFolder = stats.isDirectory();
				let item = {
					text: name, // Hiển thị
					path: fullpath, // Path tới node
					isFolder: isFolder, // Là thư mục?
				};
				if (!isFolder) {
					item = Object.assign(item, {
						size: stats.size, // Kích thước
						date: stats.mtime, // Thời gian chỉnh sửa
					});
				}
				if (isFolder) {
					lstFolder.push(item);
				} else {
					lstFile.push(item);
				}
			}

			return [...lstFolder, ...lstFile];
		}
		catch (ex) {
			set.status = 500;
			return ex.message;
		}
	});
}