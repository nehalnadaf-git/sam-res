import os
import base64
from PIL import Image

def generate_all_icons():
    # Source image path (Gemini-generated monogram logo)
    src_path = 'C:/Users/Nehal/.gemini/antigravity-ide/brain/ed5fc5cf-1a3e-41c8-a948-d065a699c880/flat_hospitality_logo_gold_bg_1781805640518.png'
    img = Image.open(src_path)
    
    # Target directory
    public_dir = 'e:/Developer/samiullah/public'
    
    # 1. Save apple-touch-icon.png (1024x1024)
    img_1024 = img.resize((1024, 1024), Image.Resampling.LANCZOS)
    img_1024.save(os.path.join(public_dir, 'apple-touch-icon.png'), 'PNG')
    print("Saved apple-touch-icon.png (1024x1024)")
    
    # 2. Save web-app-manifest-512x512.png (512x512)
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(public_dir, 'web-app-manifest-512x512.png'), 'PNG')
    print("Saved web-app-manifest-512x512.png")
    
    # 3. Save web-app-manifest-192x192.png (192x192)
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(public_dir, 'web-app-manifest-192x192.png'), 'PNG')
    print("Saved web-app-manifest-192x192.png")
    
    # 4. Save favicon-96x96.png (96x96)
    img_96 = img.resize((96, 96), Image.Resampling.LANCZOS)
    img_96.save(os.path.join(public_dir, 'favicon-96x96.png'), 'PNG')
    print("Saved favicon-96x96.png")
    
    # 5. Save favicon.ico (48x48)
    img_48 = img.resize((48, 48), Image.Resampling.LANCZOS)
    img_48.save(os.path.join(public_dir, 'favicon.ico'), 'ICO')
    print("Saved favicon.ico")
    
    # 6. Generate base64 embedded favicon.svg from the 192x192 PNG to keep file size small but crisp
    temp_path = os.path.join(public_dir, 'web-app-manifest-192x192.png')
    with open(temp_path, 'rb') as f:
        encoded_data = base64.b64encode(f.read()).decode('utf-8')
        
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="100%" height="100%">
  <image href="data:image/png;base64,{encoded_data}" width="192" height="192"/>
</svg>'''
    
    with open(os.path.join(public_dir, 'favicon.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Saved favicon.svg (with base64 embedded PNG)")

if __name__ == '__main__':
    generate_all_icons()
