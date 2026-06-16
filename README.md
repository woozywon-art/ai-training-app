# AI 실무자 교육 앱 (인증 없음)

20레벨 · 1주일 완성 교육 과정. **로그인·회원관리 없음** — 테스트 서버에 올리면 누구나 바로 학습합니다.
진도/시험 점수는 각자 브라우저(localStorage)에만 저장됩니다(서버 계정 없음).

## 실행
```bash
npm install
npm run dev          # 개발 (localhost:3000)
npm run build        # 운영 빌드
npm run start        # 운영 실행 (포트 3000)
```

## 테스트 서버 배포
- **Node 서버**: `npm install && npm run build && npm run start` 후 nginx 등으로 80→3000 프록시.
- **Vercel/정적 호스팅**: 그대로 import 하면 됩니다. 모든 페이지가 정적 생성(SSG)됩니다.
- (선택) 완전 정적 파일이 필요하면 `next.config.mjs`에 `output: "export"` 추가 후 `npm run build` → `out/` 폴더를 아무 정적 호스팅에 업로드.

## 콘텐츠 채우는 법 — `src/lib/course.ts` 하나만 수정
- `LEVELS` 배열에서 각 레벨의 `slides`와 `exam.items`를 채우고 `filled: true`로 바꾸면 됩니다.
- **슬라이드 종류**
  - `visual` — 16:9 자료 화면(사진) + UI 콜아웃(번호 설명)
  - `text` — 사진 없이 텍스트로 설명(퀴즈형 개념)
  - `check` — 중간 점검 1문항
- **시험 문항(`exam.items`)** — `객관식` / `진위형`(answer 0=O,1=X) / `주관식`(sample=모범답안). 레벨마다 20문항 이상 권장.
- **제출형(`exam.submission`)** — 실습형 레벨의 50점 과제. 채점 화면에서 루브릭 자가 확인으로 점수 반영.
- 현재 **Lv.01이 완성본**입니다. 이걸 템플릿 삼아 Lv.02~20을 채우세요.

## 사진(이미지) 넣는 법
1. 이미지 파일을 `public/img/`에 넣습니다 (예: `public/img/lv1-screen.png`).
2. 해당 슬라이드의 `img.src`에 경로를 적습니다: `img: { desc: "...", size: "...", src: "/img/lv1-screen.png" }`.
3. `src`가 없으면 "여기에 이미지를 넣어주세요 + 무슨 사진인지" 플레이스홀더가 표시됩니다.

## 진도 초기화
브라우저 데이터(localStorage)를 지우면 됩니다. 서버엔 아무것도 저장되지 않습니다.
