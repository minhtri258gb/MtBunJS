import { spawn } from 'bun';

export default function hiddenConsole(toggle) {
	spawn({
		cmd: ['./tools/HiddenConsole.exe', toggle ? '1' : '0'],
		stdio: ['inherit', 'inherit', 'inherit'],
		// detached: true, // Chạy độc lập với tiến trình cha
		// windowsHide: true, // Ẩn cửa sổ của tiến trình con trên Windows
	});
}