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

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.clearRect(0, 0, w, h);

  // 대칭 상태에 따라 앞면 또는 뒷면 이미지 선택
  const isFlipped = op === 'MX' || op === 'MY' || op === 'MD' || op === 'MAD';
  const hasBackImage = Boolean(imgBack && imgBack.complete && imgBack.naturalWidth !== 0);
  const img = isFlipped ? (hasBackImage ? imgBack : imgFront) : imgFront;

  ctx.save();
  ctx.translate(w / 2, h / 2);

  if (!isFlipped) {
    // [앞면: 순수 회전군 C4]
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
      case 'ID':
      default:
        break;
    }
  } else {
    // [뒷면: MY 기준 순수 회전 분해 (거울 반전 텍스트 왜곡 방지)]
    // imgBack이 없을 때(폴백)만 기하학적 수평 반전 scale(-1, 1) 적용
    if (!hasBackImage) {
      ctx.scale(-1, 1);
    }

    switch (op) {
      case 'MY':
        // MY는 뒷면 스프라이트의 기본 기준 상태 (0도 회전)
        break;
      case 'MX':
        // MX = R180 * MY
        ctx.rotate((180 * Math.PI) / 180);
        break;
      case 'MD':
        // MD = R270 * MY (반시계 90도 회전)
        ctx.rotate((-90 * Math.PI) / 180);
        break;
      case 'MAD':
        // MAD = R90 * MY (시계 90도 회전)
        ctx.rotate((90 * Math.PI) / 180);
        break;
    }
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
