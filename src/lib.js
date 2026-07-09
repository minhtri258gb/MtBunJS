import { t } from 'elysia';
import duckdb from '@duckdb/node-api';

export default async function registerLibrary() {
	globalThis.lib = {
		elysia: { t },
		duckdb,
	};
}
