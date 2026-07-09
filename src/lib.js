import { t } from 'elysia';
import duckdb from '@duckdb/node-api';

export default function registerLibrary() {
	globalThis.lib = {
		elysia: { t }, // HTTP Server
		duckdb, // Database DuckDB
	};
}
