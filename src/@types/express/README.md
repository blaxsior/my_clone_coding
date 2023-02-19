# 타입 인식

커스텀 선언을 추가하고 싶은 경우, 다음 경로 아래에 추가한다.  
1. @types/ 폴더의 *.d.ts 파일 내부
2. Global.d.ts 파일 내부

원리는 타입스크립트 공식 문서의 [Declaration Merging](https://www.typescriptlang.org/ko/docs/handbook/declaration-merging.html#%EC%86%8C%EA%B0%9C-introduction) 을 통해 알아볼 수 있다.  
유저가 선언한 병합은 