import cheerio from "cheerio";
import config from 'config';
const { waitUntil } = config.get("puppeteerPageSettings");

/**
 * 호환되는 프린터 모델: OKI ES5112
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const okiES5112 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); // 네트워크가 idle 상태일 때까지 대기
    await page.waitForTimeout(5000); // 외부 리소스 가져오는 시간 대기용?
    await page.waitForSelector("html"); // Execution context was destroyed, most likely because of a navigation. 에러 해결 코드?
    const html = await page.content(); // html 소스 가져오기
    
    const $ = cheerio.load(html, { decodeEntities: false });
    const elements = $("tr.sub_item_color").find("td table"); // <tr class="sub_item_color> -> <td> -> <table> 태그 정보 조회

    supplyInfo = {
      dept, model, url,
      tonerK: elements[0].next.data,
      drumK: elements[1].next.data.trim(),
    };
  } 
  
  catch (e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};

export { okiES5112 };
