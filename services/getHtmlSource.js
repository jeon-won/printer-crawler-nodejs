import puppeteer from 'puppeteer';

/**
 * html 소스를 반환합니다.
 * @param {string} url 
 */
const getHtmlSource = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForTimeout(5000);
  await page.waitForSelector("html");
  const html = await page.content();

  await browser.close();
  return html;
};

export default getHtmlSource;