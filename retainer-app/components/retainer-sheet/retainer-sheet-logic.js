function randomize(max, min = 1) {
  return Math.floor(Math.random() * max) + min;
}

class DicePool {
  constructor(combinationStr) {
    let [amount, type, modification] = this.#breakdown(combinationStr);
    this.amount = amount;
    this.type = type;
    this.modification = modification;
  }

  roll() {
    let result = 0;
    for (var i = 0; i < this.amount; i++) {
      result += randomize(this.type);
    }

    result += this.modification;

    return result;
  }

  #breakdown(combinationStr) {
    let [diceStr, modification] = this.#stripModification(combinationStr);
    let [amount, type] = diceStr.split('d');

    return [amount, type, modification];
  }

  #stripModification(str) {
    if (str.indexOf('-') != -1) {
      let aritmic = 1;
      let breakArr = str.split('-');
      breakArr[aritmic] *= -1

      return breakArr;
    } else if (str.indexOf('+') != -1) {
      return str.split('+');
    }

    return [str, 0];
  }
}

export class Character {
  str;
  dex;
  con;
  int;
  wis;
  cha;
  hp;
  gender;
  alignment;
  background;
  distinctiveFeature = {
    'last': false,
    'text': ''
  };
  personality;
  gear;
  combatGear = {
    'ac': 0,
    'armor': '',
    'melee_weapon': '',
    'ranged_weapon': {
      'extra': false,
      'text': ''
    },
    'shield': '',
  };
  abilityList = ['str', 'dex', 'con', 'int', 'wis', 'cha'];


  constructor() {
    this.#generateAbilities();
  }

  #generateAbilities() {
    let abilityPool = new DicePool('3d6');
    let highestAbilityObj = {'type': 'str', 'modifier': -5};
    let ability = '', modifier = 0;

    for (var i = 0; i < this.abilityList.length; i++) {
      ability = this.abilityList[i];

      if (ability != 'cha') {
        modifier = this.abilityModifierTable( abilityPool.roll() );
      } else {
        modifier = this.charismaModifierTable( abilityPool.roll() );
      }

      if (highestAbilityObj.modifier <= modifier) {
        highestAbilityObj.type = ability;
        highestAbilityObj.modifier = modifier;
      }

      this[ability] = modifier;
    }

    this.#swapStrWith(highestAbilityObj);

