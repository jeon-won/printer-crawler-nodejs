import cheerio from "cheerio";
import config from 'config';
const { waitUntil } = config.get("puppeteerPageSettings");

/**
 * 호환되는 프린터 모델: Xerox DP3055
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxDP3055 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); 
    await page.waitForTimeout(5000); // 외부 리소스 가져오는 시간 대기용
    await page.waitForSelector("html");
    const html = await page.content(); // html 소스 가져오기

    const $ = cheerio.load(html, { decodeEntities: false }); //한글 변환
    const elements = $("font"); // font 태그 전부 가져옴

    supplyInfo = {
      dept, model, url,
      tonerK: elements[7].children[1].data.trim(), // 이 프린터는 드럼토너 일체형
      // maintenanceKit: elements[10].children[0].data, // 유지보수 키트
    };
  } 
  
  catch (e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
}


/**
 * 호환되는 프린터 모델: Xerox DCII3005
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxII3005 = async (page, printer) => {
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
      tonerK: elements[3].children[0].data,
      drumK: elements[7].children[0].data,
    };
  } 
  
  catch (e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }
  
  return supplyInfo;
}


/**
 * 호환되는 프린터 모델: Xerox DCII30067
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxIII3007 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = [];
  
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
      drumK: elements[9].children[0].data,
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};


/**
 * 호환되는 프린터 모델: Xerox DCIV2060, DCIV3060, DCIV3065
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const xeroxIV2060 = async (page, printer) => {
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
      drumK: elements[9].children[0].data,
    };
  }

  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;  
};

export { xeroxDP3055, xeroxII3005, xeroxIII3007, xeroxIV2060 };
