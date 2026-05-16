import json

# Calibrated Pixel Data from scratch/pixel_calibration.py
calibrated_coords = {
    "Stephanie Piles": {"dot": [3230, 930], "box": [2700, 115, 150, 200]},
    "Jeanine Crouch": {"dot": [3450, 840], "box": [3470, 115, 150, 200]},
    "Rachel Heusner": {"dot": [3680, 750], "box": [4240, 115, 150, 200]},
    "Jahby Art": {"dot": [4040, 680], "box": [5010, 115, 150, 200]},
    "The Art Trail": {"dot": [4230, 620], "box": [600, 115, 150, 200]},
    "Jason Nedd": {"dot": [4420, 560], "box": [670, 115, 150, 200]},
    "Amber Shaw": {"dot": [2450, 1950], "box": [50, 400, 150, 200]},
    "Kimme Museum": {"dot": [2350, 2300], "box": [450, 400, 150, 200]},
    "Arletys Arias": {"dot": [2420, 1980], "box": [850, 400, 150, 200]},
    "Chinyere Herbert": {"dot": [2480, 2020], "box": [1250, 400, 150, 200]},
    "Tomley Roberts": {"dot": [2520, 2050], "box": [1650, 400, 150, 200]},
    "Mystery Tombstone": {"dot": [2580, 2100], "box": [50, 800, 150, 200]},
    "Goat Racing": {"dot": [2200, 2600], "box": [450, 800, 150, 200]},
    "Duniesky Lora": {"dot": [2620, 2150], "box": [850, 800, 150, 200]},
    "The Circles": {"dot": [2660, 2200], "box": [1250, 800, 150, 200]},
    "Museum Buccoo": {"dot": [2150, 2650], "box": [50, 1200, 150, 200]},
    "Healing with Horses": {"dot": [2100, 2700], "box": [450, 1200, 150, 200]},
    "One Love Arts Atelier": {"dot": [2050, 2750], "box": [850, 1200, 150, 200]},
    "Planet Ceramics": {"dot": [1800, 3100], "box": [50, 1600, 150, 200]},
    "Gary's Wraps": {"dot": [1750, 3150], "box": [450, 1600, 150, 200]},
    "Anthony Mckenna": {"dot": [1700, 3200], "box": [50, 2000, 150, 200]},
    "Renee Benjamin": {"dot": [1650, 3250], "box": [450, 2000, 150, 200]},
    "Joseph Bacchus": {"dot": [1600, 3300], "box": [850, 2000, 150, 200]},
    "Martin Superville": {"dot": [2800, 2800], "box": [1300, 3200, 150, 200]},
    "Dean Martin": {"dot": [2850, 2850], "box": [1700, 3200, 150, 200]},
    "Ikechukwu Ojuro": {"dot": [2900, 2900], "box": [2100, 3200, 150, 200]},
    "Shaw Park Cultural Complex": {"dot": [3000, 2950], "box": [2500, 3200, 150, 200]},
    "Tobago Museum": {"dot": [3100, 3000], "box": [2900, 3200, 150, 200]},
    "Magdalena Art Gallery": {"dot": [3200, 3050], "box": [3300, 3200, 150, 200]},
    "Shonari Richardson": {"dot": [3300, 3100], "box": [3700, 3200, 150, 200]},
    "Nick McKenna": {"dot": [3400, 3150], "box": [4100, 3200, 150, 200]},
    "Botanical Gardens": {"dot": [3050, 2850], "box": [2600, 2600, 150, 200]}
}

