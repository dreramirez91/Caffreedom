"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XLSX = require("xlsx");
var fs = require("fs");
function main() {
    var excelFilePath = './caffreedomData.xlsx';
    var fileContent = fs.readFileSync(excelFilePath);
    var workbookData = XLSX.read(fileContent, { type: 'buffer' });
    var sheetName = workbookData.SheetNames[0];
    var sheet = workbookData.Sheets[sheetName];
    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: ['drink', 'mg/floz'] });
    console.log(JSON.stringify(jsonData, null, 2));
}
main();
