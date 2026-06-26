@echo off

title BUILD

cd ..

bun build --compile src/main.js --outfile server

timeout /t 5