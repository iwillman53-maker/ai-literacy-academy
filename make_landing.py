#!/usr/bin/env python3
"""강의 홈페이지 생성기: course.json 의 값만 바꿔서 landing-template.html 로 홈 페이지를 만든다.
사용법:  python make_landing.py course.json            ->  (course.json 의 page 이름).html 생성
캐리커처(caricature.jpg)는 같은 폴더에 두면 파일 안에 내장된다(경로 문제 없음)."""
import base64, html, json, os, sys
here = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, 'course.json')
c = json.load(open(src, encoding='utf-8'))
t = open(os.path.join(here, 'landing-template.html'), encoding='utf-8').read()
e = html.escape
img = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(here, 'caricature.jpg'), 'rb').read()).decode()
n = 0; parts = ''
for p in c['parts']:
    li = ''
    for it in p['items']:
        n += 1; li += f'<li><b>{n}</b><span>{it}</span></li>'
    parts += f'<article class="part"><div class="pn">{e(p["n"])}</div><h3>{e(p["t"])}</h3><ul>{li}</ul></article>'
info = {k: v for k, v in c.get('info', {}).items() if v}
info_sec = ''
if info:
    cells = ''.join(f'<div><b>{e(k)}</b><span>{e(v)}</span></div>' for k, v in info.items())
    info_sec = f'<section class="blk"><div class="wrap"><div class="lab">강의 안내</div><h2>언제, <span class="am">어디서</span></h2><div class="info">{cells}</div></div></section>'
rep = {
 'TITLE_PLAIN': e(c['title_plain']), 'COURSE': e(c['course']), 'KICKER': e(c['kicker']), 'SUBTITLE': e(c['subtitle']),
 'ORG': e(c['org']), 'OG_DESC': e(c['og_desc']), 'DOMAIN': c['domain'].rstrip('/'), 'OG_IMAGE': c['og_image'], 'PAGE': c['page'],
 'TITLE_HTML': c['title_html'], 'CHIPS': ''.join(f'<span>{e(x)}</span>' for x in c['chips']),
 'SLIDES_URL': c['slides_url'], 'INFO_SECTION': info_sec,
 'PROMISE_LABEL': e(c['promise_label']), 'PROMISE_TITLE': c['promise_title'],
 'PROMISES': ''.join(f'<div class="pc"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in c['promises']),
 'PARTS_LABEL': e(c['parts_label']), 'PARTS_TITLE': c['parts_title'], 'PARTS': parts,
 'QUOTE': c['quote'], 'QUOTE_SUB': e(c['quote_sub']), 'CARICATURE': img,
 'INSTRUCTOR_NAME': e(c['instructor']['name']), 'INSTRUCTOR_DESC': '<br>'.join(e(x) for x in c['instructor']['desc']),
 'FOOTER': e(c['footer'])}
for k, v in rep.items(): t = t.replace('{{' + k + '}}', v)
assert '{{' not in t, '채워지지 않은 항목이 있습니다'
out = os.path.join(os.path.dirname(os.path.abspath(src)), c['page'])
open(out, 'w', encoding='utf-8').write(t)
print('만들어진 파일:', out)
