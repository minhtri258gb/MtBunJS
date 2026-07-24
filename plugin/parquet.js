export default function() {

	// Reference
	let hyparquet = lib.hyparquet;

	// Define API
	server.post('/api/parquet-get', async ({ body, set }) => {
		try {

			// Input
			const { file } = body;

			let filepath = `database/${file}.parquet`;

			// Đọc file
			const fileParquet = await hyparquet.asyncBufferFromFile(filepath);

			// Read struct
			const data = await hyparquet.parquetReadObjects({ file: fileParquet });

			// Return
			return { success: true, result: data };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, message: ex.message };
		}
	});
}