var allImages = document.getElementsByTagName("img");
for (var i = 0; i < allImages.length; i++) {
  const img = allImages[i];
  chrome.runtime.sendMessage({ action: 'verify', url: img.src }, function (response) {
    if (response.ok) {
      img.style.border = "5px solid green";
      let title = ''
      for (var key in response.source) {
        let value = ''
        if (key == 'author' || key == 'rightModel') {
          const tmp = response.source[key]
          for (var k in tmp) {
            value += '\n\t' + k + ': ' + tmp[k];
          }
        } else {
          value = response.source[key];
        }
        title += key + ': ' + value + '\n';
      }
      img.title = title;
    } else {
      img.style.border = "5px solid red";
      img.title = "WARNING! This image is in violation of Photo Registry laws. Blockchain or die!";
    }
  });
}
