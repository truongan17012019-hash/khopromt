import sys, os
sys.stdout.reconfigure(encoding='utf-8')

# Check supabase config
fp = r'D:\Promt\promptvn\src\lib\supabase.ts'
print('=== SUPABASE LIB ===')
print(open(fp, 'r', encoding='utf-8').read())

# Check .env.local for supabase URL
env = r'D:\Promt\promptvn\.env.local'
print('\n=== ENV (supabase lines) ===')
for line in open(env, 'r', encoding='utf-8'):
    if 'SUPABASE' in line.upper() or 'supabase' in line.lower():
        # mask the key
        if 'KEY' in line.upper() or 'key' in line.lower():
            parts = line.strip().split('=', 1)
            if len(parts) == 2:
                print(f'{parts[0]}={parts[1][:20]}...')
            else:
                print(line.strip())
        else:
            print(line.strip())
