import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')
# Check vercel.json or .vercel for domain info
vercel_dir = r"D:\Promt\promptvn\.vercel"
if os.path.isdir(vercel_dir):
    for f in os.listdir(vercel_dir):
        fp = os.path.join(vercel_dir, f)
        if f.endswith('.json'):
            print(f"=== .vercel/{f} ===")
            with open(fp, "r", encoding="utf-8") as fh:
                print(fh.read())
vj = r"D:\Promt\promptvn\vercel.json"
if os.path.exists(vj):
    print("=== vercel.json ===")
    with open(vj, "r", encoding="utf-8") as fh:
        print(fh.read())
# also check package.json for homepage
pj = r"D:\Promt\promptvn\package.json"
with open(pj, "r", encoding="utf-8") as fh:
    pkg = json.load(fh)
    print(f"name: {pkg.get('name')}")
    print(f"homepage: {pkg.get('homepage','N/A')}")
