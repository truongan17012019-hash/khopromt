"""Rebuild blog-posts.ts and courses.ts with enriched content, properly escaped."""
import os

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Wrote {path} ({len(content)} chars)")

# Helper: escape HTML content for TS double-quoted strings
def h(s):
    return s.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')

base = r'D:\Promt\promptvn\src\data'

#############################
# BLOG POSTS
#############################
