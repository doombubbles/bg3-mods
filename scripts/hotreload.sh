set -e

MODNAME=$(basename "$(pwd)")
DATA_DIR="output/$MODNAME/Public/$MODNAME/Stats/Generated/Data"
FILE=$(basename "$1")

bin/ProcessTemplates.exe -s "$1" -d "$DATA_DIR" -v "$MODNAME"

if ! grep -Fxq "$FILE" "$DATA_DIR/__HotReload.txt"; then
    echo "$FILE" >> "$DATA_DIR/__HotReload.txt"
fi

cd scripts && node lua-debugger-exec.js ../bin/DebugAdapter/LuaDebugger.exe payloads/initalize.json payloads/launch.json payloads/reset.json payloads/disconnect.json