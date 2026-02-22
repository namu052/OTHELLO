# 오델로 게임 구현 계획서

## 1. 문서 목적
`memory-bank/game-design-document.md`를 기반으로, 실제 개발에 바로 착수할 수 있는 구현 계획과 산출물/검증 기준을 정의한다.

## 2. 구현 목표
- 웹에서 동작하는 8x8 오델로 게임을 구현한다.
- 1차 릴리스는 인간 vs 인간(PvP) 모드에 집중한다.
- React 컴포넌트 구조와 순수 규칙 엔진 분리로 유지보수성과 AI 확장성을 확보한다.

## 3. 범위 정의
### 포함 범위 (MVP)
- 8x8 보드 렌더링
- 초기 돌 4개 자동 배치
- 유효 수 판정(8방향)
- 착수 시 뒤집기 처리
- 턴 전환 및 패스 처리
- 점수 집계(흑/백)
- 게임 종료 판정 및 승패/무승부 표시
- 새 게임 시작(리셋)

### 제외 범위 (후속)
- AI 플레이어
- 온라인 멀티플레이
- 로그인/랭킹
- 애니메이션 고도화

## 4. 기술 스택 및 원칙
- UI: React (함수형 컴포넌트 + Hooks)
- 언어: JavaScript
- 스타일: CSS 분리 파일
- 빌드: Vite
- 테스트: Vitest + React Testing Library
- 품질: ESLint + Prettier

핵심 원칙:
- 규칙 로직은 `engine` 계층의 순수 함수로 분리
- UI는 상태 표시와 이벤트 전달에 집중
- 상태 변경은 reducer를 통해 일관되게 처리

## 5. 규칙 명세(구현 기준)
### 초기 상태
- 보드 크기: 8x8
- 중앙 4칸 배치:
  - (3,3) 백, (4,4) 백
  - (3,4) 흑, (4,3) 흑
- 선공: 흑

### 유효 수
- 빈 칸에만 착수 가능
- 8방향 중 최소 1방향에서:
  - 인접 칸이 상대 돌이고
  - 그 방향으로 연속된 상대 돌 뒤에 내 돌이 존재하면 유효

### 뒤집기
- 유효 수로 착수했을 때, 조건을 만족한 모든 방향의 상대 돌을 뒤집는다.

### 패스
- 현재 턴 플레이어의 유효 수가 0개면 자동 패스
- 상대 턴으로 전환
- 양쪽 연속 패스가 발생하면 게임 종료

### 종료 조건
- 보드가 가득 찬 경우
- 양쪽 모두 유효 수가 없는 경우

### 승패 조건
- 흑/백 돌 개수를 비교
- 많은 쪽 승리
- 같으면 무승부

## 6. 개발 구조(권장 폴더)
```text
src/
  app/
    App.jsx
  components/
    board/
      Board.jsx
      Cell.jsx
      board.css
    game/
      GamePanel.jsx
      ScoreBoard.jsx
      TurnIndicator.jsx
  features/
    othello/
      engine/
        rules.js
        move-validator.js
        flipper.js
        game-over.js
      state/
        game-reducer.js
        initial-state.js
      hooks/
        useOthelloGame.js
      types/
        constants.js
  styles/
    variables.css
    globals.css
  tests/
    unit/
    integration/
```

## 7. 단계별 구현 계획
## Phase 1: 프로젝트 초기화
작업:
- Vite + React 프로젝트 생성
- ESLint/Prettier 설정
- 기본 폴더 구조 생성

완료 기준:
- `npm run dev`, `npm run test`, `npm run lint` 정상 동작

## Phase 2: 규칙 엔진 구현
작업:
- 보드/플레이어 상수 정의
- 유효 수 탐색 함수 구현
- 착수 + 뒤집기 함수 구현
- 패스/종료/승자 판정 함수 구현

완료 기준:
- 엔진 단위 테스트 통과
- UI 없이 함수 호출만으로 게임 진행 가능

## Phase 3: 상태 관리 구현
작업:
- 초기 상태 정의
- reducer 액션 정의:
  - `PLACE_STONE`
  - `PASS_TURN`
  - `RESET_GAME`
- 파생 상태(점수, 유효 수, 종료 상태) 계산 연결

완료 기준:
- reducer 테스트 통과
- 비정상 입력(유효하지 않은 수) 방어 처리 완료

## Phase 4: UI 컴포넌트 구현
작업:
- `Board`, `Cell` 렌더링
- 클릭 이벤트 -> 액션 디스패치 연결
- 점수판/턴 표시/종료 메시지/재시작 버튼 구현

완료 기준:
- 브라우저에서 PvP 한 판 진행 가능
- 불가 수 클릭 시 상태가 변하지 않음

## Phase 5: 통합 테스트 및 안정화
작업:
- 사용자 시나리오 기반 통합 테스트 작성
- 엣지 케이스 점검:
  - 단일 방향 뒤집기
  - 다중 방향 뒤집기
  - 연속 패스 종료
  - 무승부
- 린트/포맷/테스트 최종 정리

완료 기준:
- 테스트 전부 통과
- 수동 플레이 기준 주요 버그 없음

## 8. 테스트 전략
### 단위 테스트(엔진 우선)
- `getValidMoves(board, player)`
- `applyMove(board, move, player)`
- `shouldPassTurn(board, player)`
- `isGameOver(board, currentPlayer, passCount)`
- `getWinner(board)`

### 통합 테스트(UI)
- 셀 클릭 시 돌 배치 및 뒤집기 반영
- 턴 전환 표시 정확성
- 종료 시 승패 문구 정확성
- 재시작 버튼으로 초기 상태 복원

## 9. 산출물
- 동작 가능한 React 오델로 앱
- 규칙 엔진 코드 및 테스트 코드
- 기본 UI 스타일(CSS)
- 개발 문서:
  - `memory-bank/game-design-document.md` (기획)
  - `implemention-plan.md` (구현 계획)

## 10. 일정 예시 (5일)
- Day 1: 초기화 + 엔진 골격
- Day 2: 유효 수/뒤집기 구현 + 단위 테스트
- Day 3: 상태 관리 + UI 연결
- Day 4: UI 완성 + 통합 테스트
- Day 5: 버그 수정 + 품질 점검 + 릴리스 준비

## 11. 리스크 및 대응
- 리스크: 뒤집기/유효 수 로직 버그
  - 대응: 방향별 테스트 케이스를 충분히 작성
- 리스크: UI와 규칙 로직 결합으로 인한 유지보수 저하
  - 대응: 엔진 모듈 분리와 reducer 중심 상태 변경 강제
- 리스크: AI 확장 시 구조 변경 비용 증가
  - 대응: 엔진 함수 시그니처를 UI 독립적으로 유지

## 12. 완료 정의(Definition of Done)
- 규칙 명세를 만족하는 게임이 동작한다.
- 핵심 규칙 테스트(유효 수/뒤집기/패스/종료/승패) 통과
- 브라우저 수동 검증 시 한 판 전체 플레이 가능
- 린트/포맷/테스트 파이프라인 통과
