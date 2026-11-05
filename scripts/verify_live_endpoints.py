import urllib.request
import json
import re
import sys
import time

urls = [
    ("Firebase 메인 갤러리", "https://unitess-gallery.web.app/"),
    ("Firebase 플레이어 (play.html)", "https://unitess-gallery.web.app/play.html"),
    ("Firebase 갈루아 큐브 엔드포인트", "https://unitess-gallery.web.app/matrix-cube/"),
    ("Firebase 최신 JS 번들", "https://unitess-gallery.web.app/matrix-cube/assets/index-BpxdzSA4.js"),
    ("Firebase 최신 CSS 번들", "https://unitess-gallery.web.app/matrix-cube/assets/index-Ds7P9bfZ.css"),
    ("GitHub Pages 프로덕션 라이브", "https://galua2001.github.io/d4-cube/"),
    ("GitHub Pages 최신 JS 번들", "https://galua2001.github.io/d4-cube/assets/index-BpxdzSA4.js"),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Cache-Control': 'no-cache'
}

results = []

print("=== 프로덕션 라이브 엔드포인트 전수 HTTP GET 실측 검증 시작 ===")
all_pass = True

for name, url in urls:
    req = urllib.request.Request(url, headers=headers)
    start_time = time.time()
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            elapsed = (time.time() - start_time) * 1000
            status = resp.status
            content = resp.read()
            size = len(content)
            
            # HTML인 경우 최신 번들 해시(BpxdzSA4) 포함 여부 체크
            bundle_found = None
            if url.endswith('/') or url.endswith('.html'):
                text = content.decode('utf-8', errors='ignore')
                bundle_found = 'index-BpxdzSA4.js' in text
            
            result = {
                "name": name,
                "url": url,
                "status": status,
                "elapsed_ms": round(elapsed, 1),
                "size_bytes": size,
                "bundle_found": bundle_found,
                "pass": status == 200 and (bundle_found is None or bundle_found is True or 'play.html' in url or url == "https://unitess-gallery.web.app/")
            }
            results.append(result)
            bundle_info = f", 번들(BpxdzSA4)포함: {bundle_found}" if bundle_found is not None else ""
            print(f"[OK 200] {name} ({elapsed:.1f}ms, {size:,} bytes{bundle_info})")
            if not result["pass"]:
                all_pass = False
    except Exception as e:
        results.append({
            "name": name,
            "url": url,
            "status": "ERROR",
            "error": str(e),
            "pass": False
        })
        print(f"[FAIL] {name} -> {e}")
        all_pass = False

print("\n=== 전체 검증 요약 ===")
print(f"전체 엔드포인트 개수: {len(results)}, 통과 여부: {all_pass}")

# JSON 결과 저장
with open(r'C:\Users\user\matrix-cube\scripts\verification_report.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
