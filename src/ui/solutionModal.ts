import { MoveStep } from '../core/solver';
import { D4Op } from '../core/group';

export function getMathExplanation(lineLabel: string, op: D4Op): string {
  switch (op) {
    case 'MX':
      return `
        <div class="math-report-box">
          <div class="math-report-title">↕ 가로축 거울 대칭 반사 (Horizontal Reflection: <i>M<sub>X</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 사상</b>: 가로 중심선(X축)을 거울축으로 삼아 (<i>x</i>, <i>y</i>) ↦ (<i>x</i>, -<i>y</i>)로 반전합니다.</li>
            <li><b>위상 소거 성질</b>: <i>M<sub>X</sub></i> ∘ <i>M<sub>X</sub></i> = <i>ID</i> 성질을 통해 상하 뒤집힘을 한 번에 해소합니다.</li>
            <li><b>대칭 분해 관계</b>: <i>M<sub>X</sub></i> = <i>M<sub>D</sub></i> ∘ <i>R</i>₉₀ = <i>R</i>₉₀ ∘ <i>M<sub>AD</sub></i> 입니다.</li>
            <li><b>라인 수렴 효과</b>: ${lineLabel} 상의 모든 타일의 상하 패리티를 통일합니다.</li>
          </ul>
        </div>
      `;
    case 'MY':
      return `
        <div class="math-report-box">
          <div class="math-report-title">↔ 세로축 거울 대칭 반사 (Vertical Reflection: <i>M<sub>Y</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 사상</b>: 세로 중심선(Y축)을 거울축으로 삼아 (<i>x</i>, <i>y</i>) ↦ (-<i>x</i>, <i>y</i>)로 반전합니다.</li>
            <li><b>위상 소거 성질</b>: <i>M<sub>Y</sub></i> ∘ <i>M<sub>Y</sub></i> = <i>ID</i> 성질을 통해 좌우 뒤집힘을 즉시 원상 복구합니다.</li>
            <li><b>대칭 분해 관계</b>: <i>M<sub>Y</sub></i> = <i>R</i>₉₀ ∘ <i>M<sub>D</sub></i> = <i>M<sub>AD</sub></i> ∘ <i>R</i>₉₀ 입니다.</li>
            <li><b>라인 수렴 효과</b>: ${lineLabel} 상의 모든 타일의 좌우 거울상을 소거합니다.</li>
          </ul>
        </div>
      `;
    case 'MD':
      return `
        <div class="math-report-box">
          <div class="math-report-title">⤢ 주대각 거울 대칭 전치 (Main Diagonal Reflection: <i>M<sub>D</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 전치</b>: 주대각선(↖-↘, <i>y</i> = <i>x</i>)을 기준으로 (<i>x</i>, <i>y</i>) ↦ (<i>y</i>, <i>x</i>) 전치합니다.</li>
            <li><b>회전의 대칭 분해 (Cartan-Dieudonné)</b>: 90° 회전은 <i>R</i>₉₀ = <i>M<sub>D</sub></i> ∘ <i>M<sub>X</sub></i> 로 완벽히 분해됩니다. 행과 열 사이의 비가환 뒤틀림을 풀어내는 핵심 축입니다.</li>
            <li><b>라인 수렴 효과</b>: ${lineLabel} 상의 주대각 거울 패리티 불일치를 상쇄합니다.</li>
          </ul>
        </div>
      `;
    case 'MAD':
      return `
        <div class="math-report-box">
          <div class="math-report-title">⤡ 부대각 거울 대칭 반사 (Anti-Diagonal Reflection: <i>M<sub>AD</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 사상</b>: 부대각선(↗-↙, <i>y</i> = -<i>x</i>)을 기준으로 (<i>x</i>, <i>y</i>) ↦ (-<i>y</i>, -<i>x</i>)로 전치 반전합니다.</li>
            <li><b>분해 관계</b>: <i>R</i>₂₇₀ = <i>M<sub>AD</sub></i> ∘ <i>M<sub>X</sub></i> 입니다.</li>
            <li><b>라인 수렴 효과</b>: ${lineLabel} 상의 부대각선 방향 위상차를 정렬합니다.</li>
          </ul>
        </div>
      `;
    case 'R90':
      return `
        <div class="math-report-box">
          <div class="math-report-title">↻ 90° 시계방향 회전 (Quarter Rotation: <i>R</i>₉₀)</div>
          <ul class="math-report-list">
            <li><b>순환군 구조</b>: 4차 순환군(<i>C</i>₄)의 생성원(Generator)으로 좌표를 (<i>x</i>, <i>y</i>) ↦ (<i>y</i>, -<i>x</i>)로 90° 회전합니다.</li>
            <li><b>두 반사의 합성</b>: <i>R</i>₉₀ = <i>M<sub>D</sub></i> ∘ <i>M<sub>X</sub></i> (45° 교각을 이루는 두 거울 대칭축의 합성)으로 유도됩니다.</li>
            <li><b>역원 수렴</b>: <i>R</i>₂₇₀ ∘ <i>R</i>₉₀ = <i>ID</i>(0° 원본)로 완성합니다.</li>
            <li><b>라인 수렴 효과</b>: ${lineLabel} 상의 각도 불일치를 90° 회전하여 해소합니다.</li>
          </ul>
        </div>
      `;
    case 'R180':
      return `
        <div class="math-report-box">
          <div class="math-report-title">🔄 180° 점대칭 회전 (Half Rotation: <i>R</i>₁₈₀)</div>
          <ul class="math-report-list">
            <li><b>점대칭 구조</b>: 원점 중심 대칭으로 (<i>x</i>, <i>y</i>) ↦ (-<i>x</i>, -<i>y</i>)로 반전합니다.</li>
            <li><b>직교 두 반사의 합성</b>: <i>R</i>₁₈₀ = <i>M<sub>X</sub></i> ∘ <i>M<sub>Y</sub></i> = <i>M<sub>D</sub></i> ∘ <i>M<sub>AD</sub></i>. 클라인 4원군(<i>V</i>₄)의 중심 원소입니다.</li>
            <li><b>2차 대합 성질</b>: <i>R</i>₁₈₀ ∘ <i>R</i>₁₈₀ = <i>ID</i> 이므로 180° 돌아간 타일을 즉시 원위치로 환원합니다.</li>
          </ul>
        </div>
      `;
    case 'R270':
      return `
        <div class="math-report-box">
          <div class="math-report-title">↺ 270° 반시계 회전 (Counter Rotation: <i>R</i>₂₇₀)</div>
          <ul class="math-report-list">
            <li><b>순환군 구조</b>: <i>R</i>₉₀의 역원(<i>R</i>₉₀⁻¹ = <i>R</i>₂₇₀)으로 좌표를 (<i>x</i>, <i>y</i>) ↦ (-<i>y</i>, <i>x</i>)로 회전합니다.</li>
            <li><b>역원 수렴</b>: <i>R</i>₉₀ ∘ <i>R</i>₂₇₀ = <i>ID</i> 로 정위치 복원합니다.</li>
            <li><b>라인 수렴 효과</b>: ${lineLabel} 타일들을 반시계방향 90° 회전시켜 위상을 일치시킵니다.</li>
          </ul>
        </div>
      `;
    default:
      return `
        <div class="math-report-box">
          <div class="math-report-title">✨ 항등원 합성 (Identity Convergence)</div>
          <ul class="math-report-list">
            <li>${lineLabel} 타일에 해당 역연산을 합성하여 0번 원본(ID)으로 복원합니다.</li>
          </ul>
        </div>
      `;
  }
}

