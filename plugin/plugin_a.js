export default function (app) {
	return app.get('/api/plugin-a', () => {
		return {
			status: "success",
			message: "Hello từ Plugin A bằng JavaScript thuần!"
		};
	});
}