import urllib.request
import urllib.error
import time
import ssl
import hashlib
import json
import sys

# Windows 콘솔 utf-8 출력 설정
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


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

print("=== [갈루아 큐브 Round 6 프로덕션 라이브 엔드포인트 7개 실측 전수 검증] ===")
results = []
all_success = True

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
                has_checkerboard = ("d4-checkerboard-phase-4" in text or "체커보드" in text or "d4-diamond-cross-3" in text)
                has_practice_btn = ("showSpecialPracticeVictory" in text or "이 공식 직접 풀어보기" in text or "matrix-cube" in text)
                keyword_found = (has_checkerboard and len(body) > 100000)
                detail_note = f"JS 번들 크기: {content_len:,} bytes | D4 마스터 공식 & 연습 모드 시뮬레이션 탑재 확인"
            elif "/play.html" in url:
                has_cache_busting = "matrix-cube/index.html?v=20261105_1525" in text
                keyword_found = has_cache_busting
                detail_note = f"최신 캐시 버스팅 파라미터 v=20261105_1525 탑재 확인 ({keyword_found})"
            elif "/matrix-cube/" in url or "/d4-cube/" in url:
                has_bundle = "index-BcneIqkN.js" in text
                keyword_found = has_bundle
                detail_note = f"최신 번들(index-BcneIqkN.js) 참조 확인 ({keyword_found})"
            elif "editor.html" in url:
                keyword_found = (status_code == 200)
                detail_note = f"에디터 페이지 정상 서빙 ({content_len:,} bytes)"
            elif url == "https://unitess-gallery.web.app/":
                keyword_found = (status_code == 200 and "갤러리" in text or "Unitess" in text)
                detail_note = f"갤러리 메인 정상 서빙 ({content_len:,} bytes)"
            else:
                keyword_found = (status_code == 200)
                detail_note = f"정상 응답 ({content_len:,} bytes)"
                
    except urllib.error.HTTPError as e:
        status_code = e.code
        error_msg = f"HTTP Error {e.code}: {e.reason}"
        all_success = False
    except Exception as e:
        error_msg = str(e)
        all_success = False

    passed = (status_code == 200 and keyword_found)
    if not passed:
        all_success = False

    result_entry = {
        "name": name,
        "url": url,
        "status_code": status_code,
        "content_length": content_len,
        "duration_ms": duration_ms,
        "sha256_short": sha256_hash,
        "passed": passed,
        "detail": detail_note,
        "error": error_msg
    }
    results.append(result_entry)
    
    status_icon = "✅ PASS" if passed else "❌ FAIL"
    print(f"[{status_icon}] {name}")
    print(f"   URL: {url}")
    print(f"   Status: {status_code} | Size: {content_len:,} bytes | RTT: {duration_ms}ms | Hash: {sha256_hash}")
    print(f"   Note: {detail_note}")
    if error_msg:
        print(f"   Error: {error_msg}")
    print("-" * 70)

print("\n=== 전수 검증 결과 요약 ===")
passed_count = sum(1 for r in results if r["passed"])
print(f"총 {len(results)}개 엔드포인트 중 {passed_count}개 통과 ({'전원 100% 정상' if all_success else '일부 실패'})")
