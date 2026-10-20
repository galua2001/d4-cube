import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def main():
    # 1. dist 디렉토리에서 간단한 HTTP 서버 실행
    server = subprocess.Popen(
        ['python', '-m', 'http.server', '4173', '--directory', 'dist'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(1.5)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            
            # 모바일 뷰포트 (아이폰 환경)
            mobile_context = await browser.new_context(
                viewport={'width': 390, 'height': 844},
                user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
            )
            page = await mobile_context.new_page()

            # 앱 로드
            response = await page.goto('http://127.0.0.1:4173')
            print(f"HTTP Status: {response.status}")
            assert response.status == 200, f"Expected 200, got {response.status}"

            await page.wait_for_selector('.board-grid')
            await asyncio.sleep(1)

            # 1. 기본 테마 확인 (light)
            theme_attr = await page.evaluate("document.documentElement.getAttribute('data-theme')")
            print(f"Initial theme: {theme_attr}")
            assert theme_attr == 'light', f"Expected light theme, got {theme_attr}"

            # 라이트 테마 스크린샷 캡처
            out_dir = 'c:/Users/user/matrix-cube'
            light_shot = os.path.join(out_dir, 'verify_theme_light_default.png')
            await page.screenshot(path=light_shot)
            print(f"Saved: {light_shot}")

            # 2. 다크 모드 토글 클릭
            color_btn = page.locator('#btn-toggle-colormode')
            await color_btn.click()
            await asyncio.sleep(0.5)

            dark_attr = await page.evaluate("document.documentElement.getAttribute('data-theme')")
            print(f"Toggled theme: {dark_attr}")
            assert dark_attr == 'dark', f"Expected dark theme, got {dark_attr}"

            dark_shot = os.path.join(out_dir, 'verify_theme_dark_toggled.png')
            await page.screenshot(path=dark_shot)
            print(f"Saved: {dark_shot}")

            # 3. 새로고침 후 다크 모드 지속성(Persistence) 확인
            await page.reload()
            await page.wait_for_selector('.board-grid')
            reloaded_theme = await page.evaluate("document.documentElement.getAttribute('data-theme')")
            print(f"Theme after reload: {reloaded_theme}")
            assert reloaded_theme == 'dark', f"Expected dark theme after reload, got {reloaded_theme}"

            # 4. 다시 라이트 모드로 토글
            await page.locator('#btn-toggle-colormode').click()
            await asyncio.sleep(0.5)
            back_light = await page.evaluate("document.documentElement.getAttribute('data-theme')")
            print(f"Theme restored to light: {back_light}")
            assert back_light == 'light', f"Expected light theme, got {back_light}"

            # 5. 데스크톱 뷰포트에서도 확인
            desktop_context = await browser.new_context(
                viewport={'width': 1200, 'height': 800}
            )
            desktop_page = await desktop_context.new_page()
            await desktop_page.goto('http://127.0.0.1:4173')
            await desktop_page.wait_for_selector('.board-grid')
            await asyncio.sleep(0.5)

            desktop_shot = os.path.join(out_dir, 'verify_theme_light_desktop.png')
            await desktop_page.screenshot(path=desktop_shot)
            print(f"Saved: {desktop_shot}")

            print("All verification steps passed successfully!")

            await browser.close()
    finally:
        server.terminate()
        server.wait()

if __name__ == '__main__':
    asyncio.run(main())
