export default function initAuthn() {
	globalThis.auth = {
		check(c) {

			// Nếu từ localhost thì là admin
			const url = new URL(c.env.url);
			const hostname = url.hostname;
			return (
				hostname === 'localhost'
				|| hostname === '127.0.0.1'
				|| hostname === '::1'
				|| hostname === '0.0.0.0'
			);
		}
	};
}