    this.hp = this.con + randomize(8);
    this.gender = this.#genderTable();
    this.alignment = this.#alignmentTable();
    this.background = this.#backgroundTable();
    this.distinctiveFeature = this.#distinctiveFeatureTable();
    this.personality = this.#personalityTable();
    this.gear = this.#gearsTable();
    this.combatGear = this.#combatGearsTable();
  }

  abilityModifierTable(score) {
    let abilityModifiers = [null, null, null, -3, -2, -2, -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3];
    return abilityModifiers[score];
  }

  charismaModifierTable(score) {
    let charismaModifiers = [null, null, null, -2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2];
    return charismaModifiers[score];
  }

  getDescription() {
    let characterDescription = this.distinctiveFeature.last ? `${this.background} ${this.distinctiveFeature.text}`
                                                            : `${this.distinctiveFeature.text} ${this.background}`;

    return `${characterDescription} (${this.personality})`.toLowerCase();
  }

  getEquipment() {
    let meleeSeparator = (this.combatGear.ranged_weapon.extra) ? '' : ',';
    let rangedSeparator = (this.combatGear.ranged_weapon.text) ? ',' : '';

    return `${this.combatGear.melee_weapon}${meleeSeparator} ${this.combatGear.ranged_weapon.text}${rangedSeparator} ${this.combatGear.armor} ${this.combatGear.shield} ${this.gear}.`.toLowerCase();
  }

  #swapStrWith(highestAbilityObj) {
    this[highestAbilityObj.type] = this.str;
    this.str = highestAbilityObj.modifier;
  }

  #genderTable() {
    let score = new DicePool('3d6').roll();
    let gender = 'unknown';

    if (score < 11) {
      gender = 'male';
    } else if (score > 11) {
      gender = 'female';
    }

    return gender;
  }

  #alignmentTable() {
    let score = randomize(6);
    let alignment = 'chaotic';

    if (score < 3) { alignment = 'lawful'; }
    else if (score < 6) { alignment = 'neutral'; }

    return alignment
  }

  #backgroundTable() {
    let background = '';

    let fate = [
      'Escaped', 'Run-away', 'Ruined', 'Failed', 'Penniless', 'Disgraced', 'Deserted', 'Disgraced', 'Unemployed', 'Lost', 'Wanted', 'Failed', 'Defrocked', 'Run-away', 'Run-away', 'Quack', 'Lost', 'Out-of-luck', 'Runaway', 'Failed', 'Wanted', 'Haunted', 'Former', 'Former', 'Robbed', 'Hapless', 'Wandering', 'Lost', 'Luckless', 'Fleeing', 'Wandering', 'Wanted', 'Failed', 'Washed Out', 'pathetic'
    ];

    let score = randomize(fate.length - 1);
    background += fate[score] + ' ';

    let occupation = [
      'Serf', 'Slave', 'Peasant', 'Apprentice', 'Yeoman', 'Noble', 'Militia', 'Squire', 'Knight', 'Mercenary', 'Barbarian', 'Duellist', 'Wizard', 'Academic', 'Cleric', 'Acolyte', 'Physician', 'Liquor Lawyer', 'Gambler', 'Thief', 'Burglar', 'Pickpocket', 'Grave Robber', 'Smuggler', 'Charcoal-Burner', 'Fisher', ' Hunter', 'Vagabond', 'Ranger', 'Gold Digger', 'Iconoclast', 'Heretic', 'Rabble Rouser', 'Charlatan', 'Bard', 'Entertainer'
    ];

    score = randomize(occupation.length - 1);

    background += occupation[score];

    return background;
  }

  #checkVowel(firstLetter) {
    return ('aouei'.indexOf(firstLetter) == -1) ? 'a' : 'an';
  }

  #distinctiveFeatureTable() {
    let distinctiveFeatures = [
      'Albino', 'with Scrofula', 'with Huge Birthmark', 'with Bad Breath', 'with Smelly Feet', 'Flatulent', 'with Balding Pate', 'Hairless', 'Very Hairy', 'with Glossy Hair', 'with Greasy Hair', 'with Huge Beard', 'with Pockmarked Face', 'with Angel Face', 'with Patrician Nose', 'with Vicious Scar', 'with Weather-beaten Face', 'with Heroic Jaw', 'Wheezing', 'with Cough', 'Limp', 'Toothless', 'Bow-legged', 'Hunchback', 'with a Winning Smile', 'with Piercing Glance', 'with Permanent Scowl', 'with Soulful Eyes', 'with Dour Look', 'with Cheerful Expression', 'Lisping', 'Stuttering', 'with Heavy Accent', 'with Nasal Voice', 'with Shrill Voice', 'with Booming Voice'
    ];
    let score = randomize(distinctiveFeatures.length - 1);
    let isLast = distinctiveFeatures[score].startsWith('with');

    return {'text': distinctiveFeatures[score], 'last': isLast};
  }

  #personalityTable() {
    let personalities = [
      'Death-Wish', 'Hair Puller', 'Skin Picker', 'Drinker', 'Pothead', 'Compulsive Gambler', 'Devout', 'Prudent', 'Shy', 'Trusting', 'Modest', 'Frugal', 'Humours', 'Mischievous', 'Bitter and Twisted', 'Sarcastic', 'Cynical', 'Inattentive', 'Daydreamer', 'Talkative', 'Taciturn', 'Spiteful', 'Reckless', 'Wasteful', 'Greedy', 'Lustful', 'Gluttonous', 'Querulous', 'Lazy', 'Vain', 'Pyromaniac', 'Sadist', 'Pathological Liar', 'Hypochondriac', 'Narcissist', 'Psychopath'
    ];
    let score = randomize(personalities.length - 1);

    return personalities[score];
  }

  #gearsTable() {
    let gears = [
      'Holy Water (vial)', 'Healing (potion)', 'Acid (vial)', 'Granny’s Moonshine (jar)', 'Medical Alcohol (Bottle)', 'Rat Poison (Jar)', 'Ten Foot Pole', 'Steel Mirror', '50’ Rope', '25’ Elven Rope', '12 Iron Spikes and Hammer', 'Crowbar', '10 Candles', 'Hourcandle', '5 Torches', 'Lantern', 'Bullseye Lantern', '“Gnomish” Firestarter', 'Deck of Cards', 'Deck of Cards (Marked)', 'Set of Dice', 'Set of Dice (Loaded)', 'Set of Royal Game of Ur', 'Set of Dragon Chess', 'Compass', '5 Snares', 'Bear Trap', 'Fishing Rod', 'Hunting Horn', 'Woodcutter\'s Axe', 'Prayer Beads', 'Prayer Wheel', 'Holy Symbol (wood)', 'Holy Symbol (silver)', 'Holy Symbol (gold)', 'Relic'
    ];
    let score = randomize(gears.length - 1);

    return gears[score];
  }

  #combatGearsTable() {
    let twoToThree = {
      'ac': 9,
      'melee_weapon': ['dagger', 'club', 'club', 'club', 'hand axe', 'mace', 'spear', 'spear', 'spear', 'spear', 'war hammer', 'battle axe'],
      'ranged_weapon': ['', '', '', 1, 1, 2, 2, 'short bow', 'short bow', 'sling', 'sling', 'sling']
    }

    let four = {
      'ac': 8,
      'melee_weapon': ['club', 'hand axe', 'hand axe', 'hand axe', 'mace', 'short sword', 'spear', 'spear', 'spear', 'spear', 'war hammer', 'sword'],
      'ranged_weapon': twoToThree.ranged_weapon,
      'shield': 'shield'
    }

    let five = {
      'ac': 7,
      'armor': 'leather',
      'melee_weapon': ['club', 'hand axe', 'mace', 'short sword', 'short sword', 'spear', 'spear', 'war hammer', 'sword', 'battle axe', 'pole arm', 'two-handed sword'],
      'ranged_weapon': ['', '', 1, 2, 'crossbow', 'crossbow', 'short bow', 'short bow', 'long bow', 'long bow', 'sling', 'sling']
    }

    let six = {
      'ac': 6,
      'armor': 'leather',
      'melee_weapon': ['club', 'hand axe', 'mace', 'short sword', 'short sword', 'short sword', 'spear', 'spear', 'spear', 'war hammer', 'sword', 'sword'],
      'ranged_weapon': five.ranged_weapon,
      'shield': 'shield'
    }

    let sevenToNine = {
      'ac': 4,
      'armor': 'chain',
      'melee_weapon': ['hand axe', 'mace', 'short sword', 'short sword', 'short sword', 'spear', 'spear', 'spear', 'war hammer', 'sword', 'sword', 'sword'],
      'ranged_weapon': five.ranged_weapon,
      'shield': 'shield'
    }

    let ten = {
      'ac': 5,
      'armor': 'chain',
      'melee_weapon': ['battle axe', 'battle axe', 'battle axe', 'battle axe', 'pole arm', 'pole arm', 'pole arm', 'pole arm', 'two-handed sword', 'two-handed sword', 'two-handed sword', 'two-handed sword'],
      'ranged_weapon': ['', '', 1, 2, 'crossbow', 'crossbow', 'crossbow', 'short bow', 'long bow', 'long bow', 'long bow', 'long bow']
    }

    let eleven = {
      'ac': 2,
      'armor': 'plate',
      'melee_weapon': ['mace', 'short sword', 'spear', 'spear', 'warhammer', 'sword', 'sword', 'sword', 'sword', 'sword', 'sword', 'sword'],
      'ranged_weapon': ['', '', '', '', '', '', 'crossbow', 'crossbow', 'crossbow', 'long bow', 'long bow', 'long bow'],
      'shield': 'shield'
    }

    let twelve = {
      'ac': 3,
      'armor': 'plate',
      'melee_weapon': ['battle axe', 'battle axe', 'pole arm', 'pole arm', 'pole arm', 'pole arm', 'pole arm', 'two-handed sword', 'two-handed sword', 'two-handed sword', 'two-handed sword', 'two-handed sword'],
      'ranged_weapon': eleven.ranged_weapon
    }

    let combatGears = [null, null, twoToThree, twoToThree, four, five, six, sevenToNine, sevenToNine, sevenToNine, ten, eleven, twelve];

    let wealth     = new DicePool('2d6').roll();
    let meleeRoll  = new DicePool('1d12-1').roll();
    let rangedRoll = new DicePool('1d12-1').roll();
    let equipment  = combatGears[wealth];

    return {
      'ac': equipment.ac,
      'armor': (equipment.armor) ? equipment.armor + ',' : '',
      'melee_weapon': equipment.melee_weapon[meleeRoll],
      'ranged_weapon': this.#checkExtraRangedWeapons(equipment.ranged_weapon[rangedRoll], equipment.melee_weapon[meleeRoll]),
      'shield': (equipment.shield) ? equipment.shield + ',' : '',
    }
  }

  #checkExtraRangedWeapons(rangedWeapon, meleeWeapon) {
    let extra = typeof rangedWeapon == 'number'
    let text = rangedWeapon;
    let canCarryExtra = ['dagger', 'hand axe', 'spear'].indexOf(meleeWeapon) != -1;

    if (extra && canCarryExtra) {
      text = `(${rangedWeapon} in reserve)`
    } else if (extra) {
      text = '';
      extra = false;
    }

    return {
      'text': text,
      'extra': extra
    }
  }
}
