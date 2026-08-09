# ✌️ 가위바위보 대결 ✊

초등학생을 위한 밝고 재미있는 10라운드 가위바위보 대결 웹게임 프로젝트입니다.
컴퓨터 AI와 10라운드 동안 가위바위보를 겨루고, 실시간 점수와 소요시간을 기록하여 **Firebase Cloud Firestore TOP 10 랭킹**에 도전합니다.

---

## 🚀 주요 기능

- **직관적이고 밝은 UI**: 큰 글씨, 귀여운 가위바위보 아이콘(✌️ ✊ ✋), 모바일 터치 친화적 디자인
- **10라운드 맞대결**: Progress Bar와 함께 현재 라운드(ROUND X / 10) 및 실시간 승/무/패 전적 표시
- **10초 제한시간 타이머**: 라운드당 10초 타이머, 5초 이하 시 빨간색 강조 및 진동 효과, 시간 초과 시 자동 패배 처리
- **가위... 바위... 보! 대결 연출**: 학생과 컴퓨터의 선택을 재미있는 쇼다운 카운트다운 연출 후 공개
- **실시간 Firestore 랭킹**: 점수(승리 x 10점) 내림차순 및 소요시간 오름차순으로 정렬된 TOP 10 챔피언 랭킹
- **중복 저장 방지**: 게임 종료 시 결과가 단 1회만 정확히 Firestore에 저장되도록 방지

---

## 🛠️ 기술 스택

- **Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Motion (Framer Motion)
- **Backend & Database**: Firebase Cloud Firestore (Modular JS SDK v11)
- **Deployment**: Vercel

---

## 💻 로컬 개발 환경 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
프로젝트 루트의 `.env.example` 파일을 복사하여 `.env` 파일 또는 `.env.local`을 만듭니다.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드 및 미리보기
```bash
npm run build
```

---

## 📖 초보자를 위한 단계별 가이드 (Firebase ~ GitHub ~ Vercel 배포)

### 1. Firebase 새 프로젝트 만들기
1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속합니다.
2. **"프로젝트 추가"** 버튼을 클릭합니다.
3. 프로젝트 이름으로 `rock-paper-scissors-game`을 입력하고 **계속**을 누릅니다.
4. Google Analytics 설정 여부를 선택한 후 **프로젝트 만들기**를 완료합니다.

### 2. Firebase에서 웹 앱 등록하기
1. 생성된 Firebase 프로젝트 메인 화면 중앙의 **웹 아이콘(`</>`)**을 클릭합니다.
2. 앱 닉네임에 `가위바위보 웹앱`을 입력합니다.
3. **앱 등록** 버튼을 클릭합니다.

### 3. Firebase SDK config 값 확인하기
1. 앱 등록 후 화면에 표시되는 `const firebaseConfig = { ... }` 코드를 확인합니다.
2. 각 항목의 값(apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)을 복사해 둡니다.

### 4. Firestore Database 만들기
1. Firebase 콘솔 좌측 메뉴에서 **빌드 > Firestore Database**를 선택합니다.
2. **데이터베이스 만들기** 버튼을 누릅니다.
3. 위치는 `asia-northeast3 (서울)`을 추천하며, 보안 규칙은 **프로덕션 모드에서 시작**을 선택합니다.

### 5. Firestore Security Rules 입력하기
1. Firestore 메인화면 상단의 **규칙(Rules)** 탭을 클릭합니다.
2. 기존 규칙을 삭제하고 아래 규칙을 그대로 복사하여 붙여넣고 **게시(Publish)**를 클릭합니다.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isValidRanking(data) {
      return data.keys().hasAll(['name', 'score', 'wins', 'draws', 'losses', 'time', 'createdAt'])
        && data.keys().size() == 7
        && data.name is string
        && data.name.size() >= 1
        && data.name.size() <= 20
        && data.score is number
        && data.score >= 0
        && data.score <= 100
        && data.wins is number
        && data.wins >= 0
        && data.wins <= 10
        && data.draws is number
        && data.draws >= 0
        && data.draws <= 10
        && data.losses is number
        && data.losses >= 0
        && data.losses <= 10
        && data.wins + data.draws + data.losses == 10
        && data.time is number
        && data.time >= 0
        && data.createdAt == request.time;
    }

    match /rockPaperScissorsRankings/{rankingId} {
      allow read: if true;
      allow create: if isValidRanking(request.resource.data);
      allow update, delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6. 필요한 Firestore Index 설정 안내
본 앱은 기본적으로 점수(`score`) 정렬 후 클라이언트에서 소요시간(`time`) 복합 정렬을 수행하도록 안전 설계되어 추가 색인 생성 없이 즉시 작동합니다.
더 빠른 백엔드 멀티 정렬을 원할 경우 Firestore **색인(Indexes)** 탭에서 아래 복합 색인을 추가할 수 있습니다:
- 컬렉션 ID: `rockPaperScissorsRankings`
- 필드 1: `score` (내림차순)
- 필드 2: `time` (오름차순)

### 7. AI Studio Secrets에 Firebase 환경변수 입력하기
1. AI Studio 우측 상단 **Secrets / Settings** 패널을 엽니다.
2. 아래 6개 키에 3번 과정에서 확인한 Firebase 실제 설정값을 등록합니다.
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 8. GitHub Repository로 프로젝트 저장하기
1. AI Studio 우측 상단 메뉴에서 **Export / Save to GitHub**를 선택합니다.
2. 본인의 GitHub 계정을 연동하고 Repository 이름(예: `rock-paper-scissors-game`)을 입력하여 Push 합니다.

### 9. GitHub에 .env가 올라가지 않았는지 확인하기
1. 생성된 GitHub Repository 페이지에 접속합니다.
2. 파일 목록에서 `.env`나 `.env.local` 파일이 존재하지 않는지 확인합니다 (`.env.example`만 올라가야 합니다).

### 10. Vercel에서 GitHub Repository Import하기
1. [Vercel](https://vercel.com/)에 로그인 후 **Add New... > Project**를 누릅니다.
2. GitHub 계정을 연결하고 방금 생성한 `rock-paper-scissors-game` 저장소를 선택한 후 **Import**를 누릅니다.

### 11. Vercel Environment Variables에 Firebase 6개 값 입력하기
1. Vercel의 **Environment Variables** 섹션을 펼칩니다.
2. 7번 과정의 6개 변수(`VITE_FIREBASE_*`)와 값을 각각 입력하고 Add 합니다.

### 12. Vercel에서 Deploy하기
1. **Deploy** 버튼을 누릅니다.
2. 빌드가 정상적으로 시작되고 약 1분 이내에 폭죽 애니메이션과 함께 배포 URL이 생성됩니다.

### 13. 배포 후 실제 사이트에서 Firebase 랭킹 테스트하기
1. 배포 완료된 Vercel 도메인에 접속합니다.
2. 도전자 이름을 입력하고 10라운드 게임을 완료합니다.
3. 결과 화면에서 "✅ 랭킹에 성공적으로 기록되었습니다!" 문구를 확인하고 **🏆 랭킹 보기** 메뉴에서 본인의 기록이 상위권에 업로드되었는지 확인합니다.
