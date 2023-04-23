# retainers

An example of how to set up native custom elements. The app generate NPC cards to a game.

The file retainer-app/retainer-element.js contains the whole magic, where it creates a shadow-dom, and loads templates which is sent in as `content` in a `render()` method. The rest of the elements then `extends RetainerElement`, which uses `render()` to get hold of the template that contains all HTML.

Working example: https://erebaltor.se/rickard/generatorer/retainers/
