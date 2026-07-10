import { t } from 'elysia';
import * as duckdb from '@duckdb/node-api';

export default function registerLibrary() {
	globalThis.lib = {
		elysia: { t }, // HTTP Server
		duckdb, // Database DuckDB
	};
}
