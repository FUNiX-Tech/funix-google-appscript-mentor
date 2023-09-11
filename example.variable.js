const SUMMARY_SPREADSHEET_ID = "summary_spreadsheet_id";
const SUMMARY_SPREADSHEET = SpreadsheetApp.openById(SUMMARY_SPREADSHEET_ID);

const MENTOR_FOLDER_ID = "mentor_folder_id";
const MENTOR_FOLDER = DriveApp.getFolderById(MENTOR_FOLDER_ID);

const SHEET_STRUCTURE = {
  mentor: {
    linkRowIndex: 3,
    dataRange: {
      rowStartIndex: 6,
      columnStartIndex: 3,
    },
  },
  summary: {
    headerHeight: 3,
    orderColumnIndex: 1,
    mentorCodeColumnIndex: 2,
    totalReviewColumnIndex: 4,
    notOkReviewColumnIndex: 5,
    loadingColumnIndex: 11,
    checkboxColumnIndex: 10,
    headerRowIndex: 2,
    dataRange: {
      rowStartIndex: 4,
      columnStartIndex: 1,
    },
  },
};
