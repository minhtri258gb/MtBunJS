export default function (app) {

	// Reference
	let t = globalThis.lib.elysia.t;

	// Define API
	app.get('/api/config-get', async ({ query, set }) => {
		try {
			let { key } = query;

			if (key == null || key == '')
				return { success: false, message: 'key không hợp lệ!' };

			// Kiểm tra quyền
			if (!key.startsWith('PATH_'))
				return { success: false, message: 'key không hợp lệ!' };

			// Lấy biến môi trường
			let result = process.env[key];

			// Return
			return { success: true, result };
		}
		catch (ex) {
			set.status = 500;
			return {
				success: false,
				error: `Không thể thực thi lệnh: ${ex.message}`
			};
		}
	});
}