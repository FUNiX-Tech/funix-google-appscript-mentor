function updateSummaryFile() {
  Logger.log(`Stared updating summary spreadsheet...`);
  const mentorData = _getAllMentorData();

  const sheets = SUMMARY_SPREADSHEET.getSheets();
  sheets.forEach((sheet) => {
    const sheetName = sheet.getName();

    if (mentorData.has(sheetName)) {
      const monthData = mentorData.get(sheetName);
      monthData.forEach((d) => {
        const totalReview = d.totalReview;
        const notOk = d.notOk;
        _updateSummarySheet(sheet, d.mentorCode, {
          totalReview,
          notOk,
        });
        Logger.log(
          `Updated sheet ${sheet.getName()}: totalReview ${totalReview}, notOk: ${notOk}`
        );
      });
    }
  });
  Logger.log(`Done with updating summary file.`);
}

function applySummaryTrigger() {
  Logger.log(`Adding trigger to summary spreadsheet.`);
  removeSpreadsheetTrigger(SUMMARY_SPREADSHEET);

  _addCheckboxesToSummaryFile();

  ScriptApp.newTrigger(_summaryTrigger.name)
    .forSpreadsheet(SUMMARY_SPREADSHEET)
    .onEdit()
    .create();

  Logger.log(`Added trigger to summary spreadsheet.`);
}

function removeSummaryTrigger() {
  Logger.log(`Removing trigger from summary spreadsheet.`);
  removeSpreadsheetTrigger(SUMMARY_SPREADSHEET);
  _removeCheckboxAndStatusColumns();
  Logger.log(`Removed trigger from summary spreadsheet.`);
}

function fixMentorSheetNames() {
  const monthStart = 9;
  const year = 2023;

  const files = MENTOR_FOLDER.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const spreadsheet = SpreadsheetApp.open(file);
    const sheets = spreadsheet.getSheets();
    sheets.forEach((sheet) => {
      const sheetName = sheet.getName();
      if (!_isValidSheetName(sheet.getName())) {
        const newSheetName = `T${monthStart + sheet.getIndex() - 1}.${year}`;
        sheet.setName(newSheetName);
        Logger.log(
          `Fix sheet name "${sheetName}" to "${newSheetName}" of ${spreadsheet.getName()}.`
        );
      }
    });
  }
}

function findInvalidMentorSheetNames() {
  const files = MENTOR_FOLDER.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const spreadsheet = SpreadsheetApp.open(file);
    const sheets = spreadsheet.getSheets();
    sheets.forEach((sheet) => {
      const sheetName = sheet.getName();
      if (!_isValidSheetName(sheet.getName())) {
        Logger.log(
          `Invalid sheet name "${sheetName}" of ${spreadsheet.getName()} - ${spreadsheet.getUrl()}.`
        );
      }
    });
  }
}
