import urllib.request
import urllib.error
import time
import ssl

urls = [
    "https://unitess-gallery.web.app/",
    "https://unitess-gallery.web.app/matrix-cube/",
    "https://unitessplay.web.app/",
    "https://unitessplay.web.app/matrix-cube/",
    "https://sungholee-tech.github.io/matrix-cube/",
    "https://sungholee-tech.github.io/unitess/",
    "https://sungholee-tech.github.io/unitessplay/"
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print("=== [갈루아 큐브 Round 4 프로덕션 엔드포인트 전수 검증] ===")
results = []

for url in urls:
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
    
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            status_code = response.getcode()
            body = response.read()
            content_len = len(body)
            duration_ms = int((time.time() - start_time) * 1000)
            text = body.decode('utf-8', errors='ignore')
            
            # 핵심 키워드 검증
            if "matrix-cube" in url:
                keyword_found = "BcneIqkN" in text or "갈루아" in text or "matrix-cube" in text
            else:
                keyword_found = "unitess" in text.lower() or "tessellation" in text.lower() or "canvas" in text.lower() or "갈루아" in text

    except urllib.error.HTTPError as e:
        status_code = e.code
        duration_ms = int((time.time() - start_time) * 1000)
        error_msg = str(e)
    except Exception as e:
        status_code = "ERR"
        duration_ms = int((time.time() - start_time) * 1000)
        error_msg = str(e)

    status_str = f"HTTP {status_code}" if status_code == 200 else f"HTTP {status_code} ({error_msg})"
    print(f"[{'PASS' if status_code == 200 else 'FAIL'}] {url}")
    print(f"      상태: {status_str} | 응답 크기: {content_len:,} bytes | 지연시간: {duration_ms}ms | 키워드 일치: {keyword_found}")
    results.append({
        "url": url,
        "status": status_code,
        "size": content_len,
        "latency_ms": duration_ms,
        "keyword": keyword_found,
        "error": error_msg
    })

print("\n=== 전수 검증 종합 결과 ===")
passed_count = sum(1 for r in results if r["status"] == 200)
print(f"총 {len(urls)}개 중 {passed_count}개 통과 (HTTP 200 OK)")
