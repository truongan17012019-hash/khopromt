import os

for fname in ['src/data/blog-posts.ts', 'src/data/courses.ts']:
    fpath = os.path.join(r'D:\Promt\promptvn', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if remaining backticks exist (single)
    # In TS string literals using quotes, backticks are fine
    # But let's check for template literals
    remaining = content.count('`')
    print(f"{fname}: {remaining} single backticks")
    
    # Check for unescaped quotes in string content
    # Look for patterns like: content: "...text with "inner" quotes..."
    # This is the most common issue
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        stripped = line.strip()
        if '${' in stripped and '`' not in stripped:
            print(f"  Line {i+1}: template expression without backtick: {stripped[:80]}")

print("String check done!")
