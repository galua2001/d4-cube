# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\styles\formulaModal.css'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

r6_css = """
/* ==========================================================================
   Round 6: 속도 제어 버튼(0.5x, 1.0x, 2.0x), 공식 복사 버튼 & 복사 토스트 스타일
   ========================================================================== */

/* 공식 표기법 상단 헤더 및 복사 버튼 */
.formula-notation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.btn-copy-formula {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.btn-copy-formula:hover {
  background: rgba(56, 189, 248, 0.25);
  border-color: #38bdf8;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
}

.btn-copy-formula:active {
  transform: translateY(0);
}

.btn-copy-formula.copied {
  background: rgba(34, 197, 94, 0.25);
  border-color: #22c55e;
  color: #4ade80;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

/* 재생 컨트롤 바 & 속도 선택기 */
.step-playback-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-playback-main-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.step-speed-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 23, 42, 0.6);
  padding: 3px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: fit-content;
}

.formula-speed-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.formula-speed-btn:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.08);
}

.formula-speed-btn.active {
  background: #3b82f6;
  color: #ffffff;
  box-shadow: 0 1px 6px rgba(59, 130, 246, 0.45);
}

/* 공식 복사 알림 토스트 (Toast Feedback) */
.formula-toast {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid #38bdf8;
  color: #e0f2fe;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(56, 189, 248, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10002;
  white-space: nowrap;
}

.formula-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
"""

if "Round 6:" not in content:
    content += r6_css
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("formulaModal.css updated successfully with Round 6 styles!")
else:
    print("formulaModal.css already has Round 6 styles!")
