"""Generate app icons, adaptive-icon layers, and splash images for Personal OS."""
from PIL import Image, ImageDraw, ImageFont
import os

PRIMARY = (99, 102, 241)      # indigo
PRIMARY_DARK = (79, 70, 229)
BG = (11, 13, 16)             # near-black
WHITE = (255, 255, 255)

def font(size):
    for p in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def rounded_icon(size, radius_frac=0.22):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(size * radius_frac)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=PRIMARY)
    f = font(int(size * 0.55))
    text = "P"
    bbox = d.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]), text, font=f, fill=WHITE)
    return img

def square_icon(size):
    img = Image.new("RGBA", (size, size), PRIMARY + (255,))
    d = ImageDraw.Draw(img)
    f = font(int(size * 0.55))
    text = "P"
    bbox = d.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]), text, font=f, fill=WHITE)
    return img

def foreground_layer(size):
    """Adaptive icon foreground: transparent bg, centered glyph in safe zone."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = font(int(size * 0.36))
    text = "P"
    bbox = d.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]), text, font=f, fill=WHITE)
    return img

def splash(w, h):
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)
    icon = rounded_icon(min(w, h) // 4)
    img.paste(icon, ((w - icon.width) // 2, (h - icon.height) // 2 - h // 12), icon)
    f = font(max(24, min(w, h) // 20))
    text = "Personal OS"
    bbox = d.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    d.text(((w - tw) / 2 - bbox[0], h // 2 + h // 12), text, font=f, fill=WHITE)
    return img

# ---- Public web / PWA icons ----
os.makedirs("public/icons", exist_ok=True)
rounded_icon(192).save("public/icons/icon-192.png")
rounded_icon(512).save("public/icons/icon-512.png")
rounded_icon(180).save("public/apple-touch-icon.png")
square_icon(32).save("public/favicon-32.png")
# Simple favicon.ico
square_icon(48).save("public/favicon.ico", format="ICO", sizes=[(16,16),(32,32),(48,48)])

# ---- Android mipmap densities ----
android_res = "android/app/src/main/res"
densities = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
fg_densities = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
for name, px in densities.items():
    d = f"{android_res}/mipmap-{name}"
    os.makedirs(d, exist_ok=True)
    square_icon(px).save(f"{d}/ic_launcher.png")
    rounded_icon(px).save(f"{d}/ic_launcher_round.png")
    foreground_layer(fg_densities[name]).save(f"{d}/ic_launcher_foreground.png")

# ---- Splash (drawable + Capacitor densities) ----
os.makedirs(f"{android_res}/drawable", exist_ok=True)
splash(1080, 1920).save(f"{android_res}/drawable/splash.png")
# density-specific splash for @capacitor/splash-screen
splash_dens = {
    "drawable-port-mdpi": (320, 480),
    "drawable-port-hdpi": (480, 800),
    "drawable-port-xhdpi": (720, 1280),
    "drawable-port-xxhdpi": (960, 1600),
    "drawable-port-xxxhdpi": (1280, 1920),
    "drawable-land-mdpi": (480, 320),
    "drawable-land-hdpi": (800, 480),
    "drawable-land-xhdpi": (1280, 720),
    "drawable-land-xxhdpi": (1600, 960),
    "drawable-land-xxxhdpi": (1920, 1280),
}
for folder, (w, h) in splash_dens.items():
    dd = f"{android_res}/{folder}"
    os.makedirs(dd, exist_ok=True)
    splash(w, h).save(f"{dd}/splash.png")

print("assets generated")
