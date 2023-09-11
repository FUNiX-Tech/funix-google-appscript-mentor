// theo tháng (sheet name)
function _getAllMentorData() {
  const data = new Map([]);
  const files = MENTOR_FOLDER.getFiles();

  while (files.hasNext()) {
    const spreadsheet = SpreadsheetApp.open(files.next());
    const mentorCode = _getMentorCodeFromSpreadsheetName(spreadsheet.getName());

    const sheets = spreadsheet.getSheets();
    sheets.forEach((sheet) => {
      const sheetName = sheet.getName();

      if (!data.has(sheetName)) data.set(sheetName, []);
      const { totalReview, notOk } = _analyzeMentorSheet(sheet);
      data.set(sheetName, [
        ...data.get(sheetName),
        { mentorCode, totalReview, notOk },
      ]);
    });
  }

  return data;
}

function _analyzeMentorSheet(mentorSheet) {
  const totalReview = _calculateTotalReview(mentorSheet);
  const notOk = _calculateNotOkReview(mentorSheet);

  Logger.log(
    `analyzed sheet ${mentorSheet.getName()}: totalReview: ${totalReview}, notOk: ${notOk}.`
  );
  if (!_isValidSheetName(mentorSheet.getName()))
    Logger.log(
      `NOT VALID SHEET NAME: SPREADSHEET ${mentorSheet
        .getParent()
        .getName()}, SHEET ${mentorSheet.getName()}, URL: ${mentorSheet
        .getParent()
        .getUrl()}`
    );
  return { totalReview, notOk };
}

function _calculateTotalReview(mentorSheet) {
  const row = SHEET_STRUCTURE.mentor.linkRowIndex;
  const column = 1;
  const numRows = 1;
  const numColumns = mentorSheet.getLastColumn();

  const rowValues = mentorSheet
    .getRange(row, column, numRows, numColumns)
    .getValues()[0];
  let totalReview = 0;
  rowValues.forEach((item) => {
    if (isUrl(item)) totalReview++;
  });

  return totalReview;
}

function _calculateNotOkReview(mentorSheet) {
  const row = SHEET_STRUCTURE.mentor.dataRange.rowStartIndex;
  const numRows = mentorSheet.getLastRow() - row + 1;
  const numColumns = 1;

  const columnStart = SHEET_STRUCTURE.mentor.dataRange.columnStartIndex;
  const step = 2;

  function _filterNotOk(columnValues) {
    return columnValues.filter(
      (value) => value && value[0].trim().toLowerCase() === "not ok"
    );
  }

  let notOkReview = 0;
  for (
    let column = columnStart;
    column <= mentorSheet.getLastColumn();
    column += step
  ) {
    const checkColumnValues = mentorSheet
      .getRange(row, column, numRows, numColumns)
      .getValues();

    if (_filterNotOk(checkColumnValues).length >= 3) notOkReview++;
  }

  return notOkReview;
}

function _getMentorRowIndex(summarySheet, mentorCode) {
  // range của cột mentor code
  const row = 1;
  const column = SHEET_STRUCTURE.summary.mentorCodeColumnIndex;
  const numRows = summarySheet.getLastRow();
  const numColumns = 1;

  const values = summarySheet
    .getRange(row, column, numRows, numColumns)
    .getValues();
  const mentorRowIndex =
    values.findIndex((value) => value && value[0] === mentorCode) + 1;

  return mentorRowIndex;
}

function _updateSummarySheet(summarySheet, mentorCode, { totalReview, notOk }) {
  Logger.log(
    `Updating summary sheet ${summarySheet.getName()}, mentor ${mentorCode}, totalReview: ${totalReview}, notOk: ${notOk}`
  );
  let mentorRowIndex = _getMentorRowIndex(summarySheet, mentorCode);
  if (mentorRowIndex === -1) {
    const errorMessage = `Không tìm thấy mentor ${mentorCode} trong sheet ${summarySheet.getName()} của spreadsheet tổng hợp.`;
    throw new Error(errorMessage);
  }

  summarySheet
    .getRange(mentorRowIndex, SHEET_STRUCTURE.summary.totalReviewColumnIndex)
    .setValue(totalReview);

  summarySheet
    .getRange(mentorRowIndex, SHEET_STRUCTURE.summary.notOkReviewColumnIndex)
    .setValue(notOk);
  Logger.log(
    `Updated summary sheet ${summarySheet.getName()}, mentor ${mentorCode}, totalReview: ${totalReview}, notOk: ${notOk}`
  );
}

