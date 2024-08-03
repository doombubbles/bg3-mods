set -e

VERSION="1.0.0.$(($(git rev-list --count HEAD) + 1))"
MODNAME=$(basename "$(pwd)")
BUILD="./build/$MODNAME"
RESULT="./output/$MODNAME.pak"
DESTINATION="$LOCALAPPDATA/Larian Studios/Baldur's Gate 3/Mods/$MODNAME.pak"

# Process Templates
bin/ProcessTemplates.exe -s "$MODNAME" -d "$BUILD" -r build/values.yaml

# Build Mod
bg3-modders-multitool.exe -s "$BUILD" -d "$RESULT" -c "1" -v "$VERSION"

cp "$BUILD/mods/$MODNAME/meta.lsx" "./$MODNAME/mods/$MODNAME/meta.lsx"

cp "$RESULT" "$DESTINATION" && echo "Build Complete for $MODNAME $VERSION $DESTINATION" || echo "Build Complete for $MODNAME $VERSION $RESULT"

# Unpack to Output
rm -rf ./output/$MODNAME
bg3-modders-multitool.exe -s "$RESULT" -d "./output"

mv "$(find "./output/$MODNAME/Localization/English" -iname *.loca.xml)" "./output/$MODNAME/Localization/English/$MODNAME.loca.xml"