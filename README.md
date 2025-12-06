# CLI vs Expo Router 간단 비교 

🔵 Expo Router (파일 기반 라우팅)
- 파일 이름 = 라우팅 경로
- _layout.tsx = 폴더 내 화면들의 공통 UI 틀
- [name].tsx = 동적 라우트 처리 (/folder/:name)
- Stack / Tabs 네비게이션이 파일 구조만으로 자동 구성됨

🔴 React Navigation (CLI 방식)
- 라우트는 파일이 아니라 코드로 직접 등록해야 함
- 파일 이름과 URL은 아무 관련 없음
- _layout.tsx 같은 레이아웃 개념 없음
- 동적 라우트도 params를 직접 관리
