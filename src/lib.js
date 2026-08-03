import { t } from 'elysia';
import * as sqlite from 'bun:sqlite';
// import * as duckdb from '@duckdb/node-api';
import * as hyparquet from 'hyparquet';

export default function registerLibrary() {
	globalThis.lib = {
		elysia: { t }, // HTTP Server
		sqlite, // Database SQLite
		// duckdb, // Database DuckDB
		hyparquet, // file parquet
	};
}