function _addCheckboxesToSummaryFile() {
  Logger.log(`Adding checkboxes to summary spreadsheet.`);
  const sheets = SUMMARY_SPREADSHEET.getSheets();

  sheets.forEach((sheet) => {
    const row = SHEET_STRUCTURE.summary.dataRange.rowStartIndex;
    const column = SHEET_STRUCTURE.summary.checkboxColumnIndex;
    const lastRow = sheet.getLastRow();

    for (i = row; i <= lastRow; i++) {
      const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();

      const cell = sheet.getRange(i, column);
      cell.setDataValidation(rule);
      Logger.log(
        `Added a checkbox to summary spreadsheet: sheet ${sheet.getName()}, row ${i}`
      );
    }

    _styleCheckboxAndStatusColumns(sheet);
  });
  Logger.log(`Added checkboxes to summary spreadsheet.`);
}

function _removeCheckboxAndStatusColumns() {
  Logger.log(`Removing checkboxes from summary spreadsheet.`);
  const sheets = SUMMARY_SPREADSHEET.getSheets();
  sheets.forEach((sheet) => {
    sheet
      .getRange(
        1,
        SHEET_STRUCTURE.summary.checkboxColumnIndex,
        sheet.getLastRow(),
        1
      )
      .clear({ contentsOnly: true })
      .clearDataValidations()
      .setBorder(false, null, false, false, false, false);

    sheet
      .getRange(
        1,
        SHEET_STRUCTURE.summary.loadingColumnIndex,
        sheet.getLastRow(),
        1
      )
      .clear({ contentsOnly: true })
      .setBorder(false, null, false, false, false, false);

    Logger.log(`Removed checkbox of summary file on sheet ${sheet.getName()}.`);
  });

  Logger.log(`Removed all checkboxes of summary file.`);
}

function _getMentorSpreadsheetByCode(mentorCode) {
  Logger.log(`run _getMentorSpreadsheetByCode`);
  const files = MENTOR_FOLDER.getFiles();
  while (files.hasNext()) {
    Logger.log(`get in the while loop`);
    const file = files.next();
    Logger.log(`Filename: ${file.getName()}`);
    Logger.log(file.getName().startsWith(`[${mentorCode}]`));
    if (file.getName().startsWith(`[${mentorCode}]`))
      return SpreadsheetApp.open(file);
  }

  Logger.log(`Not found spreadsheet of mentor ${mentorCode}.`);
  return undefined;
}

function _getMentorCodeFromSpreadsheetName(spreadsheetName) {
  // [xM02467] Checklist đảm bảo chất lượng bài giảng SCR
  const regex = /\[(.+)\].*/;
  const mentorCode = spreadsheetName.match(regex)[1];
  return mentorCode;
}

function _checkboxChanged(row) {
  const mentorCode = sheet
    .getRange(row, SHEET_STRUCTURE.summary.mentorCodeColumnIndex)
    .getValues()[0][0];

  return mentorCode && row >= SHEET_STRUCTURE.summary.dataRange.rowStartIndex;
}

function _isValidSheetName(sheetName) {
  return /^t\d{1,2}\.20\d\d$/i.test(sheetName);
}

function _styleCheckboxAndStatusColumns(sheet) {
  sheet
    .getRange(
      1,
      SHEET_STRUCTURE.summary.checkboxColumnIndex,
      sheet.getLastRow(),
      1
    )
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "#000000",
      SpreadsheetApp.BorderStyle.SOLID
    );

  sheet
    .getRange(
      1,
      SHEET_STRUCTURE.summary.loadingColumnIndex,
      sheet.getLastRow(),
      1
    )
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "#000000",
      SpreadsheetApp.BorderStyle.SOLID
    );

  sheet
    .getRange(
      SHEET_STRUCTURE.summary.headerRowIndex,
      SHEET_STRUCTURE.summary.checkboxColumnIndex
    )
    .setValue("Cập nhật")
    .setFontWeight("bold");

  sheet
    .getRange(
      SHEET_STRUCTURE.summary.headerRowIndex,
      SHEET_STRUCTURE.summary.loadingColumnIndex
    )
    .setValue("Trạng thái")
    .setFontWeight("bold");
}
