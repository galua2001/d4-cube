import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 480, 'height': 850})
    page.goto('http://localhost:8080/matrix-cube/index.html')
    time.sleep(1)
    
    # 테마 토글 버튼 클릭
    page.locator('#btn-toggle-theme').click()
    time.sleep(1)
    
    page.screenshot(path='C:/Users/user/.gemini/antigravity/brain/8fe8c1c8-c925-46d9-b279-6f3341e65559/local_flying_board.png')
    print('1. Captured flying board')
    
    # 0번 타일(1행 1열)을 가로로 스와이프하여 1행 반전 (뒷모습 확인)
    cell = page.locator('.cell-box').first
    box = cell.bounding_box()
    if box:
        page.mouse.move(box['x'] + 20, box['y'] + box['height'] / 2)
        page.mouse.down()
        page.mouse.move(box['x'] + box['width'] - 10, box['y'] + box['height'] / 2, steps=10)
        page.mouse.up()
        time.sleep(1)
        
    page.screenshot(path='C:/Users/user/.gemini/antigravity/brain/8fe8c1c8-c925-46d9-b279-6f3341e65559/local_flying_row1_flipped.png')
    print('2. Captured flying row1 flipped')
    
    browser.close()
