import { D4Op } from '../core/group';

export function renderDogTileCanvas(canvas: HTMLCanvasElement, op: D4Op, imgFront: HTMLImageElement, imgBack: HTMLImageElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // 대칭 상태에 따라 앞면 또는 뒷면 이미지 선택
  const isFlipped = (op === 'MX' || op === 'MY' || op === 'MD' || op === 'MAD');
  const img = isFlipped ? (imgBack.complete ? imgBack : imgFront) : imgFront;

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
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}
