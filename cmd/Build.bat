@echo off

if not defined WT_SESSION (
  start wt nt -p "Command Prompt" -d . "%~f0"
  exit
)

title Build

cd ..

:: bun run src/build.js
call bun build ./src/main.js ^
	--compile ^
	--outfile dist/server.exe ^
	--bundle ^
	--minify

::	--external=duckdb-async

pause
:: timeout /t 5