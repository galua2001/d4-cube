# 🧩 행렬 큐브(Matrix Cube) 독립 앱 설계 문서

> **버전**: v1.0.0 (Pure Matrix Cube Standalone PWA)  
> **기반**: Vite + TypeScript + PWA + Vanilla DOM  
> **원작**: Unitess (play.html / game.js 2번 모드 추출)  

---

## 1. 프로젝트 비전 및 목표
- 기존 `Unitess`에 혼재되어 있던 복잡한 서브 시스템(1번 낙하 게임, 3번 세포 퍼즐, 에디터 메이커, 갤러리 공유 등)을 전면 제거.
- **오직 '3×3 대칭군 행렬 큐브(Matrix Cube)'에만 집중**하여 직관적이고 완성도 높은 독립 모바일/웹 퍼즐 앱 구축.
- TypeScript를 도입하여 대수적 연산(군론 $C_2, V_4, D_4$)과 양방향 BFS 솔버 로직을 순수 모듈화(`src/core/`)하여 100% 테스트 가능 구조 확보.

---

## 2. 기존 코드베이스(Unitess) 추출 매핑

| 기능 영역 | 기존 Unitess 위치 | 새 독립 앱 구조 (`src/`) |
| :--- | :--- | :--- |
| **D4 대칭군 대수학** | `patterns.js` (L1~35), `game.js` (L1985~2050) | `src/core/group.ts` (불변 연산 테이블 및 합성) |
| **보드 모델 & 라인 연산** | `game.js` (L2005~2040, L2134~2150) | `src/core/board.ts` (비트마스크 인코딩 및 라인 적용) |
| **초고속 최단수 솔버** | `game.js` (L2267~2500, L2601~2650) | `src/core/solver.ts` (양방향 BFS, 8수 보장) |
| **스와이프 제스처 판정** | `game.js` (L4300~4610) | `src/ui/gesture.ts` (포인터 이벤트 & 궤적 캔버스) |
| **3D 회전 애니메이션** | `game.js` (L4240~4280), `game.css` | `src/ui/animation.ts`, `src/styles/board.css` |
| **실사 강아지 렌더러** | `Assets/dog_front.png`, `dog_back.png` | `public/assets/`, `src/ui/tileRenderer.ts` |
| **캠페인 스테이지 & 별점**| `game.js` (L1050~1300) | `src/game/campaign.ts` (localStorage 연동) |
| **오디오 엔진** | `audio.js`, `bgm.mp3` | `src/audio/audioEngine.ts` (Autoplay 대응) |
| **수학 풀이 해설 모달** | `game.js` (L2890~3250) | `src/ui/solutionModal.ts` (드래그 가능 해설창) |

---

## 3. 핵심 아키텍처 및 데이터 흐름

```
[UI 레이어: gesture / buttons / pointer]
              │
              ▼ (Move: { lineId, op })
[Game Controller: state, undo/redo, moves]
       ├───> [Audio Engine] (BGM, tap, flip, win)
       ├───> [Tile Renderer] (3D Transform, Wagging tail)
       └───> [Core Layer]
               ├───> board.ts (State bitmask)
               ├───> group.ts (D4 algebra tables)
               └───> solver.ts (Bidirectional BFS)
```

### 3.1 D4 대칭군 8개 원소
1. `ID` (0): 원형
2. `R90` (1): 시계 90° 회전
3. `R180` (2): 180° 회전
4. `R270` (3): 반시계 90° 회전
5. `MX` (4): 가로축 대칭 (상하 반전, `y -> 1-y`)
6. `MY` (5): 세로축 대칭 (좌우 반전, `x -> 1-x`)
7. `MD` (6): 주대각선 대칭 (↖-↘ 축, `(x,y) -> (y,x)`)
8. `MAD` (7): 부대각선 대칭 (↗-↙ 축, `(x,y) -> (1-y, 1-x)`)

---

## 4. 모바일 최적화 & 안정성 규칙
1. **더블탭 확대 방지**: CSS `touch-action: none` 적용 및 meta viewport 설정.
2. **오디오 Autoplay Policy**: 첫 사용자 터치 시 Web Audio API context resume.
3. **레이스 컨디션 방지**: 0.48초 3D 애니메이션 동안 `isAnimating` 플래그로 입력 차단.
4. **PWA 완벽 지원**: Service Worker 및 manifest.json을 통한 모바일 홈 화면 추가 지원.
