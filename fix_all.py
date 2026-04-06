import re, os

for fname in ['src/data/blog-posts.ts', 'src/data/courses.ts']:
    fpath = os.path.join(r'D:\Promt\promptvn', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Strategy: find all template literals (content: `...`)
    # and convert them to regular strings with escaped chars
    # Replace backtick template literals with double-quoted strings
    
    result = []
    i = 0
    in_template = False
    template_start = -1
    
    while i < len(content):
        if not in_template:
            # Look for content: ` or content:`
            # Check if we're at a backtick that starts a template
            if content[i] == '`':
                in_template = True
                template_start = i
                result.append('"')
                i += 1
                continue
            result.append(content[i])
            i += 1
        else:
            # Inside template literal
            if content[i] == '`':
                # End of template
                in_template = False
                result.append('"')
                i += 1
                continue
            elif content[i] == '"':
                # Escape double quotes inside
                result.append('\\"')
                i += 1
                continue
            elif content[i] == '\\' and i+1 < len(content):
                # Keep existing escapes
                result.append(content[i:i+2])
                i += 2
                continue
            elif content[i] == '\n':
                # Multi-line: use string concatenation
                result.append('\\n')
                i += 1
                continue
            elif content[i] == '$' and i+1 < len(content) and content[i+1] == '{':
                # Template expression ${...} - not expected in content
                result.append('${')
                i += 2
                continue
            else:
                result.append(content[i])
                i += 1
    
    new_content = ''.join(result)
    
    if new_content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {fname}")
        # Count remaining backticks
        remaining = new_content.count('`')
        print(f"  Remaining backticks: {remaining}")
    else:
        print(f"No changes needed for {fname}")

print("Done!")
