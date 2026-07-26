import os
from PIL import Image, ImageDraw, ImageFont

# General setup
W, H = 1080, 1080
color_canvas = (3, 7, 18) # #030712
color_card_bg = (11, 17, 30) # #0B111E
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
    logo_font = ImageFont.truetype(selected_font, 30)
    meta_font = ImageFont.truetype(selected_font, 16)
    title_font = ImageFont.truetype(selected_font, 26)
    item_font = ImageFont.truetype(selected_font, 18)
    footer_font = ImageFont.truetype(selected_font, 22)
    step_font = ImageFont.truetype(selected_font, 14)
else:
    logo_font = ImageFont.load_default()
    meta_font = ImageFont.load_default()
    title_font = ImageFont.load_default()
    item_font = ImageFont.load_default()
    footer_font = ImageFont.load_default()
    step_font = ImageFont.load_default()

def draw_base_template(draw, post_num):
    # Grid lines
    grid_color = (18, 24, 38)
    for x in range(0, W, 60):
        draw.line((x, 0, x, H), fill=grid_color, width=1)
    for y in range(0, H, 60):
        draw.line((0, y, W, y), fill=grid_color, width=1)
    
    # Header logo
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
    
    # Meta info
    draw.text((W - 300, y_header + 8), f"Launch Asset // Post {post_num}", font=meta_font, fill=color_grey_text)

# ----------------------------------------------------
# POST 1: SAMPLE LIFE CYCLE PIPELINE
# ----------------------------------------------------
img1 = Image.new("RGB", (W, H), color_canvas)
d1 = ImageDraw.Draw(img1)
draw_base_template(d1, 1)

d1.text((80, 150), "The Lifecycle of a Traceable Sample", font=title_font, fill=color_white)

# Draw Pipeline Nodes
y_pipeline = 480
node_x_coords = [150, 410, 670, 930]
node_labels = ["01", "02", "03", "04"]
node_titles = ["Intake", "Analysis", "Validation", "Issuance"]
node_descs = [
    "Pre-paid logistics\n& instant QR scan",
    "Direct instrument\ndata integration",
    "Automated matrix\ncompliance check",
    "QR-code verified\ntamper-proof CoA"
]

# Connecting line
d1.line((150, y_pipeline, 930, y_pipeline), fill=color_accent, width=4)

for i in range(4):
    cx, cy = node_x_coords[i], y_pipeline
    # Node outer ring (ellipse with cx - r, cy - r, cx + r, cy + r)
    d1.ellipse((cx - 24, cy - 24, cx + 24, cy + 24), fill=color_canvas, outline=color_accent, width=3)
    # Node core
    d1.ellipse((cx - 12, cy - 12, cx + 12, cy + 12), fill=color_accent)
    
    # Title
    d1.text((cx - 50, cy - 80), node_titles[i], font=title_font, fill=color_white)
    # Desc
    desc_y = cy + 50
    for line in node_descs[i].split("\n"):
        d1.text((cx - 95, desc_y), line, font=item_font, fill=color_grey_text)
        desc_y += 24

