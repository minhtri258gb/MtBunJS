export default function (app) {

	// Reference
	let t = globalThis.lib.elysia.t;

	// Define API
	app.get('/api/duckdb-info', async ({ set }) => {
		try {

			// Ref
			let duckdb = globalThis.lib.duckdb;

			let version = duckdb.version();
			let config = duckdb.configurationOptionDescriptions();

			// Return
			return { success: true, result: { version, config } };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, error: `Không thể thực thi lệnh: ${ex.message}` };
		}
	});
	app.post('/api/duckdb-run', async ({ body, set }) => {
		try {

			// Input
			let { database, sql } = body;

			// Ref
			let duckdb = globalThis.lib.duckdb;

			// Run DuckDB
			const instance = await duckdb.DuckDBInstance.create(database);
			const connection = await instance.connect();
			let rowCount = null, errorMessage = '';
			try {
				let resultQuery = await connection.run(sql);
				rowCount = resultQuery.rowCount;
			}
			catch (ex) {
				errorMessage = ex.message;
			}
			finally {
				connection.closeSync();
				instance.closeSync();
			}

			if (errorMessage.length > 0)
				return { success: false, message: errorMessage };

			// Return
			return { success: true, result: { rowCount } };
		}
		catch (ex) {
			set.status = 500;
			return {
				success: false,
				error: `Không thể thực thi lệnh: ${ex.message}`
			};
		}
	});
	app.post('/api/duckdb-query', async ({ body, set }) => {
		try {

			// Input
			let { database, sql } = body;

			// Ref
			let duckdb = globalThis.lib.duckdb;

			// Use DuckDB
			const instance = await duckdb.DuckDBInstance.create(database);
			const connection = await instance.connect();
			let rowObjects = null, errorMessage = '';
			try {
				const reader = await connection.runAndReadAll(sql);
				// const rows = reader.getRows();
				rowObjects = reader.getRowObjects();
				// const columns = reader.getColumns();
				// const columnsObject = reader.getColumnsObject();
			}
			catch (ex) {
				errorMessage = ex.message;
			}
			finally {
				connection.closeSync();
				instance.closeSync();
			}

			if (errorMessage.length > 0)
				return { success: false, message: errorMessage };

			// Return
			return { success: true, result: rowObjects };
		}
		catch (ex) {
			set.status = 500;
			return { success: false, error: `Không thể thực thi lệnh: ${ex.message}` };
		}
	});
}