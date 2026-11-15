import {CustomRetainerElement} from '../../custom-retainer-element.js';
import {Character} from './retainer-sheet-logic.js';

export class RetainerSheet extends CustomRetainerElement {
  character = {};

  get folder() {
    return this.defaultFolder + 'components/'
  }

  render() {
    let character = new Character();

    for (const abilityShort in character.abilities) {
      this.updateTextContent('#ability_' + abilityShort, character.abilities[abilityShort]);
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
