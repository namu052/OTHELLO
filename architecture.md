# Othello 아키텍처 노트

## 1. 아키텍처 개요
현재 구조는 UI와 게임 규칙을 분리하는 레이어드 접근을 따른다.

- UI 레이어: `src/app`, `src/components`
- 도메인(규칙) 레이어: `src/features/othello/engine`
- 상태 레이어: `src/features/othello/state`, `src/features/othello/hooks`
- 공통 레이어: `src/features/othello/types`, `src/utils`
- 스타일 레이어: `src/styles`
- 테스트 레이어: `src/tests`

핵심 의도:
- 엔진 로직을 순수 함수로 유지해 테스트 가능성, 재사용성, AI 확장성을 확보한다.

## 2. 파일별 역할

### 앱/렌더링
- `src/main.jsx`
  - React 루트 마운트
  - 전역 스타일 진입점
- `src/app/App.jsx`
  - 페이지 상위 레이아웃 구성
  - `useOthelloGame` 상태를 주입하고 `Board`, `GamePanel`에 전달

### 보드 UI
- `src/components/board/Board.jsx`
  - 8x8 셀 렌더링 컨테이너
  - 보드 상태/유효 수를 `Cell`에 전달하고 클릭 이벤트를 위임
- `src/components/board/Cell.jsx`
  - 단일 셀 UI/클릭 인터랙션 단위
  - 돌 표시/유효 수 힌트 표시
- `src/components/board/board.css`
  - 보드 및 셀 시각 표현

### 게임 패널 UI
- `src/components/game/GamePanel.jsx`
  - 게임 보조 패널 조합(턴, 점수, 상태, 패스/리셋 버튼)
- `src/components/game/ScoreBoard.jsx`
  - 점수 표시 뷰
- `src/components/game/TurnIndicator.jsx`
  - 현재 턴 표시 뷰
- `src/components/game/game-panel.css`
  - 패널 레이아웃 및 액션 버튼 스타일

### 규칙 엔진 (도메인 핵심)
- `src/features/othello/engine/rules.js`
  - 초기 보드 생성(`createInitialBoard`)
  - 유효 수 목록 계산(`getValidMoves`)
- `src/features/othello/engine/move-validator.js`
  - 보드 범위 검사(`isInBounds`)
  - 상대 색 계산(`getOpponent`)
  - 뒤집기 좌표 탐색(`getFlipsForMove`)
  - 단일 수 유효성 판단(`isValidMove`)
- `src/features/othello/engine/flipper.js`
  - 수 적용 및 돌 뒤집기(`applyMove`)
  - 유효하지 않은 수는 원본 보드 반환
- `src/features/othello/engine/game-over.js`
  - 점수 집계(`getScore`)
  - 패스 여부(`shouldPassTurn`)
  - 종료 판정(`isGameOver`)
  - 승자 판정(`getWinner`)

### 상태/훅
- `src/features/othello/state/initial-state.js`
  - 초기 보드 생성 + 파생 상태 결합(`deriveGameState`, `createInitialGameState`)
- `src/features/othello/state/game-reducer.js`
  - 상태 전이 엔트리
  - `PLACE_STONE`, `PASS_TURN`, `RESET_GAME` 구현
  - 자동 패스 처리(`resolveAutoPass`) 포함
- `src/features/othello/hooks/useOthelloGame.js`
  - `useReducer` 기반 상태 접근 훅
  - `actions` 헬퍼(`placeStone`, `passTurn`, `resetGame`) 제공

상태 레이어 업데이트 메모:
- Phase 3에서 reducer 중심 액션과 파생 상태 계산 연결을 완료
- UI 이벤트 바인딩 확장은 Phase 4 범위로 유지

진행 상태 메모:
- Phase 3는 사용자 검증 완료
- Phase 4에서 UI 계층 상태/액션 바인딩 완료
- Phase 4 사용자 검증 완료, Phase 5(통합 테스트/안정화) 착수 가능

### 타입/상수
- `src/features/othello/types/constants.js`
  - 보드 크기, 돌 타입, 방향 벡터, 무승부 상수 정의

### 공통 유틸
- `src/utils/array.js`
  - 2차원 배열 생성 유틸
- `src/utils/logger.js`
  - 개발 모드 조건부 로그 유틸

### 테스트
- `src/tests/unit/engine.test.js`
  - 규칙 엔진 단위 테스트(초기 배치/유효수/단일+다중 방향 뒤집기/종료/승자)
- `src/tests/integration/app.smoke.test.jsx`
  - 앱 사용자 시나리오 통합 테스트(초기 렌더/착수/무효 클릭/리셋)
- `src/tests/setup.js`
  - 테스트 환경 초기화(jest-dom)

### 설정/품질
- `package.json`
  - 스크립트 및 의존성 정의
- `vite.config.js`
  - 빌드/개발 서버 설정
- `vitest.config.js`
  - 테스트 런타임 설정
- `eslint.config.js`
  - 정적 분석 규칙
- `.prettierrc`, `.prettierignore`
  - 코드 포맷 정책

## 3. 아키텍처 통찰

### 통찰 1: 엔진 순수 함수화가 변경 비용을 낮춘다
- `engine/*`가 React와 분리되어 있어, UI 리팩터링이나 AI 도입 시 규칙 재사용이 쉽다.
- 버그 발생 시 UI 레이어와 도메인 레이어를 분리해 진단 가능하다.

### 통찰 2: reducer 중심 상태 전이로 디버깅 지점을 고정할 수 있다
- 상태 전이가 reducer로 집중되면 액션 단위 추적이 가능해져 유지보수성이 높아진다.
- Phase 3에서 액션 타입을 확장해도 엔진 함수 계약을 유지하면 리스크가 낮다.

### 통찰 3: 유효 수/뒤집기 로직은 동일한 탐색 규칙을 공유해야 한다
- `getFlipsForMove`를 단일 진실 공급원으로 사용하면
  - 유효성 검사(`isValidMove`)
  - 뒤집기 적용(`applyMove`)
  간 규칙 불일치를 방지할 수 있다.

### 통찰 4: 파생 상태는 저장보다 계산이 안정적이다
- 점수, 종료 여부, 유효 수 목록은 보드 상태에서 계산 가능하므로
  상태 중복 저장을 최소화하면 동기화 버그를 줄일 수 있다.

### 통찰 5: 테스트 우선순위는 엔진 > UI가 맞다
- 오델로의 핵심 리스크는 규칙 로직이므로 엔진 테스트가 회귀 방어의 중심이 된다.
- UI 테스트는 사용자 흐름 보증용으로 최소-핵심 시나리오 위주가 효율적이다.

### 통찰 6: 테스트 가능한 UI는 명시적 식별자를 갖춰야 한다
- 보드 셀에 좌표 기반 `aria-label`을 두면
  - 통합 테스트가 안정적으로 사용자 행동을 재현할 수 있고
  - 추후 E2E 자동화로 확장하기 쉬워진다.

## 4. 다음 확장 시 권장 규칙
- `engine` 함수는 부수효과 없이 유지한다.
- reducer에서는 엔진 함수만 호출하고 로직 중복 구현을 피한다.
- 컴포넌트는 이벤트 전달과 렌더링 책임만 가진다.
- AI 모듈 추가 시 `features/othello/ai/`에서 엔진 함수 계약을 그대로 사용한다.
