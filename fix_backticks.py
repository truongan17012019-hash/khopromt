import re, os

for fname in ['src/data/blog-posts.ts', 'src/data/courses.ts']:
    fpath = os.path.join(r'D:\Promt\promptvn', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count backtick occurrences
    count = content.count('```')
    print(f"{fname}: found {count} triple backtick occurrences")
    
    if count > 0:
        # Replace opening ```language with <pre><code>
        content = re.sub(r'```\w*\n?', '<pre><code>', content)
        # Any remaining ``` (closing) - but the above catches both
        # Let's be more careful: replace pairs
        # Actually the regex above replaces ALL ``` (opening with lang AND closing)
        # But closing ``` might not have \w after them
        # Let me just replace all remaining ```
        content = content.replace('```', '</code></pre>')
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Fixed {fname}")
    else:
        print(f"  No fix needed for {fname}")

print("Done!")
