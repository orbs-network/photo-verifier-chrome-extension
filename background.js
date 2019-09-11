const account = Orbs.createAccount();
console.log("New account: " + account.publicKey);

const VCHAIN = 1000;
const NODE_URL = 'https://node1.demonet.orbs.com/vchains/' + VCHAIN;
const HASH_SERVICE_URL = 'https://image-hash.herokuapp.com/hash';
const CONTRACT_NAME = 'ExtensionPhotoRegistry';

const client = new Orbs.Client(NODE_URL, VCHAIN, 'TEST_NET');

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request.url)

    if (request.action == "verify") {
      const body = '{"url":"' + request.url + '"}'

      const xhr = new XMLHttpRequest();
      xhr.open('POST', HASH_SERVICE_URL);
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
  const q = client.createQuery(
    account.publicKey,
    CONTRACT_NAME,
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

