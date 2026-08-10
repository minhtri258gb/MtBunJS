export default function() {

	// Define API
	app.get('/api/config-get', async (c) => {
		try {

			// Check Permission
			let permission = auth.check(c);

			const key = c.req.query('key');

			if (key == null || key == '')
				return c.text('key không hợp lệ!', 400);

			// Kiểm tra quyền
			if (!permission && !key.startsWith('PATH_'))
				return c.text('key không hợp lệ!', 400);

			// Lấy biến môi trường
			let result = process.env[key];

			if (!result || result.length == 0)
				return c.text(`Không tìm thấy Key ${key}`, 400);

			// Return
			return c.text(result);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
}