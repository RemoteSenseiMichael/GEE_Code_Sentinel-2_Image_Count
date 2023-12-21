////------------------------------------------------------------////
////----------------- Sentinel-2 Cloud Masking -----------------////
////------------------------------------------------------------////

// Map.addLayer(valdata, {color: 'red'}, 'class')

function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

////------------------------------------------------------------////
////-------------------- Sentinel-2  Imagery -------------------////
////------------------------------------------------------------////

var S2_Summer_2017 = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2017-07-01', '2017-08-31')
                  .filterBounds(roi)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);
var S2_Summer_2018 = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2018-07-01', '2018-08-31')
                  .filterBounds(roi)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);
var S2_Summer_2019 = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2019-07-01', '2019-08-31')
                  .filterBounds(roi)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);
var S2_Summer_2020 = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2020-07-01', '2020-08-31')
                  .filterBounds(roi)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);
var S2_Summer_2021 = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2021-07-01', '2021-08-31')
                  .filterBounds(roi)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);
var S2_Summer_2022 = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2022-07-01', '2022-08-31')
                  .filterBounds(roi)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);                  

var Optical_Summer_01 = S2_Summer_2022.merge(S2_Summer_2021).merge(S2_Summer_2020).merge(S2_Summer_2019).merge(S2_Summer_2018).merge(S2_Summer_2017)
var Optical_Summer_02 = Optical_Summer_01.select('B2')

////------------------------------------------------------------////
////---------------- Counut the number of scenes ---------------////
////------------------------------------------------------------////

var Count = Optical_Summer_02.count()

////------------------------------------------------------------////
////----------------------- Export to drive --------------------////
////------------------------------------------------------------////

Export.image.toDrive({
  image: Count,
    description: "S2_Count",
    scale: 1000,
    folder: 'GEE_Outputs',
    region: roi, // roi = region of interest geometry
    maxPixels: 10000000000000,
    fileFormat: 'GeoTIFF'
}); 