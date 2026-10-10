// 공모전 심사위원 및 플레이어를 위한 작품 소개 모달 (About Modal)
import { t } from '../i18n/translations';

export function showAboutModal() {
  const existing = document.getElementById('about-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'about-modal-overlay';
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-content about-modal-content">
      <div class="modal-header">
        <div class="modal-title">${t('about.title')}</div>
        <button id="btn-about-close" class="btn-close" aria-label="${t('about.closeAria')}">✕</button>
      </div>

      <!-- 탭 바 -->
      <div class="modal-tab-bar" id="about-tab-bar">
        <button class="modal-tab-btn active" data-tab="intro">${t('about.tabIntro')}</button>
        <button class="modal-tab-btn" data-tab="math">${t('about.tabMath')}</button>
        <button class="modal-tab-btn" data-tab="god8">${t('about.tabGod8')}</button>
        <button class="modal-tab-btn" data-tab="edu">${t('about.tabEdu')}</button>
      </div>

      <!-- 탭 내용 영역 -->
      <div class="about-tab-body">
        <!-- 1. 기획 의도 -->
        <div class="about-tab-pane active" id="pane-intro">
          <div class="about-card">
            <div class="about-card-badge">${t('about.introCard1Badge')}</div>
            <h4 class="about-card-title">${t('about.introCard1Title')}</h4>
            <p class="about-desc">
              ${t('about.introCard1Desc')}
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">${t('about.introCard2Badge')}</div>
            <h4 class="about-card-title">${t('about.introCard2Title')}</h4>
            <p class="about-desc">
              ${t('about.introCard2Desc')}
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">${t('about.introCard3Badge')}</div>
            <h4 class="about-card-title">${t('about.introCard3Title')}</h4>
            <p class="about-desc">
              ${t('about.introCard3Desc')}
            </p>
          </div>
        </div>

        <!-- 2. D4 대칭군 수학 -->
        <div class="about-tab-pane" id="pane-math">
          <div class="about-card">
            <div class="about-card-badge">${t('about.mathCard1Badge')}</div>
            <h4 class="about-card-title">${t('about.mathCard1Title')}</h4>
            <p class="about-desc">
              ${t('about.mathCard1Desc')}
            </p>
            <ul class="about-list">
              <li>${t('about.mathListId')}</li>
              <li>${t('about.mathListRot')}</li>
              <li>${t('about.mathListRef')}</li>
              <li>${t('about.mathListDiag')}</li>
            </ul>
          </div>

          <div class="about-card">
            <div class="about-card-badge">${t('about.mathCard2Badge')}</div>
            <h4 class="about-card-title">${t('about.mathCard2Title')}</h4>
            <p class="about-desc">
              ${t('about.mathCard2Desc')}
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">${t('about.mathCard3Badge')}</div>
            <h4 class="about-card-title">${t('about.mathCard3Title')}</h4>
            <p class="about-desc" style="white-space: pre-line;">
              ${t('about.mathCard3Desc')}
            </p>
          </div>
        </div>

        <!-- 3. 신의 숫자 8 -->
        <div class="about-tab-pane" id="pane-god8">
          <div class="about-card highlight">
            <div class="about-card-badge gold">${t('about.god8Card1Badge')}</div>
            <h4 class="about-card-title">${t('about.god8Card1Title')}</h4>
            <p class="about-desc">
              ${t('about.god8Card1Desc')}
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">${t('about.god8Card2Badge')}</div>
            <h4 class="about-card-title">${t('about.god8Card2Title')}</h4>
            <p class="about-desc" style="white-space: pre-line;">
              ${t('about.god8Card2Desc')}
            </p>
          </div>
        </div>

        <!-- 4. 교육적 효과 -->
        <div class="about-tab-pane" id="pane-edu">
          <div class="about-card">
            <div class="about-card-badge">${t('about.eduCard1Badge')}</div>
            <h4 class="about-card-title">${t('about.eduCard1Title')}</h4>
            <p class="about-desc">
              ${t('about.eduCard1Desc')}
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">${t('about.eduCard2Badge')}</div>
            <h4 class="about-card-title">${t('about.eduCard2Title')}</h4>
            <p class="about-desc">
              ${t('about.eduCard2Desc')}
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">${t('about.eduCard3Badge')}</div>
            <h4 class="about-card-title">${t('about.eduCard3Title')}</h4>
            <p class="about-desc">
              ${t('about.eduCard3Desc')}
            </p>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <button id="btn-about-confirm" class="btn-action primary" style="width: 100%;">${t('about.confirm')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 닫기 핸들러
  const closeModal = () => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('#btn-about-close')?.addEventListener('click', closeModal);
  overlay.querySelector('#btn-about-confirm')?.addEventListener('click', closeModal);

  // 오버레이 바깥 클릭 시 닫기
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // ESC 키 닫기
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      window.removeEventListener('keydown', onKeyDown);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  // 탭 전환 이벤트
  const tabButtons = overlay.querySelectorAll('.modal-tab-btn');
  const panes = overlay.querySelectorAll('.about-tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `pane-${tabKey}`) {
          pane.classList.add('active');
        }
      });
    });
  });
}
