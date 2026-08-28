export default function() {

	// Reference
	let duckdb = lib.duckdb;

	// Define API
	app.post('/api/duckdb-run', async (c) => {
		try {

			// Check Permission
			if (!auth.check(c))
				return c.text('Bạn không có quyền thực hiện thao tác này!', 403);

			// Input
			let { database, sql } = await c.req.json();

			// Validate
			if (database.length == 0)
				return c.text('Missing body: database', 400);
			if (sql.length == 0)
				return c.text('Missing body: sql', 400);

			// Ref
			let duckdb = lib.duckdb;

			// Run DuckDB
			const db = await duckdb.Database.create(`database/${database}.duckdb`);

			let errorMessage = '';
			try {
				await db.run(sql);
			}
			catch (ex) {
				errorMessage = ex.message;
			}
			finally {
				db.close();
			}

			if (errorMessage.length > 0)
				return c.text(errorMessage, 400);

			// Return
			return c.text('success');
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
	app.post('/api/duckdb-query', async (c) => {
		try {

			// Input
			let { database, sql } = await c.req.json();

			// Validate
			if (database.length == 0)
				return c.text('Missing body: database', 400);
			if (sql.length == 0)
				return c.text('Missing body: sql', 400);

			// Ref
			let duckdb = lib.duckdb;

			// Use DuckDB
			const db = new duckdb.Database(`database/${database}.duckdb`);
			const conn = db.connect();

			let rows = [], errorMessage = '';
			try {
				rows = await new Promise((resolve, reject) => {
					conn.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
				});
			}
			catch (ex) {
				errorMessage = ex.message;
			}
			finally {
				conn.close();
			}

			if (errorMessage.length > 0)
				return c.text(errorMessage, 400);

			// Return
			return c.json(rows);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
}