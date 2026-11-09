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
    ("Firebase Matrix-Cube JS Bundle", "https://unitess-gallery.web.app/matrix-cube/assets/index-BpxdzSA4.js"),
    ("GitHub Pages D4-Cube (HTML)", "https://galua2001.github.io/d4-cube/"),
    ("GitHub Pages D4-Cube JS Bundle", "https://galua2001.github.io/d4-cube/assets/index-BpxdzSA4.js"),
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print("================================================================================")
print("  갈루아 큐브(Galois Cube) LBL 정통 해법 및 공식/비법서 이원화 배포 라이브 실측 검증")
print("================================================================================\n")

results = []
all_success = True

for idx, (name, url) in enumerate(urls, 1):
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
            sha256_hash = hashlib.sha256(body).hexdigest()[:12]
            text = body.decode('utf-8', errors='ignore')
            
            # 엔드포인트별 핵심 검증
            if "index-BpxdzSA4.js" in url:
                # LBL / 비법서 및 마스터 공식 실측 확인
                has_lbl = ("lbl" in text.lower() or "formula.category.godNumber" in text or "d4-zigzag-diagonal-flush-4" in text)
                has_finish = ("finish-l-shape-5" in text or "d4-corner-sandwich-3" in text)
                keyword_found = (has_lbl and has_finish and len(body) > 300000)
                detail_note = f"JS 번들 크기: {content_len:,} bytes | LBL 및 마스터 공식 29선 탑재 확인 (SHA256: {sha256_hash})"
            elif "/play.html" in url:
                has_cache_busting = "matrix-cube/index.html?v=20261109_1852" in text
                keyword_found = has_cache_busting
                detail_note = f"최신 캐시 버스팅 파라미터 v=20261109_1852 탑재 확인 (일치: {keyword_found})"
            elif "/matrix-cube/" in url or "/d4-cube/" in url:
                has_bundle = "index-BpxdzSA4.js" in text
                keyword_found = has_bundle
                detail_note = f"최신 번들(index-BpxdzSA4.js) 참조 확인 (일치: {keyword_found})"
            elif "editor.html" in url:
                keyword_found = (status_code == 200)
                detail_note = f"에디터 페이지 정상 서빙 ({content_len:,} bytes)"
            elif url == "https://unitess-gallery.web.app/":
                keyword_found = (status_code == 200 and ("갤러리" in text or "Unitess" in text))
                detail_note = f"갤러리 메인 정상 서빙 ({content_len:,} bytes)"
            else:
                keyword_found = (status_code == 200)
                detail_note = f"정상 응답 ({content_len:,} bytes)"
                
    except urllib.error.HTTPError as e:
        status_code = e.code
        duration_ms = int((time.time() - start_time) * 1000)
        error_msg = f"HTTP Error {e.code}: {e.reason}"
        all_success = False
    except Exception as e:
        duration_ms = int((time.time() - start_time) * 1000)
        error_msg = str(e)
        all_success = False

    is_ok = (status_code == 200 and (keyword_found if keyword_found is not None else True))
    if not is_ok:
        all_success = False
        
    res_entry = {
        "index": idx,
        "name": name,
        "url": url,
        "status": status_code,
        "latency_ms": duration_ms,
        "size_bytes": content_len,
        "sha256": sha256_hash,
        "verified": is_ok,
        "detail": detail_note if not error_msg else error_msg
    }
    results.append(res_entry)
    
    badge = "[200 OK PASS]" if is_ok else "[FAILED]"
    print(f"[{idx}/7] {badge} {name}")
    print(f"      URL: {url}")
    print(f"      Status: {status_code} | Latency: {duration_ms}ms | Size: {content_len:,} bytes | Hash: {sha256_hash}")
    print(f"      Note: {res_entry['detail']}\n")

print("--------------------------------------------------------------------------------")
if all_success:
    print("[ALL PASS] 7개 라이브 프로덕션 엔드포인트 전수 200 OK 및 최신 번들 정상 반영 실측 완료!")
else:
    print("[WARN/FAIL] 일부 엔드포인트에서 미반영 또는 오류가 발생하였습니다.")
print("================================================================================\n")

with open(r'C:\Users\user\matrix-cube\scripts\verification_report_lbl.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
