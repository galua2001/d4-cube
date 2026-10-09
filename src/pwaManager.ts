/**
 * 행렬 큐브 (Matrix Cube) PWA 매니저
 * unitess에서 검증된 네이티브 앱 설치 프롬프트 및 설치 배너 엔진
 */

let deferredPrompt: any = null;

export function initPWAManager() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
  const headerBtn = document.getElementById('btn-pwa-install');

  // Service Worker 등록
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          if (reg.update) reg.update();
        })
        .catch(() => {});
    });
  }

  // 안드로이드 / 크롬 beforeinstallprompt 감지
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!isStandalone && headerBtn) {
      headerBtn.style.display = 'inline-flex';
    }
  });

  // 설치 완료 감지
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (headerBtn) {
      headerBtn.style.display = 'none';
    }
  });

  // 버튼 클릭 시 네이티브 앱 설치 다이얼로그 즉시 호출
  if (headerBtn) {
    headerBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
          headerBtn.style.display = 'none';
        }
      } else {
        alert('브라우저 메뉴(⋮)에서 [홈 화면에 추가] 또는 [앱 설치]를 선택하시면 바탕화면에 설치됩니다.');
      }
    });
  }
}
