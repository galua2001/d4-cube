/**
 * @file tileRenderer.ts
 * @description D4 대칭군 타일 캔버스 렌더러 (강아지/갈루아 캐릭터 테마 지원)
 */

import { D4Op } from '../core/group';

/**
 * 캐릭터 이미지와 D4 대칭 연산 상태를 받아 Canvas에 렌더링합니다.
 * @param canvas 대상 HTMLCanvasElement
 * @param op 적용할 D4 대칭군 연산
 * @param imgFront 캐릭터 앞면 이미지
 * @param imgBack 캐릭터 뒷면 이미지 (대칭 변환 시 표시)
 */
export function renderCharacterTileCanvas(
  canvas: HTMLCanvasElement,
  op: D4Op,
  imgFront: HTMLImageElement,
  imgBack: HTMLImageElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // 대칭 상태에 따라 앞면 또는 뒷면 이미지 선택
  const isFlipped = op === 'MX' || op === 'MY' || op === 'MD' || op === 'MAD';
  const img = isFlipped ? (imgBack && imgBack.complete ? imgBack : imgFront) : imgFront;

  ctx.save();
  ctx.translate(w / 2, h / 2);

  // 연산별 2D Canvas 변환 매핑
  switch (op) {
    case 'R90':
      ctx.rotate((90 * Math.PI) / 180);
      break;
    case 'R180':
      ctx.rotate((180 * Math.PI) / 180);
      break;
    case 'R270':
      ctx.rotate((270 * Math.PI) / 180);
      break;
    case 'MX':
      ctx.scale(1, -1);
      break;
    case 'MY':
      ctx.scale(-1, 1);
      break;
    case 'MD':
      ctx.rotate((90 * Math.PI) / 180);
      ctx.scale(-1, 1);
      break;
    case 'MAD':
      ctx.rotate((-90 * Math.PI) / 180);
      ctx.scale(-1, 1);
      break;
    default:
      break;
  }

  // 타일 중앙 정렬로 그리기
  if (img) {
    try {
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
    } catch {
      // 이미지 미로드 또는 테스트 환경 예외 방지
    }
  }
  ctx.restore();
}

/**
 * 기존 코드 및 하위 호환성을 위한 alias
 */
export const renderDogTileCanvas = renderCharacterTileCanvas;
