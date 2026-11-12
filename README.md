# 철하네 꿀 부사사과 (사내 사과 판매 안내 앱)

주소: https://cgn210-alt.github.io/cgn-apple/ (저장소를 만든 뒤부터 열림)
관리자: https://cgn210-alt.github.io/cgn-apple/admin.html

- 사내게시판 전체공지(2022·2023·2024·2026년) 사과 판매 글을 바탕으로 만든 앱입니다.
- 화면 내용은 Firebase 데이터베이스 `apple/content`에 저장됩니다. 누구나 볼 수 있고, 마스터만 고칠 수 있습니다.
- 저장된 내용이 없거나 Firebase 설정 전이면 `apple-data.js`의 기본 내용이 보입니다.
- 마스터: cgn210@cgnmail.net (관리자 페이지에서 수정·저장)

## 처음 한 번 설정

1. Firebase 콘솔(console.firebase.google.com)에서 새 프로젝트 만들기 (예: cgn-apple)
2. Authentication > 로그인 방법 > Google 사용 설정
3. Authentication > 설정 > 승인된 도메인에 `cgn210-alt.github.io` 추가
4. Realtime Database 만들기 (위치: 싱가포르 asia-southeast1, 잠금 모드로 시작)
5. Realtime Database > 규칙 탭에 `database.rules.json` 내용을 붙여 넣고 게시
6. 프로젝트 설정 > 내 앱 > 웹 앱 추가 → 나오는 설정값을 `firebase-config.js`에 붙여 넣기
7. github.com/new 에서 저장소 `cgn-apple`(Public) 만들기 → 이 폴더에서 `사이트-올리기.bat` 실행
8. 저장소 Settings > Pages > Branch: main / (root) 저장

## 내용 고치기

1. 관리자 주소 접속 → 마스터 구글 계정으로 로그인
2. 고칠 칸을 바꾸고 아래 '저장' → 앱에 바로 반영됩니다(앱은 새로고침).
3. '처음 내용으로 되돌리기'는 화면만 되돌립니다. 저장을 눌러야 실제로 반영됩니다.

## 보안 규칙을 바꿨을 때

`database.rules.json`을 고치면 Firebase 콘솔 규칙 탭에 직접 다시 붙여 넣고 게시해야 합니다.
