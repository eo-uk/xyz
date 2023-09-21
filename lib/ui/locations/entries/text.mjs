export default entry => {

  // val maybe the input element with the entry.value.
  let val = entry.value;

  if (entry.edit) {

    if (entry.edit.options) {

           // If distinct get the values from the field on the table.
           if (entry.edit.options.distinct) {

            // Query distinct field values from the layer table.
            mapp.utils.xhr(`${entry.location.layer.mapview.host}/api/query?` +
              mapp.utils.paramString({
                template: 'distinct_values',
                dbs: entry.location.layer.dbs,
                locale: entry.location.layer.mapview.locale.key,
                layer: entry.location.layer.key,
                filter: entry.location.layer.filter && entry.location.layer.filter.current,
                table: entry.location.layer.tableCurrent(),
                field: entry.field
              })).then(response => {
    
                if (!response) {
                  console.warn(`Distinct values query did not return any values for field ${entry.field}`)
                  return;
                }
    
                entry.edit.options = [response]
    
                  // Flatten response in array to account for the response being a single record and not an array.
                  .flat()
    
                  // Map the entry field from response records.
                  .map(record => record[entry.field])
    
                  // Filter out null values.
                  .filter(val => val !== null)
    
    
                val = options(entry)
              });
          } else {
    
            val = options(entry)
          }

    } else {

      val = mapp.utils.html`
      <input
        type="text"
        maxlength=${entry.edit.maxlength}
        value="${entry.value || ''}"
        placeholder="${entry.edit.placeholder || ''}"
        onkeyup=${e => {
          entry.newValue = e.target.value
          entry.location.view?.dispatchEvent(
            new CustomEvent('valChange', {
              detail: entry
            })
          )
        }}>`
    }
  }

  return mapp.utils.html.node`
    <div
      class="val"
      style="${`${entry.css_val || ''}`}">
      ${entry.prefix}${val}${entry.suffix}`

}

function options(entry) {

  const chk = entry.edit.options.find(
    option => typeof option === 'object' && Object.values(option)[0] === entry.value || option === entry.value
  ) || entry.value

  entry.value = chk
    && typeof chk === 'object'
    && Object.keys(chk)[0] || chk || entry.value || '';

  const entries = entry.edit.options.map(option => ({
    title: typeof option === 'string' && option || Object.keys(option)[0],
    option: typeof option === 'string' && option || Object.values(option)[0]
  }))

  const dropdown = mapp.ui.elements.dropdown({
    placeholder: entry.edit.placeholder,
    span: entry.value,
    entries: entries,
    callback: (e, _entry) => {
      entry.newValue = _entry.option
      entry.location.view?.dispatchEvent(
        new CustomEvent('valChange', {
          detail: entry,
        })
      );
    },
  });

  return dropdown
}