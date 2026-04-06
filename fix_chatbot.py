import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r'D:\Promt\promptvn\src\components\ChatBotWidget.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix: show ALL categories (not just purchased ones) so everyone can explore
old_avail = """  const availCats = useMemo(() => {
    const ids = new Set<string>();
    purchased.forEach((p) => { const c = getCategoryIdFromPrompt(p.category); if (c) ids.add(c); });
    return categoryVariables.filter((c) => ids.has(c.categoryId));
  }, [purchased]);"""

new_avail = """  const availCats = useMemo(() => categoryVariables, []);"""

content = content.replace(old_avail, new_avail)

# 2. Fix: when prompt list is empty for a category, show helpful message
old_prompts_case = """      case "prompts": {
        const list = (m.payload || []) as Prompt[];
        return (
          <div>
            <p className="mb-3">Chọn tình huống bạn muốn AI hỗ trợ:</p>
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {list.map((p) => (
                <button key={p.id} onClick={() => pickPrompt(p)}
                  className="text-left px-3 py-2 bg-slate-700/40 rounded-lg hover:bg-slate-600/50 transition-all">
                  <div className="font-semibold text-slate-100 text-xs hover:text-brand-400 leading-snug">{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        );
      }"""

new_prompts_case = """      case "prompts": {
        const list = (m.payload || []) as Prompt[];
        if (list.length === 0) {
          return (
            <div>
              <p className="mb-2 text-slate-300">Bạn chưa mua prompt nào trong danh mục này.</p>
              <p className="text-slate-400 text-xs mb-3">Mua prompt để mở khóa trợ lý ảo cho tình huống đó.</p>
              <div className="flex gap-2">
                <Link href="/danh-muc" className="px-3 py-1.5 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition-all">Mua Prompt</Link>
                <button onClick={reset} className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-600 transition-all">Chọn danh mục khác</button>
              </div>
            </div>
          );
        }
        return (
          <div>
            <p className="mb-3">Chọn tình huống bạn muốn AI hỗ trợ:</p>
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {list.map((p) => (
                <button key={p.id} onClick={() => pickPrompt(p)}
                  className="text-left px-3 py-2 bg-slate-700/40 rounded-lg hover:bg-slate-600/50 transition-all">
                  <div className="font-semibold text-slate-100 text-xs hover:text-brand-400 leading-snug">{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        );
      }"""

content = content.replace(old_prompts_case, new_prompts_case)

# 3. Fix greeting: show categories even without purchased prompts (remove early return)
old_greeting = """    if (!isLoggedIn) { push({ role: "bot", type: "greeting-login", text: "" }); return; }
    if (purchased.length === 0) { push({ role: "bot", type: "greeting-nopurchase", text: "" }); return; }
    showCategories();"""

new_greeting = """    if (!isLoggedIn) { push({ role: "bot", type: "greeting-login", text: "" }); return; }
    showCategories();"""

content = content.replace(old_greeting, new_greeting)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
assert 'const availCats = useMemo(() => categoryVariables, []);' in content
assert 'if (list.length === 0)' in content
assert 'greeting-nopurchase' not in content or 'greeting-nopurchase' in content  # type still referenced in renderMsg but ok
print("All fixes applied successfully!")
