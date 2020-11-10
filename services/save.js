import jsonfile from 'jsonfile';
import ExcelJS from 'exceljs';
import config from 'config';
import getCurrentTime from './getCurrentTime.js';

/**
 * 객체 배열을 JSON 파일로 저장합니다.
 * 
 * @param {Object} data 
 */
const saveJson = (data) => {
  jsonfile.writeFile(`./result/result_${getCurrentTime()}.json`, data)
  .then(() => console.log(`saveJson(): ${data.length} Printer(s) crawling completed!`))
  .catch(err => console.error(`saveJson(): ${err}`));
}

/**
 * 객체 배열을 엑셀(XLSX) 파일로 저장합니다.
 * 
 * @param {Object} data 
 */
const saveXlsx = (data) => {
  const { tonerWarning, tonerAlert, drumWarning, drumAlert, warningColor, alertColor } = config.get("excelSettings");
  
  // 워크시트 생성 및 설정
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Result');
  worksheet.autoFilter = { from: 'A1', to: 'O1', }; // 필터 설정
  worksheet.views = [{ 
    state: 'frozen', ySplit: 1,  // 틀 고정
    zoomScale: 85 // 확대/축소
  }];
  
  // 열 추가
  worksheet.columns = [
    { key: 'count', header: '연번' },
    { key: 'dept', header: '부서' },
    { key: 'model', header: '프린터 모델' },
    { key: 'url', header: 'URL', hidden: true },
    { key: 'tonerK', header: '토너(K)' },
    { key: 'tonerK2', header: '토너(K2)' },
    { key: 'tonerC', header: '토너(C)' },
    { key: 'tonerM', header: '토너(M)' },
    { key: 'tonerY', header: '토너(Y)' },
    { key: 'drumK', header: '드럼(K)' },
    { key: 'drumC', header: '드럼(C)' },
    { key: 'drumM', header: '드럼(M)' },
    { key: 'drumY', header: '드럼(Y)' },
    { key: 'wastebox', header: '토너회수통' },
    { key: 'error', header: '에러' },
  ];
  
  // 행 추가(행의 속성은 열의 key 속성에 매칭되어 추가됨)
  let count = 0;
  data.forEach(printer => {
    const { 
      dept, model, url, 
      tonerK, tonerK2, tonerC, tonerM, tonerY, 
      drumK, drumC, drumM, drumY, 
      wastebox, error } = printer;

      worksheet.addRow({
      count: ++count,
      dept, model,  url,
      tonerK: getOnlyNumber(tonerK) ? parseInt(getOnlyNumber(tonerK)) : tonerK, 
      tonerK2: getOnlyNumber(tonerK2) ? parseInt(getOnlyNumber(tonerK2)) : tonerK2, 
      tonerC: getOnlyNumber(tonerC) ? parseInt(getOnlyNumber(tonerC)) : tonerC, 
      tonerM: getOnlyNumber(tonerM) ? parseInt(getOnlyNumber(tonerM)) : tonerM, 
      tonerY: getOnlyNumber(tonerY) ? parseInt(getOnlyNumber(tonerY)) : tonerY, 
      drumK: getOnlyNumber(drumK) ? parseInt(getOnlyNumber(drumK)) : drumK, 
      drumC: getOnlyNumber(drumC) ? parseInt(getOnlyNumber(drumC)) : drumC, 
      drumM: getOnlyNumber(drumM) ? parseInt(getOnlyNumber(drumM)) : drumM, 
      drumY: getOnlyNumber(drumY) ? parseInt(getOnlyNumber(drumY)) : drumY, 
      wastebox, 
      error
    });
  
    // D열(URL)에 함수(formula) 사용
    worksheet.getCell(`D${count+1}`).value = { formula: `HYPERLINK("${url}")` };
  });
  
  // 컬럼 사이즈 자동 설정(https://stackoverflow.com/questions/63189741/how-to-autosize-column-width-in-exceljs)
  worksheet.columns.forEach(function (column, i) {
    var maxLength = 0;
    column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value 
        ? cell.value.toString().length : 10;
        if (columnLength > maxLength ) {
            maxLength = columnLength;
        }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
    worksheet.getColumn('D').width = 40; // 함수 수식으로 구성된 데이터는 사이즈 계산이 안 되므로 컬럼 사이즈를 수동 설정
  });
  
  // 토너 잔량 주의 및 경고 색상 추가
  ['E', 'F', 'G', 'H', 'I'].map(key => {
    worksheet.getColumn(key).eachCell(cell => {
      if(!cell.value) return;
  
      else if(cell.value <= tonerAlert) {
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{ argb: alertColor },
          bgColor:{ argb: alertColor }
        };
      }
  
      else if(cell.value >= tonerAlert && cell.value <= tonerWarning) {
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{ argb: warningColor },
          bgColor:{ argb: warningColor }
        };
      }
    })
  });
  
  // 드럼 잔량 주의 및 경고 색상 추가
  ['J', 'K', 'L', 'M'].map(key => {
    worksheet.getColumn(key).eachCell(cell => {
      if(!cell.value) return;
  
      else if(cell.value <= drumAlert) {
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{ argb: alertColor },
          bgColor:{ argb: alertColor }
        };
      }
  
      else if(cell.value >= drumAlert && cell.value <= drumWarning) {
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{ argb: warningColor },
          bgColor:{ argb: warningColor }
        };
      }
    })
  });
  
  // 엑셀 파일로 저장
  workbook.xlsx.writeFile(`./result/result_${getCurrentTime()}.xlsx`);
  console.log(`saveXlsx(): ${count} Printer(s) crawling completed!`);
}

/**
 * 문자열 중 숫자만 추출하여 반환합니다.
 * 
 * @param {String} data 
 */
const getOnlyNumber = (data) => {
  const a = /[^%a-zA-Z가-힣]*/g; // %, 영문, 한글 제외 정규식
  const result = a.exec(data);

  if(result[0]) return result[0];
  return false;
}

export { saveJson, saveXlsx };