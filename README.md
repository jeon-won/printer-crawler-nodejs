# printer-crawler-nodejs

## 개요
각종 네트워크 프린터의 소모품 정보(토너, 드럼 등의 잔량)를 수집하는 Node.js 프로그램입니다. 자바스크립트를 배워볼 겸 겸사겸사...


## 사용한 주요 라이브러리

### pupeteer
네트워크 프린터의 소모품 정보를 표시하는 페이지는 대부분 자바스크립트로 구현되어 있어 동적인 크롤링이 필요합니다. puppeteer는 동적인 웹페이지 소스를 얻어오기 위해 사용합니다.

### puppeteer-cluster
puppeteer는 비동기 방식으로 작동합니다. 크롤링할 프린터 대수가 많아질수록 puppeteer에 포함된 크로미움 인스턴스도 이에 비례하여 생성되므로 CPU 사용률과 메모리 사용량이 급격히 높아져 크롤링이 제대로 되지 않을 수 있습니다. puppeteer-cluster를 사용하면 인스턴스 풀을 관리하여 크로미움 병렬 처리를 유용하게 할 수 있습니다.

자세한 사용법은 https://github.com/thomasdondorf/puppeteer-cluster 을 참고...

### cheerio
cheerio는 html 소스에서 원하는 정보만 추출하기 위해 사용합니다.

### config
`./config/default.json` 파일에 저장된 값을 쉽게 불러올 수 있게 해주는 라이브러리입니다.

### exceljs
엑셀 파일을 생성하기 위한 라이브러리입니다. 자세한 사용법은 https://github.com/exceljs/exceljs#create-a-workbook 을 참고...


## 프로그램 구조

### 작동방식
1. Puppeteer Cluster 인스턴스를 생성합니다.
2. 프린터 정보를 Puppeteer Cluster Queue에 전달합니다.
3. Puppeteer Cluster 인스턴스는 각 프린터에 맞는 크롤러 함수를 호출한 후 크롤링 결과를 전달받아 배열에 저장합니다.
4. 모든 크롤링 작업이 끝나면 Puppeteer Cluster 인스턴스를 해제합니다.
5. 크롤링 결과가 저장된 배열을 파일로 저장합니다.

### 최상위 폴더
`index.js` 파일은 프로그램의 시작점입니다. 프로그램을 시작하려면 `node index` 또는 `npm start` 명령어를 실행합니다.

### config 폴더
* `default.json`: 프로그램 설정 정보를 담은 JSON입니다. config 라이브러리에 의해 사용됩니다.
  - maxConcurrency: 최대 병렬 작업 수
  - monitor: 작업 상황을 콘솔에 출력
  - waitUntil: 네트워크 대기 설정 (networkidle2: 네트워크가 idle 상태일 때까지 대기)
  - Warning(주의) 및 Alert(경고) 수치: 해당 수치 이하이면 엑셀파일에 색을 표시함
  - saveOption: 해당 파일로 저장할 것인지 여부
``` json
{
  "puppeteerClusterSettings": {
    "maxConcurrency": 5,
    "monitor": true
  },
  "puppeteerPageSettings": {
    "waitUntil": "networkidle2"
  },
  "excelSettings": {
    "tonerWarning": 50,
    "tonerAlert": 25,
    "drumWarning": 30,
    "drumAlert": 15,
    "warningColor": "FFFFDAB9",
    "alertColor": "FFFF6347"
  },
  "saveOptions": {
    "xlsx": true,
    "json": true
  }
}
```

* `target.json`: 크롤링할 프린터 정보를 포함하는 JSON 배열입니다. crawler 속성에는 crawler 폴더에 있는 크롤러 함수 이름이 들어가야 합니다.
```json
[
  {
    "dept": "Department",
    "model": "Printer Model",
    "crawler": "okiC843",
    "url": "http://192.168.100.1/printer/suppliessum.htm"
  }
]
```

### crawler 폴더
이 폴더에는 프린터 소모품 정보를 크롤링하는 함수가 구현되어 있습니다. 이 함수들은 puppeteer-cluster에서 사용하는 page 객체와 `target.json` 파일에 명시된 프린터 정보를 매개변수로 받습니다.

### services 폴더
* `getCurrentTime.js`: 현재시간(년월일시분초) 값을 반환합니다. 크롤링 결과를 저장할 때 현재 시간을 얻어오기 위해 사용합니다.
* `getHtmlSource.js`: html 소스를 반환합니다. (테스트 용으로 만든 함수).
* `save.js`: saveJson() 함수와 saveXlsx() 함수가 크롤링 결과를 파일로 저장합니다.


## 크롤러 함수와 호환되는 프린터 모델
같은 모델끼리도 소모품 정보가 다르게 보여지는 경우가 있고, 펌웨어(?) 종류에 따라 소모품 표시 방식이 다르기 때문에 호환이 되지 않을 수 있습니다.

### okiBlack.js
* okiES5112(): OKI ES5112

### okiColor.js
* okiC843(): OKI C833, C843

### sindohColor.js
* sindohD410(): Sindoh D410, D711
* sindohD420(): Sindoh D420 (CM3091)
* sindoh2ndD420(): 일부 Sindoh D420, D422
* sindohD720(): Sindoh D270, D722 (CM6011)

### xeroxBlack.js
* xeroxDP3055(): Xerox DocuPrint 3055
* xeroxII3005(): Xerox DocuCentre-II 3005
* xeroxII3007(): Xerox DocuCentre-II 3007
* xeroxIV2060(): Xerox DocuCentre-IV 2060, DocuCentre-IV 3060, DocuCentre-IV 3065

### xeroxColor.js
* xeroxC2265(): Xerox DocuCentre-IV C2265
* xeroxC2275(): Xerox ApeosPort-V C2275, ApeosPort-V C3373, DocuCentre-V C3374, DocuCentre-V C3374, ApeosPort-V C3376
* xeroxC3371(): Xerox DocuCentre-VI C3371
* xeroxC5005(): Xerox DocuPrint C5005
* xeroxC5580(): Xerox ApeosPort-V C5580, DocuCentre-V C5585
