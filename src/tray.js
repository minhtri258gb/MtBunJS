import { createTray } from 'tray-hook';

import hiddenConsole from './utils/hideConsole';

// https://www.npmjs.com/package/tray-hook

export default async function trayicon() {

	const tray = createTray();

	// Bind Global
	globalThis.tray = tray;

	// Start
	await tray.start();

	// Icon
	await tray.setIcon('./res/icons/logo.ico');

	// Tooltip
	await tray.setTooltip('MtBunJS');

	// Menu
	await tray.setMenu([
		{ type: 'item', id: 'open', title: 'Open' },
		{ type: 'check', id: 'dark', title: 'Dark Mode', checked: false },
		{ type: 'check', id: 'hideconsole', title: 'Hide Console', checked: true },
		{ type: 'separator', id: 'sep-1' },
		{ type: 'submenu', id: 'more', title: 'More', items: [
			{ type: 'item', id: 'about', title: 'About' }
		]},
		{ type: 'item', id: 'quit', title: 'Quit' }
	]);

	// Event
	tray.on('click', async (id) => {
		switch (id) {
			case 'open':
				Bun.spawn([
					'cmd.exe', '/c',
					'start', `http://localhost:${process.env.PORT}`
				], {
					stdout: 'ignore',
					stderr: 'ignore',
					stdin: 'ignore',
					detached: true
				});
				break;
			case 'quit': // Tắt Server
				tray.quit(); // Dừng Tray
				await server.stop(); // Dừng Elysia
				process.exit(0); // Dừng cmd
				break;
		}
	});
	tray.on('check', (id, checked) => {
		switch (id) {
			case 'hideconsole':
				hiddenConsole(checked);
				break;
		}
	});

}