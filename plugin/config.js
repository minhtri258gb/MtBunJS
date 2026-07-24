export default function() {

	// Reference
	let t = lib.elysia.t;

	// Define API
	server.get('/api/config-get', async ({ request, query, set }) => {
		try {

			// Check Permission
			let permission = auth.check(request);

			let { key } = query;

			if (key == null || key == '')
				return { success: false, message: 'key không hợp lệ!' };

			// Kiểm tra quyền
			if (!permission && !key.startsWith('PATH_'))
				return { success: false, message: 'key không hợp lệ!' };

			// Lấy biến môi trường
			let result = process.env[key];

			if (!result || result.length == 0)
				return { success: false, message: `Không tìm thấy Key ${key}` };

			// Return
			return { success: true, result: result };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: `Không thể thực thi lệnh: ${ex.message}` };
		}
	});
}