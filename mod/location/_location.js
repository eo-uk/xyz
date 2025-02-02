const methods = {
  new: require('./new'),
  get: require('./get'),
  update: require('./update'),
  delete: require('./delete'),
}

module.exports = async (req, res) => {

  if (!Object.hasOwn(methods, req.params.method)) {
    return res.send(`Failed to evaluate 'method' param.<br><br>
    <a href="https://geolytix.github.io/xyz/docs/develop/api/location/">Location API</a>`)
  }

  const method = methods[req.params.method]

  if (typeof method !== 'function') return;
  
  const locale = req.params.locale && req.params.workspace.locales[req.params.locale]

  const layer = locale && locale.layers[req.params.layer] ||  req.params.workspace.templates[req.params.layer]

  if (!layer) return res.status(400).send('Layer not found.')

  req.params.layer = layer

  if (!req.params.layer) {
    return res.status(400).send(`Failed to evaluate 'layer' param.<br><br>
    <a href="https://geolytix.github.io/xyz/docs/develop/api/location/">Location API</a>`)
  }
  
  return method(req, res)
  
}
