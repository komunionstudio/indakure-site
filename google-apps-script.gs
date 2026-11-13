/**
 * IndaKure — signups to Google Sheet
 *
 * Paste this into the Google Sheet's Extensions > Apps Script editor,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Every "Get notified" / "Subscribe" form on the website adds one row.
 */
var SHEET_NAME = 'Signups';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = {};
    try { data = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) {}
    var contact = String(data.contact || '').trim().slice(0, 200);
    if (!contact) return out_('missing contact');

    var sheet = getSheet_();
    // skip exact duplicates (same email/number already on the list)
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 2, last - 1, 1).getValues();
      var needle = contact.toLowerCase();
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0]).toLowerCase() === needle) return out_('duplicate');
      }
    }
    sheet.appendRow([
      new Date(),
      contact,
      String(data.type || '').slice(0, 20),
      String(data.source || '').slice(0, 60),
      String(data.page || '').slice(0, 200)
    ]);
    return out_('ok');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out_('IndaKure signup endpoint is running.'); }

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Signed up', 'Email or mobile', 'Type', 'Form', 'Page']);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  return sheet;
}

function out_(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
