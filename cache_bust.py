import os
import time

html_path = "index.html"
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace <script src="app.js" defer></script> with a versioned one
timestamp = int(time.time())
if 'src="app.js"' in content:
    content = content.replace('src="app.js"', f'src="app.js?v={timestamp}"')
elif 'src="app.js?v=' in content:
    import re
    content = re.sub(r'src="app\.js\?v=\d+"', f'src="app.js?v={timestamp}"', content)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Cache bust applied with version {timestamp}")