# Artist and Location Data extracted from the reference document
locations = [
    # Southwest / Crown Point / Scarborough Area
    {
        'name': 'Martin Superville',
        'category': 'Artists',
        'type': 'Artist / Painter',
        'region': 'Southwest',
        'area': 'Lowlands',
        'photo': '../Tobago_Art_Directory/Martin_Superville/photo_1.jpg',
        'description': 'Renowned Tobago artist known for vibrant depictions of island life and culture.'
    },
    {
        'name': 'Dean Martin',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Scarborough/Central',
        'area': 'Scarborough',
        'photo': '../Tobago_Art_Directory/Dean_Martin_Superville/photo_1.jpg',
        'description': 'Local artist capturing the essence of Tobago through expressive works.'
    },
    {
        'name': 'Ikechukwu Ojuro',
        'category': 'Artists',
        'type': 'Designer / Artist',
        'region': 'Scarborough/Central',
        'area': 'Scarborough',
        'photo': '../Tobago_Art_Directory/Ike/photo_1.jpg',
        'description': 'Contemporary designer and artist pushing creative boundaries in Tobago.'
    },
    {
        'name': 'Shaw Park Cultural Complex',
        'category': 'Cultural Sites',
        'type': 'Arts Venue / Cultural Space',
        'region': 'Scarborough/Central',
        'area': 'Shaw Park',
        'photo': '../Tobago_Art_Directory/Shaw_Park_Cultural_Complex/photo_1.jpg',
        'address': 'Shaw Park, Scarborough, Tobago',
        'description': 'Tobago\'s premier performing arts theater and exhibition space.'
    },
    {
        'name': 'Tobago Museum',
        'category': 'Museums',
        'type': 'Museum',
        'region': 'Scarborough/Central',
        'area': 'Scarborough',
        'photo': '../Tobago_Art_Directory/TOBAGO Museum/photo_1.jpg',
        'address': '84 Fort Street, Scarborough, Tobago (Inside Fort King George)',
        'description': 'Located within Fort King George, showcasing the rich history of Tobago.'
    },
    {
        'name': 'Magdalena Art Gallery',
        'category': 'Galleries',
        'type': 'Art Gallery',
        'region': 'Southwest',
        'area': 'Lowlands',
        'photo': '../Tobago_Art_Directory/Magdalena_Grande_Gallery/photo_1.jpg',
        'description': 'A premium space showcasing local and regional fine art.'
    },
    {
        'name': 'Shonari Richardson',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Scarborough/Central',
        'area': 'Scarborough',
        'photo': '../Tobago_Art_Directory/Shonari_Richardson/photo_1.jpg',
        'description': 'Contemporary Tobago artist focusing on cultural themes.'
    },
    {
        'name': 'Nick McKenna',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Scarborough/Central',
        'area': 'Scarborough',
        'photo': '../Tobago_Art_Directory/Nick_McKenna/photo_1.jpg',
        'description': 'Artist known for unique perspectives on Tobago\'s landscape.'
    },
    {
        'name': 'Anthony Mckenna',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Southwest',
        'area': 'Crown Point',
        'photo': '../Tobago_Art_Directory/Anthony Mckenna/photo_1.jpg',
        'description': 'Creative spirit based in the vibrant Crown Point area.'
    },
    {
        'name': 'Gary\'s Wraps',
        'category': 'Creative Businesses',
        'type': 'Creative Business',
        'region': 'Southwest',
        'area': 'Crown Point',
        'photo': '../Tobago_Art_Directory/Gary\'s Wraps/photo_1.jpg',
        'description': 'Innovative local brand blending creativity with commerce.'
    },
    {
        'name': 'Planet Ceramics',
        'category': 'Workshops',
        'type': 'Ceramic Studio',
        'region': 'Southwest',
        'area': 'Southwest Tobago',
        'photo': '../Tobago_Art_Directory/Helen_Evans_Planet_Ceramics/photo_1.jpg',
        'description': 'Ceramic studio and workshop producing unique island-inspired pottery.'
    },
    {
        'name': 'Renee Benjamin',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Southwest',
        'area': 'Crown Point',
        'photo': '../Tobago_Art_Directory/Renease Benjamin/photo_1.jpg',
        'description': 'Artist capturing the light and life of Southwest Tobago.'
    },
    {
        'name': 'Joseph Bacchus',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Southwest',
        'area': 'Crown Point',
        'photo': '../Tobago_Art_Directory/Joseph Bachus/photo_1.jpg',
        'description': 'Local artist with a deep connection to the Crown Point community.'
    },
    {
        'name': 'Collis Street Art',
        'category': 'Public Art',
        'type': 'Street Artist',
        'region': 'Southwest',
        'area': 'Crown Point',
        'photo': '../Tobago_Art_Directory/Collis Street Art/photo_1.jpg',
        'description': 'Vibrant street art that brings the walls of Crown Point to life.'
    },
    {
        'name': 'Amber Shaw',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Western Coast',
        'area': 'Plymouth',
        'photo': '../Tobago_Art_Directory/Amber_Shaw/photo_1.png',
        'description': 'Plymouth-based artist known for intricate and meaningful works.'
    },
    {
        'name': 'Kimme Museum',
        'category': 'Museums',
        'type': 'Museum / Sculpture Garden',
        'region': 'Western Coast',
        'area': 'Mt. Irvine / Bethel',
        'photo': '../Tobago_Art_Directory/Kimmes_Museum/photo_1.jpeg',
        'address': 'Kimme Drive, Bethel, Tobago',
        'description': 'The castle-like studio and museum of the late Luise Kimme, featuring monumental sculptures.'
    },
    {
        'name': 'Arletys Arias',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Western Coast',
        'area': 'Plymouth',
        'photo': '../Tobago_Art_Directory/Arletys_Lora/photo_1.png',
        'description': 'Artist bringing a unique contemporary voice to the Plymouth region.'
    },
    {
        'name': 'Chinyere Herbert',
        'category': 'Artists',
        'type': 'Graphic Designer / Curator',
        'region': 'Western Coast',
        'area': 'Plymouth',
        'photo': '../Tobago_Art_Directory/Chinyere_Herbert/photo_1.jpg',
        'description': 'Multi-disciplinary creative, graphic designer and art curator.'
    },
    {
        'name': 'Tomley Roberts',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'Western Coast',
        'area': 'Plymouth',
        'photo': '../Tobago_Art_Directory/Tomley_Roberts_Art_Tobago/photo_1.jpeg',
        'description': 'Artist and educator deeply rooted in Tobago\'s art education and creation.'
    },
    {
        'name': 'Museum Buccoo',
        'category': 'Museums',
        'type': 'Museum / Heritage',
        'region': 'Western Coast',
        'area': 'Buccoo',
        'address': 'Buccoo Main Road, Buccoo, Tobago',
        'description': 'Community museum celebrating the heritage and culture of Buccoo.'
    },
    {
        'name': 'Healing with Horses',
        'category': 'Heritage',
        'type': 'Cultural / Experiential Venue',
        'region': 'Western Coast',
        'area': 'Buccoo',
        'photo': '../Tobago_Art_Directory/Healing_With_Horses/photo_1.jpg',
        'description': 'A therapeutic and cultural center offering unique experiences with horses.'
    },
    {
        'name': 'Mystery Tombstone',
        'category': 'Heritage',
        'type': 'Historical Site',
        'region': 'Western Coast',
        'area': 'Plymouth',
        'photo': '../Tobago_Art_Directory/Mystery_Tombstone/photo_1.jpg',
        'description': 'A famous historical landmark with an enigmatic inscription from 1783.'
    },
    {
        'name': 'Duniesky Lora',
        'category': 'Artists',
        'type': 'Artist / Sculptor',
        'region': 'Western Coast',
        'area': 'Plymouth',
        'photo': '../Tobago_Art_Directory/Duneiski_Lora/photo_1.jpg',
        'description': 'Sculptor and artist creating powerful works in the Western Coast region.'
    },
    {
        'name': 'Jason Nedd',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'North Coast & Windward',
        'area': 'L\'Anse Fourmi',
        'photo': '../Tobago_Art_Directory/Jason_Nedd/photo_10.jpg',
        'description': 'Artist capturing the rugged beauty and spirit of Northern Tobago.'
    },
    {
        'name': 'TVAA (Tobago Visual Arts Association)',
        'category': 'Workshops',
        'type': 'Arts Organization',
        'region': 'North Coast & Windward',
        'area': 'Castara',
        'photo': '../Tobago_Art_Directory/TVAA/photo_1.jpg',
        'description': 'An organization dedicated to supporting and promoting visual artists across Tobago.'
    },
    {
        'name': 'Suzi Alfred',
        'category': 'Artists',
        'type': 'Artist',
        'region': 'North Coast & Windward',
        'area': 'Castara',
        'photo': '../Tobago_Art_Directory/Suzi_Alfred/photo_1.png',
        'description': 'Artist inspired by the serene and natural environment of Castara.'
    },
    {
        'name': 'Jahby Art',
        'category': 'Artists',
        'type': 'Artist / Craft',
        'region': 'North Coast & Windward',
        'area': 'Northern Tobago',
        'photo': '../Tobago_Art_Directory/Jahby Art/photo_1.jpg',
        'description': 'Craft and art that embodies the Northern Tobago spirit.'
    },
    {
        'name': 'Fort King George',
        'category': 'Heritage',
        'type': 'Museum + Historic Site',
        'region': 'Scarborough/Central',
        'area': 'Scarborough',
        'photo': '../Tobago_Art_Directory/Fort_King_George/photo_1.jpg',
        'address': '84 Fort Street, Scarborough, Tobago',
        'description': 'Tobago\'s best-preserved colonial fort, offering panoramic views and history.'
    },
    {
        'name': 'Botanical Gardens',
        'category': 'Nature',
        'type': 'Botanical Gardens',
        'region': 'Scarborough/Central',
        'area': 'Scarborough',
        'photo': '../Tobago_Art_Directory/Botanical_Gardens/photo_1.jpeg',
        'description': 'Lush gardens in the heart of Scarborough featuring tropical flora.'
    },
    {
        'name': 'One Love Arts Atelier',
        'category': 'Galleries',
        'type': 'Gallery / Creative Space',
        'region': 'Southwest',
        'area': 'Lowlands',
        'address': '91 Allfields Trace, Lowlands, Tobago',
        'description': 'A vibrant gallery and artisan hub in the Lowlands area.'
    },
    {
        'name': 'The Art Gallery',
        'category': 'Galleries',
        'type': 'Art Gallery',
        'region': 'Southwest',
        'area': 'Lowlands',
        'address': 'Hibiscus Drive Extension, Lowlands, Tobago',
        'photo': '../Tobago_Art_Directory/The_Art_Gallery/photo_1.jpg',
        'description': 'A key space for experiencing contemporary Tobago art.'
    }
]

