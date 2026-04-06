import sys, os
sys.stdout.reconfigure(encoding='utf-8')

# Read login page
fp = r'D:\Promt\promptvn\src\app\dang-nhap\page.tsx'
if os.path.exists(fp):
    print('=== DANG NHAP PAGE ===')
    print(open(fp, 'r', encoding='utf-8').read()[:3000])

# Read store to see auth logic  
fp2 = r'D:\Promt\promptvn\src\lib\store.ts'
print('\n\n=== STORE (auth section) ===')
content = open(fp2, 'r', encoding='utf-8').read()
# Find useAuthStore
idx = content.find('useAuthStore')
if idx >= 0:
    start = max(0, idx - 200)
    end = min(len(content), idx + 1500)
    print(content[start:end])

# Check dashboard for user info
fp3 = r'D:\Promt\promptvn\src\app\dashboard\page.tsx'
print('\n\n=== DASHBOARD (first 60 lines) ===')
lines = open(fp3, 'r', encoding='utf-8').readlines()
for i in range(min(60, len(lines))):
    print(f'{i+1}: {lines[i]}', end='')
