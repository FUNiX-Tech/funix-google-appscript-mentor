function isUrl(value) {
  return (
    typeof value === "string" && value.trim().toLowerCase().startsWith("http")
  );
}

function removeSpreadsheetTrigger(spreadsheet) {
  const triggers = ScriptApp.getUserTriggers(spreadsheet);
  triggers.forEach((trigger) => {
    ScriptApp.deleteTrigger(trigger);
  });

  Logger.log(`Removed all triggers of ${spreadsheet.getName()}`);
}
