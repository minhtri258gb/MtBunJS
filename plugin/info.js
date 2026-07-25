import { networkInterfaces } from 'os';

export default function() {

	// Define API
	server.get('/api/info-ip', async ({ set }) => {
		try {

			let nets = networkInterfaces();

			let networkName = nets['Wi-Fi'];
			if (!networkName)
				networkName = nets['Ethernet'];

			if (networkName) {
				for (let net of networkName) {
					const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
					if (net.family === familyV4Value && !net.internal) {

						// Retuen found
						return net.address;
					}
				}
			}

			// Retuen not found
			set.status = 400;
			return 'IP not found';
		}
		catch (ex) {
			set.status = 500;
			return `Không thể thực thi lệnh: ${ex.message}`;
		}
	});
}