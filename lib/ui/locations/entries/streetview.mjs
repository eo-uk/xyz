export default entry => {

  const pin = entry.location.infoj.find(entry => entry.type === 'pin')

   if (!pin || !pin.value) {
    console.warn('You must provide a pin type entry in the infoj to use streetview') 
    return;
  };

  const lnglat = ol.proj.toLonLat(
    pin.value,
    `EPSG:${pin.srid || entry.location.layer.mapview.srid}`,
    'EPSG:4326')

  const node = mapp.utils.html.node`
    <a
      target="_blank"
      href=${`https://www.google.com/maps?cbll=${lnglat[1]},${lnglat[0]}&layer=c`}>`

  mapp.utils.xhr({
    url: `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lnglat[1]},${lnglat[0]}&source=outdoor&key=${entry.key}`,
    requestHeader: null
  }).then(response => {

      if (response.status !== 'OK') return;

      const src = `https://maps.googleapis.com/maps/api/streetview?location=${lnglat[1]},${lnglat[0]}&source=outdoor&size=300x230&key=${entry.key}`

      node.append(mapp.utils.html.node`<img src=${src}>`)

    })

  return node
}