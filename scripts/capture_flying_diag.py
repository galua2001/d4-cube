import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 480, 'height': 850})
    page.goto('http://localhost:8080/matrix-cube/index.html')
    time.sleep(1)
    
    # 테마 갈루아로 전환
    page.locator('#btn-toggle-theme').click()
    time.sleep(0.5)
    
    # 대각선 버튼 ON
    diag_btn = page.locator('#btn-toggle-diag')
    if diag_btn.count() > 0:
        diag_btn.click()
        time.sleep(0.5)
        
    # 2행 1열(21 성분, index 3)에서 대각선 드래그하여 2행 주대각 대칭(MD)
    cell = page.locator('.cell-box').nth(3)
    box = cell.bounding_box()
    if box:
        # 좌상단 -> 우하단 드래그
        page.mouse.move(box['x'] + 10, box['y'] + 10)
        page.mouse.down()
        page.mouse.move(box['x'] + box['width'] - 10, box['y'] + box['height'] - 10, steps=10)
        page.mouse.up()
        time.sleep(1)
        
    page.screenshot(path='C:/Users/user/.gemini/antigravity/brain/8fe8c1c8-c925-46d9-b279-6f3341e65559/local_flying_diag_flipped.png')
    print('Captured flying diag flipped!')
    browser.close()
