# -*- coding: utf-8 -*-
translations_path = r'C:\Users\user\matrix-cube\src\i18n\translations.ts'

with open(translations_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 'en: {' 와 'ko: {' 사이의 범위를 찾아서
# 라인 680에 삽입된 한국어 블록 제거
en_start = code.find("en: {")
ko_start = code.find("ko: {")

en_part = code[en_start:ko_start]
ko_part = code[ko_start:]

# en_part에서 '    // Round 8 신규 D4 마스터 공식 3선 (ko)' 가 있으면 제거
bad_marker = "    // Round 8 신규 D4 마스터 공식 3선 (ko)"
bad_idx = en_part.find(bad_marker)
if bad_idx != -1:
    # Find the end of this block, which is before '  },'
    end_idx = en_part.find("  },", bad_idx)
    en_part = en_part[:bad_idx] + en_part[end_idx:]
    print("Cleaned up wrongly placed Korean block from en section!")

new_code = code[:en_start] + en_part + ko_part
with open(translations_path, 'w', encoding='utf-8') as f:
    f.write(new_code)
print("translations.ts cleanup completed!")
