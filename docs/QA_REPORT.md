# QA 결과 보고서: 튜토리얼 3단계 구조 완결 개편 및 검증

- **검증 일시**: 2026-10-09
- **검증 대상**: `src/ui/tutorialModal.ts`, `src/ui/tutorialModal.test.ts`, `src/audio/audioEngine.ts`, `public/sw.js`, `index.html`
- **담당 QA**: cube-tester

---

## 1. 개요 및 변경 사항

기존 단계 체계를 군론 퍼즐의 핵심에 집중할 수 있도록 **총 3단계 완결 구조(STEP 1 행렬 시연 ➔ STEP 2 V4 4수 실전 ➔ STEP 3 D4 5수 실전 및 완성)**로 전면 개편하였습니다.

### 3단계 완결 구조
1. **STEP 1**: 퍼즐 목표 & 행렬 변환 실전 시연 (11 가로, 12 세로, 31 3회 회전, 21 대각선)
2. **STEP 2**: [V4 실전] V4 4수 최단 풀이 (0, 180, X, Y 대칭 변환만 사용)
3. **STEP 3**: [D4 실전] 8차 정이면체군 D4 5수 묘수 풀이 및 완성 (대각선 반사 + 회전 결합 5수 최단 해법)

---

## 2. 테스트 및 검증 결과 요약

| 검증 항목 | 검증 도구/방법 | 결과 | 비고 |
| :--- | :--- | :---: | :--- |
| **단위 테스트** | `npx vitest run` | **PASS (44/44)** | 5개 테스트 파일 전체 통과 (100%) |
| **타입 안정성** | `npx tsc --noEmit` | **PASS** | TypeScript 컴파일 오류 0건 |
| **프로덕션 빌드** | `npm run build` | **PASS** | `tsc && vite build` 무오류 번들링 완료 |
| **PWA 캐시 버전** | 버전 태그 점검 | **PASS** | `public/sw.js`, `index.html` `v20261009_2055` 반영 |
| **프리뷰 서버** | `vite preview` + `Invoke-WebRequest` | **PASS (200 OK)** | HTTP 200 정상 응답 (`/d4-cube/`) |
| **모바일 E2E 검증** | Playwright (iPhone 13 뷰포트) | **PASS** | 3단계 순차 이동, D4 6수 pills, 모달 완료 검증 |
| **콘솔 및 오디오 정책** | Playwright 콘솔 리스너 | **PASS** | 콘솔 에러 0건, Autoplay 정책 위반 0건 |

---

## 3. 발견 및 조치된 버그 (Bug Fixes)

1. **BGM 오디오 경로 절대경로 문제 수정 (`src/audio/audioEngine.ts`)**:
   - **현상**: `new Audio('/assets/bgm.mp3')`로 절대경로가 하드코딩되어 있어 `base: '/d4-cube/'` 배포 환경 및 preview 서버에서 404 콘솔 에러 발생.
   - **조치**: 상대경로 `new Audio('assets/bgm.mp3')`로 수정하여 리소스 정상 로딩 및 콘솔 에러 0건 달성.

2. **튜토리얼 모달 애니메이션 타이머 및 스텝 UI 정합성 확보 (`src/ui/tutorialModal.ts`)**:
   - **조치**: 3단계 체계에 맞춘 `clearD4AnimTimers` 정리 및 `updateStepUI`의 3단계 스텝별 버튼 문구(`다음 (1/3) ➔`, `다음 (2/3) ➔`, `🎮 실전 퍼즐 시작하기`) 완벽 동기화.

---

## 4. 세부 단위 테스트 검증 내역 (`src/ui/tutorialModal.test.ts`)

- **3단계 구조 및 네비게이션**:
  - `open(1)`: 1단계(퍼즐 목표 & 행렬 변환 실전 시연) 시작 및 STEP1_SUB_DEMOS 4종 검증
  - `open(2)`: 2단계([V4 실전] V4 4수 최단 풀이) 진입 및 V4 초기 보드 상태 로드와 goToV4SubStep(1~4) 서브 스텝 탐색 검증
  - `open(3)`: 3단계([D4 실전] 8차 정이면체군 D4 5수 묘수 풀이) 진입 시 D4 실전 예제 초기 상태 로드 및 goToD4SubStep 서브 스텝 탐색 검증 (5수 후 모든 타일 ID)
  - `nextStep()` 및 `prevStep()`: 1 ➔ 2 ➔ 3 순회 및 3단계에서 다음 누르면 `completeTutorial()` 호출되어 닫힘 확인
  - `goToStep(s)`: 1~3 범위를 안전하게 클램핑 (음수 ➔ 1, 10 ➔ 3)
- **손동작 제스처 애니메이션 연동**:
  - 1단계: 11 가로, 12 세로, 31 회전, 21 대각선 제스처 클래스 부여
  - 2단계: V4 실전 수별 제스처(두 번 클릭, 세로 밀기 등) 연동
  - 3단계: D4 실전 수별 제스처(탭, 두 번 클릭, 세로 밀기, 대각선 밀기, 가로 밀기) 연동
- **UI 텍스트 및 버튼 라벨 매핑**:
  - 1단계 `다음 (1/3) ➔`, 2단계 `다음 (2/3) ➔`, 3단계 `🎮 실전 퍼즐 시작하기` 공식 규격 일치 확인

---

## 5. 모바일 뷰포트 E2E 검증 (Playwright)

- **디바이스 에뮬레이션**: iPhone 13 (390×844)
- **검증 흐름**:
  1. `http://localhost:4173/d4-cube/` 정상 로딩 (HTTP 200)
  2. 헤더 `🎓 튜토리얼` 버튼 클릭 -> 튜토리얼 모달 노출
  3. STEP 1 (1/3) -> STEP 2 (2/3) -> STEP 3 (3/3) 순차 진행 확인
  4. STEP 3 D4 수 버튼 6개(초기, 1수~5수) 인터랙션 확인
  5. 3단계에서 `🎮 실전 퍼즐 시작하기` 클릭 -> 모달 정상 종료 및 메인 보드 복귀
  6. 모바일 화면 캡처 저장 완료:
     - `docs/screenshot_tutorial_step1.png`
     - `docs/screenshot_tutorial_step2.png`
     - `docs/screenshot_tutorial_step3.png`
     - `docs/screenshot_game_board.png`
- **콘솔 에러 검사**: 콘솔 에러 0건, Page error 0건

---

## 6. 종합 평가

- **배포 준비 상태**: 🟢 **배포 즉시 가능 (Production Ready)**
- 튜토리얼 3단계 개편 사양이 단위 테스트, 타입 검사, 프로덕션 빌드, E2E 검증 전 과정에서 100% 충족되었습니다.
