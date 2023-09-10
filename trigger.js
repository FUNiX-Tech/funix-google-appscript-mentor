function _summaryTrigger(e) {
  Logger.log(`Summary file trigger has been fired...`);
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const column = range.getColumn();
  const row = range.getRow();

  const mentorCode = sheet
    .getRange(row, SHEET_STRUCTURE.summary.mentorCodeColumnIndex)
    .getValues()[0][0];
  if (
    !mentorCode ||
    row < SHEET_STRUCTURE.summary.dataRange.rowStartIndex ||
    column !== SHEET_STRUCTURE.summary.checkboxColumnIndex
  )
    return;

  const loadingRange = sheet.getRange(
    row,
    SHEET_STRUCTURE.summary.loadingColumnIndex
  );
  loadingRange.setValue("Pending");

  const sheetName = sheet.getName();
  Logger.log(`debug 3`);

  const mentorSpreadsheet = _getMentorSpreadsheetByCode(mentorCode);
  if (!mentorSpreadsheet) {
    loadingRange.setValue("Error");
    Logger.log(`Not found mentor spreadsheet with code ${mentorCode}`);
    return;
  }

  Logger.log(`debug 4`);

  const mentorSheet = mentorSpreadsheet.getSheetByName(sheetName);
  if (!mentorSheet) {
    loadingRange.setValue("Error");
    Logger.log(`Not found sheet ${sheetName} in ${mentorCode} spreadsheet.`);
    return;
  }

  const { totalReview, notOk } = _analyzeMentorSheet(mentorSheet);

  _updateSummarySheet(sheet, mentorCode, { totalReview, notOk });
  loadingRange.setValue("Done");
  Logger.log(
    `Updated ${mentorCode}: totalReview: ${totalReview}, notOk: ${notOk}.`
  );
}
