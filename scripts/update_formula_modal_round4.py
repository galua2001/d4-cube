# -*- coding: utf-8 -*-
"""
formulaModal.ts 및 formulaModal.css 에 실전 보드 연습(Practice on Board) 버튼 및 콜백 탑재
"""
import sys

modal_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.ts'
css_path = r'C:\Users\user\matrix-cube\src\styles\formulaModal.css'

# 1. formulaModal.ts 업데이트
with open(modal_path, 'r', encoding='utf-8') as f:
    modal_content = f.read()

# FormulaItem import 추가
old_import = "import {\n  FORMULAS,\n  FormulaCategory,\n  FormulaStep,\n  getFormulasByCategory,\n  getFormulaById\n} from '../data/formulas';"
new_import = "import {\n  FORMULAS,\n  FormulaCategory,\n  FormulaStep,\n  FormulaItem,\n  getFormulasByCategory,\n  getFormulaById\n} from '../data/formulas';"

if old_import in modal_content:
    modal_content = modal_content.replace(old_import, new_import, 1)

# onPracticeCallback 필드 및 setPracticeCallback 메서드 추가
class_start = 'export class FormulaModalController {'
callback_field = '''export class FormulaModalController {
  private onPracticeCallback?: (formula: FormulaItem) => void;

  public setPracticeCallback(cb: (formula: FormulaItem) => void): void {
    this.onPracticeCallback = cb;
  }'''

if class_start in modal_content:
    modal_content = modal_content.replace(class_start, callback_field, 1)

# renderDetail() 내부에 CTA 버튼 추가
playback_bar_end = '''                  <button class="formula-ctrl-btn" id="btn-step-reset">↺ ${t('formula.btnReset')}</button>
                </div>'''

cta_box = '''                  <button class="formula-ctrl-btn" id="btn-step-reset">↺ ${t('formula.btnReset')}</button>
                </div>

                <!-- 실전 보드 연습 액션 바 -->
                <div class="formula-practice-cta-box">
                  <button class="btn-practice-formula" id="btn-practice-formula" data-formula-id="${formula.id}">
                    <span class="cta-icon">🚀</span>
                    <span class="cta-text">${t('formula.btnPracticeOnBoard')}</span>
                    <span class="cta-badge">${formula.difficulty}${t('settings.movesSuffix')} 도전</span>
                  </button>
                </div>'''

if playback_bar_end in modal_content:
    modal_content = modal_content.replace(playback_bar_end, cta_box, 1)

# renderDetail() 말미에 bindPracticeButton 호출 추가 및 bindPracticeButton 메서드 구현
detail_end = '''    if (hasSteps) {
      this.bindStepControls(steps);
      this.renderStepInfo();
      this.renderMiniBoard();
    }
  }'''

detail_end_with_practice = '''    if (hasSteps) {
      this.bindStepControls(steps);
      this.renderStepInfo();
      this.renderMiniBoard();
    }
    this.bindPracticeButton(formula);
  }

  private bindPracticeButton(formula: FormulaItem): void {
    const btn = this.overlay?.querySelector('#btn-practice-formula');
    btn?.addEventListener('click', () => {
      soundEngine.playTap();
      this.close();
      if (this.onPracticeCallback) {
        this.onPracticeCallback(formula);
      }
    });
  }'''

if detail_end in modal_content:
    modal_content = modal_content.replace(detail_end, detail_end_with_practice, 1)

with open(modal_path, 'w', encoding='utf-8') as f:
    f.write(modal_content)

print("Successfully updated formulaModal.ts!")

# 2. formulaModal.css 업데이트
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

practice_css = '''
/* 실전 보드 직접 풀어보기 CTA 박스 및 버튼 스타일 */
.formula-practice-cta-box {
  margin-top: 12px;
  width: 100%;
}

.btn-practice-formula {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-practice-formula:hover {
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.btn-practice-formula:active {
  transform: translateY(0);
}

.btn-practice-formula .cta-icon {
  font-size: 1.1rem;
}

.btn-practice-formula .cta-badge {
  background: rgba(0, 0, 0, 0.25);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 메인 화면 연습 모드 상단 배너 */
.practice-mode-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 78, 59, 0.4) 100%);
  border: 1px solid rgba(52, 211, 153, 0.5);
  border-radius: 10px;
  padding: 8px 14px;
  margin: 6px 0 10px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
  animation: practiceBannerGlow 2.5s infinite alternate ease-in-out;
}

@keyframes practiceBannerGlow {
  from { box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
  to { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
}

.practice-active-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.practice-icon {
  font-size: 1.1rem;
}

.practice-title {
  font-weight: 700;
  font-size: 0.88rem;
  color: #6ee7b7;
  flex: 1;
}

.practice-target {
  background: rgba(16, 185, 129, 0.25);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #a7f3d0;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 600;
}

.btn-exit-practice {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-exit-practice:hover {
  background: rgba(239, 68, 68, 0.4);
  color: #ffffff;
}

/* 연습 모드 특수 승리 카드 */
.practice-special-card {
  border: 2px solid #10b981 !important;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.5) !important;
}
'''

if '.btn-practice-formula' not in css_content:
    css_content += practice_css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("Successfully updated formulaModal.css!")
else:
    print("formulaModal.css already contains practice styles.")
