import os
from PIL import Image, ImageDraw, ImageFont

# Canvas setup (Instagram/LinkedIn 1:1 post format)
W, H = 1080, 1080
img = Image.new("RGB", (W, H), (3, 7, 18)) # #030712 Canvas
draw = ImageDraw.Draw(img)

# Colors
color_canvas = (3, 7, 18)
color_card_bg = (11, 17, 30) # #0B111E
color_border_default = (255, 255, 255, 20) # low opacity white
color_white = (255, 255, 255)
color_grey_text = (156, 163, 175) # #9CA3AF
color_accent = (198, 242, 78) # #C6F24E (electric lime)
color_red = (239, 68, 68) # #EF4444 (red)
color_green = (16, 185, 129) # #10B981 (emerald green)

# Font loading
font_paths = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial.ttf"
]
selected_font = None
for path in font_paths:
    if os.path.exists(path):
        selected_font = path
        break

if selected_font:
    logo_font = ImageFont.truetype(selected_font, 32)
    meta_font = ImageFont.truetype(selected_font, 18)
    title_font = ImageFont.truetype(selected_font, 26)
    item_font = ImageFont.truetype(selected_font, 20)
    footer_font = ImageFont.truetype(selected_font, 22)
else:
    logo_font = ImageFont.load_default()
    meta_font = ImageFont.load_default()
    title_font = ImageFont.load_default()
    item_font = ImageFont.load_default()
    footer_font = ImageFont.load_default()

# 1. Draw Subtle Background Grid (every 60px)
grid_color = (20, 25, 35)
for x in range(0, W, 60):
    draw.line((x, 0, x, H), fill=grid_color, width=1)
for y in range(0, H, 60):
    draw.line((0, y, W, y), fill=grid_color, width=1)

# 2. Draw Header
# Logo: "simp" (white) + "leaf" (lime) + "ied" (white) + "." (lime)
logo_segments = [
    ("simp", color_white),
    ("leaf", color_accent),
    ("ied", color_white),
    (".", color_accent)
]
curr_x = 80
y_header = 70
for txt, col in logo_segments:
    draw.text((curr_x, y_header), txt, font=logo_font, fill=col)
    bbox = logo_font.getbbox(txt)
    curr_x += (bbox[2] - bbox[0])

# Meta info: "Platform Launch // Day 01"
draw.text((W - 320, y_header + 8), "Platform Launch // Day 01", font=meta_font, fill=color_grey_text)

# 3. Main Title
draw.text((80, 150), "Why laboratories are changing.", font=title_font, fill=color_white)

# 4. Draw Cards
# Card 1: The Old Way (Spreadsheets)
card1_left, card1_top, card1_right, card1_bottom = 80, 220, 510, 880
# Draw card background
draw.rounded_rectangle((card1_left, card1_top, card1_right, card1_bottom), radius=12, fill=color_card_bg)
# Draw card border (subtle grey)
draw.rounded_rectangle((card1_left, card1_top, card1_right, card1_bottom), radius=12, outline=(40, 48, 64), width=1)

# Card 1 Title
draw.text((card1_left + 40, card1_top + 40), "The Spreadsheet Era", font=title_font, fill=color_grey_text)
draw.line((card1_left + 40, card1_top + 85, card1_right - 40, card1_top + 85), fill=(40, 48, 64), width=1)

# Card 1 Items (Red Crosses)
card1_items = [
    "Manual transcription",
    "Lost shipping tracking",
    "Hours of audit prep",
    "Disconnected software",
    "PDF report tampering",
    "Human entry errors"
]
item_y = card1_top + 130
for item in card1_items:
    # Draw red cross "X"
    draw.text((card1_left + 40, item_y), "✕", font=item_font, fill=color_red)
    # Draw item text
    draw.text((card1_left + 75, item_y), item, font=item_font, fill=color_grey_text)
    item_y += 75


# Card 2: The New Way (Simpleafied)
card2_left, card2_top, card2_right, card2_bottom = 570, 220, 1000, 880
# Draw card background
draw.rounded_rectangle((card2_left, card2_top, card2_right, card2_bottom), radius=12, fill=color_card_bg)
# Draw card border (glowing lime)
draw.rounded_rectangle((card2_left, card2_top, card2_right, card2_bottom), radius=12, outline=color_accent, width=2)

# Card 2 Title
draw.text((card2_left + 40, card2_top + 40), "The Simpleafied Era", font=title_font, fill=color_accent)
draw.line((card2_left + 40, card2_top + 85, card2_right - 40, card2_top + 85), fill=color_accent, width=1)

# Card 2 Items (Green Checks)
card2_items = [
    "Direct LIMS integration",
    "Real-time sample tracking",
    "6-minute audit exports",
    "Unified operations portal",
    "Cryptographic QR CoAs",
    "Automated data validation"
]
item_y = card2_top + 130
for item in card2_items:
    # Draw green checkmark "✓"
    draw.text((card2_left + 40, item_y), "✓", font=item_font, fill=color_green)
    # Draw item text
    draw.text((card2_left + 75, item_y), item, font=item_font, fill=color_white)
    item_y += 75

# 5. Draw Footer Action
draw.text((W // 2 - 160, 960), "Start free at simpleafied.eu", font=footer_font, fill=color_accent)

# Save image
output_path = "/Users/zsoltgalfalvi/Downloads/Simpleafied/campaign_day1.jpg"
img.save(output_path, "JPEG", quality=95)
print(f"Saved vector-perfect comparison chart to {output_path}")
