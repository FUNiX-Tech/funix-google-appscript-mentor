/**
 * These functions are designed to handle scenarios where a separate trigger needs to be added to each spreadsheet.
 * This implementation can result in an error message stating "has too many triggers" since Google Apps Script has a maximum limit of 20 triggers per script.
 * Although there are other potential solutions, I will opt to use a time-driven trigger in this case.
 */

// function applyMentorTriggers() {
//   Logger.log(`Adding mentor triggers...`);
//   removeMentorTriggers();

//   const files = MENTOR_FOLDER.getFiles();
//   while (files.hasNext()) {
//     const file = files.next();
//     const spreadsheet = SpreadsheetApp.open(file);

//     ScriptApp.newTrigger(_mentorTrigger.name)
//       .forSpreadsheet(spreadsheet)
//       .onChange()
//       .create();

//     Logger.log(`Added trigger to spreadsheet ${spreadsheet.getName()}`);
//   }

//   Logger.log(`Added mentor triggers successfully`);
// }

// function removeMentorTriggers() {
//   Logger.log(`Removing mentor triggers...`);
//   const files = MENTOR_FOLDER.getFiles();
//   while (files.hasNext()) {
//     const file = files.next();
//     const spreadsheet = SpreadsheetApp.open(file);
//     removeSpreadsheetTrigger(spreadsheet);
//   }

//   Logger.log(`Removed mentor triggers`);
// }

// function _mentorTrigger(e) {
//     Logger.log(`Mentor trigger has been fired...`);
//     const mentorSpreadsheet = e.source;
//     const mentorSheet = mentorSpreadsheet.getActiveSheet();
//     const mentorSheetName = sheet.getName(); // metorSheetName có dạng tháng: T9.2023, T10.2023

//     // sheet tổng hợp cần update cũng có tên = mentorSheetName
//     let summarySheet = CHECK_RECORD_SPREADSHEET.getSheetByName(mentorSheetName);

//     if (!summarySheet)
//       throw new Error(
//         `Not found sheet "${mentorSheetName}" in summary spreadsheet`
//       );

//     const mentorCode = _getMentorCodeFromSpreadsheetName(
//       mentorSpreadsheet.getName()
//     );

//     const { totalReview, notOk } = _analyzeMentorSheet(mentorSheet);
//     _updateSummarySheet(summarySheet, mentorCode, {
//       totalReview,
//       notOk,
//     });

//     Logger.log(
//       `Mentor trigger has just updated the sheet ${summarySheet.getName()} of summary spreadsheet.`
//     );
//   }
