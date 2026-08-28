@echo off

if not defined WT_SESSION (
  start wt nt -p "Command Prompt" -d . "%~f0"
  exit
)

title BUNDLE

cd ..

echo ====== Config ======================================================================
set PATH_PUBLIC=D:/Projects/MtClient

echo ====== Clean =======================================================================
rd /s /q "dist"
del /f /q "server.7z"
mkdir dist

echo ====== Build =======================================================================
:: bun run src/build.js
call bun build ./src/main.js ^
	--compile ^
	--outfile dist/server.exe ^
	--bundle ^
	--minify

echo ====== Resource Server =============================================================
xcopy /E /I /Y /Q "database" "dist\database"
xcopy /E /I /Y /Q "plugin" "dist\plugin"
xcopy /E /I /Y /Q "res" "dist\res"

xcopy /E /I /Y /Q "node_modules\@phtdacosta" "dist\node_modules\@phtdacosta"

xcopy /Y /Q ".env.example" "dist\"
xcopy /Y /I /Q "tools\HiddenConsole.exe" "dist\tools\"

echo ====== Resource Client =============================================================
xcopy /E /I /Y /Q "%PATH_PUBLIC%\common" "dist\public\common"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\home" "dist\public\home"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\document" "dist\public\document"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\server" "dist\public\server"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\logs" "dist\public\logs"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\task" "dist\public\task"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\diagram" "dist\public\diagram"

xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\codemirror5-5.65.18" "dist\public\lib\codemirror5-5.65.18"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\dompdf.js-2.0.0" "dist\public\lib\dompdf.js-2.0.0"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\easymde-2.21.0" "dist\public\lib\easymde-2.21.0"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\fontawesome-6.7.2" "dist\public\lib\fontawesome-6.7.2"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\gridstack-12.3.3" "dist\public\lib\gridstack-12.3.3"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\highlightjs" "dist\public\lib\highlightjs"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\jquery" "dist\public\lib\jquery"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\json-editor-2.15.2" "dist\public\lib\json-editor-2.15.2"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\jstree-3.3.17" "dist\public\lib\jstree-3.3.17"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\markdown-it" "dist\public\lib\markdown-it"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\mermaid-11.12.2" "dist\public\lib\mermaid-11.12.2"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\mt" "dist\public\lib\mt"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\panzoom-9.4.4" "dist\public\lib\panzoom-9.4.4"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\sweetalert2-11.22.4" "dist\public\lib\sweetalert2-11.22.4"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\tabulator-6.3" "dist\public\lib\tabulator-6.3"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\tingle" "dist\public\lib\tingle"
xcopy /E /I /Y /Q "%PATH_PUBLIC%\lib\toastify-js-1.12.0" "dist\public\lib\toastify-js-1.12.0"

xcopy /E /I /Y /Q "%PATH_PUBLIC%\res\icons" "dist\public\res\icons"

xcopy /Y /I /Q "%PATH_PUBLIC%\favicon.ico" "dist\public\"
xcopy /Y /I /Q "%PATH_PUBLIC%\index.html" "dist\public\"

echo ====== Bundle ======================================================================
cd dist
call 7z a "..\server.7z" * -m0=lzma2 -mx=9 -ms=on
cd ..

pause
:: timeout /t 5