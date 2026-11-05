# -*- coding: utf-8 -*-
import sys

target_path = r'C:\Users\user\matrix-cube\src\main.ts'

with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 잘못 배치된 위치 찾기
wrong_marker = "window.addEventListener('DOMContentLoaded', () => {\n  new MatrixCubeApp();\n\n  /**\n   * 공식 비법서 '실전 보드 연습' 모드 시작 (Board Hydration)"
if wrong_marker not in content:
    # \r\n 형식 처리
    content = content.replace('\r\n', '\n')

marker = "window.addEventListener('DOMContentLoaded', () => {\n  new MatrixCubeApp();\n\n  /**"
idx = content.find(marker)
if idx != -1:
    before = content[:idx]
    # before 끝에는 updateBoard의 마지막 }들이 있음:
    #   }
    # }
    # 
    last_class_close = before.rfind('  }\n}')
    if last_class_close != -1:
        # 클래스 닫기 직전 위치
        class_content = before[:last_class_close + 4] # "  }\n"
        
        # 메서드 본문
        methods_start = content.find('  /**\n   * 공식 비법서 \'실전 보드 연습\' 모드 시작 (Board Hydration)', idx)
        methods_content = content[methods_start:]
        # methods_content 끝의 마지막 }\n} 제거
        # methods_content 에서 끝부분 찾기
        end_idx = methods_content.rfind('}\n}')
        if end_idx != -1:
            methods_only = methods_content[:end_idx + 1] # methods_only 끝은 endPracticeMode의 '}'
        else:
            methods_only = methods_content.rstrip().rstrip('}')

        new_content = class_content + '\n' + methods_only + '\n}\n\n// 앱 실행\nwindow.addEventListener(\'DOMContentLoaded\', () => {\n  new MatrixCubeApp();\n});\n'
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully fixed class closing in main.ts!")
    else:
        print("Error: last_class_close not found!")
else:
    print("Error: marker not found!")