d1.text((W // 2 - 160, 960), "Start free at simpleafied.eu", font=footer_font, fill=color_accent)
img1.save("/Users/zsoltgalfalvi/Downloads/Simpleafied/campaign_day1.jpg", "JPEG", quality=95)

# ----------------------------------------------------
# POST 2: AUDIT PREPARATION COMPARISON
# ----------------------------------------------------
img2 = Image.new("RGB", (W, H), color_canvas)
d2 = ImageDraw.Draw(img2)
draw_base_template(d2, 2)

d2.text((80, 150), "Audit Prep: Manual vs. Simpleafied", font=title_font, fill=color_white)

# Draw Cards
# Card 1: Manual
d2.rounded_rectangle((80, 240, 510, 860), radius=12, fill=color_card_bg, outline=(40, 48, 64), width=1)
d2.text((120, 280), "The Manual Audit", font=title_font, fill=color_grey_text)
d2.line((120, 325, 470, 325), fill=(40, 48, 64), width=1)
manual_items = ["32+ analyst hours lost", "Paper cabinets search", "Missing signature alerts", "Spreadsheet archaeology", "Audit panic"]
y_item = 370
for item in manual_items:
    d2.text((120, y_item), "✕", font=item_font, fill=color_red)
    d2.text((155, y_item), item, font=item_font, fill=color_grey_text)
    y_item += 80

# Card 2: Simpleafied
d2.rounded_rectangle((570, 240, 1000, 860), radius=12, fill=color_card_bg, outline=color_accent, width=2)
d2.text((610, 280), "The 6-Minute Export", font=title_font, fill=color_accent)
d2.line((610, 325, 960, 325), fill=color_accent, width=1)
sa_items = ["Zero prep required", "Immutable audit trail", "Timestamped events", "Analyst signature logs", "1-click secure PDF export"]
y_item = 370
for item in sa_items:
    d2.text((610, y_item), "✓", font=item_font, fill=color_green)
    d2.text((645, y_item), item, font=item_font, fill=color_white)
    y_item += 80

d2.text((W // 2 - 160, 960), "Start free at simpleafied.eu", font=footer_font, fill=color_accent)
img2.save("/Users/zsoltgalfalvi/Downloads/Simpleafied/campaign_day2.jpg", "JPEG", quality=95)

# ----------------------------------------------------
# POST 3: CULTIVATOR-TO-LAB LOOP
# ----------------------------------------------------
img3 = Image.new("RGB", (W, H), color_canvas)
d3 = ImageDraw.Draw(img3)
draw_base_template(d3, 3)

d3.text((80, 150), "Cultivation & Laboratory, Connected.", font=title_font, fill=color_white)

# Cultivator Card
d3.rounded_rectangle((80, 320, 480, 760), radius=12, fill=color_card_bg, outline=(40, 48, 64), width=1)
d3.text((120, 360), "Medical Cultivation Site", font=title_font, fill=color_white)
d3.line((120, 405, 440, 405), fill=(40, 48, 64), width=1)
cult_items = ["Log active batches", "Auto-recommend analytes", "Generate shipping manifest", "Request courier pickup"]
y_item = 440
for item in cult_items:
    d3.text((120, y_item), "✓", font=item_font, fill=color_accent)
    d3.text((155, y_item), item, font=item_font, fill=color_grey_text)
    y_item += 70

# Testing Lab Card
d3.rounded_rectangle((600, 320, 1000, 760), radius=12, fill=color_card_bg, outline=color_accent, width=1)
d3.text((640, 360), "Accredited Laboratory", font=title_font, fill=color_accent)
d3.line((640, 405, 960, 405), fill=color_accent, width=1)
lab_items = ["Intake metadata check", "Live status updates", "Instrument result pull", "Instant CoA distribution"]
y_item = 440
for item in lab_items:
    d3.text((640, y_item), "✓", font=item_font, fill=color_green)
    d3.text((675, y_item), item, font=item_font, fill=color_white)
    y_item += 70

# Two-way connection text in center
d3.text((W // 2 - 130, 240), "Real-time communication loop", font=meta_font, fill=color_grey_text)
# Loop lines
d3.line((480, 500, 600, 500), fill=color_accent, width=2)
d3.line((480, 580, 600, 580), fill=color_accent, width=2)
d3.text((530, 470), "->", font=item_font, fill=color_accent)
d3.text((530, 550), "<-", font=item_font, fill=color_accent)

d3.text((W // 2 - 160, 960), "Start free at simpleafied.eu", font=footer_font, fill=color_accent)
img3.save("/Users/zsoltgalfalvi/Downloads/Simpleafied/campaign_day3.jpg", "JPEG", quality=95)

# ----------------------------------------------------
# POST 4: REGULATORY DOCUMENT VAULT
# ----------------------------------------------------
img4 = Image.new("RGB", (W, H), color_canvas)
d4 = ImageDraw.Draw(img4)
draw_base_template(d4, 4)

d4.text((80, 150), "Your Regulatory Document Vault", font=title_font, fill=color_white)

# Vault Container mockup
d4.rounded_rectangle((100, 240, 980, 840), radius=12, fill=color_card_bg, outline=(40, 48, 64), width=1)
# Vault Header
d4.text((140, 280), "simpleafied.eu/vault/certificates", font=item_font, fill=color_grey_text)
d4.line((140, 315, 940, 315), fill=(40, 48, 64), width=1)

vault_files = [
    ("Batch-023-A_Cannabinoids.pdf", "Verified Authentic", "QR ACTIVE", color_green),
    ("Batch-023-A_Pesticides.pdf", "Verified Authentic", "QR ACTIVE", color_green),
    ("Batch-023-A_HeavyMetals.pdf", "Verified Authentic", "QR ACTIVE", color_green),
    ("Batch-024-C_Mycotoxins.pdf", "Verification Pending", "LOGGED", color_grey_text),
    ("Batch-021-F_TerpeneProfile.pdf", "Verified Authentic", "QR ACTIVE", color_green)
]

y_file = 350
for name, status, label, col in vault_files:
    # File icon stub
    d4.rounded_rectangle((140, y_file, 190, y_file + 45), radius=4, fill=(24, 30, 45))
    d4.text((150, y_file + 12), "PDF", font=step_font, fill=color_white)
    
    # File name
    d4.text((210, y_file + 12), name, font=item_font, fill=color_white)
    
    # Status
    d4.text((600, y_file + 12), status, font=item_font, fill=col)
    
    # Label badge
    d4.rounded_rectangle((780, y_file + 8, 920, y_file + 38), radius=6, fill=color_canvas, outline=col, width=1)
    d4.text((800, y_file + 13), label, font=step_font, fill=col)
    
    # Divider
    d4.line((140, y_file + 75, 940, y_file + 75), fill=(24, 30, 45), width=1)
    y_file += 92

d4.text((W // 2 - 160, 960), "Start free at simpleafied.eu", font=footer_font, fill=color_accent)
img4.save("/Users/zsoltgalfalvi/Downloads/Simpleafied/campaign_day4.jpg", "JPEG", quality=95)

# ----------------------------------------------------
# POST 5: COMPLIANCE ENGINE CHECKLIST
# ----------------------------------------------------
img5 = Image.new("RGB", (W, H), color_canvas)
d5 = ImageDraw.Draw(img5)
draw_base_template(d5, 5)

d5.text((80, 150), "Compliance Without Spreadsheets", font=title_font, fill=color_white)

# Checklist Box
d5.rounded_rectangle((120, 240, 960, 840), radius=12, fill=color_card_bg, outline=color_accent, width=1)
d5.text((160, 280), "Automated Compliance Rules Evaluated", font=title_font, fill=color_accent)
d5.line((160, 325, 920, 325), fill=(40, 48, 64), width=1)

checklist_rules = [
    ("THC / CBD Cannabinoid Ratios", "BfArM Section 4.2", "PASS", color_green),
    ("Pesticides & Chemical Residues", "GMP Annex 7", "PASS", color_green),
    ("Heavy Metals (Pb, Cd, Hg, As)", "EU Pharmacopoeia 2.4.27", "PASS", color_green),
    ("Microbial Screen & Yeast/Molds", "ISO 17025 validated", "PASS", color_green),
    ("Foreign Matter & Contamination", "Optical Scan validation", "PASS", color_green),
    ("Aflatoxins & Ochratoxin A", "EU Regulation 1881/2006", "PASS", color_green)
]

y_rule = 360
for name, standard, status, col in checklist_rules:
    # Checkmark icon
    d5.text((160, y_rule), "✓", font=title_font, fill=col)
    
    # Rule name
    d5.text((200, y_rule - 3), name, font=item_font, fill=color_white)
    # Standard source
    d5.text((200, y_rule + 22), standard, font=step_font, fill=color_grey_text)
    
    # Status text
    d5.text((700, y_rule - 3), status, font=item_font, fill=col)
    # Target value
    d5.text((700, y_rule + 22), "compliant", font=step_font, fill=color_grey_text)
    
    # Divider
    d5.line((160, y_rule + 65, 920, y_rule + 65), fill=(24, 30, 45), width=1)
    y_rule += 76

d5.text((W // 2 - 160, 960), "Start free at simpleafied.eu", font=footer_font, fill=color_accent)
img5.save("/Users/zsoltgalfalvi/Downloads/Simpleafied/campaign_day5.jpg", "JPEG", quality=95)

# ----------------------------------------------------
# POST 6: THROUGHPUT ANALYTICS CHART
# ----------------------------------------------------
img6 = Image.new("RGB", (W, H), color_canvas)
d6 = ImageDraw.Draw(img6)
draw_base_template(d6, 6)

d6.text((80, 150), "Maximized Laboratory Throughput", font=title_font, fill=color_white)

# Draw two bar charts
# Card 1: Before
d6.rounded_rectangle((100, 240, 500, 840), radius=12, fill=color_card_bg, outline=(40, 48, 64), width=1)
d6.text((140, 280), "Old Way (spreadsheet admin)", font=item_font, fill=color_grey_text)
# Draw bars inside
# Admin bar (40% height) - grey
d6.rounded_rectangle((180, 580, 280, 760), radius=6, fill=color_grey_text)
d6.text((195, 545), "40% admin", font=step_font, fill=color_grey_text)
# Testing bar (60% height) - white
d6.rounded_rectangle((320, 480, 420, 760), radius=6, fill=color_white)
d6.text((335, 445), "60% testing", font=step_font, fill=color_white)
d6.text((140, 800), "Capped lab capacity", font=item_font, fill=color_red)

# Card 2: After
d6.rounded_rectangle((580, 240, 980, 840), radius=12, fill=color_card_bg, outline=color_accent, width=2)
d6.text((620, 280), "Simpleafied Way (automated)", font=item_font, fill=color_accent)
# Draw bars inside
# Admin bar (5% height) - grey
d6.rounded_rectangle((660, 735, 760, 760), radius=6, fill=color_grey_text)
d6.text((675, 705), "5% admin", font=step_font, fill=color_grey_text)
# Testing bar (95% height) - lime
d6.rounded_rectangle((800, 380, 900, 760), radius=6, fill=color_accent)
d6.text((815, 345), "95% testing", font=step_font, fill=color_accent)
d6.text((620, 800), "Reclaimed 40% capacity", font=item_font, fill=color_green)

d6.text((W // 2 - 160, 960), "Start free at simpleafied.eu", font=footer_font, fill=color_accent)
img6.save("/Users/zsoltgalfalvi/Downloads/Simpleafied/campaign_day6.jpg", "JPEG", quality=95)

print("Generated all 6 vector-perfect launch graphics successfully.")
