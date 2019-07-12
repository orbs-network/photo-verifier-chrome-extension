var allImages = document.getElementsByTagName("img");
for (var i = 0; i < allImages.length ; i++) {
  allImages[i].style.border = "5px solid red";
  allImages[i].title = "Name: Some photo\nPhotographer: Some photographer\nLicense: Some license";
}
