@echo off
setlocal enabledelayedexpansion

:load_env
if "%~1"=="" goto no_command
if "%~1"=="--" goto prepare_command

echo Attempting to load: %~1
if exist "%~1" (
    for /f "usebackq tokens=1,* delims==" %%A in ("%~1") do (
        set "%%A=%%B"
        echo Loaded: %%A=%%B
    )
) else (
    echo File not found: %~1
)

shift
goto load_env

:prepare_command
shift
set command_line=
:build_command
if "%~1"=="" goto execute_command
set "arg=%~1"
if "!arg!"=="--" goto execute_command

set "command_line=!command_line! "!arg!""

shift
goto build_command

:execute_command
echo Running command: %command_line%
call %command_line%
goto :eof

:no_command
echo No command specified.
