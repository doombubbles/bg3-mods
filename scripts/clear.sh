set -e

BG3_DATA="C:/Program Files (x86)/Steam/steamapps/common/Baldurs Gate 3/Data"

# Loop through all .pak files in the ./output folder
for pak_file in ./output/*.pak; do
  # Extract the MODNAME from the file name (without the .pak extension)
  MODNAME=$(basename "$pak_file" .pak)

  # Perform the removal for each mod name
  rm -rf "$BG3_DATA/Generated/$MODNAME"
  rm -rf "$BG3_DATA/Mods/$MODNAME"
  rm -rf "$BG3_DATA/Public/$MODNAME"
done


echo "Cleared!"