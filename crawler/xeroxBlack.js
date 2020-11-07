import cheerio from "cheerio";
import config from 'config';
const { waitUntil } = config.get("puppeteerPageSettings");

/* Xerox DP3055 흑밸프린터 소모품 정보 크롤링 */
const xeroxDP3055 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); 
    // await page.waitForTimeout(5000); // 외부 리소스 가져오는 시간 대기용
    const html = await page.content(); // html 소스 가져오기

    const $ = cheerio.load(html, { decodeEntities: false }); //한글 변환
    const elements = $("font"); // small 태그 전부 가져옴

    supplyInfo = {
      dept, model, url,
      toner_k: elements[7].children[1].data.trim(), // 이 프린터는 드럼토너 일체형
      maintenanceKit: elements[10].children[0].data, // 유지보수 키트
    };
  } 
  
  catch (e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
}


/* Xerox DCII3005 흑백프린터 소모품 정보 크롤링 */
const xeroxII3005 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); 
    // await page.waitForTimeout(5000); 
    const html = await page.content(); 

    const $ = cheerio.load(html, { decodeEntities: false }); 
    const elements = $("small"); // small 태그 전부 가져옴

    supplyInfo = {
      dept, model, url,
      toner_k: elements[3].children[0].data,
      drum_k: elements[7].children[0].data,
    };
  } 
  
  catch (e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }
  
  return supplyInfo;
}


/* Xerox DCII3007 흑백프린터 소모품 정보 크롤링 */
const xeroxII3007 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = [];
  
  try {
    await page.goto(url, { waitUntil });
    // await page.waitForTimeout(5000);
    const html = await page.content();
  
    const $ = cheerio.load(html, { decodeEntities: false });
    const elements = $("small"); // small 태그 전부 가져옴
  
    supplyInfo = {
      dept, model, url,
      toner_k: elements[5].children[0].data,
      drum_k: elements[9].children[0].data,
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};


/* Xerox DCIV2060 흑백프린터 소모품 정보 크롤링 */
const xeroxIV2060 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};
  
  try {
    await page.goto(url, { waitUntil }); // 네트워크가 idle 상태일 때까지 대기
    // await page.waitForTimeout(5000); // 외부 리소스 가져오는 시간 대기용
    const html = await page.content(); // html 소스 가져옴

    const $ = cheerio.load(html, { decodeEntities: false }); //한글 변환
    const elements = $("small"); // small 태그 전부 가져옴

    supplyInfo = {
      dept, model, url,
      toner_k: elements[5].children[0].data,
      drum_k: elements[9].children[0].data,
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;  
};

export { xeroxDP3055, xeroxII3005, xeroxII3007, xeroxIV2060 };