# Add IDs and Merge calibrated coordinates
for i, loc in enumerate(locations):
    loc['id'] = f'loc-{i+1}'
    
    # Merge calibrated pixels if available
    if loc['name'] in calibrated_coords:
        loc['dot'] = calibrated_coords[loc['name']]['dot']
        loc['box'] = calibrated_coords[loc['name']]['box']
    
    if 'contact' not in loc:
        loc['contact'] = 'Contact via gallery/venue'
    if 'iconType' not in loc:
        if loc['category'] == 'Artists': loc['iconType'] = 'Creator'
        elif loc['category'] == 'Museums': loc['iconType'] = 'Gallery'
        elif loc['category'] == 'Galleries': loc['iconType'] = 'Gallery'
        elif loc['category'] == 'Heritage': loc['iconType'] = 'Castle'
        elif loc['category'] == 'Nature': loc['iconType'] = 'Water'
        elif loc['category'] == 'Cultural Sites': loc['iconType'] = 'Culture'
        else: loc['iconType'] = 'Creator'

js_content = f"""const directoryData = {json.dumps(locations, indent=4)};

const getIconSvg = (type) => {{
    const colorMap = {{
        'Castle': '#D62828', // Roadway Red
        'Water': '#0077B6', // Caribbean Sea Blue
        'Windmill': '#6B8E23', // Main Ridge Green
        'Culture': '#E0A96D', // Earth tone for Pan
        'Creator': '#6B8E23', // Artist Green
        'Gallery': '#D62828', // Heritage Red
        'Nature': '#00B4D8'   // Tropical Blue
    }};
    let color = colorMap[type] || '#333';
    
    if (type === 'Castle') {{
        return `<svg fill="${{color}}" viewBox="0 0 24 24"><path d="M21 9v2h-2v11h-4v-6H9v6H5V11H3V9h2V5h2v4h2V5h2v4h2V5h2v4h2V5h2v4h2z"/></svg>`;
    }} else if (type === 'Water') {{
        return `<svg fill="${{color}}" viewBox="0 0 24 24"><path d="M12 2c0 0-8 8-8 13a8 8 0 0 0 16 0c0-5-8-13-8-13z"/></svg>`;
    }} else if (type === 'Windmill') {{
        return `<svg fill="${{color}}" viewBox="0 0 24 24"><path d="M12 2L9 8h6l-3-6zm0 20l3-6H9l3 6zM2 12l6-3v6l-6-3zm20 0l-6 3V9l6 3z"/></svg>`;
    }} else if (type === 'Culture') {{
        return `<svg fill="${{color}}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path fill="#fff" d="M8 10h2v2H8zm6 0h2v2h-2zm-4 4h4v2h-4z"/></svg>`;
    }} else if (type === 'Creator') {{
        return `<svg fill="${{color}}" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
    }}
    return `<svg fill="${{color}}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`;
}};

window.directoryData = directoryData;
window.getIconSvg = getIconSvg;
"""

with open('/home/chinyerechiwieherbert/MAP/digital_hub/js/data.js', 'w') as f:
    f.write(js_content)

print("Successfully generated calibrated data.js")
