"""Generates public/icon.png (1024x1024 source) and public/icon.ico
(multi-size Windows icon) for System.exe, matching the in-app neon theme."""

from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math

SIZE = 1024
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

# --- Background: rounded square with a diagonal purple -> blue -> cyan gradient ---
grad = Image.new("RGB", (SIZE, SIZE), "#0D0D0D")
gpix = grad.load()
c1 = (139, 92, 246)   # accent purple
c2 = (59, 130, 246)   # accent blue
c3 = (34, 211, 238)   # accent cyan

for y in range(SIZE):
    for x in range(0, SIZE, 4):  # step 4 for speed, then blit blocks
        t = (x + y) / (SIZE * 2)
        if t < 0.5:
            tt = t / 0.5
            r = int(c1[0] + (c2[0] - c1[0]) * tt)
            g = int(c1[1] + (c2[1] - c1[1]) * tt)
            b = int(c1[2] + (c2[2] - c1[2]) * tt)
        else:
            tt = (t - 0.5) / 0.5
            r = int(c2[0] + (c3[0] - c2[0]) * tt)
            g = int(c2[1] + (c3[1] - c2[1]) * tt)
            b = int(c2[2] + (c3[2] - c2[2]) * tt)
        for xx in range(x, min(x + 4, SIZE)):
            gpix[xx, y] = (r, g, b)

mask = Image.new("L", (SIZE, SIZE), 0)
mdraw = ImageDraw.Draw(mask)
radius = int(SIZE * 0.22)
mdraw.rounded_rectangle([0, 0, SIZE - 1, SIZE - 1], radius=radius, fill=255)

bg = Image.composite(grad, Image.new("RGB", (SIZE, SIZE), "#0D0D0D"), mask)
img.paste(bg, (0, 0), mask)

# Subtle darker inset panel for contrast behind the glyph
inset = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
idraw = ImageDraw.Draw(inset)
pad = int(SIZE * 0.10)
idraw.rounded_rectangle(
    [pad, pad, SIZE - pad, SIZE - pad],
    radius=int(SIZE * 0.16),
    fill=(13, 13, 13, 90),
)
img = Image.alpha_composite(img, inset)

# --- Glyph: a chevron "level-up" mark (^) with a bold S-notch, monogram-style ---
draw = ImageDraw.Draw(img)
cx, cy = SIZE // 2, SIZE // 2

# Outer glow: draw the chevron in cyan on a blurred layer first
glow_layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_layer)

chevron_w = SIZE * 0.30
chevron_h = SIZE * 0.16
stroke = int(SIZE * 0.075)

def chevron_points(offset_y, width, height):
    return [
        (cx - width, cy + offset_y + height),
        (cx, cy + offset_y),
        (cx + width, cy + offset_y + height),
    ]

def draw_chevron(target_draw, offset_y, color):
    pts = chevron_points(offset_y, chevron_w, chevron_h)
    target_draw.line([pts[0], pts[1]], fill=color, width=stroke, joint="curve")
    target_draw.line([pts[1], pts[2]], fill=color, width=stroke, joint="curve")
    # round the joints/ends
    for p in pts:
        r = stroke // 2
        target_draw.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=color)

# Two stacked chevrons -> reads as a "level up" / rank insignia
draw_chevron(glow_draw, -int(SIZE * 0.06), (34, 211, 238, 255))
draw_chevron(glow_draw, int(SIZE * 0.09), (255, 255, 255, 255))

glow_blur = glow_layer.filter(ImageFilter.GaussianBlur(radius=SIZE * 0.02))
img = Image.alpha_composite(img, glow_blur)
img = Image.alpha_composite(img, glow_layer)

img.save("/home/claude/system-exe/public/icon.png")

# --- Build multi-size .ico for Windows ---
sizes = [16, 24, 32, 48, 64, 128, 256]
img.save(
    "/home/claude/system-exe/public/icon.ico",
    format="ICO",
    sizes=[(s, s) for s in sizes],
)

print("Icon generated:")
print(" - public/icon.png (1024x1024)")
print(" - public/icon.ico (multi-size)")
