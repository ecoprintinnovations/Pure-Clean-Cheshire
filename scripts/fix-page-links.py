import re, glob
for path in glob.glob('pages/*.html'):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    text = re.sub(
        r'(href|src|srcset)=\"(about|areas|contact|pricing|services)\.html\"',
        lambda m: f'{m.group(1)}="/{m.group(2)}.html"',
        text
    )
    text = text.replace('../images/logo-48.webp', '/images/logo-48.webp')
    text = text.replace('../images/logo-96.webp', '/images/logo-96.webp')
    text = text.replace('../images/logo-144.webp', '/images/logo-144.webp')
    text = text.replace('../images/logo-web.webp', '/images/logo-web.webp')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
print('updated pages')