export function showSolutionModal(steps: MoveStep[], onAutoPlay: () => void, onClose: () => void) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const content = document.createElement('div');
  content.className = 'modal-content';

  let stepsHtml = '';
  if (steps.length === 0) {
    stepsHtml = '<div style="text-align: center; color: #4ade80; padding: 20px;">🎉 이미 모든 타일이 완성된 상태입니다!</div>';
  } else {
    stepsHtml = steps.map((step, idx) => `
      <div class="solution-step-card" data-step-idx="${idx}">
        <div class="step-card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="step-badge">[${idx + 1}]</span>
            <span style="font-weight:700; color:#f8fafc;">${step.line.label}</span>
            <span style="color:#64748b;">➔</span>
            <span class="step-op-code">${step.op}</span>
          </div>
          <button class="btn-math-why" data-step-idx="${idx}">💡 원리</button>
        </div>
        <div class="math-report-container" id="math-report-${idx}" style="display:none;">
          ${getMathExplanation(step.line.label, step.op)}
        </div>
      </div>
    `).join('');
  }

  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">📖 해설 및 수학적 원리</div>
      <button class="btn-close">&times;</button>
    </div>

    <!-- 탭 선택 헤더 -->
    <div class="modal-tab-bar">
      <button class="modal-tab-btn active" id="tab-btn-steps">🎯 최단 풀이 (${steps.length}수)</button>
      <button class="modal-tab-btn" id="tab-btn-theory">📐 군론 수학 원리</button>
    </div>

    <!-- 탭 1: 단계별 풀이 화면 -->
    <div class="modal-tab-content active" id="tab-view-steps">
      <div style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px;">
        각 단계의 <b>[💡 원리]</b> 버튼을 누르면 대수학적 작용 원리를 확인할 수 있습니다.
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px;">
        ${stepsHtml}
      </div>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        ${steps.length > 0 ? '<button id="btn-modal-autoplay" class="btn-action primary" style="flex:1;">▶ 자동 풀기</button>' : ''}
        <button id="btn-modal-close" class="btn-action" style="flex:1;">닫기</button>
      </div>
    </div>

    <!-- 탭 2: 군론 대수학 원리 총람 -->
    <div class="modal-tab-content" id="tab-view-theory" style="display:none; max-height: 320px; overflow-y: auto; padding-right: 4px;">
      <div class="theory-section">
        <h4 style="color:#38bdf8; margin:0 0 6px 0; font-size:0.95rem;">🏛️ 1. $D_4$ 군론(Dihedral Group)과 8대 대칭</h4>
        <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.45; margin:0 0 8px 0;">
          정사각형의 대칭을 나타내는 8차 이면군 $D_4$는 4개의 순수 회전($C_4$)과 4개의 거울 반사($sC_4$)로 구성됩니다.
        </p>
        <div style="background:#090d16; padding:8px; border-radius:8px; border:1px solid #334155; font-size:0.75rem; color:#94a3b8; line-height:1.5;">
          • <b>회전</b>: ID(0°), R90(90° ↻), R180(180° 🔄), R270(270° ↺)<br/>
          • <b>반사</b>: MX(가로 상하), MY(세로 좌우), MD(주대각 ↖), MAD(부대각 ↗)
        </div>
      </div>

      <div class="theory-section" style="margin-top:10px;">
        <h4 style="color:#38bdf8; margin:0 0 6px 0; font-size:0.95rem;">⚡ 2. 2단계(2-Phase) 해법과 신의 숫자(8수)</h4>
        <div style="background:#090d16; padding:8px; border-radius:8px; border:1px solid #334155; font-size:0.75rem; color:#94a3b8; line-height:1.5;">
          • <b>Phase 1 (반사 소거, 최대 5수)</b>: 반사 준동형사상 $\\pi: D_4 \\to \\{+1, -1\\}$을 이용해 모든 뒤집힌 타일을 가환적으로 소거하여 순수 회전 상태로 통일합니다.<br/>
          • <b>Phase 2 (회전 소거, 최대 3수)</b>: $\\mathbb{Z}_4$ 상의 피벗 소거법으로 잔여 회전을 0° 원본(ID)으로 일치시킵니다.<br/>
          • <b>신의 숫자(God's Number)</b>: 임의의 섞인 행렬 큐브 상태는 <b>최대 8수 이내</b>에 반드시 해결됩니다.
        </div>
      </div>

      <div class="theory-section" style="margin-top:10px;">
        <h4 style="color:#38bdf8; margin:0 0 6px 0; font-size:0.95rem;">💡 3. 카르탕-디외도네 대칭 분해 정리</h4>
        <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.45; margin:0;">
          모든 90° 회전은 45° 교각을 이루는 두 거울 대칭의 합성(예: $R_{90} = M_D \\circ M_X$)으로 분해되며, 행렬 큐브의 라인 연산은 이 비가환 대칭 군론의 궤도를 정확히 따릅니다.
        </p>
      </div>

      <div style="margin-top: 14px;">
        <button id="btn-theory-back" class="btn-action" style="width:100%;">← 단계별 풀이로 돌아가기</button>
      </div>
    </div>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // 이벤트 바인딩
  const tabStepsBtn = content.querySelector('#tab-btn-steps') as HTMLElement;
  const tabTheoryBtn = content.querySelector('#tab-btn-theory') as HTMLElement;
  const tabStepsView = content.querySelector('#tab-view-steps') as HTMLElement;
  const tabTheoryView = content.querySelector('#tab-view-theory') as HTMLElement;

  const switchToSteps = () => {
    tabStepsBtn.classList.add('active');
    tabTheoryBtn.classList.remove('active');
    tabStepsView.style.display = 'block';
    tabTheoryView.style.display = 'none';
  };

  const switchToTheory = () => {
    tabTheoryBtn.classList.add('active');
    tabStepsBtn.classList.remove('active');
    tabTheoryView.style.display = 'block';
    tabStepsView.style.display = 'none';
  };

  tabStepsBtn.addEventListener('click', switchToSteps);
  tabTheoryBtn.addEventListener('click', switchToTheory);
  content.querySelector('#btn-theory-back')?.addEventListener('click', switchToSteps);

  // 각 스텝별 [💡 원리] 아코디언 토글
  content.querySelectorAll('.btn-math-why').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = (e.currentTarget as HTMLElement).dataset.stepIdx;
      const reportEl = content.querySelector(`#math-report-${idx}`) as HTMLElement;
      if (reportEl) {
        const isHidden = reportEl.style.display === 'none';
        reportEl.style.display = isHidden ? 'block' : 'none';
        (e.currentTarget as HTMLElement).classList.toggle('active', isHidden);
      }
    });
  });

  const closeFn = () => {
    overlay.remove();
    onClose();
  };

  content.querySelector('.btn-close')?.addEventListener('click', closeFn);
  content.querySelector('#btn-modal-close')?.addEventListener('click', closeFn);
  content.querySelector('#btn-modal-autoplay')?.addEventListener('click', () => {
    overlay.remove();
    onAutoPlay();
  });
}
