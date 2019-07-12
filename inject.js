var account = Orbs.createAccount();
console.log("New account: " + account.publicKey);

var client = new Orbs.Client('https://validator.orbs-test.com/vchains/6666', 6666, 'TEST_NET');

var allImages = document.getElementsByTagName("img");
for (var i = 0; i < allImages.length; i++) {
  verify(allImages[i]);
}

function verify(img) {
  const body = '{"url":"' + img.src + '"}'

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://10.240.2.76:5678');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status === 200) {
      const phash = xhr.responseText;
      const r = query(phash)
      console.log(r)

      if (r.ok) {
        img.style.border = "5px solid green";
        img.title = JSON.stringify(r.source);
      } else {
        img.style.border = "5px solid red";
        img.title = "WARNING! This image is in violation of Photo Registry laws. Blockchain or die!";
      }
    }
    else if (xhr.status !== 200) {
      console.error('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send(body);
}

async function query(phash) {
  const q = client.createQuery(
    account.publicKey,
    'registry',
    'verify',
    [Orbs.argString(phash)]
  )

  const r = await client.sendQuery(q)
  if (r.executionResult != "ERROR_SMART_CONTRACT") {
    const jo = JSON.parse(r.outputArguments["0"].value);
    return { ok: true, source: jo.source }
  }
  return { ok: false }
}
