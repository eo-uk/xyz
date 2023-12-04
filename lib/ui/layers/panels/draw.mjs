mapp.utils.merge(mapp.dictionaries, {
  en: {
    layer_add_new_location: 'Add new locations',
  },
  de: {
    layer_add_new_location: 'Erstelle neue Lage',
  },
  cn: {
    layer_add_new_location: '数据检视',
  },
  pl: {
    layer_add_new_location: 'Dodaj nowe miejsca',
  },
  ko: {
    layer_add_new_location: '새로운 위치 추가',
  },
  fr: {
    layer_add_new_location: 'Ajouter des nouveaux lieux',
  },
  ja: {
    layer_add_new_location: '新しいロケーションを追加',
  }
})

export default layer => {

  if (typeof layer.draw !== 'object') return;

  // Do not create the panel.
  if (layer.draw.hidden) return;
 
  // Get array of keys that is applicable to drawing
  const validKeys = Object.keys(layer.draw).filter(key => mapp.ui.elements.drawing[key])

  if (!validKeys || !validKeys.length > 0) {
    return;
  }

  // Return element from drawing method.
  const elements = validKeys.map(key => mapp.ui.elements.drawing[key](layer))

  const ICONS = {
    // Icons here
  }

  const content = mapp.utils.html`
    <style>
      .drawer .draw-panel .buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1px;
        margin-bottom: 1em;
      }
      .drawer .draw-panel .buttons button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 33%;
        background-color: var(--color-mid);
        padding: 0.3em;
      }
      .drawer .draw-panel .buttons button .icon {
        display: flex;
        width: 20%;
        margin-right: 0.5em;
      }
      .drawer .draw-panel .buttons button .icon img {
        width: 100%;
      }
      .drawer .draw-panel .buttons button.active .icon img {
        filter: invert(1);
      }
      .drawer .draw-panel .buttons button.active {
        color: var(--color-light);
        background-color: var(--color-on);
      }

      .drawer .draw-panel .content .panel-item {
        display: none;
      }
      .drawer .draw-panel .content .panel-item.active {
        display: block;
      }
    </style>

    <div class="draw-panel">
      <div class="buttons">
      ${validKeys.map((key, index) => mapp.utils.html`
        <button class=${key + (index == 0 ? " active" : "")} onclick=${() => {
          
          // Activate relevant button
          document.querySelectorAll(".drawer .draw-panel .buttons button").forEach(el => el.classList.remove("active"));
          document.querySelector(`.drawer .draw-panel .buttons button.${key}`).classList.toggle("active");

          // Activate relevant panel item
          document.querySelectorAll(".drawer .draw-panel .panel-item").forEach(el => el.classList.remove("active"));
          const panelItem = document.querySelector(`.drawer .draw-panel .panel-item.${key}`);
          panelItem.classList.toggle("active");

          // Animate panel to fade in softly
          panelItem.animate(
            [
              { opacity: 0 },
              { opacity: 1 }
            ], {
              duration: 300,
              iterations: 1
            }
          );
          
        }}>
          ${ICONS[key] ? mapp.utils.html`
            <div class="icon">
              <img src=${ICONS[key]} />
            <div/>
          ` : ""}
          ${formatButtonText(key)}
        </button>
      `)}
      </div>

      <div class="content">
        ${validKeys.map((key, index) => mapp.utils.html`
          <div class=${"panel-item " + key + (index == 0 ? " active" : "")}>
            ${mapp.ui.elements.drawing[key](layer)}
          </div>
        `)}
      </div>
    </div>
  `

  // Short circuit panel creation without elements.
  if (!elements.length) return;

  const panel = mapp.ui.elements.drawer({
    data_id: `draw-drawer`,
    class: `raised ${layer.draw.classList || ''}`,
    header: mapp.utils.html`
      <h3>${mapp.dictionary.layer_add_new_location}</h3>
      <div class="mask-icon expander"></div>`,
    content: content,
  });

  return panel;
}

function formatButtonText(text) {
  if (!text) {
    return;
  }
  return text.split("_").map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");
}