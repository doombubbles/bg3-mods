@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: URL of the zip file
SET "zipUrl=https://nightly.link/doombubbles/DoombubblesTweaks/workflows/build/main/DoombubblesTweaks.zip?h=0026dcf0a7001936a2d5d20ad84ef1244895aa81"

:: Destination directory relative to the user's AppData
SET "destDir=%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods"

:: Temporary file name for the downloaded zip
SET "tempZip=%TEMP%\DoomBubblesTweaks.zip"

echo Downloading file from %zipUrl%...

:: Use PowerShell to download the file
powershell -command "(New-Object Net.WebClient).DownloadFile(\"%zipUrl%\", \"%tempZip%\")"

:: Check if destination directory exists, if not create it
IF NOT EXIST "%destDir%" (
    echo Creating directory %destDir%...
    mkdir "%destDir%"
)

echo Extracting the file to %destDir%...
:: Use PowerShell to extract the zip file
powershell -command "Expand-Archive -LiteralPath \"%tempZip%\" -DestinationPath \"%destDir%\" -Force"

echo Cleaning up zip file...
:: Remove the downloaded zip file
del "%tempZip%"

ENDLOCAL
echo Done.
pause
