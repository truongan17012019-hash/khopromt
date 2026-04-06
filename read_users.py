import sys, os
sys.stdout.reconfigure(encoding='utf-8')

# Read admin users page
fp1 = r'D:\Promt\promptvn\src\app\admin\users\page.tsx'
print('=== ADMIN USERS PAGE ===')
print(open(fp1, 'r', encoding='utf-8').read())

print('\n\n=== API ADMIN USERS ===')
fp2 = r'D:\Promt\promptvn\src\app\api\admin\users\route.ts'
print(open(fp2, 'r', encoding='utf-8').read())
