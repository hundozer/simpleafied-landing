import os
from PIL import Image, ImageDraw, ImageFont

# Path config
base_dir = "/Users/zsoltgalfalvi/Brain" # Or gemini app data folder
base_image_path = "/Users/zsoltgalfalvi/.gemini/antigravity/brain/463f3695-ff5d-4286-8925-cedb109a5d7f/linkedin_banner_1784831427993.jpg"
output_image_path = "/Users/zsoltgalfalvi/.gemini/antigravity/brain/463f3695-ff5d-4286-8925-cedb109a5d7f/linkedin_banner_custom.jpg"
workspace_image_path = "/Users/zsoltgalfalvi/Downloads/Simpleafied/linkedin_banner_custom.jpg"

# Open base banner
img = Image.open(base_image_path)
W, H = img.size

# 1. Crop to 4:1 aspect ratio centered (LinkedIn standard aspect ratio)
target_aspect = 4.0
crop_w = W
crop_h = int(W / target_aspect)

if crop_h > H:
    crop_h = H
    crop_w = int(H * target_aspect)

left = (W - crop_w) // 2
top = (H - crop_h) // 2
right = left + crop_w
bottom = top + crop_h

cropped_img = img.crop((left, top, right, bottom))

# 2. Resize to exact LinkedIn banner dimensions: 1584 x 396 pixels
target_w, target_h = 1584, 396
resized_img = cropped_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
draw = ImageDraw.Draw(resized_img)

print(f"Resized background to LinkedIn dimensions: {target_w}x{target_h}")

# Colors
color_white = (255, 255, 255)
color_grey = (156, 163, 175)
color_accent = (198, 242, 78) # #C6F24E

# Font paths
font_logo_path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
font_motto_path = "/System/Library/Fonts/Supplemental/Georgia.ttf" # elegant serif for motto
font_motto_bold_path = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" # bold serif for highlights
font_domain_path = "/System/Library/Fonts/Supplemental/Arial.ttf"

# Fallback check
if not os.path.exists(font_logo_path): font_logo_path = "/Library/Fonts/Arial.ttf"
if not os.path.exists(font_motto_path): font_motto_path = "/System/Library/Fonts/Supplemental/Times New Roman.ttf"
if not os.path.exists(font_motto_bold_path): font_motto_bold_path = "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf"
if not os.path.exists(font_domain_path): font_domain_path = "/Library/Fonts/Arial.ttf"

# Load fonts
if os.path.exists(font_logo_path):
    logo_font = ImageFont.truetype(font_logo_path, 54)
    motto_font = ImageFont.truetype(font_motto_path, 24)
    motto_font_bold = ImageFont.truetype(font_motto_bold_path, 24)
    domain_font = ImageFont.truetype(font_domain_path, 16)
else:
    logo_font = ImageFont.load_default()
    motto_font = ImageFont.load_default()
    motto_font_bold = ImageFont.load_default()
    domain_font = ImageFont.load_default()

# Positions
left_padding = 90
y_logo = 60
y_motto = 155
y_domain = 295

# 1. Draw Logo: "simp" (white) + "leaf" (green) + "ied" (white) + "." (green)
logo_segments = [
    ("simp", color_white),
    ("leaf", color_accent),
    ("ied", color_white),
    (".", color_accent)
]

current_x = left_padding
for text, color in logo_segments:
    draw.text((current_x, y_logo), text, font=logo_font, fill=color)
    bbox = logo_font.getbbox(text)
    segment_width = bbox[2] - bbox[0]
    current_x += segment_width

# 2. Draw Motto with bold + color highlights on "what", "where", "if"
# Line 1 segments: (text, color, use_bold)
motto_line1 = [
    ("Know ", color_white, False),
    ("what", color_accent, True),
    (" to test. Find ", color_white, False),
    ("where", color_accent, True),
    (" to test.", color_white, False)
]

# Line 2 segments: (text, color, use_bold)
motto_line2 = [
    ("Know ", color_white, False),
    ("if", color_accent, True),
    (" you passed.", color_white, False)
]

# Draw Line 1
current_x = left_padding
for text, color, use_bold in motto_line1:
    font_to_use = motto_font_bold if use_bold else motto_font
    draw.text((current_x, y_motto), text, font=font_to_use, fill=color)
    bbox = font_to_use.getbbox(text)
    current_x += (bbox[2] - bbox[0])

# Draw Line 2
y_line2 = y_motto + 38
current_x = left_padding
for text, color, use_bold in motto_line2:
    font_to_use = motto_font_bold if use_bold else motto_font
    draw.text((current_x, y_line2), text, font=font_to_use, fill=color)
    bbox = font_to_use.getbbox(text)
    current_x += (bbox[2] - bbox[0])

# 3. Draw Domain: "simpleafied.eu"
draw.text((left_padding, y_domain), "simpleafied.eu", font=domain_font, fill=color_grey)

# Save images
resized_img.save(output_image_path, "JPEG", quality=95)
resized_img.save(workspace_image_path, "JPEG", quality=95)
print(f"Saved custom LinkedIn banner with highlighted bold-serif motto to {workspace_image_path}")
