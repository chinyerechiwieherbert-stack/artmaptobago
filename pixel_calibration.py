import json

# Image dimensions
IMG_W = 5325
IMG_H = 3525

# Mapping people to their Dot locations (approximate pixels on the 5325x3525 image)
# And their Box locations (photo boxes on the spread)
map_data = [
    # Top Row
    {"name": "Stephanie Piles", "dot": [3230, 930], "box": [2700, 115, 150, 200]},
    {"name": "Jeanine Crouch", "dot": [3450, 840], "box": [3470, 115, 150, 200]},
    {"name": "Rachel Heusner", "dot": [3680, 750], "box": [4240, 115, 150, 200]},
    {"name": "Jahby Art", "dot": [4040, 680], "box": [5010, 115, 150, 200]},
    {"name": "The Art Trail", "dot": [4230, 620], "box": [600, 115, 150, 200]}, # Check this
    {"name": "Jason Nedd", "dot": [4420, 560], "box": [670, 115, 150, 200]}, # Check this

    # Left Sidebar - Column 1
    {"name": "Amber Shaw", "dot": [2450, 1950], "box": [50, 400, 150, 200]},
    {"name": "Kimme Museum", "dot": [2350, 2300], "box": [450, 400, 150, 200]},
    {"name": "Arletys Arias", "dot": [2420, 1980], "box": [850, 400, 150, 200]},
    {"name": "Chinyere Herbert", "dot": [2480, 2020], "box": [1250, 400, 150, 200]},
    {"name": "Tomley Roberts", "dot": [2520, 2050], "box": [1650, 400, 150, 200]},

    # Left Sidebar - Lower
    {"name": "Mystery Tombstone", "dot": [2580, 2100], "box": [50, 800, 150, 200]},
    {"name": "Goat Racing", "dot": [2200, 2600], "box": [450, 800, 150, 200]},
    {"name": "Duniesky Lora", "dot": [2620, 2150], "box": [850, 800, 150, 200]},
    {"name": "The Circles", "dot": [2660, 2200], "box": [1250, 800, 150, 200]},

    # Buccoo Area
    {"name": "Museum Buccoo", "dot": [2150, 2650], "box": [50, 1200, 150, 200]},
    {"name": "Healing with Horses", "dot": [2100, 2700], "box": [450, 1200, 150, 200]},
    {"name": "One Love Arts", "dot": [2050, 2750], "box": [850, 1200, 150, 200]},

    # Southwest
    {"name": "Planet Ceramics", "dot": [1800, 3100], "box": [50, 1600, 150, 200]},
    {"name": "Gary's Wraps", "dot": [1750, 3150], "box": [450, 1600, 150, 200]},
    {"name": "Anthony Mckenna", "dot": [1700, 3200], "box": [50, 2000, 150, 200]},
    {"name": "Renee Benjamin", "dot": [1650, 3250], "box": [450, 2000, 150, 200]},
    {"name": "Joseph Bacchus", "dot": [1600, 3300], "box": [850, 2000, 150, 200]},

    # Bottom Row
    {"name": "Martin Superville", "dot": [2800, 2800], "box": [1300, 3200, 150, 200]},
    {"name": "Dean Martin", "dot": [2850, 2850], "box": [1700, 3200, 150, 200]},
    {"name": "Ikechukwu Ojuro", "dot": [2900, 2900], "box": [2100, 3200, 150, 200]},
    {"name": "Shaw Park Centre", "dot": [3000, 2950], "box": [2500, 3200, 150, 200]},
    {"name": "Tobago Museum", "dot": [3100, 3000], "box": [2900, 3200, 150, 200]},
    {"name": "Magdalena Art Gallery", "dot": [3200, 3050], "box": [3300, 3200, 150, 200]},
    {"name": "Shonari Richardson", "dot": [3300, 3100], "box": [3700, 3200, 150, 200]},
    {"name": "Nick McKenna", "dot": [3400, 3150], "box": [4100, 3200, 150, 200]},
    {"name": "Tedd Arthur", "dot": [3150, 2800], "box": [2200, 2600, 150, 200]},
    {"name": "Botanical Gardens", "dot": [3050, 2850], "box": [2600, 2600, 150, 200]},
]

# Note: The above pixel coordinates are estimated and will likely need refinement.
# However, the strategy is now 100% focused on PIXELS.

print(json.dumps(map_data, indent=4))
