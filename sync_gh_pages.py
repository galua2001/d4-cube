import shutil, os, glob, subprocess

repo = r'C:\Users\user\matrix-cube'
temp_dist = r'C:\Users\user\matrix-cube_temp_dist'

def run(cmd):
    print("RUN:", cmd)
    res = subprocess.run(cmd, shell=True, cwd=repo, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print("ERR:", res.stderr)
    if res.returncode != 0:
        raise RuntimeError(f"Command failed with code {res.returncode}")

# 1. gh-pages 브랜치 체크아웃
run("git checkout gh-pages")

# 2. 파일 복사 및 기존 bundle 정리
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

print("Files updated in gh-pages.")

# 3. commit & push
run("git add -A")
run('git commit -m "feat(deploy): D4 마스터 공식 3선 및 비법서 공식 스마트 정렬(난이도·이름순) gh-pages 배포 (Round 8)"')
run("git push origin gh-pages")

# 4. master 브랜치로 복귀
run("git checkout master")
print("Successfully synced gh-pages and returned to master!")
