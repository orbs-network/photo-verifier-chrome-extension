chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action == "verify") {
      const body = '{"url":"' + request.url + '"}'

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://10.240.2.76:5678');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = async function () {
        if (xhr.status === 200) {
          const phash = xhr.responseText;
          const r = await query(phash)
          sendResponse(r)
        }
        else {
          sendResponse({ ok: false })
        }
      };
      xhr.send(body);
    }
    return true
  });


async function query(phash) {
  var account = Orbs.createAccount();
  console.log("New account: " + account.publicKey);

  var client = new Orbs.Client('https://validator.orbs-test.com/vchains/6666', 6666, 'TEST_NET');

  const q = client.createQuery(
    account.publicKey,
    'registry',
    'verify',
    [Orbs.argString(phash)]
  )

  const r = await client.sendQuery(q)
  if (r.executionResult != "ERROR_SMART_CONTRACT") {
    const jo = JSON.parse(r.outputArguments[0].value);
    return { ok: true, source: jo }
  }
  return { ok: false }
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript({
    file: "/inject.js"
  });
});
