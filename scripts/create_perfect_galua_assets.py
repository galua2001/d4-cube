import os
from PIL import Image, ImageDraw

def create_perfect_galua_assets_tuned():
    # 1. 원본 스프라이트 시트 로드
    src_path = 'C:/Users/user/.gemini/antigravity/brain/8fe8c1c8-c925-46d9-b279-6f3341e65559/galois_sprite_sheet_parallel_clean_png_1792377748355.jpg'
    src = Image.open(src_path).convert('RGB')
    bg_color = src.getpixel((10, 10)) # (224, 224, 224)
    
    pad = 100
    padded = Image.new('RGB', (src.width + pad * 2, src.height + pad * 2), bg_color)
    padded.paste(src, (pad, pad))
    
    # 2. 정밀 1:1 대칭 크롭 (640x640 -> 600x600 Lanczos)
    # Front: X=329, Y=391
    fx, fy = 329 + pad, 391 + pad
    crop_f = padded.crop((fx - 320, fy - 320, fx + 320, fy + 320)).resize((600, 600), Image.Resampling.LANCZOS)
    
    # Back: X=1071, Y=393
    bx, by = 1071 + pad, 393 + pad
    crop_b = padded.crop((bx - 320, by - 320, bx + 320, by + 320)).resize((600, 600), Image.Resampling.LANCZOS)
    
    # 3. 뒷면 원래 '1' 지우기 및 유니폼 질감/줄무늬 복원
    clean_b = crop_b.copy()
    
    for y in range(270, 323):
        stripe_210 = 210.0 + (y - 270) * (3.0 / 53.0)
        
        for x in range(205, 242):
            r, g, b = clean_b.getpixel((x, y))
            is_num1 = (r < 180) or (r < 230 and b - r > 5)
            if is_num1:
                dist_stripe = abs(x - stripe_210)
                if dist_stripe < 0.6:
                    clean_b.putpixel((x, y), (22, 30, 48))
                elif dist_stripe < 1.4:
                    factor = (dist_stripe - 0.6) / 0.8
                    cr = int(22 * (1 - factor) + 244 * factor)
                    cg = int(30 * (1 - factor) + 248 * factor)
                    cb = int(48 * (1 - factor) + 252 * factor)
                    clean_b.putpixel((x, y), (cr, cg, cb))
                else:
                    clean_b.putpixel((x, y), (244, 248, 252))
                    
    # 4. 정통 야구 유니폼 스타일 등번호 '6' 생성 (8x 슈퍼샘플링)
    # 크기: 폭 w=48, 높이 h=62 (조금 더 듬직하고 선명한 크기)
    scale = 8
    w, h = 48, 62
    stroke, chamfer, top_drop, outline_w = 11.5, 8.5, 15.5, 3.2
    
    W = int(w * scale)
    H = int(h * scale)
    S = int(stroke * scale)
    C = int(chamfer * scale)
    TD = int(top_drop * scale)
    OW = int(outline_w * scale)
    
    img6 = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img6)
    
    loop_top = int(H * 0.44)
    inner_c = max(scale * 2, int(C * 0.6))
    
    outer_poly = [
        (C, 0),
        (W - C, 0),
        (W, C),
        (W, TD),
        (W - S, TD),
        (W - S, S),
        (S + inner_c, S),
        (S, S + inner_c),
        (S, loop_top),
        (W - C, loop_top),
        (W, loop_top + C),
        (W, H - C),
        (W - C, H),
        (C, H),
        (0, H - C),
        (0, C)
    ]
    
    hole_l = S
    hole_r = W - S
    hole_t = loop_top + S
    hole_b = H - S
    hole_c = max(scale * 3, int(C * 0.7))
    
    inner_poly = [
        (hole_l + hole_c, hole_t),
        (hole_r - hole_c, hole_t),
        (hole_r, hole_t + hole_c),
        (hole_r, hole_b - hole_c),
        (hole_r - inner_c, hole_b),
        (hole_l + hole_c, hole_b),
        (hole_l, hole_b - hole_c),
        (hole_l, hole_t + hole_c),
    ]
    
    fill_color = (255, 255, 255, 255)
    stroke_color = (22, 36, 71, 255)
    
    draw.polygon(outer_poly, fill=fill_color)
    draw.polygon(inner_poly, fill=(0, 0, 0, 0))
    
    draw.line(outer_poly + [outer_poly[0]], fill=stroke_color, width=OW, joint='curve')
    draw.line(inner_poly + [inner_poly[0]], fill=stroke_color, width=OW, joint='curve')
    
    num6 = img6.resize((w, h), Image.Resampling.LANCZOS)
    
    # GALOIS 중심 x=243, 등판 세로 중심 y=297
    num_x = int(243 - w / 2)
    num_y = int(297 - h / 2)
    clean_b.paste(num6, (num_x, num_y), num6)
    
    # 5. 모든 대상 경로에 저장
    paths = [
        'C:/Users/user/matrix-cube/public/assets/galua_front.png',
        'C:/Users/user/matrix-cube/public/assets/galua_back.png',
        'C:/Users/user/matrix-cube/dist/assets/galua_front.png',
        'C:/Users/user/matrix-cube/dist/assets/galua_back.png',
        'C:/Users/user/.gemini/antigravity/brain/8fe8c1c8-c925-46d9-b279-6f3341e65559/verified_galua_front_1to1.png',
        'C:/Users/user/.gemini/antigravity/brain/8fe8c1c8-c925-46d9-b279-6f3341e65559/verified_galua_back_1to1.png'
    ]
    
    for p in paths:
        if 'front' in p:
            crop_f.save(p)
        else:
            clean_b.save(p)
            
    print('Tuned 6 assets saved successfully!')

create_perfect_galua_assets_tuned()
