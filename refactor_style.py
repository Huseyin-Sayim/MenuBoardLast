import re

file_path = r"c:\addTemplates\MenuBoardLast\src\css\style.css"

def get_media_query(mod):
    if mod == 'sm': return '(min-width: 640px)'
    if mod == 'md': return '(min-width: 768px)'
    if mod == 'lg': return '(min-width: 1024px)'
    if mod == 'xl': return '(min-width: 1280px)'
    if mod == '2xl': return '(min-width: 1536px)'
    return None

def generate_rules(base_selector, variant_map):
    rules = []
    # Replace { just in case, split comma
    # Fix for empty selector parts
    selectors = [s.strip() for s in base_selector.replace('{','').split(',') if s.strip()]
    
    for variant, classes in variant_map.items():
        mods = variant.split(':')
        
        is_dark = 'dark' in mods
        
        pseudos = [m for m in mods if m in ['hover', 'focus', 'active', 'disabled', 'checked', 'visited', 'group-hover', 'focus-within']]
        bps = [m for m in mods if m in ['sm', 'md', 'lg', 'xl', '2xl']]
        
        new_selectors = []
        for sel in selectors:
            temp = sel
            if is_dark:
                temp = f".dark {temp}"
            for p in pseudos:
                temp = f"{temp}:{p}"
            new_selectors.append(temp)
        
        final_sel = ", ".join(new_selectors)
        content = f"@apply {' '.join(classes)};"
        
        block = f"{final_sel} {{\n  {content}\n}}"
        
        if bps:
            mq = get_media_query(bps[0])
            if mq:
                block = f"@media {mq} {{\n  {block}\n}}"
        
        rules.append(block)
    return rules

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

output = []
stack = [] 

for line in lines:
    if '{' in line:
        sel = line.split('{')[0].strip()
        stack.append({'selector': sel, 'pending': []})
        
    if '@apply' in line and stack:
        match = re.search(r'@apply\s+(.+?);', line)
        if match:
            classes_str = match.group(1)
            
            # FIX: Remove spaces after colons (e.g. "dark: bg-black" -> "dark:bg-black")
            classes_str = re.sub(r':\s+', ':', classes_str)
            
            # Now split
            classes = classes_str.split()
            
            base = []
            variants = {}
            
            for c in classes:
                parts = c.split(':')
                if len(parts) > 1:
                    variant_str = ':'.join(parts[:-1])
                    core_class = parts[-1]
                    if variant_str not in variants:
                        variants[variant_str] = []
                    variants[variant_str].append(core_class)
                else:
                    base.append(c)
            
            # Reconstruct line
            if base:
                # Replace the match with new base string
                # We construct text: "@apply <base>;"
                line = line.replace(match.group(0), f"@apply {' '.join(base)};")
            else:
                line = "" 
            
            # Selector fix for multiline and commas
            context = stack[-1]
            full_selector = context['selector']
            
            # Lookback logic in output buffer
            idx = len(output) - 1
            while idx >= 0:
                prev = output[idx].strip()
                if not prev:
                    idx -= 1
                    continue
                if prev.endswith(','):
                    full_selector = prev + " " + full_selector
                    idx -= 1
                else:
                    break
            
            generated = generate_rules(full_selector, variants)
            context['pending'].extend(generated)

    if line.strip():
        output.append(line.rstrip())
    
    if '}' in line:
        if stack:
            context = stack.pop()
            if context['pending']:
                for r in context['pending']:
                    output.append(r)

final_content = '\n'.join(output)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_content)
