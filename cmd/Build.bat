@echo off

title BUILD

set PATH=D:\Apps\bun-baseline;%PATH%

cd ..

:: bun run src/build.js
bun build ./src/main.js --compile --outfile server.exe

echo Hoan thanh.

pause
:: timeout /t 5