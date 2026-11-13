# 철하네 꿀 부사사과 (사내 사과 판매 안내 앱)

주소: https://cgn210-alt.github.io/cgn-apple/ (저장소를 만든 뒤부터 열림)
관리자: https://cgn210-alt.github.io/cgn-apple/admin.html

- 사내게시판 전체공지(2022·2023·2024·2026년) 사과 판매 글을 바탕으로 만든 앱입니다.
- 화면 내용은 Firebase 데이터베이스 `apple/content`에 저장됩니다. 누구나 볼 수 있고, 마스터와 부관리자만 고칠 수 있습니다.
- 저장된 내용이 없거나 Firebase 설정 전이면 `apple-data.js`의 기본 내용이 보입니다.
- 마스터: cgn210@cgnmail.net (관리자 페이지에서 수정·저장, 부관리자 등록·삭제)
- 부관리자: 마스터가 관리자 페이지 '부관리자 관리'에서 등록한 구글 계정 (`apple/admins`에 저장). 내용 수정만 가능.
- 앱 맨 아래 '관리자 페이지 열기' 버튼으로 관리자 화면에 들어갈 수 있습니다.

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

## 주문 받기와 입금 확인 안내

- 앱 '주문하기'에서 상자 수를 고르고 주문 신청서를 보내면 Firebase `apple/orders`에 저장됩니다.
  주문 내용(이름·연락처·주소)은 마스터와 부관리자만 볼 수 있습니다.
- 관리자 페이지 맨 위 '주문 현황'에 주문이 실시간으로 보입니다. 전체·입금 대기·입금 확인 건수와 금액, 상품별 상자 수가 함께 집계됩니다.
- 입금을 확인하면 '입금 확인·문자 보내기'를 누릅니다. 주문이 '입금 확인·배송 시작'으로 바뀌고,
  휴대폰 문자 앱이 신청자 번호와 안내 문구가 채워진 채로 열립니다. 전송만 누르면 됩니다.
  (문자 앱이 열리는 것은 휴대폰에서입니다. PC에서는 '카톡용 문구 복사'를 쓰세요.)
- 카카오톡으로 알리려면 '카톡용 문구 복사'를 눌러 신청자 대화창에 붙여 넣습니다.
- '엑셀(CSV) 내려받기'로 주문 전체를 엑셀 파일로 받을 수 있습니다.
- 주문 기능을 쓰려면 아래 '보안 규칙을 바꿨을 때'대로 `database.rules.json`을 Firebase 콘솔에 다시 게시해야 합니다.

## 카카오톡으로 공유하기

- 앱은 앱 주소, 관리자는 `https://cgn210-alt.github.io/cgn-apple/manage.html` 주소를 공유합니다.
  카카오가 admin.html 주소는 미리보기를 만들지 않아서, manage.html(썸네일 붙음 → 관리자 화면으로 이동)을 씁니다.
- 썸네일 원본은 `apple-og-source.html`(관리자용은 `?admin`)이고, 1200x630으로 캡처해 `apple-og.png`, `apple-admin-og.png`로 저장합니다.
- 썸네일을 바꾼 뒤 카톡에 예전 그림이 나오면 index.html·manage.html의 `?v=1` 숫자를 올립니다.
- 카톡 안의 브라우저에서는 구글 로그인이 막혀 있습니다. 관리자 로그인은 '다른 브라우저로 열기'로 하세요.

## 보안 규칙을 바꿨을 때

`database.rules.json`을 고치면 Firebase 콘솔 규칙 탭에 직접 다시 붙여 넣고 게시해야 합니다.
