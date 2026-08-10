export default function() {

	// Define API
	app.post('/api/cmd', async (c) => {
		try {

			// Check Permission
			if (!auth.check(c))
				return c.text(ex.message, 403);

			const body = await c.req.json();
			let { cmd, args, cwd, paths } = body;

			if (paths == null)
				paths = [];
			if (cmd == null || cmd.length == 0)
				return c.text('Không tìm thấy lệnh', 400);

			// Sử dụng Bun.spawn để thực thi lệnh hệ thống dưới dạng non-blocking
			const childProcess = Bun.spawn([cmd, ...(args || [])], {
				stdout: 'pipe', stderr: 'pipe',
				cwd,
				env: {
					...process.env,
					PATH: `${process.env.PATH || ''};${paths.join(';')}`
				}
			});

			// Chờ lệnh chạy xong và đọc luồng dữ liệu (stdout/stderr)
			// Đợi mã thoát (exit code) từ hệ thống (0 là thành công)
			const stdout = await new Response(childProcess.stdout).text();
			const stderr = await new Response(childProcess.stderr).text();
			const exitCode = await childProcess.exited;

			// Return
			return c.json({ exit: exitCode, output: stdout.trim(), error: stderr.trim() });
		}
		catch (ex) {
			return c.text(ex.message, 500);
		}
	});

}