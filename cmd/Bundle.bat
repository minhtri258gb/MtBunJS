@echo off

title BUNDLE

cd ..

mklink /J "public" "D:\Projects\MtClient"

call 7z a -t7z -mx=9 "server.7z" ^
    "node_modules\@phtdacosta" ^
    "plugin" ^
    "public\common" ^
    "public\document" ^
    "public\lib\fontawesome-6.7.2" ^
    "public\lib\highlightjs" ^
    "public\lib\jquery" ^
    "public\lib\jstree-3.3.17" ^
    "public\lib\markdown-it" ^
    "public\lib\mermaid-11.12.2" ^
    "res" ^
    "tools" ^
    ".env" ^
    "package.json" ^
    "server.exe"

rmdir "public"

pause