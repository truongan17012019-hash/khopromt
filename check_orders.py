import sys, os
sys.stdout.reconfigure(encoding='utf-8')

# Check orders API to understand schema
fp = r'D:\Promt\promptvn\src\app\api\orders\route.ts'
print('=== ORDERS API ===')
print(open(fp, 'r', encoding='utf-8').read()[:3000])

# Check order-finalize for how orders are created
fp2 = r'D:\Promt\promptvn\src\lib\server\order-finalize.ts'
if os.path.exists(fp2):
    print('\n\n=== ORDER FINALIZE ===')
    print(open(fp2, 'r', encoding='utf-8').read()[:3000])
