var account = Orbs.createAccount();
console.log("New account: "+account.publicKey);

let images = []

var allImages = document.getElementsByTagName("img");
for (var i = 0; i < allImages.length; i++) {
  const img = allImages[i];
  getphash(img.src)
  img.style.border = "5px solid red";
  img.title = "Name: Some photo\nPhotographer: Some photographer\nLicense: Some license";
}

function getphash(url) {
  const body = '{"url":"' + url + '"}'

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://10.240.2.76:5678');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status === 200) {
      let image = { phash: xhr.responseText };
      images.push(image)
      console.log(image)
    }
    else if (xhr.status !== 200) {
      console.error('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send(body);
}
