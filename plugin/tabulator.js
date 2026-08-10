import { readdir, exists, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

export default function() {

	// Define API
	app.post('/api/tabulator-sqlite', async (c) => {
		try {

			const body = await c.req.json();
			let { database, select, from, where, size, page, sort, filter } = body;

			// Reference
			let sqlite = lib.sqlite;

			// Validate
			if (!database || database.length == 0) 
				return c.text('Missing body: database', 400);
			if (from.length == 0)
				return c.text('Missing body: from', 400);

			// Process input
			let dbPath = `database/${database}.sqlite`;
			if (select.length == 0)
				select = '*';
			if (where.length == 0)
				where = '1=1';
			if (sort.length == 0)
				sort.push({field: 'id', dir: 'desc'});

			let isPaging = (size > 0 && page > 0);

			// Build Sort
			let sqlSort = '';
			for (let field of sort)
				sqlSort += ',' + field.field + ' ' + field.dir;
			sqlSort = sqlSort.substring(1);

			// Build Condition
			let sqlCond = where;

			if (filter.length > 0) {
				for (let field of filter) {

					// {"field": "name", "type": "like", "value": "ishura"}
					if (field.type == 'like')
						sqlCond += ` AND ${field.field} LIKE "%${field.value}%"`;
				}
			}

			// Build Query
			let sql = `
				SELECT ${select}
				FROM ${from}
				WHERE ${sqlCond}
				ORDER BY ${sqlSort}
				${isPaging ? 'LIMIT ' + (size * (page - 1)) + ', ' + size : ''}
			`.trim();

			// Build Query Count
			let sqlCount = `SELECT COUNT(1) as total FROM ${from} WHERE ${sqlCond}`;

			// Run Database
			let count = null;
			const db = new sqlite.Database(dbPath);
			let query = db.query(sql); // query
			let data = query.all();
			if (isPaging) {
				let queryCount = db.query(sqlCount);
				count = queryCount.get();
			}
			db.close(false);

			// Check Error
			if (data.error) {
				data.error.sql = sql;
				data.error.database = dbPath;
				data.error.msg = data.error.message;
			}

			// Return
			if (isPaging) {
				let total = count?.total || 0;
				let maxPage = Math.ceil(total / size);
				return c.json({ data, last_page: maxPage });
			}
			else
				return data;
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
}