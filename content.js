const query = '//*[@id="IKPMaster_MainPlaceHolder_ucAccountEvents_DataTable"]//tbody/tr[@id]//td';

function extractTable() {
  const table = [];
  const nodesSnapshot = document.evaluate(
    query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (let i = 0 ; i < nodesSnapshot.snapshotLength; i += 6) {
    const row = [];
    for (let j = 1; j < 6; j += 1) {
      row.push(nodesSnapshot.snapshotItem(i + j).textContent);
    }
    table.push({
      date: row[0],
      text: row[1],
      in: row[2],
      out: row[3],
      balance: row[4],
    });
  }

  return table;
}

function tableToCSV(table) {
  // YNAB CSV: Date,Payee,Category,Memo,Outflow,Inflow
  return table
    .map(row => `${row.date},,,${row.text},${row.out},${row.in}`)
    .join('\n');
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === 'foo') {
    sendResponse(tableToCSV(extractTable()));
  }
});