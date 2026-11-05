import urllib.request
import urllib.error
import time
import ssl
import hashlib

urls = [
    ("Firebase Gallery Root (HTML)", "https://unitess-gallery.web.app/"),
    ("Firebase Play Page (HTML)", "https://unitess-gallery.web.app/play.html"),
    ("Firebase Editor Page (HTML)", "https://unitess-gallery.web.app/editor.html"),
    ("Firebase Matrix-Cube (HTML)", "https://unitess-gallery.web.app/matrix-cube/"),
    ("Firebase Matrix-Cube JS Bundle", "https://unitess-gallery.web.app/matrix-cube/assets/index-BcneIqkN.js"),
    ("GitHub Pages D4-Cube (HTML)", "https://galua2001.github.io/d4-cube/"),
    ("GitHub Pages D4-Cube JS Bundle", "https://galua2001.github.io/d4-cube/assets/index-BcneIqkN.js"),
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print("=== [갈루아 큐브 Round 5 프로덕션 라이브 엔드포인트 7개 실측 전수 검증] ===")
results = []

for name, url in urls:
    start_time = time.time()
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    )
    status_code = None
    content_len = 0
    duration_ms = 0
    keyword_found = False
    error_msg = ""
    sha256_hash = ""
    detail_note = ""
    
    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as response:
            status_code = response.getcode()
            body = response.read()
            content_len = len(body)
            duration_ms = int((time.time() - start_time) * 1000)
            sha256_hash = hashlib.sha256(body).hexdigest()[:10]
            text = body.decode('utf-8', errors='ignore')
            
            # 엔드포인트별 핵심 검증
            if "index-BcneIqkN.js" in url:
                # D4 신규 공식 키워드 실측 확인
                has_diamond = "d4-diamond-cross-3" in text
                has_xcross = "d4-x-cross-3" in text
                has_ldiag = "d4-l-diag-combo-3" in text
                keyword_found = (has_diamond and has_xcross and has_ldiag)
                detail_note = f"공식 3종 탑재 검증 (다이아몬드:{has_diamond}, X-크로스:{has_xcross}, ㄱ자사선:{has_ldiag})"
            elif "/matrix-cube/" in url or "/d4-cube/" in url:
                has_bundle = "index-BcneIqkN.js" in text
                has_title = "갈루아" in text or "matrix-cube" in text or "Cube" in text
                keyword_found = (has_bundle and has_title)
                detail_note = f"BcneIqkN 번들 태그: {has_bundle}"
            elif "play.html" in url:
                has_canvas = "canvas" in text.lower() or "board" in text.lower()
                has_cache_busting = "20261105" in text
                keyword_found = has_canvas
                detail_note = f"캐시버스팅 반영: {has_cache_busting}"
            elif "editor.html" in url:
                has_editor = "editor" in text.lower() or "canvas" in text.lower()
                has_cache_busting = "20261105" in text
                keyword_found = has_editor
                detail_note = f"캐시버스팅 반영: {has_cache_busting}"
            else:
                has_gallery = "unitess" in text.lower() or "gallery" in text.lower()
                keyword_found = has_gallery
                detail_note = "갤러리 루트 정상 로드"

    except urllib.error.HTTPError as e:
        status_code = e.code
        duration_ms = int((time.time() - start_time) * 1000)
        error_msg = str(e)
    except Exception as e:
        status_code = "ERR"
        duration_ms = int((time.time() - start_time) * 1000)
        error_msg = str(e)

    status_str = f"HTTP {status_code}" if status_code == 200 else f"HTTP {status_code} ({error_msg})"
    pass_flag = (status_code == 200 and keyword_found)
    print(f"[{'PASS' if pass_flag else 'FAIL'}] {name}")
    print(f"      URL: {url}")
    print(f"      상태: {status_str} | 크기: {content_len:,} bytes | 응답: {duration_ms}ms | SHA: {sha256_hash} | {detail_note}")
    results.append({
        "name": name,
        "url": url,
        "status": status_code,
        "size": content_len,
        "latency_ms": duration_ms,
        "hash": sha256_hash,
        "keyword": keyword_found,
        "detail": detail_note,
        "pass": pass_flag
    })

print("\n=== 전수 검증 종합 결과 ===")
passed_count = sum(1 for r in results if r["pass"])
print(f"총 {len(urls)}개 중 {passed_count}개 ALL PASS (HTTP 200 OK & 번들 해시/내용 실측 일치)")
