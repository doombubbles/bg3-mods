COMMITS=$(git rev-list --count HEAD)
VERSION=1.0.0.$((COMMITS+1))

echo Mod Version $VERSION

bg3-modders-multitool.exe -s "./DoombubblesTweaks" -d "$LOCALAPPDATA\Larian Studios\Baldur's Gate 3\Mods\DoombubblesTweaks.pak" -c "1" -v "$VERSION"