import json, os

def escape_for_ts(s):
    """Escape a string for use in TS double-quoted string"""
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    s = s.replace('\n', '\\n')
    s = s.replace('\r', '')
    s = s.replace('\t', '\\t')
    return s

# Read files, find content fields, check for issues
for fname in ['src/data/blog-posts.ts', 'src/data/courses.ts']:
    fpath = os.path.join(r'D:\Promt\promptvn', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    total = len(content)
    print(f"{fname}: {total} chars")
    
    # Check for unescaped quotes in strings
    issues = 0
    in_string = False
    string_char = None
    i = 0
    while i < len(content):
        c = content[i]
        if not in_string:
            if c in ('"', "'"):
                in_string = True
                string_char = c
        else:
            if c == '\\':
                i += 2
                continue
            if c == string_char:
                in_string = False
            elif c == '\n' and string_char != '`':
                issues += 1
        i += 1
    print(f"  Potential issues: {issues}")

print("Check complete")
