import * as XLSX from 'xlsx';
import * as fs from 'fs';

function main() {
  const excelFilePath = './caffreedomData.xlsx';
  const fileContent = fs.readFileSync(excelFilePath);
  const workbookData = XLSX.read(fileContent, {type: 'buffer'});
  const sheetName = workbookData.SheetNames[0];
  const sheet = workbookData.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, {header: ['drink', 'mg/floz']});
  console.log(JSON.stringify(jsonData, null, 2));
}

main();
