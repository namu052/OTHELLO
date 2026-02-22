# 오델로 게임 기술 스택 및 개발 규칙

# 중요:
# 코드를 작성하기 전, 반드시 아래의 memory-bank파일들을 순서대로 읽어주세요.
# 1. memory-bank/game-design-document.md (게임 기획서)
# 2. memory-bank/implemention-plan.md (구현 계획서)
# 3. memory-bank/progress.md (현재 진행 상황)
#
# 주요 기능 개발이나 마일스톤을 완료한 후에는, 아래 파일들을 업데이트해야 합니다.
# ~ memory-bank/progress.md (진행 상황)

## 1) 목표
- HTML, CSS, JavaScript 기반으로 구현한다.
- UI는 React 컴포넌트로 구성한다.
- 유지보수성과 확장성(AI 플레이어 추가)을 우선한다.

## 2) 기술 스택
- 런타임/도구: Node.js LTS, npm
- 빌드 도구: Vite
- UI 라이브러리: React (함수형 컴포넌트 + Hooks)
- 스타일: CSS 파일 분리(컴포넌트 단위), 전역 토큰은 `styles/variables.css`
- 테스트: Vitest + React Testing Library
- 정적 분석: ESLint + Prettier

## 3) 프로젝트 구조 규칙
- 아래 구조를 기본으로 한다.

```text
src/
  app/
    App.jsx
    routes.jsx
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
    reset.css
    variables.css
    globals.css
  utils/
    array.js
    logger.js
  tests/
    unit/
    integration/
```

## 4) 아키텍처 규칙
- React 컴포넌트는 표시(Presentation) 책임만 가진다.
- 게임 규칙(뒤집기, 유효 수, 패스, 종료 판정)은 `features/othello/engine`에만 둔다.
- 상태 변경은 `game-reducer`를 통해서만 수행한다.
- 컴포넌트에서 규칙 로직을 직접 구현하지 않는다.
- AI 추가를 위해 엔진은 UI와 완전히 분리된 순수 함수 형태로 유지한다.

## 5) 상태 관리 규칙
- 전역 상태는 `useReducer` + 커스텀 훅(`useOthelloGame`)을 기본으로 한다.
- 상태 모델 최소 항목:
  - 보드(8x8)
  - 현재 턴
  - 유효 수 목록
  - 점수(흑/백)
  - 연속 패스 횟수
  - 게임 종료 여부/승자
- 파생 데이터(점수, 종료 여부)는 가능한 계산 함수로 분리한다.

## 6) 컴포넌트 설계 규칙
- 컴포넌트는 단일 책임 원칙을 지킨다.
- `Board`는 그리드 렌더링만 담당한다.
- `Cell`은 클릭 이벤트 전달과 시각 상태 표시만 담당한다.
- 점수, 턴, 메시지는 `GamePanel` 하위 컴포넌트로 분리한다.
- Props drilling이 깊어질 경우에만 Context를 도입한다.

## 7) CSS 규칙
- CSS는 컴포넌트 단위 파일로 분리한다.
- 색상/간격/폰트는 CSS 변수로 관리한다.
- 클래스명은 의미 기반 네이밍을 사용한다.
- 인라인 스타일은 동적 계산이 필요한 최소 경우에만 허용한다.
- 반응형 기준을 명시한다: 모바일 우선, `min-width` 브레이크포인트 사용.

## 8) 코드 품질 규칙
- 모든 규칙 함수는 부수효과 없는 순수 함수로 작성한다.
- 매직 넘버 금지: 보드 크기, 방향 벡터 등은 `constants.js`에 정의한다.
- 함수 길이 권장 40줄 이하, 파일 길이 권장 250줄 이하.
- 공개 함수에는 입력/출력 의미가 드러나는 이름을 사용한다.
- 콘솔 로그는 `utils/logger.js`를 통해서만 사용하고 배포 빌드에서 제거 가능해야 한다.

## 9) 테스트 규칙
- 엔진 계층 테스트를 최우선으로 작성한다.
- 최소 테스트 범위:
  - 유효 수 계산
  - 8방향 뒤집기
  - 패스 처리
  - 게임 종료 판정
  - 승자/무승부 판정
- UI 통합 테스트:
  - 클릭 시 상태 반영
  - 턴 전환
  - 종료 메시지 렌더링
- 버그 수정 시 회귀 테스트를 반드시 함께 추가한다.

## 10) Git/협업 규칙
- 기능 단위 브랜치: `feat/*`, 버그 수정: `fix/*`
- 커밋 메시지: Conventional Commits(`feat:`, `fix:`, `test:`, `refactor:`)
- PR 체크리스트 필수 항목:
  - 테스트 통과
  - 린트 통과
  - 엔진 로직 변경 시 테스트 추가
  - UI 변경 시 스크린샷 첨부

## 11) 성능/확장 규칙
- 보드 셀 렌더링 최적화를 위해 필요 시 `React.memo` 적용
- 파생 계산은 메모이제이션(`useMemo`)으로 비용을 통제
- AI 플레이어는 `features/othello/ai/` 하위에 전략 모듈로 추가
- 네트워크/멀티플레이 확장 시 엔진 코드는 재사용 가능해야 한다.
