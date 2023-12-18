elements = ["Acid", "Cold", "Fire", "Lightning", "Poison"]


with open(
    "./DoombubblesTweaks/Public/DoombubblesTweaks/Stats/Generated/Data/ChromaticOrbs.txt", "w"
) as file:
    for i in range(1, 7):
        for element in elements:
            name = f"Projectile_ChromaticOrb_{element}" + (f"_{i}" if i > 1 else "")
            file.write(
                "\n".join(
                    [
                        f'new entry "{name}"',
                        f'type "SpellData"',
                        f'data "SpellType" "Projectile"',
                        f'using "{name}"',
                        f'data "SpellSuccess" "DealDamage({i + 2}d8,{element},Magical){";RemoveStatus(BURNING)" if element == "Cold" else ""}"',
                        f'data "TooltipDamageList" "DealDamage({i + 2}d8,{element})"\n\n',
                    ]
                )
            )
