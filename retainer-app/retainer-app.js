import {CustomRetainerElement} from './custom-retainer-element.js';
import {RetainerSheet} from './components/retainer-sheet/retainer-sheet.js';

export class RetainerApp extends CustomRetainerElement {
  #mainContentEl;
  minSheets = 2;
  maxSheets = 50;

  render(content) {
    this.#mainContentEl = content.getElementById('content');
    this.generateNew(this.#mainContentEl);

    document.addEventListener('new-sheets',  () => { this.generateNew() });
    document.addEventListener('more-sheets', () => { this.generateMore() });
  }

  generateNew(content) {
    this.removeAllElements(content);
    this.generateMore(content);
  }

  generateMore(content = this.#mainContentEl) {
    this.numberOfSheets = this.#calculateNumberSheets();

    for (var i = 0; i < this.numberOfSheets; i++) {
      content.appendChild( new RetainerSheet() );
    }
  }

  removeAllElements() {
    this.#mainContentEl.textContent = '';
  }

  #calculateNumberSheets() {
    let sheetWidth = 350;
    let sheetHeight = 400;
    let maxSheetsPerRow = Math.floor(window.innerWidth / sheetWidth);
    let maxSheetsPerColumns = Math.round(window.innerHeight / sheetHeight);

    return Math.min(Math.max(maxSheetsPerRow * maxSheetsPerColumns, this.minSheets), this.maxSheets);
  }
}

customElements.define('retainer-app', RetainerApp);
