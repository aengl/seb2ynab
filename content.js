const query = '//*[@id="IKPMaster_MainPlaceHolder_ucAccountEvents_DataTable"]//tbody/tr[@id]//td';

function formatDate(date) {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getPayee(s) {
  return s.replace(/(.*) \/ \d+-\d+-\d+/, '$1');
}

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
      date: formatDate(new Date(row[0])),
      payee: getPayee(row[1]),
      in: row[2],
      out: row[3],
    });
  }

  return table;
}

function tableToCSV(table) {
  const header = 'Date,Payee,Category,Memo,Outflow,Inflow';
  const tableData = table
    .map(row => `${row.date},${row.payee},,,${row.out},${row.in}`)
    .join('\n');
  return `${header}\n${tableData}`;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === 'foo') {
    const table = extractTable();
    sendResponse(table.length ? tableToCSV(table) : null);
  }
});
