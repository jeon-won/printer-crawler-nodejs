import puppeteerCluster from 'puppeteer-cluster';
import jsonfile from 'jsonfile';
import config from 'config';
import saveXlsx from './services/saveXlsx.js';
import getCurrentTime from './services/getCurrentTime.js';
import { okiES5112 } from './crawler/okiBlack.js';
import { okiC843 } from './crawler/okiColor.js';
import { sindohD410, sindohD420, sindohD720 } from './crawler/sindohColor.js';
import { xeroxDP3055, xeroxII3005, xeroxII3007, xeroxIV2060 } from './crawler/xeroxBlack.js';
import { xeroxC2265, xeroxC2275, xeroxC3371, xeroxC5005, xeroxC5580 } from './crawler/xeroxColor.js';

const main = async () => {
  // 크롤링 최종 결과를 담을 배열 선언
  const crawlingResult = [];
  
  // Puppeteer Cluster 생성
  const { Cluster } = puppeteerCluster;
  const { maxConcurrency, monitor } = config.get("puppeteerClusterSettings");
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency, 
    monitor
  });

   // Puppeteer Cluster 에러를 처리할 이벤트 정의
   cluster.on("taskerror", (error, data) => {
    console.log(`Error crawling ${data}: ${error.message}`);
  });

  // Puppeteer Cluster가 해야 할 일 정의
  await cluster.task(async ({ page, data }) => {
    // 각 프린터에 맞는 크롤러 함수 호출 -> 크롤링 결과를 배열에 저장
    switch (data.crawler) {
      case "okiC843":
        crawlingResult.push(await okiC843(page, data));
        break;
      case "okiES5112":
        crawlingResult.push(await okiES5112(page, data));
        break;
      case "sindohD410":
        crawlingResult.push(await sindohD410(page, data));
        break;
      case "sindohD420":
      case "sindohD710":
        crawlingResult.push(await sindohD420(page, data));
        break;
      case "sindohD720":
        crawlingResult.push(await sindohD720(page, data));
        break;
      case "xeroxC2265":
        crawlingResult.push(await xeroxC2265(page, data));
        break;
      case "xeroxC2275":
        crawlingResult.push(await xeroxC2275(page, data));
        break;
      case "xeroxC3371":
        crawlingResult.push(await xeroxC3371(page, data));
        break;
      case "xeroxC5005":
        crawlingResult.push(await xeroxC5005(page, data));
        break;
      case "xeroxC5580":
        crawlingResult.push(await xeroxC5580(page, data));
        break;
      case "xeroxDP3055":
        crawlingResult.push(await xeroxDP3055(page, data));
        break;
      case "xeroxII3005":
        crawlingResult.push(await xeroxII3005(page, data));
        break;
      case "xeroxII3007":
        crawlingResult.push(await xeroxII3007(page, data));
        break;
      case "xeroxIV2060":
        crawlingResult.push(await xeroxIV2060(page, data));
        break;
      default:
        console.log(`${data.crawler}:`, "No suitable crawlers...");
    }
  });

  // 프린터 정보를 하나씩 꺼내서 Puppeteer Cluster Queue에 전달
  jsonfile.readFile('./config/target.json', async (err, printerInfo) => {
    if(err) console.error(`$jsonfile.readFile(): {err}`);
    printerInfo.forEach(printer => cluster.queue(printer));
  });

  // Puppeteer Cluster Shutdown
  await cluster.idle();
  await cluster.close();

  // 윗부분까지 비동기 코드 실행. 여기서부터 동기 코드 실행(?)

  // 파일로 저장
  const { xlsxSave, jsonSave } = config.get("saveOptions");
  xlsxSave ? saveXlsx(crawlingResult) : '';
  jsonSave ? jsonfile.writeFile(`./result/result_${getCurrentTime()}.json`, crawlingResult)
    .then(() => console.log(`${crawlingResult.length} Printers crawling completed!`))
    .catch(err => console.error(`jsonfile.writeFile(): ${err}`))
    : '';
}

main();