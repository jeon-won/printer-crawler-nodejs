import cheerio from "cheerio";
import config from 'config';
const { waitUntil } = config.get("puppeteerPageSettings");

/**
 * 호환되는 프린터 모델: Xerox DCIVC2265
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxC2265 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); // 네트워크가 idle 상태일 때까지 대기
    await page.waitForTimeout(5000); // 외부 리소스 가져오는 시간 대기용
    await page.waitForSelector("html");
    const html = await page.content(); // html 소스 가져오기
  
    const $ = cheerio.load(html, { decodeEntities: false }); //한글 변환
    const elements = $("small"); // small 태그 전부 가져옴
  
    supplyInfo = {
      dept, model, url,
      tonerK: elements[5].children[0].data,
      tonerC: elements[8].children[0].data,
      tonerM: elements[11].children[0].data,
      tonerY: elements[14].children[0].data,
      drumK: elements[22].children[0].data,
      drumC: elements[24].children[0].data,
      drumM: elements[26].children[0].data,
      drumY: elements[28].children[0].data,
      wastebox: elements[18].children[0].data,
      // transferBelt: elements[40].children[0].data, // 전사 벨트
      // fuser: elements[32].children[0].data, // 정착기(퓨저)
      // secondBiasTransferRoll: elements[35].children[0].data // 제2 바이어스 전사롤
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
}


/**
 * 호환되는 프린터 모델: APVCC275, APVC3373, DCVC3374
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxC2275 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); 
    await page.waitForTimeout(5000); 
    await page.waitForSelector("html");
    const html = await page.content(); 
  
    const $ = cheerio.load(html, { decodeEntities: false }); 
    const elements = $("small"); // small 태그 전부 가져옴
  
    supplyInfo = {
      dept, model, url,
      tonerK: elements[5].children[0].data,
      tonerC: elements[8].children[0].data,
      tonerM: elements[11].children[0].data,
      tonerY: elements[14].children[0].data,
      drumK: elements[22].children[0].data,
      drumC: elements[24].children[0].data,
      drumM: elements[26].children[0].data,
      drumY: elements[28].children[0].data,
      wastebox: elements[18].children[0].data,
      // Xerox c2275 모델은 c2263 모델과 달리 정착부, 제2 바이어스 전사롤, 전사벨트 정보가 안 보임...
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};


/**
 * 호환되는 프린터 모델: Xerox DCIVC3371
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxC3371 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil });
    await page.waitForTimeout(5000); 
    await page.waitForSelector("html");
    const html = await page.content(); 

    const $ = cheerio.load(html, { decodeEntities: false }); 
    const elements = $("small"); // small 태그 전부 가져옴

    supplyInfo = {
      dept, model, url,
      tonerK: elements[5].children[0].data,
      tonerC: elements[8].children[0].data,
      tonerM: elements[11].children[0].data,
      tonerY: elements[14].children[0].data,
      drumK: elements[22].children[0].data,
      drumC: elements[24].children[0].data,
      drumM: elements[26].children[0].data,
      drumY: elements[28].children[0].data,
      wastebox: elements[18].children[0].data,
      // 아래 속성들은 일부 VIC3371 모델에서 지원하지 않음...
      // stapleCartridge: elements[32].children[0].data, // 스테이플 카트리지
      // punchBox: elements[36].children[0].data, // 펀치 회수통
      // bindStapleCartridgeFront: elements[40].children[0].data, // 제본용 스테이플 카트리지(앞쪽)
      // bindStapleCartridgeIn: elements[42].children[0].data, // 제본용 스테이플 카트리지(안쪽)
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};


/**
 * 호환되는 프린터 모델: Xerox DPC5005
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxC5005 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};
    
  try {
    await page.goto(url, { waitUntil });
    await page.waitForTimeout(5000);
    await page.waitForSelector("html");
    const html = await page.content();
  
    const $ = cheerio.load(html, { decodeEntities: false });
    const elements = $("small"); // small 태그 전부 가져옴

    supplyInfo = {
      dept, model, url,
      tonerK: elements[5].children[0].data,
      tonerC: elements[8].children[0].data,
      tonerM: elements[11].children[0].data,
      tonerY: elements[14].children[0].data,
      drumK: elements[22].children[0].data,
      drumC: elements[24].children[0].data,
      drumM: elements[26].children[0].data,
      drumY: elements[28].children[0].data,
      wastebox: elements[18].children[0].data,
      // fuser: elements[32].children[0].data, // 정착부
      // transferBeltCleaner: elements[36].children[0].data, // 전사벨트 클리너
      // secondBiasTransferRoll: elements[40].children[0].data, // 제2 바이어스 전사롤
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};


/**
 * 호환되는 프린터 모델: Xerox APVC5580, DCVC5585
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxC5580 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil });
    await page.waitForTimeout(5000);
    await page.waitForSelector("html");
    const html = await page.content();
  
    const $ = cheerio.load(html, { decodeEntities: false });
    const elements = $("small"); // small 태그 전부 가져옴
      
    supplyInfo = {
      dept, model, url,
      tonerK: elements[5].children[0].data,
      tonerK2: elements[8].children[0].data, // 이 컬러복합기는 검정 토너를 두 개 장착함
      tonerC: elements[11].children[0].data,
      tonerM: elements[14].children[0].data,
      tonerY: elements[17].children[0].data,
      drumK: elements[25].children[0].data,
      drumC: elements[27].children[0].data,
      drumM: elements[29].children[0].data,
      drumY: elements[31].children[0].data,
      wastebox: elements[21].children[0].data,
      // stapleCartridge: elements[35].children[0].data,
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};

export { xeroxC2265, xeroxC2275, xeroxC3371, xeroxC5005, xeroxC5580 };