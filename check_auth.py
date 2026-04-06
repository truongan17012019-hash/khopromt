import sys, os
sys.stdout.reconfigure(encoding='utf-8')

# Search for auth signup/register logic
keywords = ['signUp', 'sign_up', 'auth.signUp', 'createUser', 'profiles', 'auth.admin']
for root, dirs, files in os.walk(r'D:\Promt\promptvn\src'):
    for fn in files:
        if fn.endswith(('.tsx', '.ts')):
            fp = os.path.join(root, fn)
            try:
                c = open(fp, 'r', encoding='utf-8').read()
                for k in keywords:
                    if k in c:
                        print(f'{fp} -> {k}')
                        break
            except: pass
print('---DONE---')
