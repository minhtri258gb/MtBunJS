export default function() {

	// Reference
	let t = lib.elysia.t;

	// Define API
	server.get('/api/config-get', async ({ request, query, set }) => {
		try {

			// Check Permission
			let permission = auth.check(request);

			let { key } = query;

			if (key == null || key == '') {
				set.status = 400;
				return 'key không hợp lệ!';
			}

			// Kiểm tra quyền
			if (!permission && !key.startsWith('PATH_')) {
				set.status = 400;
				return 'key không hợp lệ!';
			}

			// Lấy biến môi trường
			let result = process.env[key];

			if (!result || result.length == 0) {
				set.status = 400;
				return `Không tìm thấy Key ${key}`;
			}

			// Return
			return result;
		}
		catch (ex) {
			set.status = 500;
			return `Không thể thực thi lệnh: ${ex.message}`;
		}
	});
}