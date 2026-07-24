@echo off

if not defined WT_SESSION (
  start wt nt -p "Command Prompt" -d . "%~f0"
  exit
)

title SERVER_BUN

cd ..

bun run src/main.js

pause