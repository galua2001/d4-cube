import urllib.request
import urllib.error
import ssl
import time

urls = [
    ("Firebase 메인 갤러리", "https://unitess-gallery.web.app/"),
    ("Firebase 통합 플레이어", "https://unitess-gallery.web.app/play.html"),
    ("Firebase 매트릭스 큐브 인덱스", "https://unitess-gallery.web.app/matrix-cube/"),
    ("Firebase 최신 JS 번들", "https://unitess-gallery.web.app/matrix-cube/assets/index-BpxdzSA4.js"),
    ("Firebase 최신 CSS 스타일", "https://unitess-gallery.web.app/matrix-cube/assets/index-Ds7P9bfZ.css"),
    ("GitHub Pages 라이브 인덱스", "https://galua2001.github.io/d4-cube/"),
    ("GitHub Pages 최신 JS 번들", "https://galua2001.github.io/d4-cube/assets/index-BpxdzSA4.js"),
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

results = []
print("=== 프로덕션 라이브 엔드포인트 전수 검증 시작 ===")

for name, url in urls:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (GaloisCube-QA-Tester/1.0)"}
    )
    start_t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as response:
            status = response.status
            content = response.read()
            size = len(content)
            elapsed = time.time() - start_t
            
            # 번들 내부 키워드 검증
            bundle_ok = False
            if "index-BpxdzSA4.js" in url:
                # Round 9 신규 공식 키워드 확인
                text = content.decode('utf-8', errors='ignore')
                has_flux = "d4-twin-column-flux-4" in text or "d4TwinColumnFlux" in text or "d4-corner-kite-flux-4" in text
                has_hbracket = "d4-h-bracket-smash-3" in text or "d4HBracket" in text or "d4-plus-omega-cross-3" in text
                has_starburst = "d4-star-burst-vortex-4" in text or "d4StarBurst" in text or "d4-hyper-cube-frame-4" in text
                bundle_ok = has_flux or has_hbracket or has_starburst
            
            results.append({
                "name": name,
                "url": url,
                "status": status,
                "size": size,
                "elapsed": elapsed,
                "bundle_ok": bundle_ok if "index-BpxdzSA4.js" in url else None
            })
            print(f"[{status} OK] {name} ({size:,} bytes, {elapsed:.2f}s)")
            if "index-BpxdzSA4.js" in url:
                print(f"    └─ 최신 번들 시그니처 검증: {'PASS' if bundle_ok else 'FAIL'}")
    except urllib.error.HTTPError as e:
        elapsed = time.time() - start_t
        results.append({
            "name": name,
            "url": url,
            "status": e.code,
            "size": 0,
            "elapsed": elapsed,
            "bundle_ok": False
        })
        print(f"[{e.code} FAIL] {name} ({elapsed:.2f}s) - {e.reason}")
    except Exception as e:
        elapsed = time.time() - start_t
        results.append({
            "name": name,
            "url": url,
            "status": 0,
            "size": 0,
            "elapsed": elapsed,
            "bundle_ok": False
        })
        print(f"[ERR] {name} ({elapsed:.2f}s) - {str(e)}")

print("\n=== 전체 검증 요약 ===")
all_passed = all(r["status"] == 200 for r in results)
print(f"결과: {'전수 성공 (7/7 200 OK)' if all_passed else '일부 실패'}")
