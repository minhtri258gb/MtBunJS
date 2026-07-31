export default function() {

	// Reference
	let t = lib.elysia.t;

	// Define API
	server.post('/api/cmd', async ({ request, body, set }) => {
		try {

			// Check Permission
			if (!auth.check(request)) {
				set.status = 403;
				return ex.message;
			}

			let { cmd, args, cwd, paths } = body;

			if (paths == null)
				paths = [];
			if (cmd == null || cmd.length == 0) {
				set.status = 400;
				return 'Không tìm thấy lệnh';
			}

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
			return { exit: exitCode, output: stdout.trim(), error: stderr.trim() };
		}
		catch (ex) {
			set.status = 500;
			return `Không thể thực thi lệnh: ${ex.message}`;
		}
	});
	// , {
	// 	// Validate dữ liệu đầu vào bằng TypeBox của Elysia
	// 	body: t.Object({
	// 		paths: t.Optional(t.Array(t.String())),
	// 		cmd: t.String({ error: 'Command phải là một chuỗi ký tự' }),
	// 		args: t.Optional(t.Array(t.String())),
	// 		cwd: t.String()
	// 	})
	// }

}