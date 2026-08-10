import { Database } from 'bun:sqlite';

export default function() {

	// Define API
	app.post('/api/sqlite-run', async (c) => {
		try {

			// Check Permission
			if (!auth.check(request))
				return c.json({ success: false, error: ex.message }, 403);

			// Input
			const body = await c.req.json();
			let { database, sql } = body;

			// Validate
			if (database.length == 0)
				return c.text('Missing body: database', 400);
			if (sql.length == 0)
				return c.text('Missing body: sql', 400);

			// Use DuckDB
			const db = new Database(`database/${database}.sqlite`);
			let errorMessage = '';
			try {
				db.run(sql);
			}
			catch (ex) {
				errorMessage = ex.message;
			}
			finally {
				db.close(false);
			}

			if (errorMessage.length > 0)
				return c.text(errorMessage, 400);

			// Return
			return c.json(true);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
	app.post('/api/sqlite-query', async (c) => {
		try {

			// Input
			const body = await c.req.json();
			let { database, sql } = body;

			// Ref
			// let duckdb = globalThis.lib.duckdb;

			// Use DuckDB
			const db = new Database(`database/${database}.db`, { readonly: true });
			let rowObjects = null, errorMessage = '';
			try {
				using query = db.query(sql);
				const reader = await connection.runAndReadAll(sql);
				rowObjects = query.get();
			}
			catch (ex) {
				errorMessage = ex.message;
			}
			finally {
				db.close(false);
			}

			if (errorMessage.length > 0)
				return c.text(errorMessage, 400);

			// Return
			return c.json(rowObjects);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
}