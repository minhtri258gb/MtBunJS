import * as sqlite from 'bun:sqlite';
import * as duckdb from 'duckdb-async';
import * as hyparquet from 'hyparquet';

export default function registerLibrary() {
	globalThis.lib = {
		hono: { }, // HTTP Server
		sqlite, // Database SQLite
		duckdb, // Database DuckDB
		hyparquet, // file parquet
	};
}
