import xml.etree.ElementTree as ET
from xml.dom import minidom

input = [
    "C:/Program Files/bg3-modders-multitool/UnpackedData/Shared/Public/Shared/RootTemplates/_merged.lsf.lsx",
    "C:/Program Files/bg3-modders-multitool/UnpackedData/Shared/Public/SharedDev/RootTemplates/_merged.lsf.lsx",
    "C:/Program Files/bg3-modders-multitool/UnpackedData/Gustav/Public/Gustav/RootTemplates/_merged.lsf.lsx",
    "C:/Program Files/bg3-modders-multitool/UnpackedData/Gustav/Public/GustavDev/RootTemplates/_merged.lsf.lsx",
]

output = "./DoombubblesTweaks/Public/DoombubblesTweaks/RootTemplates/Items/Combos.lsf.lsx"

combos = {
    "MAG_Warlock_Quickened_Gloves": 3,
    "MAG_Warlock_Twinned_Gloves": 3,
    "MAG_Arcanist_Gloves": 3,
    "MAG_Fire_HeatOnFireDamage_Gloves": 2,
    "MAG_Frost_GenerateFrostOnDamage_Gloves": 2,
    "MAG_Cold_IncreaseColdDamageOnCast_Staff": 2,
    "MAG_FlamingFist_StaffOfFire": 2,
    "MAG_Frost_GenerateFrostOnStatusApply_Hat": 2,
    "MAG_Fire_ArcaneAcuityOnFireDamage_Hat": 2
}


game_objects = []

for xml_file in input:
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Search for the specific nodes with the given attributes
    for game_object in root.findall(".//node[@id='GameObjects']"):
        stats_attribute = game_object.find("./attribute[@id='Stats']")
        if (
            stats_attribute is not None
            and stats_attribute.get("value") in combos.keys()
        ):
            # Find the 'children' node of the 'GameObjects' node
            game_objects_children = game_object.find("./children")

            # Check if 'OnUsePeaceActions' node already exists under 'GameObjects' children
            on_use_peace_actions = game_objects_children.find(
                "./node[@id='OnUsePeaceActions']"
            )

            # If 'OnUsePeaceActions' does not exist, create it
            if on_use_peace_actions is None:
                on_use_peace_actions = ET.SubElement(
                    game_objects_children, "node", id="OnUsePeaceActions"
                )
                ET.SubElement(on_use_peace_actions, "children")

            # Now 'on_use_peace_actions' definitely exists, add a new 'Action' node to it
            new_action_node = ET.SubElement(
                on_use_peace_actions.find("./children"), "node", id="Action"
            )
            ET.SubElement(
                new_action_node, "attribute", id="ActionType", type="int32", value="23"
            )
            new_attributes_node = ET.SubElement(new_action_node, "children")
            new_attributes = ET.SubElement(new_attributes_node, "node", id="Attributes")
            ET.SubElement(
                new_attributes,
                "attribute",
                id="Animation",
                type="FixedString",
                value="",
            )
            ET.SubElement(
                new_attributes,
                "attribute",
                id="CombineSlots",
                type="int8",
                value=str(combos[stats_attribute.get("value")]),
            )
            ET.SubElement(
                new_attributes, "attribute", id="IsBase", type="bool", value="True"
            )

            game_objects.append(game_object)


assert len(game_objects) >= len(combos)

# Create the root and structure for the new XML
new_root = ET.Element("save")
version = ET.SubElement(
    new_root,
    "version",
    major="4",
    minor="0",
    revision="6",
    build="5",
    lslib_meta="v1,bswap_guids",
)
region = ET.SubElement(new_root, "region", id="Templates")
templates_node = ET.SubElement(region, "node", id="Templates")
children = ET.SubElement(templates_node, "children")

# Add all modified nodes
for node in game_objects:
    children.append(node)

# Write to the output XML file
xml_str = ET.tostring(new_root, "utf-8", xml_declaration=True)
pretty_xml_as_string = minidom.parseString(xml_str).toprettyxml(indent="  ")
pretty_xml_as_string = "\n".join(
    [line for line in pretty_xml_as_string.split("\n") if line.strip()]
)

with open(output, "w") as file:
    file.write(pretty_xml_as_string)
