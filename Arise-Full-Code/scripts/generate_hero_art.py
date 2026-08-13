"""Generates an original hero silhouette illustration for the dashboard
hero panel — a glowing armored silhouette in the app's purple/cyan
palette. Deliberately NOT a reproduction of any existing character."""

from PIL import Image, ImageDraw, ImageFilter
import math
import random

random.seed(7)

W, H = 900, 1100
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))

# --- Background glow field ---
bg = Image.new("RGB", (W, H), "#0D0D0D")
bpix = bg.load()
c_purple = (139, 92, 246)
cx, cy = W * 0.42, H * 0.38
for y in range(0, H, 2):
    for x in range(0, W, 2):
        d = math.hypot(x - cx, y - cy) / (W * 0.8)
        t = max(0, 1 - d)
        r = int(13 + c_purple[0] * t * 0.35)
        g = int(13 + c_purple[1] * t * 0.35)
        b = int(13 + c_purple[2] * t * 0.4)
        for yy in range(y, min(y + 2, H)):
            for xx in range(x, min(x + 2, W)):
                bpix[xx, yy] = (r, g, b)
img.paste(bg, (0, 0))

draw = ImageDraw.Draw(img, "RGBA")

# --- Silhouette: cloaked figure, shoulders + head, facing slightly left ---
silhouette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(silhouette)

body_color = (8, 8, 12, 255)

cloak_points = [
    (W * 0.18, H * 0.98),
    (W * 0.14, H * 0.75),
    (W * 0.22, H * 0.55),
    (W * 0.34, H * 0.46),
    (W * 0.40, H * 0.44),
    (W * 0.46, H * 0.46),
    (W * 0.58, H * 0.55),
    (W * 0.66, H * 0.75),
    (W * 0.62, H * 0.98),
]
sdraw.polygon(cloak_points, fill=body_color)

head_cx, head_cy = W * 0.40, H * 0.32
head_r = W * 0.11
sdraw.ellipse(
    [head_cx - head_r, head_cy - head_r * 1.15, head_cx + head_r, head_cy + head_r * 1.15],
    fill=body_color,
)

hair_pts = [
    (head_cx - head_r * 0.9, head_cy - head_r * 0.6),
    (head_cx - head_r * 1.1, head_cy - head_r * 1.5),
    (head_cx - head_r * 0.5, head_cy - head_r * 1.1),
    (head_cx - head_r * 0.2, head_cy - head_r * 1.9),
    (head_cx + head_r * 0.1, head_cy - head_r * 1.2),
    (head_cx + head_r * 0.5, head_cy - head_r * 1.7),
    (head_cx + head_r * 0.6, head_cy - head_r * 0.9),
    (head_cx + head_r * 1.0, head_cy - head_r * 1.3),
    (head_cx + head_r * 0.9, head_cy - head_r * 0.5),
]
sdraw.polygon(hair_pts, fill=body_color)

img = Image.alpha_composite(img, silhouette)
draw = ImageDraw.Draw(img, "RGBA")

eye_y = head_cy - head_r * 0.05
for ex in (head_cx - head_r * 0.32, head_cx + head_r * 0.18):
    draw.ellipse([ex - 10, eye_y - 5, ex + 10, eye_y + 5], fill=(34, 211, 238, 255))

eye_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
egdraw = ImageDraw.Draw(eye_glow)
for ex in (head_cx - head_r * 0.32, head_cx + head_r * 0.18):
    egdraw.ellipse([ex - 26, eye_y - 18, ex + 26, eye_y + 18], fill=(34, 211, 238, 160))
eye_glow = eye_glow.filter(ImageFilter.GaussianBlur(14))
img = Image.alpha_composite(img, eye_glow)

crack_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
cdraw = ImageDraw.Draw(crack_layer)

def jagged_line(draw_obj, start, angle_deg, length, segments, color, width):
    x, y = start
    angle = math.radians(angle_deg)
    for i in range(segments):
        seg_len = length / segments
        jitter = random.uniform(-0.35, 0.35)
        nx = x + math.cos(angle) * seg_len
        ny = y + math.sin(angle) * seg_len
        draw_obj.line([(x, y), (nx, ny)], fill=color, width=width)
        x, y = nx, ny
        angle += jitter

origin = (W * 0.40, H * 0.42)
for i in range(14):
    ang = random.uniform(0, 360)
    length = random.uniform(120, 340)
    color = random.choice(
        [(139, 92, 246, 200), (34, 211, 238, 190), (255, 255, 255, 140)]
    )
    jagged_line(cdraw, origin, ang, length, random.randint(3, 6), color, random.randint(2, 4))

crack_glow = crack_layer.filter(ImageFilter.GaussianBlur(3))
img = Image.alpha_composite(img, crack_glow)
img = Image.alpha_composite(img, crack_layer)

ring_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rdraw = ImageDraw.Draw(ring_layer)
ring_cx, ring_cy = W * 0.40, H * 0.94
for i, (rw, alpha) in enumerate([(280, 90), (220, 140), (160, 190)]):
    rdraw.ellipse(
        [ring_cx - rw, ring_cy - rw * 0.22, ring_cx + rw, ring_cy + rw * 0.22],
        outline=(34, 211, 238, alpha),
        width=4,
    )
ring_glow = ring_layer.filter(ImageFilter.GaussianBlur(6))
img = Image.alpha_composite(img, ring_glow)

img.putalpha(255)
img.save("/home/claude/system-exe/src/assets/hero-art.png")
print("Hero art saved.")
