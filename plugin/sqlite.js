import { Database } from 'bun:sqlite';

export default function() {

	// Reference
	let t = lib.elysia.t;

	// Define API
	server.post('/api/sqlite-run', async ({ request, body, set }) => {
		try {

			// Check Permission
			if (!auth.check(request)) {
				set.status = 403;
				return { success: false, error: ex.message };
			}

			// Input
			let { database, sql } = body;

			// Validate
			if (database.length == 0) {
				set.status = 400;
				return 'Missing body: database';
			}
			if (sql.length == 0) {
				set.status = 400;
				return 'Missing body: sql';
			}

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

			if (errorMessage.length > 0) {
				set.status = 400;
				return errorMessage;
			}

			// Return
			return true;
		}
		catch (ex) {
			set.status = 500;
			return { success: false, error: `Không thể thực thi lệnh: ${ex.message}` };
		}
	});
	server.post('/api/sqlite-query', async ({ body, set }) => {
		try {

			// Input
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