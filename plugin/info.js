import { networkInterfaces } from 'os';

export default function() {

	// Define API
	app.get('/api/info-ip', async (c) => {
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
						return c.text(net.address);
					}
				}
			}

			// Retuen not found
			return c.text('IP not found', 400);
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});
}