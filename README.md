# Coupang Eats Frontend

## SetUp
### 1. Create React App을 타입스크립트로 시작하기

```
npx create-react-app my-app --template typescript
```

https://create-react-app.dev/docs/adding-typescript

### 2. TailWindCSS
클래스로 가득 찬 유틸리티 최초의 CSS 프레임워크입니다.
https://tailwindcss.com

TailWindCSS 설치

```
npm install -D tailwindcss
```

https://tailwindcss.com/docs/installation

VSCode TailWindCSS 확장 프로그램 설치
https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss

### 3. PostCSS 사용하기

```
npm install -D postcss autoprefixer
```

https://tailwindcss.com/docs/installation/using-postcss

### 4. tailwind.config.js 생성
tailwindcss를 추가적으로 커스터마이징하기 위해서 필요한 설정 파일

```
npx tailwindcss init
```

또는

```
npx tailwindcss init -p (postcss.config.js까지 같이 생성)
```

### 5. postcss.config.js 생성
tailwind로 작성한 css파일을 일반 css파일로 변환하기 위한 설정 파일

### 6. Apollo Client graphql설치

```
npm install @apollo/client graphql
```

https://www.apollographql.com/docs/react/get-started/

### 7. Apollo GraphQL 스키마 보기
백엔드코드의 main.ts에서
```
// CORS 미들웨어를 사용하여 CORS 설정 적용
app.enableCors({
origin: 'https://studio.apollographql.com', // 허용할 출처
methods: 'GET', // 허용할 HTTP 메서드
allowedHeaders: 'Content-Type, Accept', // 허용할 헤더
});
```
위 코드를 app.listen 전에 추가한후
https://studio.apollographql.com/sandbox/explorer 에서 상단 주소(엔드포인트)를 http://localhost:4000/graphql 로 수정

### 8. graphql-ws

```
npm i graphql-ws
```

### 9. react-router-dom 설치
5버전 : 아직까지 5버전이 많이 쓰이거나 6버전이랑 비슷하게 쓰인다.
npm i react-router-dom@5.3.4

6버전으로 진행시
npm i react-router-dom

## Authentication

