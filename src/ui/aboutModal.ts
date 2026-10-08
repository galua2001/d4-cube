// 공모전 심사위원 및 플레이어를 위한 작품 소개 모달 (About Modal)

export function showAboutModal() {
  const existing = document.getElementById('about-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'about-modal-overlay';
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-content about-modal-content">
      <div class="modal-header">
        <div class="modal-title">🏆 작품 소개 & 수학적 배경</div>
        <button id="btn-about-close" class="btn-close" aria-label="닫기">✕</button>
      </div>

      <!-- 탭 바 -->
      <div class="modal-tab-bar" id="about-tab-bar">
        <button class="modal-tab-btn active" data-tab="intro">💡 기획 의도</button>
        <button class="modal-tab-btn" data-tab="math">📐 D₄ 대칭군</button>
        <button class="modal-tab-btn" data-tab="god8">⚡ 신의 숫자 8</button>
        <button class="modal-tab-btn" data-tab="edu">🎓 교육적 효과</button>
      </div>

      <!-- 탭 내용 영역 -->
      <div class="about-tab-body">
        <!-- 1. 기획 의도 -->
        <div class="about-tab-pane active" id="pane-intro">
          <div class="about-card">
            <div class="about-card-badge">🧩 개념의 재해석</div>
            <h4 class="about-card-title">루빅스 큐브의 3차원 회전을 2차원 행렬 대칭군으로</h4>
            <p class="about-desc">
              기존의 3차원 루빅스 큐브는 공간 조작이 복잡하고 모바일 터치 제어가 어렵다는 한계가 있었습니다.
              <strong>행렬 큐브(Matrix Cube)</strong>는 이를 <strong>$N \\times N$ 평면 행렬의 대칭 변환</strong>으로 혁신적으로 재해석하여,
              모바일 화면에서 직관적인 탭·스와이프 제스처만으로 즐길 수 있는 신개념 수학 퍼즐입니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">🐕 감성적 비주얼</div>
            <h4 class="about-card-title">귀여운 웰시코기 강아지와 함께하는 직관적 인지</h4>
            <p class="about-desc">
              딱딱한 숫자나 기호 대신 귀여운 강아지의 정면·뒤통수 및 꼬리 흔들기 애니메이션을 통해
              타일의 회전(0°, 90°, 180°, 270°)과 대칭(앞뒤 반전) 상태를 한눈에 직관적으로 파악할 수 있도록 설계했습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">📱 완벽한 PWA 지원</div>
            <h4 class="about-card-title">설치 없는 즉시 실행 & 오프라인 완벽 구동</h4>
            <p class="about-desc">
              Progressive Web App(PWA) 기술을 탑재하여 앱스토어 설치 없이 홈 화면에 추가할 수 있으며,
              오프라인 환경에서도 100% 동일한 부드러운 플레이가 가능합니다.
            </p>
          </div>
        </div>

        <!-- 2. D4 대칭군 수학 -->
        <div class="about-tab-pane" id="pane-math">
          <div class="about-card">
            <div class="about-card-badge">대수학 군론 (Group Theory)</div>
            <h4 class="about-card-title">정사각 2차원 대칭군 $D_4$ (Dihedral Group)</h4>
            <p class="about-desc">
              정사각형이 갖는 모든 8개의 대칭 변환을 엄밀한 수학적 군 연산 테이블(Cayley Table)로 모델링했습니다:
            </p>
            <ul class="about-list">
              <li><strong>항등원 (ID, 0)</strong>: 원래 상태 (0° 회전)</li>
              <li><strong>회전원 (R90, R180, R270)</strong>: 시계 방향 90°, 180°, 270° 회전 ($C_4$ 부분군)</li>
              <li><strong>축 대칭원 (MX, MY)</strong>: 가로 X축 상하 반전, 세로 Y축 좌우 반전</li>
              <li><strong>대각 대칭원 (MD, MAD)</strong>: 주대각선(↖-↘) 및 부대각선(↗-↙) 대칭</li>
            </ul>
          </div>

          <div class="about-card">
            <div class="about-card-badge">비가환 연산 (Non-commutative)</div>
            <h4 class="about-card-title">연산 순서가 결과를 바꾸는 깊이 있는 퍼즐성</h4>
            <p class="about-desc">
              대칭군 연산은 교환법칙이 성립하지 않습니다 ($A \\circ B \\neq B \\circ A$).
              예를 들어 가로 대칭 후 90도 회전한 결과는 90도 회전 후 가로 대칭한 결과와 완전히 다릅니다.
              이러한 비가환 대수학적 특성이 깊이 있는 수읽기와 전략적 퍼즐 풀이의 묘미를 선사합니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">단계별 부분군 모드</div>
            <h4 class="about-card-title">수학적 수준에 맞춘 $C_2 \\to V_4 \\to D_4$ 학습 곡선</h4>
            <p class="about-desc">
              - <strong>$C_2$ 모드</strong>: 180도 회전만 사용하는 순환군 (가장 쉬운 입문)<br>
              - <strong>$V_4$ 모드</strong>: 클라인 4원군 (가로·세로 반전 및 180도 회전, 가환군)<br>
              - <strong>$D_4$ 모드</strong>: 완전한 8개 원소 정사면군 (본격적인 최상위 도전)
            </p>
          </div>
        </div>

        <!-- 3. 신의 숫자 8 -->
        <div class="about-tab-pane" id="pane-god8">
          <div class="about-card highlight">
            <div class="about-card-badge gold">⚡ 수학적 정리 & 증명</div>
            <h4 class="about-card-title">행렬 큐브의 '신의 숫자'는 단 8수 (God's Number 8)</h4>
            <p class="about-desc">
              루빅스 큐브의 모든 배치가 최대 20수 이내에 풀린다는 사실이 '신의 숫자 20'으로 증명되었듯,
              <strong>3×3 행렬 큐브는 어떠한 상태에서 시작하더라도 최단 8수 이내에 100% 원상 복원이 가능함</strong>을
              양방향 BFS(Bidirectional Breadth-First Search) 알고리즘을 통해 수학적으로 규명 및 전수 검증했습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">초고속 최단수 솔버</div>
            <h4 class="about-card-title">비트마스크 양방향 BFS 엔진</h4>
            <p class="about-desc">
              - 각 타일의 8가지 상태를 3비트로 압축하여 64비트 정수 하나로 전체 보드를 표현.<br>
              - 시작 상태와 목표 상태(모두 0) 양방향에서 동시에 너비 우선 탐색을 수행하여 탐색 공간을 $O(b^d)$에서 $O(b^{d/2})$로 기하급수적 단축.<br>
              - 모바일 브라우저 환경에서도 0.05초 이내에 완벽한 최단수 해법 및 실시간 힌트를 산출합니다.
            </p>
          </div>
        </div>

        <!-- 4. 교육적 효과 -->
        <div class="about-tab-pane" id="pane-edu">
          <div class="about-card">
            <div class="about-card-badge">STEM / 수학교육</div>
            <h4 class="about-card-title">대학 수학(군론)을 초·중·고등학생도 즐기는 에듀테인먼트</h4>
            <p class="about-desc">
              일반적으로 대학 수학과에서 다루는 추상대수학의 '대칭군(Symmetric/Dihedral Group)' 개념을
              공식 암기가 아닌 <strong>손가락 터치와 시각적 회전 피드백</strong>을 통해
              어린 학생부터 성인까지 자연스럽게 '연산', '항등원', '역원', '합성'의 원리를 체득할 수 있습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">인터랙티브 경험</div>
            <h4 class="about-card-title">피치 상승 콤보 사운드 & 햅틱 촉각 피드백</h4>
            <p class="about-desc">
              연속 조작 시 음악적 음계(도-레-미-파-솔-라-도)로 상승하는 Web Audio API 신디사이저 사운드와,
              성공 시 터지는 화려한 컨페티 폭죽 및 햅틱 진동으로 퍼즐 풀이의 쾌감을 극대화했습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">알고리즘적 사고력 증진</div>
            <h4 class="about-card-title">수학적 이유(Why)가 적힌 단계별 해설서 제공</h4>
            <p class="about-desc">
              단순히 답만 알려주는 것이 아니라, 각 조작 단계마다 '어떤 성분이 어떻게 상쇄되어 항등원으로 수렴하는지'
              수학적 해설을 제공하여 논리적 문제 해결 능력을 신장시킵니다.
            </p>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <button id="btn-about-confirm" class="btn-action primary" style="width: 100%;">확인 및 플레이 시작</button>
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
