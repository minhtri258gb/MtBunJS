import { t } from 'elysia';

export default function (app) {
	app.post('/api/cmd', async ({ body, set }) => {
		try {
			let { paths, command, args, cwd } = body;

			if (paths == null)
				paths = [];

			// Sử dụng Bun.spawn để thực thi lệnh hệ thống dưới dạng non-blocking
			const childProcess = Bun.spawn([command, ...(args || [])], {
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

			return {
				success: true,
				exit: exitCode,
				output: stdout.trim(),
				error: stderr.trim(),
			};
		}
		catch (ex) {
			set.status = 500;
			return {
				success: false,
				error: `Không thể thực thi lệnh: ${ex.message}`
			};
		}
	}, {
		// Validate dữ liệu đầu vào bằng TypeBox của Elysia
		body: t.Object({
			paths: t.Optional(t.Array(t.String())),
			command: t.String({ error: 'Command phải là một chuỗi ký tự' }),
			args: t.Optional(t.Array(t.String())),
			cwd: t.String()
		})
	});

}