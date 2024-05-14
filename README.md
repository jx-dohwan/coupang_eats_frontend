## 💡프로젝트 소개

```
1️⃣ 주제 :  
2️⃣ 목표 : KoBART로 학습한 한국어 대화문 요약 모델을 Flask를 통해서 웹 서비스로 배포
3️⃣ 설명 : 기존의 Aiffel에서 진행한 대화문 생성요약 프로젝트를 베이스로 하여 KoBART 모델을 개선 및 서빙을 진행할 것 
```

<img src="img/result_v1.png"/>

### 해당 프로젝트에 관한 자세한 설명은 블로그에 정리해 놓았다.<br>
- [쿠팡이츠 클론코딩 프론트엔드](https://velog.io/@jx7789/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-%EB%8C%80%ED%99%94-%EC%9A%94%EC%95%BD-%EC%84%9C%EB%B9%84%EC%8A%A4-pepkrzfe)<br>](https://velog.io/@jx7789/series/%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0-%ED%81%B4%EB%A1%A0%EC%BD%94%EB%94%A9ft.%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C)<br>

---
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
### 1. GraphQL Code Generator 최신 사용법 정리

GraphQL Code Generator를 사용하여 React 프로젝트에서 Apollo Client와 함께 타입스크립트 타입을 자동 생성하는 과정을 단계별로 정리합니다. 이 과정은 GraphQL 스키마에 기반하여 필요한 타입스크립트 인터페이스와 훅스를 생성하여, API 사용 시 타입 안전성을 보장하고 개발 효율성을 높입니다.

#### Step 1: 필요한 패키지 설치

먼저, 프로젝트에 필요한 GraphQL Code Generator 관련 패키지들을 설치합니다.

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript-operations @graphql-codegen/typescript
```

- `@graphql-codegen/cli`: GraphQL Code Generator의 커맨드 라인 인터페이스
- `@graphql-codegen/typescript`: 타입스크립트 타입을 생성하는 플러그인
- `@graphql-codegen/typescript-operations`: GraphQL 문서(쿼리, 뮤테이션, 서브스크립션)에 대한 타입스크립트 타입을 생성하는 플러그인

#### Step 2: `codegen.yml` 설정 파일 생성

`codegen.yml` 파일을 프로젝트 루트에 생성하고, 다음과 같이 설정합니다.

```yaml
overwrite: true
schema: http://localhost:4000/graphql
documents: "./src/**/*.tsx"
generates:
  ./src/__api__/types.ts:
    plugins:
      - typescript
      - typescript-operations
```

- `overwrite`: 기존 생성된 파일들을 덮어쓸지 여부를 결정합니다.
- `schema`: GraphQL 서버의 스키마 URL을 지정합니다.
- `documents`: 프로젝트 내의 GraphQL 문서(쿼리, 뮤테이션, 서브스크립션 등)가 위치한 파일 경로를 패턴으로 지정합니다.
- `generates`: 생성된 타입스크립트 파일의 저장 위치와 사용할 플러그인들을 지정합니다.

#### Step 3: `package.json`에 스크립트 추가

`package.json` 파일에 다음 스크립트를 추가하여 타입 생성을 쉽게 실행할 수 있도록 합니다.

```json
"scripts": {
  "generate": "graphql-codegen"
}
```

#### Step 4: 타입 생성 실행

설정을 완료한 후, 아래의 커맨드로 타입을 생성합니다.

```bash
npm run generate
```

이 명령어는 `./src/__api__/types.ts`에 지정된 경로로 타입 파일을 생성합니다. 생성된 타입 파일은 백엔드의 모든 타입을 포함하며, 뮤테이션과 쿼리 이름에는 자동으로 `Mutation`과 `Query` 접미사가 붙습니다 (예: `login` 뮤테이션이 있을 경우 `loginMutation` 타입을 생성).

#### Step 5: 생성된 타입 사용 예

생성된 타입을 사용하여 Apollo Client의 훅스를 타입 안전하게 사용합니다.

```tsx
import { useMutation, gql } from '@apollo/client';
import { LoginMutation, LoginMutationVariables } from './__api__/types';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

function Login() {
  const [login, { data, loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION);

  const handleLogin = () => {
    login({
      variables: {
        email: 'example@example.com',
        password: 'password'
      }
    });
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        Login
      </button>
      {error && <p>Error logging in!</p>}
      {data && <

p>Welcome, {data.login.user.name}!</p>}
    </div>
  );
}
```

#### 주의사항

- `codegen.yml`에서 `documents` 경로 설정 시, 실제 GraphQL 쿼리와 뮤테이션을 포함하는 파일들을 정확히 지정해야 합니다.
- 스키마 URL(`schema`)은 현재 GraphQL 서버의 주소로, 로컬 개발 환경 또는 실제 서버의 주소가 될 수 있습니다.
- 생성된 타입의 이름이 기대와 다를 경우(예: `loginMutationMutation`), GraphQL 문서 내에서 사용하는 쿼리나 뮤테이션의 이름을 확인하고 필요 시 재조정해야 할 수 있습니다.

이렇게 설정하면 GraphQL Code Generator를 사용하여 타입 안전성을 보장하고, 개발 과정에서의 실수를 줄일 수 있습니다.

