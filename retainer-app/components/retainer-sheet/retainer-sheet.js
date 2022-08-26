import {RetainerElement} from '../../retainer-element.js';
import {Character} from './retainer-sheet-logic.js';

export class RetainerSheet extends RetainerElement {
  character = {};

  get folder() {
    return this.defaultFolder + 'components/'
  }

  render() {
    let character = new Character();
    let abilityShort = '';

    for (var i = 0; i < character.abilityList.length; i++) {
      abilityShort = character.abilityList[i];
      this.updateTextContent('#ability_' + abilityShort, character[abilityShort]);
    }

    this.updateTextContent('#hit_points', character.hp);
    this.updateTextContent('#portrait', character.alignment + ' ' + character.gender);
    this.updateTextContent('#description', character.getDescription());
    this.updateTextContent('#armor_class', character.combatGear.ac);
    this.updateTextContent('#equipment', character.getEquipment());

    this.character = character;
  }
}

customElements.define('retainer-sheet', RetainerSheet);
