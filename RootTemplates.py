import xml.etree.ElementTree as ET
from xml.dom import minidom

elixirs = [
    "ALCH_Solution_Elixir_Alertness",
    "ALCH_Solution_Elixir_ArcaneAcuity",
    "ALCH_Solution_Elixir_Bloodlust",
    "ALCH_Solution_Elixir_Barkskin",
    "ALCH_Solution_Elixir_Concentration",
    "ALCH_Solution_Elixir_Criticals",
    "ALCH_Solution_Elixir_Darkvision",
    "ALCH_Solution_Elixir_Enlarge",
    "ALCH_Solution_Elixir_Freedom",
    # "ALCH_Solution_Elixir_Meditation",
    # "ALCH_Solution_Elixir_Meditation_Greater",
    # "ALCH_Solution_Elixir_Meditation_Superior",
    # "ALCH_Solution_Elixir_Meditation_Supreme",
    "ALCH_Solution_Elixir_SeeInvisible",
    "ALCH_Solution_Elixir_Tadpole",
    "OBJ_Potion_Of_Hill_Giant_Strength",
    "OBJ_Potion_Of_Cloud_Giant_Strength",
    "OBJ_Potion_Of_Heroism",
    "OBJ_Potion_Of_Acid_Resistance",
    "OBJ_Potion_Of_Poison_Resistance",
    "OBJ_Potion_Of_Fire_Resistance",
    "OBJ_Potion_Of_Cold_Resistance",
    "OBJ_Potion_Of_Lightning_Resistance",
    "OBJ_Potion_Of_Thunder_Resistance",
    "OBJ_Potion_Of_Force_Resistance",
    "OBJ_Potion_Of_Psychic_Resistance",
    "OBJ_Potion_Of_Necrotic_Resistance",
    "OBJ_Potion_Of_Radiant_Resistance",
    "OBJ_BloodPotion_HalfOrc",
    "OBJ_BloodPotion_Human",
    "OBJ_BloodPotion_Halfing",
    "OBJ_BloodPotion_Gnome",
    "OBJ_BloodPotion_Dwarf",
    "OBJ_BloodPotion_Elf",
    "OBJ_BloodPotion_Tiefling",
    # "OBJ_BloodPotion_HalfElf",
    "OBJ_BloodPotion_Githyanki",
    "OBJ_BloodPotion_Dragonborn_Fire",
    "OBJ_BloodPotion_Dragonborn_Ice",
    "OBJ_BloodPotion_Dragonborn_Lightning",
    "OBJ_BloodPotion_Dragonborn_Acid",
    "OBJ_BloodPotion_Dragonborn_Poison",
    "OBJ_Potion_Of_Animal_Speaking",
    # Oils #
    "ALCH_Solution_Oil_AttackBuff",
    "ALCH_Solution_Oil_Bane",
    "ALCH_Solution_Oil_Combustion",
    "ALCH_Solution_Oil_DamageAttackBuff",
    "ALCH_Solution_Oil_Frost",
    "ALCH_Solution_Oil_Reduce",
    "ALCH_Solution_Oil_RemoveResistanceFire",
    "ALCH_Solution_Oil_Wizardsbane",
]

input = [
    "C:/Users/jpgale/Downloads/bg3-modders-multitool/UnpackedData/Shared/Public/Shared/RootTemplates/_merged.lsf.lsx",
    "C:/Users/jpgale/Downloads/bg3-modders-multitool/UnpackedData/Shared/Public/SharedDev/RootTemplates/_merged.lsf.lsx",
    "C:/Users/jpgale/Downloads/bg3-modders-multitool/UnpackedData/Gustav/Public/Gustav/RootTemplates/_merged.lsf.lsx",
    "C:/Users/jpgale/Downloads/bg3-modders-multitool/UnpackedData/Gustav/Public/GustavDev/RootTemplates/_merged.lsf.lsx",
]

output_dir = "./DoombubblesTweaks/Public/DoombubblesTweaks/RootTemplates/"
files = {"merged.lsf.lsx": "310", "_merged.lsf.lsx": "328"}

game_objects = []

for xml_file in input:
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Search for the specific nodes with the given attributes
    for game_object in root.findall(".//node[@id='GameObjects']"):
        stats_attribute = game_object.find("./attribute[@id='Stats']")
        if stats_attribute is not None and stats_attribute.get("value") in elixirs:
            # Find the 'Consume' attribute and change its value
            consume_attribute = game_object.find(
                ".//node[@id='OnUsePeaceActions']//node[@id='Attributes']/attribute[@id='Consume']"
            )
            if consume_attribute is not None:
                consume_attribute.set("value", "False")
                game_objects.append(game_object)

assert len(game_objects) >= len(elixirs)

# Create the root and structure for the new XML
new_root = ET.Element("save")
version = ET.SubElement(
    new_root,
    "version",
    major="4",
    minor="0",
    revision="9",
    build="BUILD",
    lslib_meta="v1,bswap_guids",
)
region = ET.SubElement(new_root, "region", id="Templates")
templates_node = ET.SubElement(region, "node", id="Templates")
children = ET.SubElement(templates_node, "children")

# Add all modified nodes
for node in game_objects:
    children.append(node)

for name, build in files.items():
    version.set("build", build)
    # Write to the output XML file
    xml_str = ET.tostring(new_root, "utf-8", xml_declaration=True)
    pretty_xml_as_string = minidom.parseString(xml_str).toprettyxml(indent="    ")
    pretty_xml_as_string = "\n".join(
        [line for line in pretty_xml_as_string.split("\n") if line.strip()]
    )

    with open(output_dir + name, "w") as file:
        file.write(pretty_xml_as_string)
