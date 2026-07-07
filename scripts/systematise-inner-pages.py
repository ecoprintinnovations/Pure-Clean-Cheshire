from pathlib import Path
ROOT = Path('C:/Users/chads/frodsham-cleaning')
PAGES = ROOT / 'pages'
css_path = ROOT / 'css' / 'main.css'
css = css_path.read_text(encoding='utf-8')
if '.inner-trust-bar' not in css:
    css += '''
/* Unified inner-page trust bar */
.inner-trust-bar {
  background: rgba(255,255,255,0.03);
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 24px 0;
}
.inner-trust-bar .container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}
.inner-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}
.inner-trust-item .trust-icon {
  width: 20px;
  height: 20px;
  color: #FF8C42;
  flex-shrink: 0;
}
'''
    css_path.write_text(css, encoding='utf-8')
    print('Added inner-trust-bar CSS')
else:
    print('inner-trust-bar CSS already present')

trust_snippet = '''        <section class="inner-trust-bar" aria-label="Trust indicators">
            <div class="container">
                <div class="inner-trust-item">
                    <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>£5M Public Liability</span>
                </div>
                <div class="inner-trust-item">
                    <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>7-Day Guarantee</span>
                </div>
                <div class="inner-trust-item">
                    <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span>DBS Checked</span>
                </div>
                <div class="inner-trust-item">
                    <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>Eco-Friendly Products</span>
                </div>
                <div class="inner-trust-item">
                    <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <span>Local Frodsham Team</span>
                </div>
            </div>
        </section>
'''

files = ['services.html', 'about.html', 'pricing.html', 'areas.html', 'contact.html']
for fname in files:
    path = PAGES / fname
    text = path.read_text(encoding='utf-8')
    if trust_snippet.strip() in text:
        print(f'{fname}: trust strip already present')
        continue
    if '<section class="service-hero"' in text:
        text = text.replace('<section class="service-hero"', trust_snippet + '\n        <section class="service-hero"', 1)
        text = text.replace(' style="background: var(--color-primary-50);"', '')
        text = text.replace(' style="color: var(--color-primary);"', '')
        text = text.replace(' style="font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); color: var(--color-primary); font-family: var(--font-family-heading); margin-bottom: var(--space-2);"', '')
        text = text.replace(' style="font-size: var(--font-size-lg); font-weight: var(--font-weight-normal); opacity: 0.9;"', '')
        text = text.replace(' style="text-align: center; margin-bottom: var(--space-6);"', '')
        text = text.replace(' style="margin-top: var(--space-20);"', '')
        text = text.replace(' style="margin-top: var(--space-20); padding: var(--space-12); background: var(--color-primary-50); border-radius: var(--radius-2xl);"', '')
        text = text.replace(' style="margin-bottom: var(--space-8);"', '')
        text = text.replace(' style="text-align: center; margin-bottom: var(--space-8);"', '')
        text = text.replace(' style="padding: var(--space-8);"', '')
        text = text.replace(' style="color: var(--color-600);"', '')
        text = text.replace(' style="color: var(--color-700); line-height: var(--line-height-relaxed);"', '')
        text = text.replace(' style="font-size: var(--font-size-base); font-weight: var(--font-weight-normal); color: var(--color-600);"', '')
        path.write_text(text, encoding='utf-8')
        print(f'{fname}: injected trust strip, cleaned inline styles')
    else:
        print(f'{fname}: no service-hero found')
print('Done systematising inner pages')
