export class CustomRetainerElement extends HTMLElement {
  content = HTMLElement

  get is() {
    return this.tagName.toLowerCase()
  }

  get defaultFolder() {
    return 'retainer-app/';
  }

  get folder() {
    return '';
  }

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    this.loadTemplate().then((templateContent) => {
      this.content = templateContent.cloneNode(true);
      this.render(this.content);
      this.shadowRoot.appendChild(this.content);
      this.content = null;
    });
  }

  // This method is intended to be overridden by subclasses to define how the content should be rendered.
  render(content) {

  }

  updateElement(property, selector, input) {
    let src = this.content ?? this.shadowRoot;
    let elements = src.querySelectorAll(selector);

    for (var i = 0; i < elements.length; i++) {
      elements[i][property] = input;
    }
  }

  updateTextContent(selector, str) {
    this.updateElement('textContent', selector, str);
  }

  updateHTMLContent(selector, html) {
    this.updateElement('innerHTML', selector, html);
  }

  async loadTemplate() {
    let path = this.folder + this.is + '/';
    let fullPath = path + this.is + '-template.html';

    try {
      const response = await fetch(fullPath);
      const text = await response.text();
      let html = new DOMParser().parseFromString(text, 'text/html');
      let templateContent = html.querySelector('template').content;
      return templateContent;
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define('custom-retainer-element', CustomRetainerElement);
