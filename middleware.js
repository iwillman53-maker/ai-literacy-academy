/*
  강의별 비밀번호 보호 (Vercel Routing Middleware)
  ─────────────────────────────────────────────
  · 강의 안내(첫 화면, 각 강의 랜딩페이지)는 누구나 볼 수 있습니다.
  · 웹슬라이드와 실습 자료만 비밀번호를 묻습니다.
  · 비밀번호는 이 파일에 쓰지 않습니다. Vercel 화면의
    Settings → Environment Variables 에 아래 이름으로 넣습니다.
        LIFE_AI_PASSWORD        생활 속의 AI
        ADMIN_SEMINAR_PASSWORD  AI 활용 행정세미나
  · 값을 넣지 않은 강의는 지금처럼 공개됩니다(보호 꺼짐).
  · 학생은 브라우저 창에 아이디는 아무 글자나(예: student), 비밀번호만 맞게 입력하면 됩니다.
  · 비밀번호는 영문·숫자로 정하세요(한글 비밀번호는 브라우저마다 다르게 처리될 수 있음).
  · 학기가 바뀌면 값을 바꾸고 다시 배포(Redeploy)하면 이전 비밀번호는 더 이상 통하지 않습니다.
*/

const COURSES = [
  {
    env: 'LIFE_AI_PASSWORD',
    realm: 'life-ai',
    // 루트의 슬라이드 파일(slides.html, slides_v3.html 등), assets 폴더, 루트의 PDF
    test: (p) => /^\/slides[^/]*\.html$/i.test(p) || p.startsWith('/assets/') || /^\/[^/]+\.pdf$/i.test(p),
  },
  {
    env: 'ADMIN_SEMINAR_PASSWORD',
    realm: 'admin-seminar',
    // admin-seminar 폴더 안 전부, 단 랜딩페이지(index.html)는 공개
    test: (p) => p.startsWith('/admin-seminar/') && !/^\/admin-seminar\/(index\.html)?$/i.test(p),
  },
];

function passwordFrom(header) {
  if (!header || !header.startsWith('Basic ')) return null;
  try {
    const decoded = atob(header.slice(6));
    const i = decoded.indexOf(':');
    return i === -1 ? null : decoded.slice(i + 1);
  } catch (e) {
    return null;
  }
}

export default function middleware(request) {
  const path = decodeURIComponent(new URL(request.url).pathname);
  const course = COURSES.find((c) => c.test(path));
  if (!course) return; // 보호 대상이 아님 → 그대로 보여 줌

  const expected = process.env[course.env];
  if (!expected) return; // 비밀번호를 정하지 않은 강의 → 공개

  if (passwordFrom(request.headers.get('authorization')) === expected) return;

  return new Response(
    '<!doctype html><meta charset="utf-8"><title>수강생 전용</title>' +
      '<body style="font-family:sans-serif;padding:2rem;line-height:1.7">' +
      '<h1>🔒 수강생 전용 자료입니다</h1><p>수업에서 안내한 비밀번호를 입력해 주세요.<br>아이디 칸에는 아무 글자나 넣어도 됩니다.</p>' +
      '<p><a href="/">← 강의실 첫 화면으로</a></p></body>',
    {
      status: 401,
      headers: {
        'WWW-Authenticate': `Basic realm="${course.realm}", charset="UTF-8"`,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );
}
