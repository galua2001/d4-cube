/**
 * @file sync-to-unitess.js
 * @description matrix-cube 프로젝트의 dist 빌드 결과물을 unitess/matrix-cube 폴더로 자동 동기화(복사)하는 스크립트입니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 환경에서의 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 소스(dist) 및 대상(unitess/matrix-cube) 디렉터리 경로 설정
const SRC_DIR = path.resolve(__dirname, '../dist');
const TARGET_DIR = path.resolve(__dirname, '../../unitess/matrix-cube');

/**
 * 디렉터리를 재귀적으로 복사하고 복사된 파일 수를 카운트합니다.
 * @param {string} src - 복사 원본 디렉터리
 * @param {string} dest - 복사 대상 디렉터리
 * @returns {number} 복사된 파일 수
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`[오류] 소스 디렉토리가 존재하지 않습니다: ${src}`);
    process.exit(1);
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  let fileCount = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fileCount += copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      fileCount++;
    }
  }

  return fileCount;
}

// 1. 빌드 폴더 존재 여부 확인
if (!fs.existsSync(SRC_DIR)) {
  console.error(`[동기화 실패] dist 폴더가 없습니다: ${SRC_DIR}`);
  process.exit(1);
}

// 2. 기존 대상 폴더 정리 후 신규 생성 (깔끔한 교체)
if (fs.existsSync(TARGET_DIR)) {
  fs.rmSync(TARGET_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TARGET_DIR, { recursive: true });

// 3. 파일 복사 실행
const totalFiles = copyDirRecursive(SRC_DIR, TARGET_DIR);

// 4. 요구 규격에 따른 성공 로그 출력
console.log(`[동기화 완료] matrix-cube dist ➔ unitess/matrix-cube 최신 빌드 동기화 성공! (총 ${totalFiles}개 파일)`);
