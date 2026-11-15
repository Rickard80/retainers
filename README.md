# retainers

An example of how to set up native custom elements. The app generate NPC cards to a game.

The file retainer-app/custom-retainer-element.js contains the whole magic, where it creates a shadow-dom, and loads templates which is sent in as `content` in a `render()` method. The rest of the elements then `extends CustomRetainerElement`, which uses `render()` so each custom element can manipulate the HTML.

Working example: https://rickard80.github.io/retainers/
