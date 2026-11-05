import shutil, os, glob, subprocess

repo = r'C:\Users\user\matrix-cube'
temp_dist = r'C:\Users\user\matrix-cube_temp_dist'

def run(cmd):
    print("RUN:", cmd)
    res = subprocess.run(cmd, shell=True, cwd=repo, capture_output=True, text=True, encoding='utf-8')
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print("ERR:", res.stderr)
    if res.returncode != 0:
        raise RuntimeError(f"Command failed with code {res.returncode}")

# 1. dist 백업
dist_src = os.path.join(repo, 'dist')
if os.path.exists(temp_dist):
    shutil.rmtree(temp_dist)
shutil.copytree(dist_src, temp_dist)
print("dist backed up to temp_dist.")

# 2. gh-pages 체크아웃
run("git checkout gh-pages")

# 3. 기존 bundle 정리 및 새 파일 복사
assets_dst = os.path.join(repo, 'assets')
if os.path.exists(assets_dst):
    for f in glob.glob(os.path.join(assets_dst, 'index-*.js')):
        os.remove(f)
        print("Removed old bundle:", f)

for item in os.listdir(temp_dist):
    s = os.path.join(temp_dist, item)
    d = os.path.join(repo, item)
    if os.path.isdir(s):
        if not os.path.exists(d):
            os.makedirs(d)
        for sub in os.listdir(s):
            shutil.copy2(os.path.join(s, sub), os.path.join(d, sub))
    else:
        shutil.copy2(s, d)

print("Files copied to gh-pages.")

# 4. commit & push
run("git add -A")
run('git commit -m "feat(deploy): D4 마스터 공식 3선 및 비법서 온스크린 키보드 단축키 가이드 gh-pages 배포 (Round 10)"')
run("git push origin gh-pages")

# 5. master 복귀
run("git checkout master")
if os.path.exists(temp_dist):
    shutil.rmtree(temp_dist)
print("gh-pages sync completed successfully!")
