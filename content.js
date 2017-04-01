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
    const date = new Date(row[0]);
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    table.push({
      date: `${dd}/${mm}/${yyyy}`,
      text: row[1],
      in: row[2],
      out: row[3],
      balance: row[4],
    });
  }

  return table;
}

function tableToCSV(table) {
  return table
    .map(row => `${row.date},,,${row.text},${row.out},${row.in}`)
    .join('\n');
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === 'foo') {
    const table = extractTable();
    sendResponse(table.length ? tableToCSV(table) : null);
  }
});
