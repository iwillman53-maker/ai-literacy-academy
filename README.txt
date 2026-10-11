강의 홈페이지 템플릿 사용법
==========================
바꾸는 것은 course.json 하나뿐입니다. (메모장으로 열어 값만 고치세요)

[바꿀 항목]
- course        과목명        → 링크 미리보기 제목 "과목명 | 가천대학교" 에도 반영
- title_plain / title_html   큰 제목 (title_html 의 <em>…</em> 부분이 노란색)
- subtitle      부제
- kicker        제목 위 한 줄 (예: 대학생 통일교육 · 180분)
- info          일시 / 시간 / 장소 / 대상 / 강사  (비워 두면 '강의 안내' 구역이 나오지 않음)
- promises      오늘의 약속 (제목, 설명 쌍)
- parts         강의 구성 (부 이름, 부 제목, 항목들)
- page / slides_url / og_image   이 홈 파일 이름 / 연결할 슬라이드 파일 / 링크 미리보기 이미지 파일

[홈 페이지 만들기]
  python make_landing.py course.json
→ course.json 의 page 이름(예: unification.html)으로 파일이 만들어집니다.
  (캐리커처는 caricature.jpg 가 같은 폴더에 있으면 자동으로 파일 안에 들어갑니다)

[평소에는]
Claude 에게 "강의 홈 템플릿으로 (과목명/날짜/시간/내용)로 만들어줘" 라고 하면
이 템플릿으로 홈 페이지와 링크 미리보기 이미지까지 한 번에 만들어 드립니다.
