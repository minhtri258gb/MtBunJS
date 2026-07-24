import { t } from 'elysia';
// import * as duckdb from '@duckdb/node-api';
import * as hyparquet from 'hyparquet';

export default function registerLibrary() {
	globalThis.lib = {
		elysia: { t }, // HTTP Server
		// duckdb, // Database DuckDB
		hyparquet, // file parquet
	};
}
