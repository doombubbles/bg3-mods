import xml.etree.ElementTree as ET
from xml.dom import minidom

input = [
    "C:/Users/jpgale/Documents/Coding/BG3 Mods/bg3-modders-multitool/UnpackedData/Shared/Public/Shared/RootTemplates/_merged.lsf.lsx",
    "C:/Users/jpgale/Documents/Coding/BG3 Mods/bg3-modders-multitool/UnpackedData/Shared/Public/SharedDev/RootTemplates/_merged.lsf.lsx",
    "C:/Users/jpgale/Documents/Coding/BG3 Mods/bg3-modders-multitool/UnpackedData/Gustav/Public/Gustav/RootTemplates/_merged.lsf.lsx",
    "C:/Users/jpgale/Documents/Coding/BG3 Mods/bg3-modders-multitool/UnpackedData/Gustav/Public/GustavDev/RootTemplates/_merged.lsf.lsx",
]

output = "./DoombubblesTweaks/Public/DoombubblesTweaks/RootTemplates/Items/Food.lsf.lsx"

food = {"LOOT_Camp_Pack": 40}
status_id = "CONSUMED_CAMP_SUPPLIES"


game_objects = []

for xml_file in input:
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Search for the specific nodes with the given attributes
    for game_object in root.findall(".//node[@id='GameObjects']"):
        name_attribute = game_object.find("./attribute[@id='Name']")
        stats_attribute = game_object.find("./attribute[@id='Stats']")
        if name_attribute is not None and name_attribute.get("value") in food.keys():
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

            if ET.SubElement(on_use_peace_actions, "children") is None:
                ET.SubElement(on_use_peace_actions, "children")

            # Now 'on_use_peace_actions' definitely exists, add a new 'Action' node to it
            new_action_node = ET.SubElement(
                on_use_peace_actions.find("./children"), "node", id="Action"
            )
            ET.SubElement(
                new_action_node, "attribute", id="ActionType", type="int32", value="7"
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
                id="Conditions",
                type="LSString",
                value="CanUseSpellScroll(&quot;Shout_SongOfRest&quot;)",
            )
            ET.SubElement(
                new_attributes,
                "attribute",
                id="Consume",
                type="bool",
                value="True",
            )
            ET.SubElement(
                new_attributes,
                "attribute",
                id="IsHiddenStatus",
                type="bool",
                value="True",
            )
            ET.SubElement(
                new_attributes,
                "attribute",
                id="StatsId",
                type="FixedString",
                value=status_id,
            )
            ET.SubElement(
                new_attributes,
                "attribute",
                id="StatusDuration",
                type="int32",
                value=str(food[name_attribute.get("value")]),
            )

            game_objects.append(game_object)


assert len(game_objects) >= len(food)

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
