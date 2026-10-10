/**
 * @file sync-to-unitess.js
 * @description matrix-cube 프로젝트의 dist 빌드 결과물을 unitess 및 unitessplay 폴더로 자동 동기화(복사)하는 스크립트입니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../dist');
const TARGET_DIR1 = path.resolve(__dirname, '../../unitess/matrix-cube');
const TARGET_DIR2 = path.resolve(__dirname, '../../unitess/unitessplay/matrix-cube');

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

if (!fs.existsSync(SRC_DIR)) {
  console.error(`[동기화 실패] dist 폴더가 없습니다: ${SRC_DIR}`);
  process.exit(1);
}

for (const target of [TARGET_DIR1, TARGET_DIR2]) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.mkdirSync(target, { recursive: true });
  copyDirRecursive(SRC_DIR, target);
}

function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

const totalFiles = countFiles(TARGET_DIR1);
console.log(`[동기화 완료] matrix-cube dist ➔ unitess 및 unitessplay 최신 빌드 동시 배포 성공! (총 ${totalFiles}개 파일)`);
