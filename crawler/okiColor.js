import cheerio from "cheerio";
import config from 'config';
const { waitUntil } = config.get("puppeteerPageSettings");

/**
 * 호환되는 프린터 모델: OKI C833, C843
 * 
 * @param {puppeteer.Page} page 
 * @param {Object} printer
 */
const okiC843 = async (page, printer) => {
  const { dept, model, url } = printer;
  let supplyInfo = {};

  try {
    await page.goto(url, { waitUntil }); // 네트워크가 idle 상태일 때까지 대기
    await page.waitForTimeout(5000); // 외부 리소스 가져오는 시간 대기용?
    await page.waitForSelector("html");
    const html = await page.content(); // html 소스 가져오기

    const $ = cheerio.load(html, { decodeEntities: false }); // 한글 변환
    const elements = $(".toner_bar"); // class="toner_bar"인 태그 정보를 모두 가져옴

    supplyInfo = {
      dept, model, url,
      tonerK: elements[0].next.data,
      tonerC: elements[1].next.data,
      tonerM: elements[2].next.data,
      tonerY: elements[3].next.data,
      drumK: elements[4].next.data.trim(),
      drumC: elements[5].next.data.trim(),
      drumM: elements[6].next.data.trim(),
      drumY: elements[7].next.data.trim(),
      // transferBelt: elements[8].next.data.trim(), // 전사벨트
      // fuser: elements[9].next.data.trim(), // 정착기(퓨저)
    };
  } 
  
  catch(e) {
    supplyInfo = { dept, model, url, error: e.toString() };
  }

  return supplyInfo;
};

export { okiC843 };
