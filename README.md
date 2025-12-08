# CLI vs Expo Router 간단 비교 

✓ Expo Router (파일 기반 라우팅)

- 파일 이름이 곧 라우팅 경로가 됨 (file-based routing)
- _layout.tsx 파일을 통해 폴더 단위 공통 UI 레이아웃 구성 가능
- [name].tsx 형태로 동적 라우트 패턴 지원
- 파일 구조만으로 Stack / Tabs 네비게이션 자동 구성
- 라우팅 관련 코드량이 줄고 구조가 명확해짐

✓ React Navigation (코드 기반 라우팅)

- 라우트를 파일이 아닌 코드에서 직접 등록해야 함
- 파일 이름과 URL 경로는 서로 독립적
- _layout.tsx 같은 폴더 레벨 공통 레이아웃 개념 없음
- 동적 라우트는 화면에서 params를 직접 관리해야 함
- 높은 커스터마이징 가능하지만 설정량이 많아짐
