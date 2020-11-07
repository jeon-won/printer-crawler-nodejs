import cheerio from "cheerio";
import config from 'config';
const { waitUntil } = config.get("puppeteerPageSettings");

/* Sindoh D410, D720, 일부 D420 컬러복합기 소모품 정보 크롤링 */
const sindohD410 = async (page, printerInfo) => {
    const { dept, model, url } = printerInfo;
    let supplyInfo = {};

    try {
      await page.goto(url, { waitUntil }); // 네트워크가 idle 상태일 때까지 대기
      // await page.waitForTimeout(5000); // 외부 리소스 가져오는 시간 대기용
      const html = await page.content(); // html 소스 가져오기

      const $ = cheerio.load(html, { decodeEntities: false }); // 한글 변환
      const elements = $(".data-table").find("tbody tr td"); // < class="data-table"> -> <tbody> -> <tr> -> <td> 태그 정보 조회
      const elements2 = $(".data-table-con-five").find("tbody tr td"); // < class="data-table-con-five"> -> <tbody> -> <tr> -> <td> 태그 정보 조회

      supplyInfo = {
        dept, model, url,
        tonerK: elements[11].children[0].data.trim(),
        tonerC: elements[8].children[0].data.trim(),
        tonerM: elements[5].children[0].data.trim(),
        tonerY: elements[2].children[0].data.trim(),
        drumK: elements[29].children[0].data.trim(),
        drumC: elements[14].children[0].data.trim(),
        drumM: elements[19].children[0].data.trim(),
        drumY: elements[24].children[0].data.trim(),
        // filter: elements2[2].children[0].data.trim(), // 필터. D420(CM3091)에선 안 보였음...
        // transferBelt: elements2[7].children[0].data.trim(), // 전사 벨트 유니트
        // fuser: elements2[12].children[0].data.trim(), // 정착 유니트
        // transferRoller: elements2[17].children[0].data.trim(), // 전사 롤러 유니트
        wastebox: elements2[21].children[0].data.trim(), // 폐토너통
      };
    } 
    
    catch (e) {
      supplyInfo = { dept, model, url, error: e.toString() };
    }

  // 크롤링 결과를 담은 배열 리턴
  return supplyInfo;
};


/* Sindoh CM3091(D420, D422) 컬러복합기 소모품 정보 크롤링 */
const sindohD420 = async (page, printerInfo) => {
  const { dept, model, url } = printerInfo;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil });
    // await page.waitForTimeout(5000);
    const html = await page.content();

    const $ = cheerio.load(html, { decodeEntities: false });
    const elements = $(".LevelPer"); // class="LevelPer"인 태그 정보를 모두 가져옴
    const elements2 = $(".data-table-con-five").find("tbody tr td"); // < class="data-table-con-five"> -> <tbody> -> <tr> -> <td> 태그 정보 조회

    supplyInfo = {
      dept, model, url,
      tonerK: elements[3].attribs.value,
      tonerC: elements[2].attribs.value,
      tonerM: elements[1].attribs.value,
      tonerY: elements[0].attribs.value,
      drumK: elements[7].attribs.value,
      drumC: elements[4].attribs.value,
      drumM: elements[5].attribs.value,
      drumY: elements[6].attribs.value,
      // developerK: elements[11].attribs.value, // 현상유닛(블랙)
      // developerC: elements[8].attribs.value, // 현상유닛(시안)
      // developerM: elements[9].attribs.value, // 현상유닛(마젠타)
      // developerY: elements[10].attribs.value, // 현상유닛(옐로우)
      // fuser: elements[12].attribs.value, // 정착 유니트
      // transferBelt: elements[13].attribs.value, // 전사 벨트 유니트
      // transferRoller: elements[14].attribs.value, // 전사 롤러 유니트
      wastebox: elements2[13].children[0].data,
    };
  } 
    
  catch (e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
}


/* 신도 CM6011(D720, D722) 컬러복합기 소모품 정보 크롤링 */
const sindohD720 = async (page, printerInfo) => {
  const { dept, model, url } = printerInfo;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); 
    // await page.waitForTimeout(5000); 
    const html = await page.content(); 

    const $ = cheerio.load(html, { decodeEntities: false }); 
    const elements = $(".LevelPer"); // class="LevelPer"인 태그 정보를 모두 가져옴
    const elements2 = $(".data-table-con-five").find("tbody tr td"); // < class="data-table-con-five"> -> <tbody> -> <tr> -> <td> 태그 정보 조회

    supplyInfo = {
      dept, model, url,
      tonerK: elements[3].attribs.value,
      tonerC: elements[2].attribs.value,
      tonerM: elements[1].attribs.value,
      tonerY: elements[0].attribs.value,
      drumK: elements[7].attribs.value,
      drumC: elements[4].attribs.value,
      drumM: elements[5].attribs.value,
      drumY: elements[6].attribs.value,
      // developerK: elements[11].attribs.value, // 현상유닛(블랙)
      // developerC: elements[8].attribs.value, // 현상유닛(시안)
      // developerM: elements[9].attribs.value, // 현상유닛(마젠타)
      // developerY: elements[10].attribs.value, // 현상유닛(옐로우)
      // fuser: elements[12].attribs.value, // 정착 유니트
      // transferBelt: elements[13].attribs.value, // 전사 벨트 유니트
      // transferRoller: elements[14].attribs.value, // 전사 롤러 유니트
      // tonerFilter: elements[15].attribs.value, // 토너 필터
      wastebox: elements2[17].children[0].data, // 폐토너통
      // 스테이플, 새들 스테플 카트리지1, 새들 스테플 카트리지2는 일부 기기에서 표시 안 돼서 미구현...
    };
  } 
  
  catch (e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};

export { sindohD410, sindohD420, sindohD720 };
