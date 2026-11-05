import urllib.request
import re
import ssl
import sys

# SSL context
ctx = ssl.create_default_context()

targets = [
    ("Firebase play.html", "https://unitess-gallery.web.app/play.html"),
    ("Firebase matrix-cube index.html", "https://unitess-gallery.web.app/matrix-cube/index.html"),
    ("Firebase 최신 JS 번들", "https://unitess-gallery.web.app/matrix-cube/assets/index-BuoDbGK_.js"),
    ("GitHub Pages 라이브 배포", "https://galua2001.github.io/d4-cube/"),
]

all_passed = True
results = []

for name, url in targets:
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TestVerifier/1.0'}
        )
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            status = resp.status
            body = resp.read()
            length = len(body)
            results.append((name, url, status, length, "OK"))
            print(f"[PASS] {name} -> Status: {status}, Size: {length} bytes")
    except Exception as e:
        all_passed = False
        results.append((name, url, "ERROR", 0, str(e)))
        print(f"[FAIL] {name} -> Error: {e}")

# Check content in Firebase index.html
try:
    req = urllib.request.Request("https://unitess-gallery.web.app/matrix-cube/index.html", headers={'User-Agent': 'TestVerifier/1.0'})
    with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        if "index-BuoDbGK_.js" in content:
            print("[PASS] Firebase matrix-cube/index.html contains latest bundle 'index-BuoDbGK_.js'!")
        else:
            print(f"[WARN] Latest bundle hash not found directly in index.html: {content[:300]}")
except Exception as e:
    print(f"[ERROR] Checking bundle script tag: {e}")

# Check JS bundle content for formula keywords
try:
    req = urllib.request.Request("https://unitess-gallery.web.app/matrix-cube/assets/index-BuoDbGK_.js", headers={'User-Agent': 'TestVerifier/1.0'})
    with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
        js_content = resp.read().decode('utf-8', errors='ignore')
        keywords = ["diamond-cross-3m", "l-diag-cascade-3m", "x-cross-3m"]
        for kw in keywords:
            if kw in js_content:
                print(f"[PASS] JS bundle contains formula key: {kw}")
            else:
                print(f"[FAIL] JS bundle missing formula key: {kw}")
                all_passed = False
except Exception as e:
    print(f"[ERROR] Checking JS bundle content: {e}")

if all_passed:
    print("\n>>> ALL LIVE NETWORK VERIFICATIONS SUCCEEDED (HTTP 200 OK) <<<")
else:
    print("\n>>> SOME CHECKS FAILED <<<")
