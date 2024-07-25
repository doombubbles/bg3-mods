@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: URL of the zip file
SET "zipUrl=https://nightly.link/doombubbles/DoombubblesTweaks/workflows/build/main/DoombubblesTweaks.zip?h=0026dcf0a7001936a2d5d20ad84ef1244895aa81"

:: Destination directory relative to the user's AppData
SET "destDir=%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods"

:: Temporary file name for the downloaded zip
SET "tempZip=%TEMP%\DoombubblesTweaks.zip"

SET "fileToModify=%destDir%\DoombubblesTweaks.pak"

echo Downloading from %zipUrl%...

:: Use PowerShell to download the file
powershell -command "(New-Object Net.WebClient).DownloadFile(\"%zipUrl%\", \"%tempZip%\")"
IF %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

:: Check if destination directory exists, if not create it
IF NOT EXIST "%destDir%" (
    echo Creating directory %destDir%...
    mkdir "%destDir%"
    IF %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%
)

echo Extracting to %destDir%...
:: Use PowerShell to extract the zip file
powershell -command "Expand-Archive -LiteralPath \"%tempZip%\" -DestinationPath \"%destDir%\" -Force"
IF %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

:: Fix date modified
powershell -command "(Get-Item \"%fileToModify%\").LastWriteTime = [System.DateTime]::SpecifyKind((Get-Item \"%fileToModify%\").LastWriteTime, [System.DateTimeKind]::Utc).ToLocalTime()"
IF %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

echo Cleaning up...
:: Remove the downloaded zip file
del "%tempZip%"
IF %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

powershell -command "echo ('The mod was last updated ' + (Get-Item \"%fileToModify%\").LastWriteTime.ToString('MMMM d, yyyy \a\t h:mm tt'))"
IF %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

ENDLOCAL
echo Done!

if ["%~1"]==[""] (
    pause
)
