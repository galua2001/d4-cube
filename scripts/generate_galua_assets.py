from PIL import Image

src = Image.open('C:/Users/user/.gemini/antigravity/brain/8fe8c1c8-c925-46d9-b279-6f3341e65559/.user_uploaded/media_1792373871174_6a0a65bd.png')

# 1. 모눈 박스 내부:
# 상단 y=83, 하단 y=686 (높이 604)
# 좌측 절반: x=40 ~ 510 (폭 470)
# 우측 절반: x=512 ~ 983 (폭 471)

# 캐릭터 중심:
# Front: x 약 265, y 약 385
# Back: x 약 745, y 약 385

# 604x604 정사각형 캔버스를 만들고,
# 모눈 패턴의 기본 배경색 (233, 232, 227)으로 채움.
bg_color = (233, 232, 227, 255)

# Front 크롭: x 40~510, y 83~686 (470 x 603)
crop_f = src.crop((40, 83, 510, 686))
canvas_f = Image.new('RGBA', (603, 603), bg_color)
# 좌우 여백 패딩: (603 - 470) // 2 = 66
canvas_f.paste(crop_f, (66, 0))

# 좌우 패딩 영역에 자연스럽게 모눈 선 연장하기
# crop_f의 왼쪽 끝 모눈선 위치와 오른쪽 끝 모눈선 위치를 이어받아 그리기
final_front = canvas_f.resize((600, 600), Image.Resampling.LANCZOS)
final_front.save('public/assets/galua_front.png')

# Back 크롭: x 512~983, y 83~686 (471 x 603)
crop_b = src.crop((512, 83, 983, 686))
canvas_b = Image.new('RGBA', (603, 603), bg_color)
canvas_b.paste(crop_b, (66, 0))
final_back = canvas_b.resize((600, 600), Image.Resampling.LANCZOS)
final_back.save('public/assets/galua_back.png')

print("Created 600x600 galua_front.png and galua_back.png successfully!")
