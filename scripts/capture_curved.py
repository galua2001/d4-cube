import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 450, 'height': 820})
        
        # Open local URL
        response = await page.goto('http://localhost:8080/matrix-cube/index.html')
        print('HTTP Status:', response.status)
        await page.wait_for_timeout(1000)
        
        # Check if Galois theme is active
        # The default in localStorage is 'dog' unless switched.
        # Let's set localStorage to 'galua' and reload to ensure Galois theme is shown:
        await page.evaluate("() => { localStorage.setItem('galois_cube_theme', 'galua'); }")
        await page.reload()
        await page.wait_for_timeout(1000)
        
        out_dir = r'C:\Users\user\.gemini\antigravity\brain\8fe8c1c8-c925-46d9-b279-6f3341e65559'
        
        # 1. Capture Initial Board (Front views of curved staff)
        path1 = os.path.join(out_dir, 'curved_staff_board_front.png')
        await page.screenshot(path=path1)
        print('Saved:', path1)
        
        # 2. Click Row 1 flip button
        # In main.ts, row buttons have class .btn-row-action or data attributes, or text 'Row 1' / '1행'
        buttons = await page.query_selector_all('button')
        clicked = False
        for btn in buttons:
            txt = (await btn.inner_text()).strip()
            if 'Row 1' in txt or '1행' in txt or 'R1' in txt:
                print('Found button:', txt)
                await btn.click()
                clicked = True
                break
        
        if not clicked:
            # If buttons are canvas or controls
            print('Trying tile click or control click')
            r1 = await page.query_selector('.control-btn')
            if r1:
                await r1.click()
        
        await page.wait_for_timeout(700) # wait for 3D flip animation to settle
        
        # 3. Capture Front & Back comparison
        path2 = os.path.join(out_dir, 'curved_staff_front_back_comparison.png')
        await page.screenshot(path=path2)
        print('Saved:', path2)
        
        # 4. Click Diagonal button (Main Diag)
        for btn in buttons:
            txt = (await btn.inner_text()).strip()
            if 'Main Diag' in txt or '주대각선' in txt or 'MD' in txt:
                print('Found Diag button:', txt)
                await btn.click()
                break
        await page.wait_for_timeout(700)
        
        path3 = os.path.join(out_dir, 'curved_staff_diag_symmetry.png')
        await page.screenshot(path=path3)
        print('Saved:', path3)
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
