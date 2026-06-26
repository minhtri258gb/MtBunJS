export default function (app) {
	return app.post('/api/plugin-b', ({ body }) => {
		return {
			status: "success",
			message: "Plugin B (JS) đã nhận dữ liệu",
			data: body
		};
	});
}