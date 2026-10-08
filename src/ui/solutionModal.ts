import { MoveStep } from '../core/solver';

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
      <div class="solution-step">
        <span style="font-weight: 700; color: #38bdf8;">수 ${idx + 1}</span>
        <span><b>${step.line.label}</b> ➔ <code>${step.op}</code></span>
      </div>
    `).join('');
  }

  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">📖 수학적 최단 풀이법 (${steps.length}수)</div>
      <button class="btn-close">&times;</button>
    </div>
    <div style="font-size: 0.85rem; color: #94a3b8; line-height: 1.4;">
      군론(D4 대칭군) 양방향 탐색에 기반한 신의 숫자 최적해 경로입니다.
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto;">
      ${stepsHtml}
    </div>
    <div style="display: flex; gap: 8px; margin-top: 10px;">
      ${steps.length > 0 ? '<button id="btn-modal-autoplay" class="btn-action primary" style="flex:1;">▶ 자동 풀기</button>' : ''}
      <button id="btn-modal-close" class="btn-action" style="flex:1;">닫기</button>
    </div>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

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
