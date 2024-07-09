VERSION=1.0.0.$(($(git rev-list --count HEAD)+1))
MODNAME=$(basename "$(pwd)")

# Process Templates
bin/ProcessTemplates.exe

# Build Mod
bg3-modders-multitool.exe -s "./build/$MODNAME" -d "$LOCALAPPDATA/Larian Studios/Baldur's Gate 3/Mods/$MODNAME.pak" -c "1" -v "$VERSION"

cp "./build/$MODNAME/mods/$MODNAME/meta.lsx" "./$MODNAME/mods/$MODNAME/meta.lsx"

echo "Build Complete for $MODNAME $VERSION $LOCALAPPDATA/Larian Studios/Baldur's Gate 3/Mods/$MODNAME.pak"