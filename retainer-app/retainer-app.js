import {RetainerElement} from './retainer-element.js';
import {RetainerSheet} from './components/retainer-sheet/retainer-sheet.js';

export class RetainerApp extends RetainerElement {
  minSheets = 2;
  maxSheets = 50;
  retainerSheetEl = HTMLElement;

  render(content) {
    this.retainerSheetEl = content.querySelector('retainer-sheet').cloneNode(true);
    this.generateNew(content);

    document.addEventListener('new-sheets',  () => { this.generateNew() });
    document.addEventListener('more-sheets', () => { this.generateMore() });
  }

  generateNew(content) {
    this.removeAllElements(content);
    this.generateMore(content);
  }

  generateMore(content = this.shadowRoot) {
    this.numberOfSheets = this.#calculateNumberSheets();

    for (var i = 0; i < this.numberOfSheets; i++) {
      content.appendChild( this.fillSheet(this.retainerSheetEl) );
    }
  }

  removeAllElements(content = this.shadowRoot) {
    let sheets = content.querySelectorAll('retainer-sheet');

    for (let sheet of sheets) {
      content.removeChild(sheet);
    }
  }

  #calculateNumberSheets() {
    let sheetWidth = 350;
    let sheetHeight = 400;
    let maxSheetsPerRow = Math.floor(window.innerWidth / sheetWidth);
    let maxSheetsPerColumns = Math.round(window.innerHeight / sheetHeight);

    return Math.min(Math.max(maxSheetsPerRow * maxSheetsPerColumns, this.minSheets), this.maxSheets);
  }

  fillSheet(retainerSheetEl) {
    let newSheet = retainerSheetEl.cloneNode(true);

    return newSheet;
  }
}

customElements.define('retainer-app', RetainerApp);
