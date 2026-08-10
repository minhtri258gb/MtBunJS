export default function() {

	// Reference
	let hyparquet = lib.hyparquet;

	// Define API
	app.post('/api/parquet-get', async (c) => {
		try {

			// Input
			const file = await c.req.blob();

			let filepath = `database/${file}.parquet`;

			// Đọc file
			const fileParquet = await hyparquet.asyncBufferFromFile(filepath);

			// Read struct
			const data = await hyparquet.parquetReadObjects({ file: fileParquet });

			// Return
			return c.json({ success: true, result: data });
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
}