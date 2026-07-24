@echo off

if not defined WT_SESSION (
  start wt nt -p "Command Prompt" -d . "%~f0"
  exit
)

title BUILD

cd ..

bun run src/build.js

timeout /t 5