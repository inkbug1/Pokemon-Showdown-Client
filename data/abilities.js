exports.BattleAbilities = {
	// FE Start
		"forecast": {
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm.",
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
         case 'solarsnow':
				if (pokemon.template.speciesid !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.template.speciesid !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
				if (pokemon.template.speciesid !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.template.speciesid !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]', '[from] ability: Forecast');
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 3,
		num: 59,
	},
		"dryskin": {
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day.",
		shortDesc: "This Pokemon is healed 1/4 by Water, 1/8 by Rain; is hurt 1.25x by Fire, 1/8 by Sun.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Dry Skin');
				}
				return null;
			}
		},
		onBasePowerPriority: 7,
		onFoeBasePower: function (basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.type === 'Fire') {
				return this.chainModify(1.25);
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 8);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland' || effect.id === 'solarsnow') {
				this.damage(target.maxhp / 8, target, target);
			}
		},
		id: "dryskin",
		name: "Dry Skin",
		rating: 3,
		num: 87,
	},
	"chlorophyll": {
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
		onModifySpe: function (spe) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
		},
		id: "chlorophyll",
		name: "Chlorophyll",
		rating: 3,
		num: 34,
	},

	"slushrush": {
		shortDesc: "If Hail is active, this Pokemon's Speed is doubled.",
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather(['hail', 'solarsnow'])) {
				return this.chainModify(2);
			}
		},
		id: "slushrush",
		name: "Slush Rush",
		rating: 2.5,
		num: 202,
	},
	"flowergift": {
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		onStart: function (pokemon) {
			delete this.effectData.forme;
		},
		onUpdate: function (pokemon) {
			if (!pokemon.isActive || pokemon.baseTemplate.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				if (pokemon.template.speciesid !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine');
					this.add('-formechange', pokemon, 'Cherrim-Sunshine', '[msg]', '[from] ability: Flower Gift');
				}
			} else {
				if (pokemon.template.speciesid === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim');
					this.add('-formechange', pokemon, 'Cherrim', '[msg]', '[from] ability: Flower Gift');
				}
			}
		},
		onModifyAtkPriority: 3,
		onAllyModifyAtk: function (atk) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD: function (spd) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(1.5);
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 2.5,
		num: 122,
	},

	"icebody": {
		desc: "If Hail is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Hail.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'hail' || effect.id === 'solarsnow') {
				this.heal(target.maxhp / 16);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === ['hail', 'solarsnow']) return false;
		},
		id: "icebody",
		name: "Ice Body",
		rating: 1.5,
		num: 115,
	},
	"leafguard": {
		desc: "If Sunny Day is active, this Pokemon cannot gain a major status condition and Rest will fail for it.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.",
		onSetStatus: function (status, target, source, effect) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				if (effect && effect.status) this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
				return false;
			}
		},
		onTryAddVolatile: function (status, target) {
			if (status.id === 'yawn' && this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
				return null;
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'solarsnow') return false;
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 1,
		num: 102,
	},

	"solarpower": {
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x; loses 1/8 max HP per turn.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland' || effect.id === 'solarsnow') {
				this.damage(target.maxhp / 8, target, target);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'solarsnow') return false;
		},
		id: "solarpower",
		name: "Solar Power",
		rating: 1.5,
		num: 94,
	},

	"snowcloak": {
		desc: "If Hail is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon's evasiveness is 1.25x; immunity to Hail.",
		onImmunity: function (type, pokemon) {
			if (type === ['hail', 'solarsnow']) return false;
		},
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather(['hail', 'solarsnow'])) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},

	"drought": {
		shortDesc: "On switch-in, this Pokemon summons Sunny Day.",
		onStart: function (source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.template.speciesid === 'groudon') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
                        if(!this.isWeather('solarsnow')) this.setWeather('sunnyday');          
		},
		id: "drought",
		name: "Drought",
		rating: 4.5,
		num: 70,
	},
	"snowwarning": {
		shortDesc: "On switch-in, this Pokemon summons Hail.",
		onStart: function (source) {
			if(!this.isWeather('solarsnow')) this.setWeather('hail');
		},
		id: "snowwarning",
		name: "Snow Warning",
		rating: 4,
		num: 117,
	},
	"overcoat": {
		shortDesc: "This Pokemon is immune to powder moves and damage from Sandstorm or Hail.",
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'solarsnow' || type === 'powder') return false;
		},
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (move.flags['powder'] && target !== source && this.getImmunity('powder', target)) {
				this.add('-immune', target, '[msg]', '[from] ability: Overcoat');
				return null;
			}
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 2.5,
		num: 142,
	},
	"harvest": {
		desc: "If the last item this Pokemon used is a Berry, there is a 50% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 100%.",
		shortDesc: "If last item used is a Berry, 50% chance to restore it each end of turn. 100% in Sun.",
		id: "harvest",
		name: "Harvest",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow']) || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		rating: 2.5,
		num: 139,
	},
	"turnabouttorrent": {
		shortDesc: "Water-type moves of the user is boosted by 50% as long as user is above 1/3 HP; the user's stat changes are reversed.",
		onBoost: function(boost) {
			for (var i in boost) {
				boost[i] *= -1;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp >= attacker.maxhp / 3) {
				this.debug('Turnabout Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp >= attacker.maxhp / 3) {
				this.debug('Turnabout Torrent boost');
				return this.chainModify(1.5);
			}
		},
		id: "turnabouttorrent",
		name: "Turnabout Torrent",
	},
	"intimidatingscales": {
		shortDesc: "Gains 1.5 defense when afflicted with status, and lowers the opponent's attack on switch in.",
		onStart: function(pokemon) {
			var foeactive = pokemon.side.foe.active;
			var activated = false;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate');
					activated = true;
				}
			}
			if (foeactive[i].volatiles['substitute']) {
				this.add('-activate', foeactive[i], 'Substitute', 'ability: Intimidating Scales', '[of] ' + pokemon);
			} else {
				this.boost({
					atk: -1
				}, foeactive[i], pokemon);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef: function(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "intimidatingscales",
		name: "Intimidating Scales",
	},
	"hugetorrent": {
		shortDesc: "Doubles Attack at 30% of HP or less.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(2);
			}
		},
		id: "hugetorrent",
		name: "Huge Torrent",
	},
	"intenserivalry": {
		shortDesc: "Bypasses targets' abilities if they could hinder or prevent a move if the target is the same gender",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Intense Rivalry');
		},
		onModifyMove: function(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				move.ignoreAbility = true;
			}
		},
		id: "intenserivalry",
		name: "Intense Rivalry",
	},
	"levipoison": {
		shortDesc: "If the opponent uses a Ground-type move it becomes Poisoned; Ground immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Levi Poison');
				if (move && !source.status) {
					source.setStatus('psn', target);
				}
				return null;
			}
		},
		id: "levipoison",
		name: "Levipoison",
	},
	"glassing": {
		shortDesc: "If the opponent uses a Ground-type move it becomes Burned; Ground immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Glassing');
				if (move && !source.status) {
					source.setStatus('brn', target);
				}
				return null;
			}
		},
		id: "glassing",
		name: "Glassing",
	},
	"armorcast": {
		shortDesc: "When an item is used or lost, Attack and Speed are raised by two stages, while Defense and Special Defense are lowered by one.",
	onAfterUseItem: function (item, pokemon) {
			if (pokemon !== this.effectData.target) return;
			pokemon.addVolatile('armorcast');
		},
		onTakeItem: function (item, pokemon) {
			pokemon.addVolatile('armorcast');
		},
		onEnd: function (pokemon) {
			pokemon.removeVolatile('armorcast');
		},
		effect: {
			onModifySpe: function (spe, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(2);
				}
			},
			onModifyAtk: function (atk, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(2);
				}
			},
			onModifyDef: function (def, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(2);
				}
			},
			onModifySpD: function (spd, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(2);
				}
			},
		},
		id: "armorcast",
		name: "Armor Cast",
	},
	"obliviousabsorb": {
		shortDesc: "Immune to infatuation, taunting, and electric moves, and if hit by one restores HP by 1/8 of its maximum.",
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'attract') {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Oblivious');
				return null;
			}
		},
		onTryHit: function(pokemon, target, move) {
			if (move.id === 'captivate' || move.id === 'taunt' || move.type === 'Electric') {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Oblivious');
				this.heal(target.maxhp / 8);
				return null;
			}
		},
		id: "obliviousabsorb",
		name: "Oblivious Absorb",
	},
	"fear": {
		shortDesc: "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
		onStart: function(pokemon) {
			var foeactive = pokemon.side.foe.active;
			var activated = false;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate');
					activated = true;
				}
			}
			if (foeactive[i].volatiles['substitute']) {
				this.add('-activate', foeactive[i], 'Substitute', 'ability: Intimidate', '[of] ' + pokemon);
			} else {
				this.boost({atk: -1}, foeactive[i], pokemon);
			}
		},
		id: "fear",
		name: "FEAR",
	},
	"cactuspower": {
		shortDesc: "Summons Sandstorm upon switching in. Grass-type moves have their power increased 20%.",
		onStart: function(source) {
			this.setWeather('sandstorm');
		},
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.2);
			}
		},
		id: "cactuspower",
		name: "Cactus Power",
	},
	"snowforce": {
		shortDesc: "Strengthens Ice-type moves to 1.33× their power during hail.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('hail')) {
				if (move.type === 'Ice') {
					this.debug('Snow Force boost');
					return this.chainModify(1.33);
				}
			}
		},
		id: "snowforce",
		name: "Snow Force",
	},
	"sandyskin": {
		shortDesc: "Cures any major status ailment after each turn during sand. User is immune to sand damage.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.status && this.isWeather(['sandstorm'])) {
				this.add('-activate', pokemon, 'ability: Sandy Skin');
				pokemon.cureStatus();
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandyskin",
		name: "Sandy Skin",
	},
	"technicutter": {
		shortDesc: "Moves of or below 60 BP get boosted by 1.5x, and attack cannot be lowered.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				boost['atk'] = 0;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Technicutter", "[of] " + target);
			}
		},
		id: "technicutter",
		name: "Technicutter",
	},
	"chlorovolt": {
		shortDesc: "If Electric Terrain is active, this Pokemon's Speed is doubled.",
		onModifySpePriority: 6,
		onModifySpe: function(pokemon) {
			if (this.isTerrain('electricterrain')) return this.chainModify(2);
		},
		id: "chlorvolt",
		name: "Chloro Volt",
	},
	"healingfat": {
		shortDesc: "HP is restored by 1/8th every turn when burned or frozen. Prevents the attack drop from Burn status and the immobilization by Frozen status.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'brn' || effect.id === 'frz') {
				this.heal(target.maxhp / 8);
				return false;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(1.5);
			}
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Healing Fat');
				pokemon.cureStatus();
			}
		},
		id: "healingfat",
		name: "Healing Fat",
	},
	"normalveil": {
		shortDesc: "This Pokemon is immune to Normal-type moves.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Normal') {
				this.add('-immune', target, '[msg]', '[from] ability: Normal Veil');
				return null;
			}
		},
		id: "normalveil",
		name: "Normal Veil",
	},
	"landshark": {
		shortDesc: "Lowers Opponent's defense on switch in and gets evasion boosted in sand.",
		onStart: function(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Land Shark', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target, '[msg]');
				} else {
					this.boost({
						atk: -1
					}, target, pokemon);
				}
			}
		},
		onModifyAccuracy: function(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('sandstorm')) {
				return accuracy * 0.8;
			}
		},
		id: "landshark",
		name: "Land Shark",
	},
	"serenefocus": {
		shortDesc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack.",
		onModifySecondaries: function(secondaries) {
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		id: "serenefocus",
		name: "Serene Focus",
	},
	"torrentveil": {
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Water attacks and the Pokemon has 1.25x evasion.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifyAccuracy: function(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target.hp <= target.maxhp / 3) {
				return accuracy * 0.8;
			}
		},
		id: "torrentveil",
		name: "Torrent Veil",
	},
	"mummyfortitude": {
		shortDesc: "Cofagreelix changes the ability of any attacker that makes contact to Mummy. If attacked by an enemy with the Mummy ability, Cofagreelix can endure a hit at one hit point if that hit would faint it.",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (source.ability === 'mummy' && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-activate', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && source.ability !== 'mummy') {
				let oldAbility = source.setAbility('mummy', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.getAbility(oldAbility).name, '[of] ' + source);
				}
			}
		},
		id: "mummmyfortitude",
		name: "Mummy Fortitude",
	},
	"blazingbody": {
		shortDesc: "Sturdy + Blaze.",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Blazing Body');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		id: "blazingbody",
		name: "Blazing Body",
	},
	"noskill": {
		shortDesc: "Pressure + Super Luck.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP: function(target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		onModifyCritRatio: function(critRatio) {
			return critRatio + 1;
		},
		id: "noskill",
		name: "No Skill",
	},
	"sandaura": {
		shortDesc: "Sandstream + Sand Veil.",
		onStart: function(source) {
			this.setWeather('sandstorm');
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracy: function(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('sandstorm')) {
				return accuracy * 0.8;
			}
		},
		id: "sandaura",
		name: "Sand Aura",
	},
	"staticstorm": {
		shortDesc: "30% chance to paralyze the opponent each turn if Hail is active.",
		onAfterDamage: function(damage, target, source, effect) {
			if (this.random(10) < 3) {
				source.trySetStatus('par', target, effect);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		id: "staticstorm",
		name: "Static storm",
	},
	"dreadedflames": {
		shortDesc: "Gains a 1.5x boost to fire moves on the turn of entry, and lowers opponent's defence on entry.",
		onStart: function(pokemon) {
			var foeactive = pokemon.side.foe.active;
			var activated = false;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Dreaded Flames');
					activated = true;
				}
			}
			if (foeactive[i].volatiles['substitute']) {
				this.add('-activate', foeactive[i], 'Substitute', 'ability: Dreaded Flames', '[of] ' + pokemon);
			} else {
				this.boost({
					atk: -1
				}, foeactive[i], pokemon);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3 && attacker.activeTurns > 1) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3 && attacker.activeTurns > 1) {
				return this.chainModify(1.5);
			}
		},
		id: "dreadedflames",
		name: "Dreaded Flames",
	},
	"rockygrowth": {
		shortDesc: "This Pokemon takes no recoil from moves and the power of moves that would cause recoil increases by 50% when HP is below 33%.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		id: "rockygrowth",
		name: "Rocky Growth",
		rating: 3,
		num: 211
	},
	"pristine": {
		shortDesc: "Cannot be OHKOed. Immune to major status conditions if its HP is full.",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onUpdate: function(pokemon) {
			if (pokemon.hp === pokemon.maxhp && pokemon.status === 'brn' || pokemon.status === 'frz' || pokemon.status === 'psn' || pokemon.status === 'tox' || pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Pristine');
				pokemon.cureStatus();
			}
		},
		onImmunity: function(type, pokemon) {
			if (pokemon.hp === pokemon.maxhp && pokemon.status === 'brn' || pokemon.status === 'frz' || pokemon.status === 'psn' || pokemon.status === 'tox' || pokemon.status === 'par') return false;
		},
		id: "pristine",
		name: "Pristine",
	},
	"innerbody": {
		shortDesc: "This pokemon cannot flinch, and contact moves have a 33% chance to burn the opponent.",
		onFlinch: false,
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('brn', target, move);
				}
			}
		},
		id: "innerbody",
		name: "Inner Body",
	},
	"intimidatingfangs": {
		shortDesc: "Pokemon making contact with this Pokemon have their Attack lowered by 1 stage.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Intimidating Fangs');
				this.boost({
					atk: -1
				}, source, target, null, true);
			}
		},
		id: "intimidatingfangs",
		name: "Intimidating Fangs",
	},
	"intimidatingabsorption": {
		shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage. This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.",
		onStart: function(pokemon) {
			var foeactive = pokemon.side.foe.active;
			var activated = false;
			for (var i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidating Absorption');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-activate', foeactive[i], 'Substitute', 'ability: Intimidating Absorption', '[of] ' + pokemon);
				} else {
					this.boost({
						atk: -1
					}, foeactive[i], pokemon);
				}
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Intimidating Absorption');
				}
				return null;
			}
		},
		id: "intimidatingabsorption",
		name: "Intimidating Absorption",
	},
	"keenfeet": {
		shortDesc: "Doubles Evasion whenever a stat is lowered (doesn't activate with self-inflicted drops).",
		onAfterEachBoost: function(boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			var statsLowered = false;
			for (var i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({
					evasion: 2
				});
			}
		},
		id: "keen feet",
		name: "Keen Feet",
	},
	"swiftabsorb": {
		shortDesc: "When hit by a Water moves, Speed is doubled. Water immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'water') {
				this.add('-immune', target, '[msg]', '[from] ability: Flash water');
				return null;
			}
		},
		onModifySpePriority: 5,
		onModifySpe: function(spe, pokemon) {
			return this.chainModify(2);
		},
		id: "swiftabsorb",
		name: "Swift Absorb",
	},
	"mathsurge": {
		shortDesc: "Increases Special Attack to 1.5x at 1/3 max HP or less.",
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Math surge');
				return this.chainModify(1.5);
			}
		},
		id: "mathsurge",
		name: "Math Surge",
	},
	"flameessence": {
		shortDesc: "Fire-type Moves are counted as STAB.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire') {}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire') {}
		},
		id: "flameessence",
		name: "Flame Essence",
	},
	"naturalguard": {
		shortDesc: "Starchamp's moves cannot miss unless it's suffering from a major status. Cures itself of status when it switches.",
		onAnyAccuracy: function(accuracy, target, source, move) {
			if (move && (source === this.effectData.target && source.status === 'psn' && source.status === 'tox' && source.status === 'brn' && source.status === 'frz' && source.status === 'par')) {
				return true;
			}
			return accuracy;
		},
		onSwitchOut: function(pokemon) {
			pokemon.cureStatus();
		},
		id: "naturalguard",
		name: "Natural Guard",
	},
	"stickyfloat": {
		shortDesc: "Evades Ground-type moves, and user cannot lose their item",
		onTakeItem: function(item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon) return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Sticky Float');
				return null;
			}
		},
		id: "stickyfloat",
		name: "Sticky Float",
	},
	"serenefire": {
		shortDesc: "When hit by a Fire-Type Move, all Fire-Type moves used by Hitachi will burn. Fire-Type moves have no effect on Haitchi.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				return null;
			}
		},
		onModifyMove: function(move) {
			if (!move || !move.type === 'Fire') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 100,
				status: 'brn'
			});
		},
		id: "serenefire",
		name: "Serene Fire",
	},
	"healingblaze": {
		shortDesc: "Cures status when it uses a Fire-type move. Fire type moves are boosted by 50% whenever Healing Blaze is activated.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
				attacker.cureStatus();
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
				attacker.cureStatus();
			}
		},
		id: "healingblaze",
		name: "Healing Blaze",
	},
	"barbstance": {
		shortDesc: "Switches to blade form when attacking, switches to shield form upon using king's shield. Deals 1/8 HP to contactors when in shield form.",
		onBeforeMovePriority: 11,
		onBeforeMove: function(attacker, defender, move) {
			if (attacker.template.baseSpecies !== 'Ferroslash') return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			var targetSpecies = (move.id === 'kingsshield' ? 'Ferroslash' : 'Ferroslash-Blade');
			if (attacker.template.species !== targetSpecies && attacker.formeChange(targetSpecies)) {
				this.add('-formechange', attacker, targetSpecies);
			}
		},
		id: "barbstance",
		name: "Barb Stance",
	},
	"poweruppinch": {
		shortDesc: "All attacks x1.25 stronger if health is 50% or below",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 2) {
				return this.chainModify(1.25);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 2) {
				return this.chainModify(1.25);
			}
		},
		id: "poweruppinch",
		name: "Power Up Pinch",
	},
	"electrotechnic": {
		shortDesc: "This Pokemon's moves with 60 BP or less have their power increased by 50%; if on the field there is another Pokemon with Plus, Minus or derivates, their power is doubled.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(spa, pokemon) {
			var allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (var i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "electrotechnic",
		name: "ElectroTechnic",
	},
	"speedbreak": {
		shortDesc: "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.",
		onBoost: function(boost) {
			boost.spe *= -1;
		},
		id: "speedbreak",
		name: "Speed Break",
	},
	/*	"justicepower": {
			shortDesc: "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark-type move.",
			onAfterDamage: function(damage, target, source, effect) {
				if (effect && effect.type === 'Dark') {
					this.boost({
						atk: 1
					});
				}
			},
			onDeductPP: function(damage, target, source, effect) {
				if (effect && effect.type === 'Dark') return;
				return 1;
			},
			id: "justicepower",
			name: "Justice Power",
			rating: 2,
			num: 228
		},*/
	"cursedtrace": {
		shortDesc: "Traces the foe's ability. The foe's ability now has no effect on the foe.",
		onUpdate: function(pokemon) {
			if (!pokemon.isStarted) return;
			let possibleTargets = [];
			for (let i = 0; i < pokemon.side.foe.active.length; i++) {
				if (pokemon.side.foe.active[i] && !pokemon.side.foe.active[i].fainted) possibleTargets.push(pokemon.side.foe.active[i]);
			}
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				let ability = this.getAbility(target.ability);
				let bannedAbilities = {
					comatose: 1,
					disguise: 1,
					flowergift: 1,
					forecast: 1,
					illusion: 1,
					imposter: 1,
					multitype: 1,
					schooling: 1,
					stancechange: 1,
					trace: 1,
					zenmode: 1
				};
				if (bannedAbilities[target.ability]) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, ability, '[from] ability: Cursed Trace', '[of] ' + target);
				if (pokemon.setAbility(ability)) target.addVolatile('gastroacid');
				return;
			}
		},
		id: "cursedtrace",
		name: "Cursed Trace",
	},
	/*"sheerflight": {
		desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed.",
		shortDesc: "This Pokemon's attacks with secondary effects have 1.3x power; nullifies the effects.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Ground') {
            this.add('-immune', target, '[msg]', '[from] ability: Sheer Flight');
				return null;
			}
		},
		onModifyMove: function(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				pokemon.addVolatile('sheerforce');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "sheerflight",
		name: "Sheer Flight",
		rating: 4,
		num: 230
	},*/
	"evaporation": {
		shortDesc: "If this Pokemon is hit by a Water-type move, its Fire-type moves have their power increased by 50%; immune to Water-type moves.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		onEnd: function(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(1.5);
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			}
		},
		id: "evaporation",
		name: "Evaporation",
	},
	"hardbody": {
		shortDesc: "Stat drops inflicted either by moves, abilities or status are ignored.",
		onBoost: function(boost, target, source, effect) {
			if (boost[i] < 0) {
				delete boost[i];
				showMsg = true;
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Hard Body", "[of] " + target);
		},
		onModifySpe: function(spe, pokemon) {
			if (pokemon.status === 'par') {
				return this.chainModify(1.5);
			}
		},
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(1.5);
			}
		},
		id: "hardbody",
		name: "Hard Body",
	},
	"gutbreaker": {
		shortDesc: "Abilities that hinder attacks are nullified and gets attack boosted by 1.5x when burned.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Gut Breaker');
		},
		stopAttackEvents: true,
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "gutbreaker",
		name: "Gut Breaker",
	},
	"synchofloat": {
		shortDesc: "Immune to Ground-type moves. Opposing Pokemon's ability is changed to Levitate.",
		onTryHit: function(source, target, move) {
			if (target !== source && move.type === 'Ground') {
			this.add('-immune', source, '[msg]', '[from] ability: Syncho Float');
			let oldAbility = target.setAbility('levitate', target, 'levitate', true);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Levitate', oldAbility, '[of] ' + target);
				}
			return null;
			}
		},
		id: "synchofloat",
		name: "Synchofloat",
	},
	"magicianswand": {
		shortDesc: "Swaps item with target when hit with an Electric-type attack.",
		onHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				var yourItem = target.takeItem(source);
				var myItem = source.takeItem();
				if (target.item || source.item || (!yourItem && !myItem) || (myItem.onTakeItem && myItem.onTakeItem(myItem, target) === false)) {
					if (yourItem) target.item = yourItem;
					if (myItem) source.item = myItem;
					return false;
				}
				this.add('-activate', source, 'move: Trick', '[of] ' + target);
				if (myItem) {
					target.setItem(myItem);
					this.add('-item', target, myItem, '[from] Trick');
				}
				if (yourItem) {
					source.setItem(yourItem);
					this.add('-item', source, yourItem, '[from] Trick');
				}
			}
		},
		id: "magicianswand",
		name: "Magician's Wand",
	},
	"cleanmatch": {
		shortDesc: "Pokemon not holding an item have their attack and speed increased by 50%. This ability's bonus does not stack with other abilities derived from or named Guts or Unburden.",
		onModifySpe: function(spe, pokemon) {
			if (!pokemon.item) {
				return this.chainModify(1.5);
			}
		},
		onModifyAtk: function(atk, pokemon) {
			if (!pokemon.item) {
				return this.chainModify(1.5);
			}
		},
		id: "cleanmatch",
		name: "Clean Match",
	},
	"positivegrowth": {
		shortDesc: "When this Pokemon's health is low, it gains a 50% boost to its Sp. Atk stat.",
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Math surge');
				return this.chainModify(1.5);
			}
		},
		id: "positive growth",
		name: "Positive Growth",
	},
	"errormacro": {
		shortDesc: "Physical moves hit off of special attack, and vice versa for special attacks. Stance change forms remain.",
		getCategory: function(move) {
			move = this.getMove(move);
			if (move.category === 'Status') return 'Status';
			if (move.category === 'Physical') return 'Special';
			return 'Physical';
		},
		onBeforeMovePriority: 11,
		onBeforeMove: function(attacker, defender, move) {
			if (attacker.template.baseSpecies !== 'Aegislash') return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			var targetSpecies = (move.id === 'kingsshield' ? 'Aegilene' : 'Aegislash-Saber');
			if (attacker.template.species !== targetSpecies && attacker.formeChange(targetSpecies)) {
				this.add('-formechange', attacker, targetSpecies);
			}
		},
		id: "errormacro",
		name: "Error Macro",
	},
	"latebloomer": {
		shortDesc: "Has a 30% chance of infatuating the opponent at the end of its turn if it moves last.",
		OnAfterDamagePriority: 8,
		onAfterDamage: function(damage, attacker, defender, move) {
			if (!this.willMove(defender)) {
				if (this.random(10) < 3) {
					defender.addVolatile('attract', attacker);
				}
			}
		},
		id: "latebloomer",
		name: "Late Bloomer",
	},
	"tangledflames": {
		shortDesc: "This pokemon's fire attacks are boosted 2x when confused. Fire Immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
					this.add('-immune', target, '[msg]', '[from] ability: Tangled Flames');
				return null;
			}
		},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, attacker, defender, move) {
				if (move.type === 'Fire' || attacker && attacker.volatiles['confusion']) {
					return this.chainModify(2);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function(atk, attacker, defender, move) {
				if (move.type === 'Fire' || attacker && attacker.volatiles['confusion']) {
					return this.chainModify(2);
				}
		},
		id: "tangledflames",
		name: "Tangled Flames",
	},
	"breaker": {
		shortDesc: "This pokemon's attacks aren't hindered by stat boosts, drops or abilities.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		stopAttackEvents: true,
		onBoost: function(boost, target, source, effect) {
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Breaker", "[of] " + target);
		},
		onAnyModifyBoost: function(boosts, target) {
			var source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		id: "breaker",
		name: "Breaker",
	},
	"hammerspace": {
		shortDesc: "If its item is used or lost during battle, the item will regenerate after it switches out.",
		onSwitchOut: function(pokemon) {
			pokemon.setItem(pokemon.lastItem);
			this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Hammer Space');
		},
		id: "hammer space",
		name: "Hammer Space",
	},
	"underpressure": {
		shortDesc: "This Pokemon's status is cured at the end of each turn, but it uses 2 PP every time it attacks.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.status) {
				this.debug('under pressure');
				this.add('-activate', pokemon, 'ability: Under Pressure');
				pokemon.cureStatus();
			}
		},
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Under Pressure');
		},
		onDeductPP: function(target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		id: "underpressure",
		name: "Under Pressure",
	},
	"naturaleye": {
		shortDesc: "Pidgemie avoids status moves if they're not 100% accurate.",
		onModifyAccuracyPriority: 10,
		onModifyAccuracy: function(accuracy, target, source, move) {
			if (move.category === 'Status' && !move.accuracy === '100') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 0;
			}
		},
		id: "naturaleye",
		name: "Natural Eye",
	},
	"overwhelmingpresence": {
		shortDesc: "Whenever this poke is on the field, all abilities and items the opponent has is negated.",
		onStart: function(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				this.add('-start', target, 'Embargo');
				target.addVolatile('gastroacid');
			}
		},
		onUpdate: function(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				this.add('-start', target, 'Embargo', '[silent]');
				target.addVolatile('gastroacid');
			}
		},
		id: "overwhelmingpresence",
		name: "Overwhelming Presence",
	},
	"monsoon": {
		desc: "If this Pokemon is a Casting, its type changes to the current weather condition's type, except Sandstorm. In weather, protects from Ground-type moves.",
		shortDesc: "Casting's secondary type changes to the current weather condition's type, except Sandstorm, and it gets protected from Ground-type moves.",
		onUpdate: function(pokemon) {
			if (pokemon.baseTemplate.species !== 'Casting' || pokemon.transformed) return;
			var forme = null;
			switch (this.effectiveWeather()) {
				case 'sunnyday':
				case 'desolateland':
					if (pokemon.template.speciesid !== 'castingsunny') forme = 'Casting-Sunny';
					break;
				case 'raindance':
				case 'primordialsea':
					if (pokemon.template.speciesid !== 'castingrainy') forme = 'Casting-Rainy';
					break;
				case 'hail':
					if (pokemon.template.speciesid !== 'castingsnowy') forme = 'Casting-Snowy';
					break;
				default:
					if (pokemon.template.speciesid !== 'casting') forme = 'Casting';
					break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]');
			}
		},
         onTryHit: function(target, source, move) {
			if (target !== source && target.template.speciesid !== 'casting' && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Monsoon');
				return null;
			}
		},
		id: "monsoon",
		name: "Monsoon",
	},
	"monsoonaltered": {
		desc: "If this Pokemon is a Casting, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "Casting's secondary type changes to the current weather condition's type, except Sandstorm.",
		onUpdate: function(pokemon) {
			if (pokemon.baseTemplate.species !== 'Casting' || pokemon.transformed) return;
			var forme = null;
			switch (this.effectiveWeather()) {
				case 'sunnyday':
				case 'desolateland':
					if (pokemon.template.speciesid !== 'castingsunny') forme = 'Casting-Sunny';
					break;
				case 'raindance':
				case 'primordialsea':
					if (pokemon.template.speciesid !== 'castingrainy') forme = 'Casting-Rainy';
					break;
				case 'hail':
					if (pokemon.template.speciesid !== 'castingicy') forme = 'Casting-Icy';
					break;
				default:
					if (pokemon.template.speciesid !== 'casting') forme = 'Casting';
					break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]');
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Monsoon Altered');
				return null;
			}
		},
		id: "monsoonaltered",
		name: "Monsoon-Altered",
	},
	"justifiedfire": {
		shortDesc: "Raises user's Special Attack when hit with a Fire-type attack. Grants immunity to Fire.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!this.boost({
						spa: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Justified Fire');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function(target, source, source2, move) {
			if (move.type !== 'Fire' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Justified Fire');
				}
				return this.effectData.target;
			}
		},
		id: "justifiedfire",
		name: "Justified Fire",
	},
	"sturdytempo": {
		desc: "Sturdy + Own Tempo.",
		shortDesc: "Sturdy + Own Tempo",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy Tempo');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Sturdy Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile: function(status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit: function(target, source, move) {
			if (move && move.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Sturdy Tempo');
			}
		},
		id: "sturdytempo",
		name: "Sturdy Tempo",
	},
	"hydrostream": {
		shortDesc: "On switch-in, this Pokemon summons Rain Dance.",
		onStart: function(source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'kyogre') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
		},
		id: "hydrostream",
		name: "Hydro Stream",
	},
	"hydrate": {
		desc: "This Pokemon's Normal-type moves become Water-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Water type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Water';
				move.hydrateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.hydrateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		id: "hydrate",
		name: "Hydrate",
	},
	"leafstream": {
		shortDesc: "On switch-in, this Pokemon summons Sunny Day.",
		onStart: function(source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'groudon') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('sunnyday');
		},
		id: "leafstream",
		name: "Leaf Stream",
	},
	"cybercriminal": {
		desc: "This Pokemon's Special Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Special Attack is raised by 1 stage if it attacks and KOes another Pokemon.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({
					spa: 1
				}, source);
			}
		},
		id: "cybercriminal",
		name: "Cyber Criminal",
	},
	"cleartempo": {
		shortDesc: "Immune to stat drops and confusion.",
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Clear Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile: function(status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit: function(target, source, move) {
			if (move && move.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Clear Tempo');
			}
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Clear Tempo", "[of] " + target);
		},
		id: "cleartempo",
		name: "Clear Tempo",
	},
	"sandyeyes": {
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 1.3x in Sandstorm; immunity to it.",
		onSourceModifyAccuracy: function(accuracy) {
			if (this.isWeather('sandstorm')) {
				if (typeof accuracy !== 'number') return;
				this.debug('sandyeyes - enhancing accuracy');
				return accuracy * 1.3;
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandyeyes",
		name: "Sandy Eyes",
	},
	"sharparmor": {
		shortDesc: "Atk is raised by 2 when hit by a Water-type move and lowered by 2 when hit by a Fire-type; gives immunity to Water-type moves.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.type === 'Water') {
				this.boost({
					atk: 2
				});
			}
		},
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.type === 'Fire') {
				this.boost({
					atk: -2
				});
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water') {
				move.accuracy = true;
				if (!target.addVolatile('sharparmor')) {
					this.add('-immune', target, '[msg]', '[from] ability: Sharp Armor');
				}
				return null;
			}
		},
		id: "sharparmor",
		name: "Sharp Armor",
	},
	"dreamcrusher": {
		shortDesc: "The user deals 2x damage to sleeping targets.",
		onModifyDamage: function(damage, source, pokemon, move) {
			for (const target of pokemon.side.foe.active) {
			if (!target || !target.hp) continue;
			if (target.status && target.status == 'slp') {
				this.debug('Dream Crusher boost');
				return this.chainModify(2);
			}
			}
		},
		id: "dreamcrusher",
		name: "Dream Crusher",
	},
	"desertsnow": {
		desc: "This pokemon's Ground/Rock/Steel/Ice attacks do 1.3x in Sandstorm and Hail, opposing attacks of those types heal by 1/16 under the same weather conditions.",
		shortDesc: "This pokemon's Ground/Rock/Steel/Ice attacks do 1.3x in Sandstorm and Hail, opposing attacks of those types heal by 1/16 under the same weather conditions.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('hail')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel' || move.type === 'Ice') {
					this.debug('Desert Snow boost');
					return this.chainModify(1.3);
				}
			}
		},
		onTryHit: function(target, source, move) {
			if (this.isWeather('hail')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel' || move.type === 'Ice') {
					if (!this.heal(target.maxhp / 16)) {
						this.add('-immune', target, '[msg]', '[from] ability: Desert Snow');
					}
				}
				return null;
			}
		},
		id: "desertsnow",
		name: "Desert Snow",
	},
	"magicbreak": {
		shortDesc: "This Pokemon's attacks ignore the effects of the opponent's items.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Magic Break');
		},
		onModifyMove: function(move) {
			move.ignoreItem = true;
		},
		id: "magicbreak",
		name: "Magic Break",
	},
	"raptorhead": {
		desc: "Prevents recoil damage and Attack reduction.",
		shortDesc: "Prevents recoil damage and Attack reduction.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				delete boost['atk'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Raptor Head", "[of] " + target);
			}
		},
		id: "raptorhead",
		name: "Raptor Head",
	},
	"steadfastluck": {
		shortDesc: "When this Fusion Evolution flinches, its speed and critical hit ratio are raised by 1 stage.",
		onFlinch: function(pokemon) {
			this.boost({
				spe: 1,
				critRatio: 1,
			});
		},
		id: "steadfastluck",
		name: "Steadfast Luck",
	},
	"thunderousembers": {
		desc: "Raises Special Attack by 1.5x when hit by a fire attack move; immunity to fire attacks.",
		shortDesc: "Raises Special Attack by 1.5x when hit by a fire attack move; immunity to fire attacks.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!this.boost({
						spa: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Thunderous Embers');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function(target, source, source2, move) {
			if (move.type !== 'Fire' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Thunderous Embers');
				}
				return this.effectData.target;
			}
		},
		id: "thunderousembers",
		name: "Thunderous Embers",
	},
	"torrentialvoltage": {
		desc: "Electric immunity, and when hit by an Electric-type move, this Pokemon's Electric moves gain a 50% power boost.",
		shortDesc: "Electric immunity, and when hit by an Electric-type move, this Pokemon's Electric moves gain a 50% power boost.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				move.accuracy = true;
				if (!target.addVolatile('torrentialvoltage')) {
					this.add('-immune', target, '[msg]', '[from] ability: Torrential Voltage');
				}
				return null;
			}
		},
		onEnd: function(pokemon) {
			pokemon.removeVolatile('torrentialvoltage');
		},
		effect: {
			noCopy: true,
			onStart: function(target) {
				this.add('-start', target, 'ability: Torrential Voltage');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('Torrential Voltage boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function(atk, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('Torrential Voltage boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'ability: Torrential Voltage', '[silent]');
			},
		},
		id: "torrentialvoltage",
		name: "Torrential Voltage",
	},
	"seamonster": {
		desc: "Lowers opponent's attack one stage upon switching in. Water-type attacks are boosted 10%.",
		shortDesc: "Lowers opponent's attack one stage upon switching in. Water-type attacks are boosted 10%.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Sea Monster', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({
						atk: -1
					}, foeactive[i], pokemon);
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify(1.1);
			}
		},
		id: "seamonster",
		name: "Sea Monster",
	},
	"sereneeyes": {
		shortDesc: "Moves with secondary effect chances have their accuracy doubled.",
		onModifyMovePriority: -2,
		onModifyMove: function(move) {
			if (move.secondaries) {
				return move.accuracy * 2;
			}
		},
		id: "sereneeyes",
		name: "Serene Eyes",
	},
	"fromashes": {
		desc: "If the Pokémon is burned, it will gain 1/8 of its maximum HP at the end of each turn instead of taking damage. The Pokémon with this Ability does not lose Attack due to burn.",
		shortDesc: "If the Pokémon is burned, it will gain 1/8 of its maximum HP at the end of each turn instead of taking damage. The Pokémon with this Ability does not lose Attack due to burn.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.heal(target.maxhp / 8);
				return false;
			}
		},
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(1);
			}
		},
		id: "fromashes",
		name: "From Ashes",
	},
	"sturdytech": {
		shortDesc: "Sturdy + Technician",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		id: "sturdytech",
		name: "Sturdy Tech",
	},
	"armoredguts": {
		shortDesc: "When statused, this Pokemon gains a 1.5x Attack Boost and it cannot be struck by Critical hits.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onCriticalHit: false,
		id: "armoredguts",
		name: "Armored Guts",
	},
	"shakeitoff": {
		shortDesc: "Boosts the Special Attack stat by two stages when statused.",
		onUpdate: function(spa, pokemon) {
			if (pokemon.status) {
				this.boost({
					spa: 2
				});
			}
		},
		id: "shakeitoff",
		name: "Shake it Off",
	},
	"prankstar": {
		shortDesc: "This pokemon's moves of 70% accuracy or less have +1 Priority.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move.accuracy <= 70) return priority + 1;
		},
		id: "prankstar",
		name: "Prankstar",
	},
	"sturdyfire": {
		shortDesc: "Sturdy + Flash Fire",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		onEnd: function(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
		id: "sturdyfire",
		name: "Sturdy Fire",
	},
	"kindle": {
		shortDesc: "During hail, its Fire moves are powered up by 1.5x and recovers 1/16 HP every turn.",
		onModifySpAPriority: 5,
		onModifySpA: function(spa, pokemon) {
			if (this.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp / 16, target, target);
			}
		},
		id: "kindle",
		name: "Kindle",
	},
	"durablebarbs": {
		shortDesc: "Sturdy + Iron Barbs",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onAfterDamageOrder: 1,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target);
			}
		},
		id: "durablebarbs",
		name: "Durable Barbs",
	},
	"rapidgrowth": {
		shortDesc: "Grass-type moves have their priority increased by 1.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.type === 'Grass') return priority + 1;
		},
		id: "rapidgrowth",
		name: "Rapid Growth",
	},
	"amazingbulk": {
		shortDesc: "This Pokemon receives 1/2 damage from supereffective attacks.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(0.5);
			}
		},
		id: "amazingbulk",
		name: "Amazing Bulk",
	},
	"chargedup": {
		shortDesc: "Users Special Attack is doubled.",
		onModifySpAPriority: 5,
		onModifySpA: function(atk) {
			return this.chainModify(2);
		},
		id: "chargedup",
		name: "Charged Up",
	},
	"khanqueror": {
		shortDesc: "Ignores type immunities while attacking",
		onModifyMovePriority: -5,
		onModifyMove: function(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity = true;
			}
		},
		id: "khanqueror",
		name: "Khanqueror",
	},
	"synchrostall": {
		shortDesc: "On switch-in, this Pokemon summons Trick Room.",
		onStart: function(source) {
			this.useMove('Trick Room', source);
		},
		id: "Synchrostall",
		name: "Synchrostall",
	},
	"permafrost": {
		shortDesc: "Immune to Fire and Ground.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground' || move.type === 'Fire') {
				this.add('-immune', target, '[msg]', '[from] ability: Permafrost');
				return null;
			}
		},
		id: "permafrost",
		name: "Permafrost",
	},
	"heavyarmor": {
		shortDesc: "If a physical attack hits this Pokemon, defense is raised by 1, speed is lowered by 1.",
		onAfterDamage: function(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({
					def: 1,
					spe: -1
				}, target, target);
			}
		},
		id: "heavyarmor",
		name: "Heavy Armor",
	},
		"negativebody": {
		desc: "On switch-in, this Pokemon resets the stats of adjacent opposing Pokemon by 1 stage.",
		shortDesc: "On switch-in, this Pokemon resets the stats of adjacent opponents by 1 stage.",
		onStart: function (pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Negative Body', 'boost');
					activated = true;
				}
				target.clearBoosts();
			}
		},
		id: "negativebody",
		name: "Negative Body",
	},
	"stunningbug": {
		shortDesc: "Bug-type moves have their priority increased by 1.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.type === 'Bug') return priority + 1;
		},
		id: "stunningbug",
		name: "Stunning Bug",
	},
	"champion": {
		shortDesc: "Users Attack is 1.5x.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.chainModify(1.5);
		},
		id: "champion",
		name: "Champion",
	},
	'venomstream': {
		shortDesc: "Uses Toxic Spikes on switch in",
		onStart: function(source) {
			this.useMove('Toxic Spikes', source);
		},
		id: "venomstream",
		name: "Venom Stream",
	},
	"sunaura": {
		shortDesc: "Powers up each Pokemon's Fire-type moves by 33%.",
		onBasePowerPriority: 8,
		onBasePower: function(type, attacker, defender, move) {
			if (type === 'Fire') {
				return this.chainModify(1.3);
			}
		},
		id: "sunaura",
		name: "Sun Aura",
	},
	'tropicalstorm': {
		shortDesc: "Tailwind on switch in",
		onStart: function(source) {
			this.useMove('Tailwind', source);
		},
		id: "tropicalstorm",
		name: "Tropical Storm",
	},
	"flamedrive": {
		shortDesc: "If this Pokemon is struck by a Fire type move, its speed is raised by one stage. Fire type immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.add('-immune', target, '[msg]', '[from] ability: Flame Drive');
				return null;
			}
		},
		onModifySpe: function(spe, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(1.5);
			}
		},
		id: "flamedrive",
		name: "Flame Drive",
	},
		'boosttrace': {
		shortDesc: "Copies opponent's stat boosts (not drops) on switch in.",
		onStart: function(pokemon) {
			let possibleTargets = pokemon.side.foe.active.filter(foeActive => foeActive && this.isAdjacent(pokemon, foeActive));
			while (possibleTargets.length) {
				let rand = 0;
                                let buffed = false;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				for (let i in target.boosts) {
                                  if (target.boosts[i] > 0){
				    source.boosts[i] = target.boosts[i];
                                    buffed = true;
                                  }
			        }
				if (!buffed) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				return;
			}
		},
		id: "boosttrace",
		name: "Boost Trace",
	},
	"masochist": {
		shortDesc: "This Pokemon's Atk & Defense are raised by 1 stage after it is damaged by a move.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({
					def: 1,
					atk: 1
				});
			}
		},
		id: "masochist",
		name: "Masochist",
	},
	'flamingpresence': {
		shortDesc: "Upon switching in, this pokemon burns all opposing pokemon that can be burned.",
		onStart: function(pokemon) {
			        for (const target of pokemon.side.foe.active) {
                                    let activated = false;
                                    if (!target || !this.isAdjacent(target, pokemon)) continue;
				    if (!activated) {
					activated = true;
				     }
				     if (!target.volatiles['substitute']){
					source.trySetStatus('brn', target);
				     }
			}
		},
		id: "flamingpresence",
		name: "Flaming Presence",
	},
	"kaleidocope": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(0.5);
			}
		},
		onModifyDamage: function(damage, source, target, move) {
			if (move.typeMod < 0) {
				return this.chainModify(2);
			}
		},
		id: "kaleidocope",
		name: "Kaleidocope",
	},
	"hazmatfur": {
		shortDesc: "This Pokemon takes 1/2 damage from contact and Fire moves.",
		onSourceModifyDamage: function(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod /= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		id: "hazmatfur",
		name: "Hazmat Fur",
	},
	"indulgence": {
		shortDesc: "This Pokemon's healing moves have their priority increased by 3.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.category === 'Status' || move && move.flags['heal']) return priority + 3;
		},
		onModifyMove: function(move) {
			if (move && move.category === 'Status') {}
		},
		id: "indulgence",
		name: "Indulgence",
	},
	"determination": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Attack stat stage.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0 && target.hp <= target.maxhp / 2) {
				delete boost['atk'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Determination", "[of] " + target);
			}
		},
		id: "determination",
		name: "Determination",
	},
	"outrageous": {
		shortDesc: "This Pokemon's SpA is 1.5x as long as it is confused.",
		onModifySpA: function(spa, target) {
			if (target && target.volatiles['confusion']) {
				return spa * 1.5;
				this.add('-ability', target, 'Outrageous');
			}
		},
		id: "outrageous",
		name: "Outrageous",
	},
	"woodhead": {
		shortDesc: "This Pokémon does not take recoil damage; when this Pokémon's HP are under 33%, the power of recoil moves is raised by 50%.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		id: "woodhead",
		name: "Wood Head",
	},
	"blazerush": {
		shortDesc: "The Pokémon's Speed is doubled when its HP falls below 1/3 of the maximum.",
		onModifySpe: function(spe, attacker) {
			if (attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(2);
			}
		},
		id: "blazerush",
		name: "Blaze Rush",
	},
	"swiftretreat": {
		shortDesc: "This Pokemon's speed is doubled until its HP falls below 50%, then it switches out.",
		onModifySpe: function(spe, attacker) {
			if (attacker.hp > attacker.maxhp / 2) {
				return this.chainModify(2);
			}
		},
		onAfterMoveSecondary: function(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				source.switchFlag = false;
				this.add('-activate', target, 'ability: Emergency Exit');
			}
		},
		onAfterDamage: function(damage, target, source, effect) {
			if (!target.hp || effect.effectType === 'Move') return;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				this.add('-activate', target, 'ability: Emergency Exit');
			}
		},
		id: "swiftretreat",
		name: "Swift Retreat",
	},
	"championsspirit": {
		shortDesc: "This Pokemon's Atk & Defense are raised by 1 stage after it is damaged by a move.",
		onAfterDamage: function(damage, target, source, effect, move) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused' && !move.crit) {
				this.boost({
					def: 1,
					atk: 1
				});
			}
		},
		onHit: function(target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({
					atk: 3,
					def: 3
				});
				this.add('-setboost', target, 'atk', 12, '[from] ability: Champions Spirit');
			}
		},
		id: "championsspirit",
		name: "Champions Spirit",
	},
	"Beasts Focus": {
		shortDesc: "If Pokémon would be flinched, buffs highest non-HP stat instead.",
		onFlinch: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({
					[stat]: 1
				}, source);
			}
		},
		id: "beastsfocus",
		name: "Beasts Focus",
	},
	"volttorrent": {
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Electric attacks.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Electric' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Electric' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		id: "volttorrent",
		name: "Volt Torrent",
	},
	"ancientmariner": {
		shortDesc: "Steelworker + No Guard.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		onAnyAccuracy: function(accuracy, target, source, move) {
			if (move && (source === this.effectData.target || target === this.effectData.target)) {
				return true;
			}
			return accuracy;
		},
		id: "ancientmariner",
		name: "Ancient Mariner",
	},
	"monkeyseemonkeydo": {
		shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
		onUpdate: function(pokemon) {
			if (!pokemon.isStarted) return;
			let possibleTargets = pokemon.side.foe.active.filter(foeActive => foeActive && this.isAdjacent(pokemon, foeActive));
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				let ability = this.getAbility(target.ability);
				let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'zenmode'];
				if (bannedAbilities.includes(target.ability)) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, ability, '[from] ability: Monkey See Monkey Do', '[of] ' + target);
				pokemon.setAbility(ability);
				return;
			}
		},
		id: "monkeyseemonkeydo",
		name: "Monkey See Monkey Do",
	},
	"overwhelming": {
		shortDesc: "This Pokemon's moves ignore the immunities of the target. To any pokemon which resist the typing of this Pokemon's attack this Pokemon deals doubled damage.",
		onModifyMovePriority: -5,
		onModifyMove: function(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity = true;
			}
		},
		onModifyDamage: function(damage, source, target, move) {
			if (move.typeMod < 0) {
				return this.chainModify(2);
			}
		},
		id: "overwhelming",
		name: "Overwhelming",
	},
	"pixielure": {
		shortDesc: "Prevents Fairy-types from switching out.",
		onFoeTrapPokemon: function(pokemon) {
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, this.effectData.target) && pokemon.type === 'Fairy') {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, source) && pokemon.type === 'Fairy') {
				pokemon.maybeTrapped = true;
			}
		},
		id: "pixielure",
		name: "Pixie Lure",
	},
	"flowerpower": {
		shortDesc: "Increases Attack and Special Defense by 1.5x, no ifs or buts about it.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			return this.chainModify(1.5);
		},
		onModifyDefPriority: 5,
		onModifyDef: function(def, pokemon) {
			return this.chainModify(1.5);
		},
		isUnbreakable: true,
		id: "flowerpower",
		name: "Flower Power",
	},
	"guerillawarfare": {
		shortDesc: "Attacks with 60 BP or less get a 50% power boost and have the added effect of causing the user to switch out.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				return this.chainModify(1.5);
			}
		},
		onModifyMove: function(move) {
			if (move.basePower <= 60) {
				move.selfSwitch = true;
			}
		},
		id: "guerillawarfare",
		name: "Guerilla Warfare",
	},
	"lightspeed": {
		shortDesc: "This Pokemon's Speed is doubled.",
		onModifySpe: function(spe, pokemon) {
			return this.chainModify(2);
		},
		id: "lightspeed",
		name: "Light Speed",
	},
	"highstakes": {
		shortDesc: "The Attack of this Pokemon is boosted by x2.5, at the cost of loosing 25% percent accuracy on Physical moves.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.modify(atk, 2.5);
		},
		onModifyMovePriority: -1,
		onModifyMove: function(move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number') {
				move.accuracy *= 0.75;
			}
		},
		id: "highstakes",
		name: "High Stakes",
	},
	"fearshield": {
		shortDesc: "Immune to Ghost, Dark, and Bug-type moves.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Bug' || move.type === 'Dark' || move.type === 'Ghost') {
				this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				return null;
			}
		},
		id: "fearshield",
		name: "Fear Shield",
	},
	"puffycloud": {
		shortDesc: "Negates weather effects. Powers up physical attacks by a factor of 1.5 while any weather is in play.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Puffy Cloud');
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(pokemon, atk) {
			if (this.isWeather(['sunnyday', 'desolateland', 'hail', 'rainyday', 'primordialsea', 'sandstream', 'shadowsky', 'aircurrent']) && pokemon.useItem()) {
				return this.chainModify(1.5);
			}
		},
		suppressWeather: true,
		id: "puffycloud",
		name: "Puffy Cloud",
	},
	"tinkering": {
		shortDesc: "This Pokemon's status moves and moves that switch the user out have +1 priority. this Pokemon heals status conditions upon switching out..",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.category === 'Status' || move.selfSwitch === 'true') {
				return priority + 1;
			}
		},
		onModifyMove: function(move) {
			if (move && move.category === 'Status' || move.selfSwitch === 'true') {}
		},
		onCheckShow: function(pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;
			let active = pokemon.side.active;
			let cureList = [];
			let noCureCount = 0;
			for (let i = 0; i < active.length; i++) {
				let curPoke = active[i];
				// pokemon not statused
				if (!curPoke || !curPoke.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				let template = this.getTemplate(curPoke.species);
				// pokemon can't get Natural Cure
				if (Object.values(template.abilities).indexOf('Natural Cure') < 0) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!template.abilities['1'] && !template.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}
				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}
			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured
				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', "(" + cureList.length + " of " + pokemon.side.name + "'s pokemon " + (cureList.length === 1 ? "was" : "were") + " cured by Natural Cure.)");
				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = false;
				}
			}
		},
		onSwitchOut: function(pokemon) {
			if (!pokemon.status) return;
			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;
			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.setStatus('');
			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) delete pokemon.showCure;
		},
		id: "tinkering",
		name: "Tinkering",
	},
	"bamboozled": {
		shortDesc: "Immune to status moves. Status moves used by this fusion have +1 priority.",
		onImmunity: function(pokemon, move) {
			if (move.category === 'Status') return false;
		},
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
		onModifyMove: function(move) {
			if (move && move.category === 'Status') {}
		},
		id: "bamboozled",
		name: "Bamboozled",
	},
	"electronrain": {
		shortDesc: "Sp. Atk under Rain is 1.5x. Summons Rain upon switching in.",
		onStart: function(source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'kyogre') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
		},
		onModifySpAPriority: 5,
		onModifySpA: function(spa, pokemon) {
			if (this.isWeather(['rainyday', 'primordialsea'])) {
				return this.chainModify(1.5);
			}
		},
		id: "electronrain",
		name: "Electron Rain",
	},
	'prestidigitation': {
		shortDesc: "Switches item on switch in",
		onStart: function(source) {
			this.useMove('Switcheroo', source);
		},
		id: "prestidigitation",
		name: "Prestidigitation",
	},
	"revvedup": {
		shortDesc: "Users Speed is double upon switch-in.",
		onModifySpe: function(spe) {
			return this.chainModify(2);
		},
		id: "revvedup",
		name: "Revved Up",
	},
	"mistysupercharge": {
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' || move.type === 'Electric' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fairy';
				move.mistysuperchargeBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.mistysuperchargeBoosted) return this.chainModify(1.3);
		},
		onStart: function(source) {
			this.setTerrain('mistyterrain');
		},
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fairy' && this.isTerrain('mistyterrain')) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fairy' && this.isTerrain('mistyterrain')) {
				return this.chainModify(1.5);
			}
		},
		id: "mistysupercharge",
		name: "Misty Supercharge",
	},
	"grassworker": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Grass-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.5);
			}
		},
		id: "grassworker",
		name: "Grassworker",
	},
	"bubbleslip": {
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.",
		onModifyAtkPriority: 5,
		onSourceModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Bubble');
			return false;
		},
		onModifyMove: function(move) {
			if (move.type === 'Water') {
				move.selfSwitch = true;
			}
		},
		id: "bubbleslip",
		name: "Bubble Slip",
	},
	"operationovergrow": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.75 while using a Grass-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.75);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.75);
			}
		},
		id: "operationovergrow",
		name: "Operation: Overgrow",
	},
	"lightningfist": {
		shortDesc: "This Pokemon's punch-based attacks have their priorities increased by 1.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move.flags['punch']) return priority + 1;
		},
		id: "lightningfist",
		name: "Lightning Fist",
	},
	"flarewings": {
		shortDesc: "While Burned, holder's Speed is doubled; immune to Burn damage.",
		onModifySpe: function(spe, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(2);
			}
		},
		onDamagePriority: 1,
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'brn') {
				return false;
			}
		},
		id: "flarewings",
		name: "Flare Wings",
	},
	"peckingorder": {
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({
						def: -1
					}, foeactive[i], pokemon);
				}
			}
		},
		id: "peckingorder",
		name: "Pecking Order",
	},
	"hydrodynamic": {
		shortDesc: "Aloha's Speed increases by one stage at the end of every turn, prevents opponent's moves and abilities from decreasing this Pokémon's Speed stat.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({
					spe: 1
				});
			}
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				delete boost['spe'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Hydrodynamic", "[of] " + target);
			}
		},
		id: "hydrodynamic",
		name: "Hydrodynamic",
	},
	"engineer": {
		shortDesc: "60 or lower BP moves inflict 1.5x damage and ignore opponent's ability.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		onModifyMove: function(move) {
			if (move.basePower <= 60) {
				move.ignoreAbility = true;
			}
		},
		id: "engineer",
		name: "Engineer",
	},
	"soulpower": {
		shortDesc: "Doubles the user's Special Attack stat.",
		onModifySpAPriority: 5,
		onModifySpA: function(atk, pokemon) {
			return this.chainModify(2);
		},
		id: "soulpower",
		name: "Soul Power",
	},
	"landsshield": {
		shortDesc: "Halves damage taken if either at full health or hit Super Effectively, both stack.",
		onSourceModifyDamage: function (damage, source, target, move) {
                        let mod = 1;
			if (target.hp >= target.maxhp) {
				mod = mod * 0.5;
			}

			if (move.typeMod > 0) {
				mod = mod * 0.5;
                        }
                        return mod;
		},
		id: "landsshield",
		name: "Land's Shield",
	},
	"godlikepowers": {
		shortDesc: "This Pokemon's Attack is doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.chainModify(2);
		},
		onModifySpAPriority: 5,
		onModifySpA: function(spa) {
			return this.chainModify(2);
		},
		onModifyDefPriority: 5,
		onModifyDef: function(def) {
			return this.chainModify(2);
		},
		onModifySpDPriority: 5,
		onModifySpD: function(spd) {
			return this.chainModify(2);
		},
		onModifySpe: function(spe) {
			return this.chainModify(2);
		},
		id: "godlikepowers",
		name: "Godlike Powers",
	},
	"softenup": {
		shortDesc: "On switch-in, the foe's Attack and Special Attack are lowered by one stage. When this Pokémon knocks out an opponent, its Attack and Special Attack are raised by one stage.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Soften Up', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({
						atk: -1,
						spa: -1
					}, foeactive[i], pokemon);
				}
			}
		},
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({
					atk: 1,
					spa: 1
				}, source);
			}
		},
		id: "softenup",
		name: "Soften Up",
	},
	"mistymind": {
		desc: "This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
		id: "mistymind",
		name: "Misty Mind",
		onSetStatus: function(status, target, source, effect) {
			if (effect && effect.status) {
				this.add('-activate', target, 'move: Misty Mind');
			}
			return false;
		},
		onAnyModifyBoost: function(boosts, target) {
			let source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
	},
	"unstablevoltage": {
		shortDesc: "Attacks that either target this Pokémon or are used by it have perfect accuracy. Ignores abilities when attacking and attacked.",
		onAnyAccuracy: function(accuracy, target, source, move) {
			if (move && (source === this.effectData.target || target === this.effectData.target)) {
				return true;
			}
			return accuracy;
		},
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Unstable Voltage');
		},
		onModifyMove: function(move) {
			move.ignoreAbility = true;
		},
		id: "unstablevoltage",
		name: "Unstable Voltage",
	},
	"hugebubble": {
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved. When it has 1/3 or less of its max HP, its Water power is 3x instead of 2x.",
		onModifyAtkPriority: 5,
		onSourceModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			} else if (move.type === 'Water' & attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(3);
			}
		},
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			} else if (move.type === 'Water' & attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(3);
			}
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Huge Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Bubble');
			return false;
		},
		id: "hugebubble",
		name: "Huge Bubble",
	},
	"ambition": {
		shortDesc: "This Pokemon's moves ignore screens, Aurora Veil, Substitutes, Mist, Safeguard, accuracy drops, and evasion boosts.",
		onModifyMove: function(move) {
			move.infiltrates = true;
		},
		onModifyMove: function(move) {
			move.ignoreEvasion = true;
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0) {
				delete boost['accuracy'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "accuracy", "[from] ability: Ambition", "[of] " + target);
			}
		},
		id: "ambition",
		name: "Ambition",
	},
	"poweroftwo": {
		shortDesc: "This Pokemon's Attack and Speed is doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.chainModify(2);
		},
		onModifySpe: function(spe) {
			return this.chainModify(2);
		},
		id: "poweroftwo",
		name: "Power of Two",
	},
	"chlorocoat": {
		shortDesc: "This Pokemon's Speed and Defense is doubled.",
		onModifyDefPriority: 5,
		onModifyDef: function(def) {
			return this.chainModify(2);
		},
		onModifySpe: function(spe) {
			return this.chainModify(2);
		},
		id: "chlorocoat",
		name: "Chlorocoat",
	},
	"photosynthesissurge": {
		shortDesc: "On switch-in, this Pokemon summons Sun + Grassy Terrain.",
		onStart: function(source) {
			this.setTerrain('grassyterrain');
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'groudon') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('sunnyday');
		},
		id: "photosynthesissurge",
		name: "Photosynthesis Surge",
	},
	"blacksmith": {
		shortDesc: "Traps in Fire and Steel types, and absorbs moves of these typed to get a boost on it's Fire-Type attacks.",
		onFoeTrapPokemon: function(pokemon) {
			if (pokemon.hasType('Steel') || pokemon.hasType('Fire') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType('Steel') || pokemon.hasType('Fire')) && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire' || move.type === 'Steel') {
				move.accuracy = true;
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Blacksmith');
					target.addVolatile('flashfire');
				}
				return null;
			}
		},
		onEnd: function(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(target) {
				this.add('-start', target, 'ability: Blacksmith');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(1.5);
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'ability: Blacksmith', '[silent]');
			},
		},
		id: "blacksmith",
		name: "Blacksmith",
	},
	"magicalice": {
		shortDesc: "This Pokemon cannot have stats lowered, nor can it be confused.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Magical Ice", "[of] " + target);
		},
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Magical Ice');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile: function (status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit: function (target, source, move) {
			if (move && move.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Magical Ice');
			}
		},
		id: "magicalice",
		name: "Magical Ice",
	},
	"codeunkown": {
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Code Unknown', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({
						atk: -1,
						spa: -1
					}, foeactive[i], pokemon);
				}
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "codeunkown",
		name: "Code Unknown",
	},
	"thermophilic": {
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Fire moves; Fire immunity. It also heals 1/8 of its max HP every turn in Sun.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Thermophilic');
				}
				return null;
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.heal(target.maxhp / 8, target, target);
			}
		},
		id: "thermophilic",
		name: "Thermophilic",
	},
	"planinaction": {
		shortDesc: "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark-type move.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Plan In Action');
			this.boost({
				atk: 1
			});
		},
		onAnyBasePower: function(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark' || move.auraBoost) return;
			move.auraBoost = move.hasAuraBreak ? 0x0C00 : 0x1547;
			return this.chainModify([move.auraBoost, 0x1000]);
		},
		id: "planinaction",
		name: "Plan In Action",
	},
	"enchantedskull": {
		shortDesc: "This Pokemon's attacks with recoil damage have 1.5x power and the recoil damage is nullified.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
		id: "enchantedskull",
		name: "Enchanted Skull",
	},
	"thunderstormsurge": {
		shortDesc: "On switch-in, this Pokemon summons Rain + Electric Terrain.",
		onStart: function(source) {
			this.setTerrain('electricterrain');
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'kyogre') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
		},
		id: "thunderstormsurge",
		name: "Thunderstorm Surge",
	},
	"movemadness": {
		shortDesc: "This Pokemon's moves of the following types change types and get a 1.5x power boost: Normal type moves become Ground type, Ground type moves become Electric type, Electric type moves become Steel type, -Steel type moves become Rock type and Rock type moves become Normal type.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Ground';
				move.madnessBoosted = true;
			} else if (move.type === 'Ground' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Electric';
				move.madnessBoosted = true;
			} else if (move.type === 'Electric' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Steel';
				move.madnessBoosted = true;
			} else if (move.type === 'Steel' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Rock';
				move.madnessBoosted = true;
			} else if (move.type === 'Rock' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Normal';
				move.madnessBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.madnessBoosted) return this.chainModify(1.5);
		},
		id: "movemadness",
		name: "Move Madness",
	},
	"lightarmor": {
		shortDesc: "Boosts defense by 1.5x when over 1/3 HP. Doubles speed when under 1/3 HP.",
		onModifyDefPriority: 5,
		onModifyDef: function(def, pokemon) {
			if (pokemon.hp > pokemon.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe: function(spe, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify(2);
			}
		},
		id: "lightarmor",
		name: "Light Armor",
	},
	"cleanaura": {
		shortDesc: "This Pokemon is immune to major status conditions.",
		onSetStatus: function(status, target, source, effect) {
			if (effect && effect.status) {
				this.add('-activate', target, 'move: Clean Aura');
			}
			return false;
		},
		id: "cleanaura",
		name: "Clean Aura",
	},
	"brainfreezesurge": {
		shortDesc: "On switch-in, this Pokemon summons Hail + Psychic Terrain.",
		onStart: function(source) {
			this.setTerrain('psychicterrain');
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'kyogre') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('hail');
		},
		id: "brainfreezesurge",
		name: "Brainfreeze Surge",
	},
	"fattrap": {
		shortDesc: "Traps Pokémon of the Fire, Ice or Steel types and takes half damage from moves of those types.",
		onFoeTrapPokemon: function(pokemon) {
			if (pokemon.hasType('Steel') || pokemon.hasType('Fire') || pokemon.hasType('Ice') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType('Steel') || pokemon.hasType('Fire') || pokemon.hasType('Ice')) && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire' || move.type === 'Steel' || move.type === 'Ice') mod /= 2;
			return this.chainModify(mod);
		},
		id: "fattrap",
		name: "Fat Trap",
	},
	"authority": {
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.category === 'Physical') {
				return priority + 1;
			}
		},
		onModifyMove: function(move) {
			if (move && move.category === 'Physical') {
				move.pranksterBoosted = true;
			}
		},
		id: "authority",
		name: "Authority",
	},
	"firebgone": {
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.5x power; Fire Immunity.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Fire' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fairy';
				move.bgoneBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.bgoneBoosted) return this.chainModify(1.5);
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.add('-immune', target, '[msg]', '[from] ability: Fire-B-Gone');
				return null;
			}
		},
		id: "firebgone",
		name: "Fire-B-Gone",
	},
	"lethalleafage": {
		shortDesc: "This Pokemon's contact and Grass-type moves are boost 1.3x. These boosts stack.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['contact'] || move.type === 'Grass') {
				return this.chainModify(1.3);
			} else if (move.flags['contact'] && move.type === 'Grass') {
				return this.chainModify(1.69);
			}
		},
		id: "lethalleafage",
		name: "Lethal Leafage",
	},
	"sandmistsurge": {
		shortDesc: "On switch-in, this Pokemon summons Sandstorm + Misty Terrain.",
		onStart: function(source) {
			this.setTerrain('mistyterrain');
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'groudon') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('sandstream');
		},
		id: "sandmistsurge",
		name: "Sandmist Surge",
	},
	"compactboost": {
		shortDesc: "Boosts Defense by two stages + highest non-hp non-def stat by one stage upon KOing a foe.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				let secondBest = 'spa';
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
						secondBest = source.stats > bestStat;
					}
				}
				if (stat !== 'def') {
					this.boost({
						[stat]: 1
					}, source);
				} else if (stat === 'def') {
					this.boost({
						[secondBest]: 1
					}, source);
				}
				this.boost({
					def: 2
				}, source);
			}
		},
		id: "compactboost",
		name: "Compact Boost",
	},
	"meteorshower": {
		shortDesc: "This Pokemon's Normal-type moves become Rock-type and have 1.5x power. All Rock-type Pokemon on the field have +50% Special Defense.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Rock';
				move.meteorshowerBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.meteorshowerBoosted) return this.chainModify(1.5);
		},
		onModifySpDPriority: 4,
		onModifySpD: function(spd, pokemon) {
			if (pokemon.type === 'Rock') {
				return this.chainModify(1.5);
			}
		},
		id: "meteorshower",
		name: "Meteor Shower",
	},
	"blackhole": {
		shortDesc: "This Pokemon receives 1/2 damage from supereffective attacks. Immune to burn.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				return this.chainModify(0.5);
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Black Hole');
			return false;
		},
		isUnbreakable: true,
		id: "blackhole",
		name: "Black Hole",
	},
	"gracefulanalyst": {
		shortDesc: "60% power boosting Analytic + Serene Grace",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon) {
			let boosted = true;
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (const target of allActives) {
				if (target === pokemon) continue;
				if (this.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				return this.chainModify(1.6);
			}
		},
		onModifyMovePriority: -2,
		onModifyMove: function(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					// @ts-ignore
					secondary.chance *= 2;
				}
			}
		},
		id: "gracefulanalyst",
		name: "Graceful Analyst",
	},
	"underwaterscreen": {
		shortDesc: "While this Pokemon is active, Water and Rock-Type Pokemon Special Defense is boosted by 50%. Raises the power of Water and Rock-type moves by 50% when at 1/2 HP or less.",
		onModifySpDPriority: 4,
		onModifySpD: function(spd, pokemon) {
			if (pokemon.type === 'Rock' || pokemon.type === 'Water') {
				return this.chainModify(1.5);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Rock' && attacker.hp <= attacker.maxhp / 2) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Rock' && attacker.hp <= attacker.maxhp / 2) {
				return this.chainModify(1.5);
			}
		},
		id: "underwaterscreen",
		name: "Underwater Screen",
	},
	"mountainclimber": {
		shortDesc: "Speed under Hail or Sand is 2.5x, immunity to both.",
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather('hail') || this.isWeather('sandstorm')) {
				return this.chainModify(2.5);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail' || type === 'sandstorm') return false;
		},
		id: "mountainclimber",
		name: "Mountain Climber",
	},
	"monarchoftherain": {
		shortDesc: "Speed under Hail or Sand is 2.5x, immunity to both.",
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather('hail') || this.isWeather('sandstorm')) {
				return this.chainModify(2.5);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail' || type === 'sandstorm') return false;
		},
		id: "monarchoftherain",
		name: "Monarch of the Rain",
	},
	"dukeofthelightning": {
		shortDesc: "This Pokemon's Speed is doubled.",
		onModifySpe: function(spe) {
			return this.chainModify(2);
		},
		id: "dukeofthelightning",
		name: "Duke of the Lightning",
	},
	"emperorofthefire": {
		shortDesc: "This Pokemon's Attack is doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.chainModify(2);
		},
		id: "emperorofthefire",
		name: "Emperor of the Fire",
	},
	"overloadedhelm": {
		shortDesc: "This Pokemon's Steel and Normal-type attacks have their power multiplied 1.5x and turns them into Electric moves.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Steel' || move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Electric';
				move.overloadedhelmBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.overloadedhelmBoosted) return this.chainModify(1.5);
		},
		id: "overloadedhelm",
		name: "Overloaded Helm",
	},
	"unrivaledclaws": {
		shortDesc: "This Pokemon's contact moves have their power multiplied by 1.67.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify(1.67);
			}
		},
		id: "unrivaledclaws",
		name: "Unrivaled Claws",
	},
	"ouroboros": {
		shortDesc: "Upon scoring a KO or switching out, the user regains 1/3 max HP.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.heal(target.maxhp / 3);
			}
		},
		id: "ouroboros",
		name: "Ouroboros",
	},
	"braveheart": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				return this.chainModify(0.75);
			}
		},
		onHit: function(target, source, move) {
			if (move.typeMod > 0) {
				target.setBoost({
					atk: 2
				});
				this.add('-setboost', target, 'atk', 4, '[from] ability: Braveheart');
			}
		},
		id: "braveheart",
		name: "Braveheart",
	},
	"darklight": {
		shortDesc: "Provides inmunity to super effective attacks and heals 25% of its health instead. This Ability cannot be ignored.",
		onImmunity: function(move) {
			if (move.typeMod > 0) return false;
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.typeMod > 0) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Dark Light');
				}
				return null;
			}
		},
		isUnbreakable: true,
		id: "darklight",
		name: "Dark Light",
	},
	"ancientfoilage": {
		shortDesc: "While this Pokemon is active, Grass and Rock-Type Pokemon Special Defense is boosted by 50%. Raises the power of Grass and Rock-type moves by 50% when at 1/2 HP or less.",
		onModifySpDPriority: 4,
		onModifySpD: function(spd, pokemon) {
			if (pokemon.type === 'Rock' || pokemon.type === 'Grass') {
				return this.chainModify(1.5);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Rock' && attacker.hp <= attacker.maxhp / 2) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Rock' && attacker.hp <= attacker.maxhp / 2) {
				return this.chainModify(1.5);
			}
		},
		id: "ancientfoilage",
		name: "Ancient Foliage",
	},
	"prodigy": {
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 2.35. Does affect Struggle.",
		shortDesc: "This Pokemon's moves of 60 power or less have 2.25x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				return this.chainModify(2.25);
			}
		},
		id: "prodigy",
		name: "Prodigy",
	},
	"toothick": {
		shortDesc: "This Pokemon takes half the damage from physical attacks.",
		onModifyDefPriority: 6,
		onModifyDef: function(def, move) {
			if (move.category === 'Physical') {
				return this.chainModify(2);
			}
		},
		id: "toothick",
		name: "Too Thick",
	},
	"techfur": {
		shortDesc: "This Pokemon's moves of 60 power or less have 3x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				return this.chainModify(3);
			}
		},
		id: "techfur",
		name: "Tech Fur",
	},
	"soundsoul": {
		shortDesc: "Attack is raised by 1 stage when hit by sound-based moves. Receives no damage from sound-based moves.",
		onImmunity: function(move, pokemon) {
			if (move.flags['sound']) return false;
		},
		onHit: function(target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.flags['sound']) {
				target.setBoost({
					atk: 1
				});
				this.add('-setboost', target, 'atk', 1, '[from] ability: Anger Point');
			}
		},
		id: "soundsoul",
		name: "Sound Soul",
	},
	"phasethrough": {
		shortDesc: "Frisk + Natural Care",
		onStart: function(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				if (target.item) {
					this.add('-item', target, target.getItem().name, '[from] ability: Phase Through', '[of] ' + pokemon, '[identify]');
				}
			}
		},
		onCheckShow: function(pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;
			let cureList = [];
			let noCureCount = 0;
			for (const curPoke of pokemon.side.active) {
				// pokemon not statused
				if (!curPoke || !curPoke.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				let template = this.getTemplate(curPoke.species);
				// pokemon can't get Natural Cure
				if (Object.values(template.abilities).indexOf('Natural Cure') < 0) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!template.abilities['1'] && !template.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}
				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}
			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (const pokemon of cureList) {
					pokemon.showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured
				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', "(" + cureList.length + " of " + pokemon.side.name + "'s pokemon " + (cureList.length === 1 ? "was" : "were") + " cured by Natural Cure.)");
				for (const pokemon of cureList) {
					pokemon.showCure = false;
				}
			}
		},
		onSwitchOut: function(pokemon) {
			if (!pokemon.status) return;
			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;
			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Phase Through');
			pokemon.setStatus('');
			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) delete pokemon.showCure;
		},
		id: "phasethrough",
		name: "Phase Through",
	},
	"us": {
		shortDesc: "Immune to priority & status moves.",
		onImmunity: function(pokemon, move) {
			if (move.category === 'Status' || move.priority > 0) return false;
		},
		id: "us",
		name: "US",
	},
	"healthymeal": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks and cannot be inflicted with any major status condition.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				return this.chainModify(0.75);
			}
		},
		onAllySetStatus: function(status, target, source, effect) {
			if (effect && effect.status) {
				this.add('-activate', target, 'ability: Healthy Meal');
				return false;
			}
		},
		id: "healthymeal",
		name: "Healthy Meal",
	},
	"christmasspirit": {
		shortDesc: "Halves super-effective damage. Halves damage from Fire and Ice-typed moves. These stack. Cannot be bypassed by Mold Breaker or similar effects.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				return this.chainModify(0.75);
			}
		},
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		isUnbreakable: true,
		id: "christmasspirit",
		name: "Christmas Spirit",
	},
	"scrumptious": {
		shortDesc: "If this Pokemon is statused, its Attack & SpA is 1.5x; ignores burn halving physical damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "scrumptious",
		name: "Scrumptious",
	},
	"heatseeker": {
		shortDesc: "When this Pokemon is at 33.3% of its health or less, its Speed and the power of its Fire-type moves go up by 1.5x. When in rain, its speed and power of Fire moves is doubled (which essentially means that its Fire-type moves ignore the rain debuff.)",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				return this.chainModify(1.5);
			}
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
		onModifySpe: function(spe, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify(1.5);
			}
		},
		id: "heatseeker",
		name: "Heat Seeker",
	},
	"bingobongo": {
		shortDesc: "Normal and Fighting-type moves have 1.5x power and can hit Ghost-types.",
		onBasePowerPriority: 8,
		onBasePower: function(move) {
			if (move.type === 'Normal' || move.type === 'Fighting') {
				return this.chainModify(1.5);
			}
		},
		onModifyMovePriority: -5,
		onModifyMove: function(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		id: "bingobongo",
		name: "Bingo Bongo",
	},
	"panicmode": {
		shortDesc: "This Pokemon's moves have +1 priority when this Pokemon is burned, paralyzed, or poisoned. Ignores the burn Attack drop.",
		onModifyPriority: function(priority, move, effect) {
			if (effect.id === 'psn' || effect.id === 'tox' || effect.id === 'brn' || effect.id === 'par') return priority + 1;
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.effect.id === 'brn') {
				return this.chainModify(2);
			}
		},
		id: "panicmode",
		name: "Panic Mode",
	},
	"positivity": {
		shortDesc: "This Pokemon's stat changes are amplified to 3x their normal amount.",
		onBoost: function(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= 3;
			}
		},
		id: "positivity",
		name: "Positivity",
	},
	"fisticuffs": {
		shortDesc: "Punching moves get a 50% boost in power. All other contact moves get a 33% boost.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				return this.chainModify(1.5);
			} else if (move.flags['contact'] && !move.flags['punch']) {
				return this.chainModify(1.3);
			}
		},
		id: "fisticuffs",
		name: "Fisticuffst",
	},
	"starburst": {
		shortDesc: "This Pokémon's moves with 60 Base Power or less or that have a secondary effect have their base power doubled. These effects stack.",
		onModifyMovePriority: -2,
		onModifyMove: function(move) {
			if (move.secondaries && move.basePower <= 60) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					// @ts-ignore
					secondary.chance *= 2;
				}
			}
		},
		id: "starburst",
		name: "Starburst",
	},
	"faefist": {
		shortDesc: "This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				return this.chainModify(1.7);
			} else if (move.type === 'Fairy') {
				return this.chainModify(1.2);
			} else if (move.flags['punch'] && move.type === 'Fairy') {
				return this.chainModify(2.04);
			}
		},
		onModifyMove: function(move) {
			if (move.flags['punch']) {
				move.type === 'Fairy'
			}
		},
		id: "faefist",
		name: "Fae Fist",
	},
	"malware": {
		shortDesc: "This Pokemon's Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense at the end of each full turn on the field.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({
					spa: 1
				});
			} else if (totalspd) {
				this.boost({
					atk: 1
				});
			}
		},
		id: "malware",
		name: "Malware",
	},
	"nightmarefuel": {
		shortDesc: "Dark-type moves have 1.5x power and have a 33% chance to put the foe to sleep.",
		onModifyMovePriority: -1,
		onModifyMove: function(move) {
			if (move.category !== "Status") {
				move.secondaries.push({
					chance: 33,
					status: 'slp',
				});
			}
		},
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Dark') {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Dark') {
				return this.chainModify(1.5);
			}
		},
		id: "nightmarefuel",
		name: "Nightmare Fuel",
	},
	"snowabsorb": {
		shortDesc: "On switch-in, this Pokemon summons Hail.",
		onStart: function(source) {
			this.setWeather('hail');
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Snow Absorb');
				}
				return null;
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp / 8, target, target);
			}
		},
		id: "snowabsorb",
		name: "Snow Absorb",
	},
	"confidenceboost": {
		shortDesc: "All of this {okemon's stats are raised by 1 stage if it attacks and KOes another Pokemon.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1
				}, source);
			}
		},
		id: "confidenceboost",
		name: "Confidence Boost",
	},
	"blizzardblur": {
		shortDesc: "Summons Hail upon switch-in. This Pokemon's Speed is doubled in Hail. This Pokemon cannot be damaged by hail.",
		onStart: function(source) {
			this.setWeather('hail');
		},
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		id: "blizzardblur",
		name: "Blizzard Blur",
	},
	"frenzy": {
		shortDesc: "This Pokemon's multi-hit attacks always hit the maximum number of times and have 1.5x power.",
		onModifyMove: function(move) {
			if (move.multihit && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.multihit) {
				return this.chainModify(1.5);
			}
		},
		id: "frenzy",
		name: "Frenzy",
	},
	"solarpanel": {
		shortDesc: "This Pokemon is immune to Electric, Fire and Grass-type moves. If targetted by one, this Pokemon's Special Attack is raised by one stage, and harsh sunlight appears.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric' || move.type === 'Fire' || move.type === 'Grass') {
				this.setWeather('desolateland');
				if (!this.boost({
						spa: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Solar Panel');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function(target, source, source2, move) {
			if (move.type !== 'Electric' || move.type !== 'Fire' || move.type !== 'Grass' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Solar Panel');
				}
				return this.effectData.target;
			}
		},
		id: "solarpanel",
		name: "Solar Panel",
	},
	"icescale": {
		shortDesc: "Halves damage taken in hail. Takes no damage from Hail.",
		onModifyDefPriority: 6,
		onModifyDef: function(def, effect) {
			if (this.isWeather(['hail'])) {
				return this.chainModify(2);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD: function(spd, effect) {
			if (this.isWeather(['hail'])) {
				return this.chainModify(2);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		id: "icescale",
		name: "Ice Scale",
	},
	"synchscales": {
		shortDesc: "This Pokemon recieves 1/2 damage from attacks if it has a status condition.",
		onModifyDefPriority: 5,
		onModifyDef: function(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD: function(spd, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "synchscales",
		name: "Synch Scales",
	},
	"poisonshield": {
		shortDesc: "Takes 50% damage from attacks when HP is full. If attacked directly when HP is full, the attacker is poisoned.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				return this.chainModify(0.5);
			}
		},
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status && source.runStatusImmunity('powder') && source.hp >= source.maxhp) {
				source.setStatus('psn', target);
			}
		},
		id: "poisonshield",
		name: "Poison Shield",
	},
	"rebel": {
		shortDesc: "Boosts Attack by one stage upon switch-in and by two stages for every stat drop.",
		onStart: function(pokemon) {
			this.boost({
				atk: 1
			});
		},
		onAfterEachBoost: function(boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({
					atk: 2
				}, target, target, null, true);
			}
		},
		id: "rebel",
		name: "Rebel",
	},
	"fullsteamahead": {
		shortDesc: "Upon entering the field, this Pokémon sets up Rain. This Pokémon heals for 25% of its max HP per turn while Rain is active.",
		onStart: function(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.template.speciesid === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 4, target, target);
			}
		},
		id: "fullsteamahead",
		name: "Full Steam Ahead",
	},
	"juggernaut": {
		shortDesc: "Recoil-inducing moves have the added effect of boosting its Speed one stage when used. Does not take recoil damage.",
		onModifyMovePriority: -1,
		onModifyMove: function(move) {
			if (move.category !== "Status" && move.recoil) {
				move.secondaries.push({
					chance: 100,
					self: {
						boosts: {
							spe: 1,
						}
					}
				});
			}
		},
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		id: "juggernaut",
		name: "Juggernaut",
	},
	"flashweather": {
		shortDesc: "In Sun, absorbs Fire moves, in Rain Water, in Hail Ice, and in Sand, Rock.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire' && this.isWeather(['sunnyday', 'desolateland'])) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Weather');
				}
				return null;
			} else if (target !== source && move.type === 'Water' && this.isWeather(['raindance', 'primordialsea'])) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Weather');
				}
				return null;
			} else if (target !== source && move.type === 'Rock' && this.isWeather(['sandstorm'])) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Weather');
				}
				return null;
			} else if (target !== source && move.type === 'Ice' && this.isWeather(['hail'])) {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Weather');
				}
				return null;
			}
		},
		id: "flashweather",
		name: "Flash Weather",
	},
	"clearfocus": {
		shortDesc: "Resets stat drops at the end of each turn (including self-inflicted).",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			let activate = false;
			let boosts = {};
			for (let i in pokemon.boosts) {
				if (pokemon.boosts[i] < 0) {
					activate = true;
					boosts[i] = 0;
				}
			}
			pokemon.setBoost(boosts);
		},
		id: "clearfocus",
		name: "Clear Focus",
	},
	"charmstar": {
		shortDesc: "Moves without a secondary effect have a 20% chance to attract the opponent.",
		onModifyMovePriority: -1,
		onModifyMove: function(move) {
			if (move.category !== "Status") {
				for (const secondary of move.secondaries) {
					if (!move.secondaries) return;
				}
				move.secondaries.push({
					chance: 20,
					volatileStatus: 'attract',
				});
			}
		},
		id: "charmstar",
		name: "Charm Star",
	},
	"magicfat": {
		shortDesc: "Immune to Fire and Ice type moves as long as it holds an item.",
		onTryHit: function(target, source, move) {
			if (target !== source && target.item && move.type === 'Fire' || move.type === 'Ice') {
				this.add('-immune', target, '[msg]', '[from] ability: Magic Fat');
				return null;
			}
		},
		id: "magicfat",
		name: "Magic Fat",
	},
	"forestfire": {
		shortDesc: "Immunity to fire attacks; when hit by a fire move, the opponent takes 1/16th of their health.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.add('-immune', target, '[msg]', '[from] ability: Forest Fire');
				this.damage(source.maxhp / 8, source, source);
				return null;
			}
		},
		id: "forestfire",
		name: "Forest Fire",
	},
	"disconnect": {
		shortDesc: "The foe's same-type attack bonus (STAB) is 0.75 instead of 1.5.",
		onModifyMove: function(move, pokemon) {
			for (const target of pokemon.side.foe.active) {
				target.move.stab = 0.75;
			}
		},
		id: "disconnect",
		name: "Dis/connect",
	},
	"pondscum": {
		shortDesc: "Water-type moves have a 25% chance to flinch the foe.",
		onModifyMovePriority: -1,
		onModifyMove: function(move) {
			if (move.category !== "Status" && move.type === 'Water') {
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {}
				move.secondaries.push({
					chance: 25,
					volatileStatus: 'flinch',
				});
			}
		},
		id: "pondscum",
		name: "Pond Scum",
	},
	"compelling": {
		shortDesc: "If this Pokémon's stats are lowered, its Special Attack is raised by 2 stages, and the opponent cannot switch. This ability cannot be triggered by self-inflicted stat drops.",
		onAfterEachBoost: function(boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({
					spa: 2
				}, target, target, null, true);
				source.addVolatile('trapped', source, 'trapper')
			}
		},
		id: "compelling",
		name: "Compelling",
	},
	"stormlauncher": {
		shortDesc: "Boosts launching attacks by 50% in no weather. Doubles their power and doubles the user's speed in rain. Quarters their power and halves the users speed in the sun.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(1.5);
			} else if (move.flags['pulse'] && this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			} else if (move.flags['pulse'] && this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(0.25);
			}
		},
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			} else if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(0.5);
			}
		},
		id: "stormlauncher",
		name: "Storm Launcher",
	},
	"staticswitch": {
		shortDesc: "30% chance to paralyze the opponent whenever the user switches out.",
		onSwitchOut: function(source, target) {
			if (this.randomChance(3, 10)) {
				source.trySetStatus('par', target);
			}
		},
		id: "staticswitch",
		name: "Static Switch",
	},
	"reflex": {
		shortDesc: "Protects the Pokémon from opposing recoil and crash moves.",
		onTryHit: function(pokemon, target, move) {
			if (move.recoil || move.name === 'High Jump Kick' || move.name === 'Jump Kick') {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Reflex');
				return null;
			}
		},
		id: "reflex",
		name: "Reflex",
	},
	"clearpouch": {
		shortDesc: "When this Pokemon consumes a Berry, it regains 33% of its maximum HP and any negative stat changes are removed.",
		onEatItem: function(item, pokemon) {
			this.heal(pokemon.maxhp / 3);
			let activate = false;
			let boosts = {};
			for (let i in pokemon.boosts) {
				if (pokemon.boosts[i] < 0) {
					activate = true;
					boosts[i] = 0;
				}
			}
			pokemon.setBoost(boosts);
		},
		id: "clearpouch",
		name: "Clear Pouch",
	},
	"precision": {
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 1.5. Does affect Struggle.",
		shortDesc: "This Pokemon's moves of 60 power or less have 1.5x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 75) {
				return this.chainModify(2);
				move.technicianBoosted = true;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, move) {
			if (!move.technicianBoosted) {
				return this.modify(atk, 1.33);
			}
		},
		onModifyMovePriority: -1,
		onModifyMove: function(move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number') {
				move.accuracy *= 0.9;
			}
		},
		id: "precision",
		name: "Precision",
	},
	"sleepwalker": {
		shortDesc: "When hit by a sleeping move, Speed will increase by 1 stage. Immune to Sleep.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				pokemon.cureStatus();
				this.boost({
					spe: 1
				});
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Insomnia');
			this.boost({
				spe: 1
			});
			return false;
		},
		id: "sleepwalker",
		name: "Sleepwalker",
	},
	"absolutezero": {
		shortDesc: "Biting and normal-type moves used by this Pokemon are treated as being ice-type in addition to their usual type and receive a 30% power boost.",
		onEffectiveness: function(typeMod, type, move) {
			if (move.flags['bite'] || move.type === 'Normal') {
				return typeMod + this.getEffectiveness('Ice', type);
			}
		},
		id: "absolutezero",
		name: "Absolute Zero",
	},
	"taintedlens": {
		shortDesc: "Not very effective moves will also badly poison the target.",
		onModifyDamage: function(damage, source, target, move) {
			if (move.typeMod < 0) {
				return this.chainModify(2);
				source.setStatus('psn', target);
			}
		},
		id: "taintedlens",
		name: "Tainted Lens",
	},
	"purethug": {
		shortDesc: "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.",
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'brn' || status.id !== 'psn' || status.id !== 'tox' || status.id !== 'par' || status.id !== 'frz') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Pure Thug');
			this.boost({
				atk: 1
			});
			return false;
		},
		onUpdate: function(pokemon) {
			if (pokemon.status) {
				this.add('-activate', pokemon, 'ability: Pure Thug');
				pokemon.cureStatus();
			}
		},
		id: "purethug",
		name: "Pure Thug",
	},
	"mysticwave": {
		shortDesc: "Boosts the power of Water-type moves by 50% as long as the user holds an item.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.item) {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.item) {
				return this.chainModify(2);
			}
		},
		id: "mysticwave",
		name: "Mystic Wave",
	},
	"titanicstrength": {
		shortDesc: "If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.",
		onTakeItem: function(item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon || !pokemon.hp || pokemon.item === 'stickybarb') return;
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				pokemon.setBoost({
					atk: 6
				});
				this.add('-setboost', pokemon, 'atk', 12, '[from] ability: Titanic Strength');
			}
		},
		onAfterUseItem: function(item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon || !pokemon.hp || pokemon.item === 'stickybarb') return;
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				pokemon.setBoost({
					atk: 6
				});
				this.add('-setboost', pokemon, 'atk', 12, '[from] ability: Titanic Strength');
			}
		},
		id: "titanicstrength",
		name: "Titanic Strength",
	},
	"hygroscopy": {
		shortDesc: "Upon being hit by a water- or steel-type move, restores 1/4 of this Pokemon's maximum HP. Water- and steel-type opponents cannot switch out while this Pokemon is active.",
		onFoeTrapPokemon: function(pokemon) {
			if (pokemon.hasType('Steel') || pokemon.hasType('Water') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType('Steel') || pokemon.hasType('Water')) && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water' || move.type === 'Steel') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Hygroscopy');
				}
				return null;
			}
		},
		id: "hygroscopy",
		name: "Hygroscopy",
	},
	"wonderlust": {
		shortDesc: "This Pokemon is immune to status.",
		onSetStatus: function(status, target, source, effect) {
			if (effect && effect.status) {
				this.add('-immune', target, '[msg]', '[from] ability: Hygroscopy');
			}
			return false;
		},
		id: "wonderlust",
		name: "Wonderlust",
	},
	"prisoncell": {
		shortDesc: "Prevents adjacent Dark-type foes from choosing to switch.",
		onFoeTrapPokemon: function(pokemon) {
			if (pokemon.hasType('Dark') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType('Dark')) && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "prisoncell",
		name: "Prison Cell",
	},
	"venomglare": {
		shortDesc: "On switch-in, the bearer poisons adjacent opponents.",
		onStart: function(target, source) {
			if (!source.status) {
				source.setStatus('psn', target);
			}
		},
		id: "venomglare",
		name: "Venom Glare",
	},
	"terrorize": {
		shortDesc: "On switch-in, the bearer poisons adjacent opponents.",
		onStart: function(target, source) {
			source.addVolatile('gastroacid');
		},
		id: "terrorize",
		name: "Terrorize",
	},
	"clearlevitation": {
		shortDesc: "Immune to Ground-type attacks and non-self inflicted stat drops",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Clear Levitation');
				return null;
			}
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Clear Levitation", "[of] " + target);
		},
		id: "clearlevitation",
		name: "Clear Levitation",
	},
	"grounddrive": {
		shortDesc: "Speed is raised by 1 when hit by a Ground-type move; Ground immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Clear Levitation');
				this.boost({
					atk: 1
				});
				return null;
			}
		},
		id: "grounddrive",
		name: "Ground Drive",
	},
	"topgear": {
		shortDesc: "This Pokemon is immune to electric-type attacks and has its attack raised by one stage if it would be hit by one. This Pokemon's attacks' secondary effects are converted into a 33% power boost.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({
						atk: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Top Gear');
				}
				return null;
			}
		},
		onModifyMove: function(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([0x14CD, 0x1000]);
		},
		id: "topgear",
		name: "Top Gear",
	},
	"surgebloom": {
		shortDesc: "Allied Grass type Pokemon have their Grass STAB increased by x1.5 and their stats can't be lowered..",
		onAllyBoost: function(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add('-fail', this.effectData.target, 'unboost', '[from] ability: Surge Bloom', '[of] ' + target);
		},
		onAllySetStatus: function(status, target, source, effect) {
			if (target.hasType('Grass')) {
				if (!effect || !effect.status) return false;
				this.add('-activate', this.effectData.target, 'ability: Surge Bloom', '[of] ' + target);
				return null;
			}
		},
		onAllyModifyMove: function(move, pokemon) {
			if (pokemon.type === 'Grass' || move.type === 'Grass') {
				move.stab = 3;
			}
		},
		id: "surgebloom",
		name: "Surge Bloom",
	},
	'unparalleledtechnique': {
		shortDesc: "This Pokemon imprisons adjacent targets on switch-in.",
		onStart: function(source) {
			this.useMove('Imprison', source);
		},
		id: "unparalleledtechnique",
		name: "Unparalleled Technique",
	},
	'obliterate': {
		shortDesc: "Deletes the opponent's item upon switch-in if it isn't a Mega Stone. The deleted item is treated as if it were knocked off, so Recycle cannot recover it.",
		onStart: function(target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] ability: Obliterate', '[of] ' + source);
				}
			}
		},
		id: "obliterate",
		name: "Obliterate",
	},
	"shaggycoat": {
		shortDesc: "This Pokemon's defense stat is doubled. When at 1/3 HP or lower, this Pokemon's defense stat is tripled.",
		onModifyDefPriority: 6,
		onModifyDef: function(def, pokemon) {
			if (pokemon.hp > pokemon.maxhp / 3) {
				return this.chainModify(2);
			} else if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify(3);
			}
		},
		id: "shaggycoat",
		name: "Shaggy Coat",
	},
	"clearabsorb": {
		shortDesc: "Whenever this Pokemon's stats would be lowered, its health is restored by up to 25% instead. This does not include self-induced stat drops.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					this.heal(target.maxhp / 4);
					this.add('-ability', target, 'Clear Absorb');
				}
			}
		},
		id: "clearabsorb",
		name: "Clear Absorb",
	},
	"evaporate": {
		shortDesc: "30% chance of healing 1/4 of its max HP instead of taking damage whenever hit by a super-effective attack.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.typeMod > 0) {
				if (this.randomChance(3, 10)) {
				        if (!this.heal(target.maxhp / 4)) {
					        this.add('-immune', target, '[msg]', '[from] ability: Evaporate');
				        }
					this.add('-ability', target, 'Evaporate');
                                        return null;
				}
			}
		},
		id: "evaporate",
		name: "Evaporate",
	},
	"caestus": {
		shortDesc: "Arm, hand, and punching moves do 25% more damage where applicable and raise this Pokémon's Attack by one stage after their use.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['punch'] || move.name === 'Helping Hand' || move.name === 'Arm Thrust' || move.name === 'Hammer Arm' || move.name === 'Needle Arm') {
				return this.chainModify(1.25);
			}
		},
		onUpdate: function(move) {
			if (move.flags['punch'] || move.name === 'Helping Hand' || move.name === 'Arm Thrust' || move.name === 'Hammer Arm' || move.name === 'Needle Arm') {
				this.boost({
					atk: 1
				});
			}
		},
		id: "caestus",
		name: "Caestus",
	},
	"fusionpowered": {
		shortDesc: "This Pokémon's STAB moves do 3x damage rather than 1.5x, but have 33% recoil. Moves with a recoil element do 1.25x bonus damage.",
		onModifyMove: function(move) {
			move.stab = 3;
			if (move.stab) {
				move.recoil = [1, 3];
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return this.chainModify(1.25);
			}
		},
		id: "fusionpowered",
		name: "Fusion Powered",
	},
	"hyperprotection": {
		shortDesc: "This Pokemon is imune to Ground-Type moves. If a move against this Pokémon ended up on a Critical Hit, it won't affect the Pokémon.",
		onTryHit: function(target, source, move) {
			if (move && move.effectType === 'Move' && move.crit || move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Hyper Protection');
				return null;
			}
		},
		id: "hyperprotection",
		name: "Hyper Protection",
	},
	"sandslurp": {
		shortDesc: "Using or being the target of Ground- and Water-type moves heals this Pokémon for 1/8th of its maximum health. This increases to 1/6th in Sandstorm.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water' || move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Sand Slurp');
				this.heal(target.maxhp / 8);
				return null;
			} else if (target !== source && move.type === 'Water' || move.type === 'Ground' && this.isWeather('sandstorm')) {
				this.add('-immune', target, '[msg]', '[from] ability: Sand Slurp');
				this.heal(target.maxhp / 16);
				return null;
			}
		},
		id: "sandslurp",
		name: "Sand Slurp",
	},
	"sandystorm": {
		shortDesc: "The user summons a sandstorm, and while the user is in a sandstorm, all moves used by all pokemon cost double PP.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Sandy Storm');
			this.setWeather('sandstorm');
		},
		onDeductPP: function(target, source) {
			if (target.side === source.side && this.isWeather('sandstorm')) return;
			return 1;
		},
		id: "sandystorm",
		name: "Sandy Storm",
	},
	"hotairballoon": {
		shortDesc: "Immune to Ground type attacks. If the opponent attempts to use a Ground-type attack on this pokemon, the attacker is burned.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Hot Air Balloon');
				if (move && !source.status) {
					source.setStatus('brn', target);
				}
				return null;
			}
		},
		id: "hotairballoon",
		name: "Hot Air Balloon",
	},
	"fatalgrace": {
		shortDesc: "If those with this ability are poisoned, they recover HP every turn and have secondary effect chances multiplied by 2.5.",
		onDamagePriority: 1,
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.maxhp / 8);
				return false;
			}
		},
		onModifyMovePriority: -2,
		onModifyMove: function(move, pokemon) {
			if (move.secondaries && pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					// @ts-ignore
					secondary.chance *= 2.5;
				}
			}
		},
		id: "fatalgrace",
		name: "Fatal Grace",
	},
	"meangirl": {
		shortDesc: "Raises Attack by 1 stage whenever a Pokemon of the same gender enters battle. This also triggers when switching in on such a Pokemon.",
		onSwitchIn: function(basePower, attacker, defender) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.boost({
						atk: 1
					});
				}
			}
		},
		onFoeSwitchIn: function(basePower, attacker, defender) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.boost({
						atk: 1
					});
				}
			}
		},
		id: "meangirl",
		name: "Mean Girl",
	},
	"serenesurge": {
		shortDesc: "Upon switching in, set Psychic Terrain. During this Psychic Terrain, all affected Pokemon's moves have their secondary effect chances doubled.",
		onStart: function(source) {
			this.setTerrain('psychicterrain');
		},
		onModifyMovePriority: -2,
		onModifyMove: function(move, target, source) {
			if (move.secondaries && this.isTerrain('psychicterrain') && !target.isGrounded() || target.isSemiInvulnerable() || target.side === source.side) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					// @ts-ignore
					secondary.chance *= 2;
				}
			}
		},
		id: "serenesurge",
		name: "Serene Surge",
	},
	"ashestoashes": {
		shortDesc: "When this Pokémon is below 50% health, the Base Power and secondary effect chance of moves with secondary effects are doubled.",
		onModifyMovePriority: -2,
		onModifyMove: function(move, pokemon) {
			if (move.secondaries && pokemon.hp <= pokemon.maxhp / 2) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					// @ts-ignore
					secondary.chance *= 2;
				}
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 2) {
				return this.chainModify(2);
			}
		},
		id: "ashestoashes",
		name: "Ashes to Ashes",
	},
	"beastbarbs": {
		shortDesc: "When hit by direct contact,the Pokémon's highest non-HP stat is boosted by one stage.",
		onAfterDamageOrder: 1,
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({
					[stat]: 1
				}, source);
			}
		},
		id: "beastbarbs",
		name: "Beast Barbs",
	},
	"subdue": {
        shortDesc: "Lowers the opponent's highest stat by one, and boosts that same stat by one on yourself upon switch-in.",
        onStart: function (pokemon) {
            let activated = false;
            for (const target of pokemon.side.foe.active) {
                let stat = 'atk';
                let bestStat = 0;
                for (let i in target.stats) {
                    if (target.stats[i] > bestStat) {
                        stat = i;
                        bestStat = target.stats[i];
                    }
                }
                if (!target || !this.isAdjacent(target, pokemon)) continue;
                if (!activated) {
                   if(pokemon.ability === "subdue") {
 							this.add('-ability', pokemon, 'Subdue', 'boost');
							}
                    activated = true;
                }
                if (target.volatiles['substitute']) {
                    this.add('-immune', target, '[msg]');
                } else {
                    this.boost({[stat]: -1}, target, pokemon);
                    this.boost({[stat]: 1}, pokemon);
                }
            }
        },
        id: "subdue",
        name: "Subdue",
    },
		"sunbath": {
		shortDesc: "Under Sun or Rain, Speed is doubled and regains 1/8 of max health at the end of the turn. Ignores Sun's Water Debuff.",
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea', 'sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland' || effect.id === 'solarsnow' || effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 8, target, target);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'solarsnow') return false;
		},
		id: "sunbath",
		name: "Sun Bath",
	},
	"pixiegrace": {
		shortDesc: "Normal-Type moves become Fairy, Moves with secondary effects have the chance of the effects happening doubled, and both Normal-Type and Moves with secondary effect gain a 1.2x boost.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fairy';
				move.pixilateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.pixilateBoosted) {
				return this.chainModify([0x1333, 0x1000]);
			} else if (move.secondaries && move.type === 'Fairy' || move.type === 'Normal') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onModifyMovePriority: -2,
		onModifyMove: function(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					// @ts-ignore
					secondary.chance *= 2;
				}
			}
		},
		id: "pixiegrace",
		name: "Pixie Grace",
	},
	"turborise": {
		shortDesc: "User is immune to Ground-type attacks. This immunity cannot be bypassed by Mold Breaker-esque effects.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				return null;
			}
		},
		isUnbreakable: true,
		id: "turborise",
		name: "Turborise",
	},
	"queenscommand": {
		shortDesc: "Immune to priority moves. Attack raised by one if hit by one.",
		onFoeTryMove: function(target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Queens Command', effect, '[of] ' + target);
				this.boost({
					atk: 1
				});
				return false;
			}
		},
		id: "queenscommand",
		name: "Queen's Command",
	},
	"soulforgeddiamond": {
		shortDesc: "This Pokemon receives 0.665x damage from supereffective attacks.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				return this.chainModify(0.665);
			}
		},
		id: "soulforgeddiamond",
		name: "Soulforged Diamond",
	},
	'slowsurge': {
		shortDesc: "Summons Trick Room for 5 turns upon entering the field; if Trick Room is already active when the holder is switched in, it will disappear from the field.",
		onStart: function(source) {
			this.useMove('Trick Room', source);
		},
		id: "slowsurge",
		name: "Slow Surge",
	},
	'petrify': {
		shortDesc: "Prevents all adjacent opponent from using sound-based moves for two turns.",
		onStart: function(pokemon) {
			for (const target of pokemon.side.foe.active) {
			if (!target || target.fainted) continue;
			target.addVolatile('throatchop');
			}
		},
		id: "petrify",
		name: "Petrify",
	},
	"triggered": {
		shortDesc: "Heals 1/4 of its max HP from Psychic-type moves and 1/8 of its max HP in Psychic Terrain; Psychic immunity. Takes 1.25x damage from Dark-type moves.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Psychic') {
					this.heal(target.maxhp / 4)
					this.add('-immune', target, '[msg]', '[from] ability: Triggered');
					return null;
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (this.isTerrain('psychicterrain')) {
				this.heal(pokemon.maxhp / 4)
				this.add('-ability', pokemon, 'Triggered');
			}
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Dark') mod *= 1.25;
			return this.chainModify(mod);
		},
		id: "triggered",
		name: "Triggered",
	},
	"sharpshooter": {
		shortDesc: "This Pokemon's attacks always result in a critical hit, but use 2 PP instead of 1.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP: function (pokemon) {
			return 1;
		},
		onModifyMove: function(move) {
			move.willCrit = true;
		},
		id: "sharpshooter",
		name: "Sharpshooter",
	},
	"rubberup": {
		shortDesc: "Whenever another Pokémon faints or has its stats lowered, this Pokémon has its Special Attack stat boosted by 2 combat stages.",
		onAfterEachBoost: function (boost, pokemon, source) {
		for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
			let statsLowered = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: 2}, pokemon, pokemon, null, true);
			}
		}
		},
		onAnyFaint: function () {
			this.boost({spa: 2}, this.effectData.target);
		},
		id: "rubberup",
		name: "Rubber Up",
	},
	"shadowguard": {
		shortDesc: "Immune to attacking moves while at full HP.",
		onTryHit: function (target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.hp = target.maxhp) {
				this.add('-immune', target, '[msg]', '[from] ability: Shadow Guard');
				return null;
			}
		},
		id: "shadowguard",
		name: "Shadow Guard",
	},
	"spiralflames": {
		shortDesc: "Stat boosts and drops are inverted on this Pokémon and ignored on the opponent.",
		onBoost: function (boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= -1;
			}
		},
		onAnyModifyBoost: function (boosts, target) {
			let source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		id: "spiralflames",
		name: "Spiral Flames",
	},
	"pixieabsorb": {
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Fairy moves; Fairy immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fairy') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Pixie Absorb');
				}
				return null;
			}
		},
		id: "pixieabsorb",
		name: "Pixie Absorb",
	},
	"peerpressure": {
		shortDesc: "The opponent's highest non-HP stat is halved.",
		onStart: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in target.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = target.stats[i];
					}
				}
				this.boost({[stat]: -2}, target);
			}
		},
		id: "peerpressure",
		name: "Peer Pressure",
	},
	"rhythm": {
		shortDesc: "At the end of every turn, Darmin switches from Darmin-Up to Darmin-Down, or vice versa.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.name === 'Darmin-Up') {
			this.add('-formechange', pokemon, 'Darmin-Down', '[msg]');
			pokemon.formeChange("Darmin-Down");
			}
			else if (pokemon.name === 'Darmin-Down') {
			this.add('-formechange', pokemon, 'Darmin-Up', '[msg]');
			pokemon.formeChange("Darmin-Up");
			}
		},
		id: "rhythm",
		name: "Rhythm",
	},
		"magicalwand": {
	shortDesc: "Critical hit ratio is raised by one stage. Transforms into Star-Butterfly after it gets a critical hit. In butterfly form, critical hit ratio is raised by two stages.",
	onModifyCritRatio: function(critRatio, pokemon) {
		if (pokemon.baseTemplate.species === 'Star') {
			return critRatio + 1;
		} else if (pokemon.template.speciesid === 'starbutterfly') {
			return critRatio + 2;
		}
	},
	onHit: function(target, source, move) {
		if (!target.hp) return;
		if (target.baseTemplate.baseSpecies === 'Star' && move && move.effectType === 'Move' && move.crit && target.template.speciesid !== 'starbutterfly') {
		this.add('-formechange', target, 'Star-Butterfly', '[msg]');
			target.formeChange("Star-Butterfly");
			this.add('-ability', target, 'Magical Wand');
		}
	},
	id: "magicalwand",
	name: "Magical Wand",
},
	"medicalexpert": {
		shortDesc: "This Pokemon's moves have 1.3x the power when inflicted with a status condition or when it moves last. These bonuses stack.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.3);
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon) {
			let boosted = true;
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (const target of allActives) {
				if (target === pokemon) continue;
				if (this.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "medicalexpert",
		name: "Medical Expert",
	},
	'badinfluence': {
		shortDesc: "When the user switches in, all opponents on the field have their stat changes inverted.",
		onStart: function(source) {
			this.useMove('Topsy-Turvy', source);
		},
		id: "badinfluence",
		name: "Bad Influence",
	},
	"scout": {
		shortDesc: "Exits the battle if it senses that the opposing Pokemon has super effective or OHKO moves.",
		onStart: function (pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					let move = this.getMove(moveSlot.move);
					if (move.category !== 'Status' && (this.getImmunity(move.type, pokemon) && this.getEffectiveness(move.type, pokemon) > 0 || move.ohko)) {
						this.add('-ability', pokemon, 'Scout');
						pokemon.switchFlag = true;
						return;
					}
				}
			}
		},
		id: "scout",
		name: "Scout",
	},
	"rejuvenation": {
		shortDesc: "Every time this Pokemon KOs another Pokemon, it heals 20% of it's HP. If this Pokemon is at full health, it's highest non-HP stat will be increased by 1 stage instead.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move' && source.hp === source.maxhp) {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
			}
			else if (effect && effect.effectType === 'Move') {
				this.heal(source.maxhp / 5);
			}
		},
		id: "rejuvenation",
		name: "Rejuvenation",
	},
	"forcedrain": {
		shortDesc: "While this Pokemon is active, attacks with secondary effects used by adjacent foes have 0.75x power and the secondary effects are nullified.",
		onModifySecondaries: function (secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.secondaries) {
				return this.chainModify(0.75);
			}
		},
		id: "forcedrain",
		name: "Force Drain",
	},
		"foundation": {
		shortDesc: "This Pokemon's STAB bonus is 2x rather than 1.5x. When this Pokemon is at or below half of its maximum HP, this Pokemon transforms into Zeeeee-Complete. Zeeeee-Complete's STAB bonus becomes 2.33x rather than 2x.",
			onModifyMove: function (move, pokemon) {
			if (pokemon.baseTemplate.species === 'Zeeeee') {
			move.stab = 2;
			}
			else if (pokemon.template.speciesid === 'zeeeeecomplete') {
			move.stab = 2.33;
			}
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies === 'Zeeeee' && pokemon.hp <= pokemon.maxhp / 2 && pokemon.template.speciesid !== 'zeeeeecomplete') {
			this.add('-formechange', pokemon, 'Zeeeee-Complete', '[msg]');
			pokemon.formeChange("Zeeeee-Complete");
			this.add('-ability', pokemon, 'Foundation');
		}
		},
		id: "foundation",
		name: "Foundation",
	},
	"barbsboost": {
		shortDesc: "When defeating an opponent or when touched by a contact move, boost the user's highest non-HP stat by one stage. An attacker loses 1/8 HP when using a contact move on this Pokémon.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, pokemon, source, move) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
			let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
			if (target && target !== source && move && move.flags['contact']) {
				this.damage(target.maxhp / 8, target, source);
				this.boost({[stat]: 1}, source);
			}
			}
		},
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
			}
		},
		id: "barbsboost",
		name: "Barbs Boost",
	},
	'atmosphericpull': {
		shortDesc: "Summons Gravity upon switch-in.",
		onStart: function(source) {
			this.useMove('Gravity', source);
		},
		id: "atmosphericpull",
		name: "Atmospheric Pull",
	},
	"trickyglare": {
		shortDesc: "Status moves have +1 priority. If the opposing Pokemon attempts to use status moves, the move will fail and their attack will drop by 1 stage.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		onTryHit: function (target, source, move) {
			if (target !== source && move.category === 'Status') {
				this.boost({atk: -1}, source, target);
				this.add('-immune', target, '[msg]', '[from] ability: Tricky Glare');
				return null;
			}
		},
		id: "trickyglare",
		name: "Tricky Glare",
	},
	"confiscation": {
		shortDesc: "Any Pokemon that tries to switch out on it will lose its item as a result.",
		onFoeSwitchOut: function (pokemon) {
			pokemon.takeItem();
			if (pokemon.item) {
			this.add('-enditem', pokemon, 'item', '[from] ability: Confiscation', '[of] ' + pokemon);
			}
		},
		onSwitchOut: function (pokemon) {
			pokemon.takeItem();
			if (pokemon.item) {
			this.add('-enditem', pokemon, 'item', '[from] ability: Confiscation', '[of] ' + pokemon);
			}
		},
		id: "confiscation",
		name: "Confiscation",
	},
	"statharvesting": {
		shortDesc: "When this Pokemon uses it's berry, it has a 50% chance to immediately re-gain it's berry. Every time this happens, this Pokemon's highest non-HP stat goes up by 1. The chance goes up to 100% in the sun. Berries cannot be harvested twice in one turn.",
		id: "statharvesting",
		name: "Stat Harvesting",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let stat = 'atk';
				let bestStat = 0;
				for (let i in pokemon.stats) {
					if (pokemon.stats[i] > bestStat) {
						stat = i;
						bestStat = pokemon.stats[i];
					}
				}
			if (this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					this.boost({[stat]: 1}, pokemon);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Stat Harvesting');
					}
				}
		},
	},
	"familiarmaneuvering": {
		shortDesc: "This Pokemon's STAB moves have +1 priority (including status moves that would be STAB).",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (pokemon.hasType(move.type)) return priority + 1;
		},
		id: "familiarmaneuvering",
		name: "Familiar Maneuvering",
	},
	"powersurge": {
		shortDesc: "Immune to Electric-type moves. When hit by one, next attack is a guaranteed crit.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
					this.add('-immune', target, '[msg]', '[from] ability: Power Surge');
					target.addVolatile('laserfocus');
					return null;
			}
		},
		id: "powersurge",
		name: "Power Surge",
	},
	"sheerfat": {
		shortDesc: "This Pokemon's attacks with secondary effects have their power multiplied 1.3x and have their effects nullified. This Pokemon takes half the damage it would normally have taken from moves with secondary effects.",
		onModifyMove: function (move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([0x14CD, 0x1000]);
		},
		onBasePowerPriority: 7,
		onFoeBasePower: function (basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.secondaries) {
				return this.chainModify(0.5);
			}
		},
		id: "sheerfat",
		name: "Sheer Fat",
	},
	"oceanshield": {
		shortDesc: "When at full HP, the holder takes half damage from moves; when the holder is hit by a non-status move while at full HP, the power of its Water-type moves is boosted by 50%.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				return this.chainModify(0.5);
			}
		},
		onAfterDamage: function(damage, target, source, move) {
			if (move && source.hp >= source.maxhp) {
				move.oceanshieldBoost = true;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.oceanshieldBoost) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.oceanshieldBoost) {
				return this.chainModify(1.5);
			}
		},
		id: "oceanshield",
		name: "Ocean Shield",
	},
	"persistentmorale": {
		shortDesc: "Takes 50% less damage from Fire, Ice, and Dark-type moves. If hit by a move of said types, Attack is raised by one stage.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Dark') {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Dark') {
				return this.chainModify(0.5);
			}
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.type === 'Dark' || effect.type === 'Fire' || effect.type === 'Ice') {
				this.boost({atk: 1});
			}
		},
		id: "persistentmorale",
		name: "Persistent Morale",
	},
	"dazzlebeast": {
		shortDesc: "Priority moves won't work against this Pokémon. Attempts to do so result in +1 to its highest non-HP stat.",
		onTryHit: function (pokemon, source, effect) {
			for (const target of pokemon.side.foe.active) {
			if ((target.side === this.effectData.source.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.add('-immune', target, '[msg]', '[from] ability: Dazzle Beast');
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
				return null;
			}
			}
		},
		id: "dazzlebeast",
		name: "Dazzle Beast",
	},
	"contagiousyawn": {
		shortDesc: "On switch-in, the opposing Pokemon's ability is changed to Truant.",
		onSwitchInPriority: 1,
		onSwitchIn: function	(pokemon, source, move) {
		for (const target of pokemon.side.foe.active) {
		let oldAbility = target.setAbility('truant', target, 'truant', true);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Truant', oldAbility, '[of] ' + target);
				}
			}
		},
		id: "contagiousyawn",
		name: "Contagious Yawn",
	},
	"enchanted": {
		shortDesc: "Immune to Fairy and Ground moves. This Pokemon's Normal type moves become Fairy type and have 1.2x power.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground' || move.type === 'Fairy') {
				this.add('-immune', target, '[msg]', '[from] ability: Clear Levitation');
				return null;
			}
		},
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fairy';
				move.pixilateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.pixilateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		id: "enchanted",
		name: "Enchanted",
	},
		"magicsponge": {
		shortDesc: "The Pokémon only takes damage from attacks. If indirect damage or a water-type attack is used on it, it will health 25% of its life instead.",
		onTryHit: function (target, source, move, effect) {
			if (target !== source && move.type === 'Water' || effect.effectType !== 'Move') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Magic Sponge');
				}
				return null;
			}
		},
		id: "magicsponge",
		name: "Magic Sponge",
	},
	"groundleecher": {
		shortDesc: "Wielder is inmune to Ground-type attacks and it heals 1/3 of its maximum HP when hit by a ground attack and on switching out.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Ground') {
				if (!this.heal(target.maxhp / 3)) {
					this.add('-immune', target, '[msg]', '[from] ability: Ground Leecher');
				}
				return null;
			}
		},
		onSwitchOut: function (pokemon) {
			pokemon.heal(pokemon.maxhp / 3);
		},
		id: "groundleecher",
		name: "Ground Leecher",
	},
	"bloodthirst": {
		shortDesc: "This Pokemon's Attack and the highest stat is raised by 1 if it attacks and KOes another Pokemon.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
				this.boost({atk: 1}, source);
			}
		},
		id: "bloodthirst",
		name: "Bloodthirst",
	},
	"electrotorrent": {
		shortDesc: "When this Pokemon enters the field, the opposing Pokemon is paralyzed and rain is set up for 5 turns.",
		onStart: function (source, pokemon) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.template.speciesid === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
			for (const target of pokemon.side.foe.active) {
			source.setStatus('par', target);
			}
		},
		id: "electrotorrent",
		name: "Electrotorrent",
	},
	"darksurge": {
		shortDesc: "On switch-in, this Pokemon summons Dark Terrain.",
		onStart: function (source) {
			this.setTerrain('darkterrain');
		},
		id: "darksurge",
		name: "Dark Surge",
	},
	"blazingbeast": {
		shortDesc: "Gets a Flash Fire boost when this Pokémon takes out another.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				source.addVolatile('flashfire')
			}
		},
		id: "blazingbeast",
		name: "Blazing Beast",
	},
	"jailbreak": {
		shortDesc: "If this Pokemon is holding an item, its speed and the power of its Dark-type moves are 1.33x. If it is not holding an item, its speed and the power of its Dark-type moves are doubled.",
		onModifySpe: function (spe, pokemon) {
			if (pokemon.item) {
				return this.chainModify(1.33);
			}
			else if (!pokemon.item) {
				return this.chainModify(2);
			}	
		},
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Dark' && attacker.item) {
				return this.chainModify(1.33);
			}
			else 	if (move.type === 'Dark' && !attacker.item) {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Dark' && attacker.item) {
				return this.chainModify(1.33);
			}
			else 	if (move.type === 'Dark' && !attacker.item) {
				return this.chainModify(2);
			}
		},
		id: "jailbreak",
		name: "Jailbreak",
	},
	"paralyzedwithfear": {
		shortDesc: "If the opponent is paralyzed, they lose 1/8 of their HP each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.side.foe.active) {
				if (!target || !target.hp) continue;
				if (target.status === 'par' || target.hasAbility('comatose')) {
					this.damage(target.maxhp / 8, target, pokemon);
				}
			}
		},
		id: "paralyzedwithfear",
		name: "Paralyzed With Fear",
	},
	"flipout": {
		shortDesc: "This Pokémon's multi-strike moves hit the maximum amount of times and deal 33% extra damage. Such moves also heal this Pokémon for 33% of the damage dealt.",
		onModifyMove: function(move) {
			if (move.multihit && move.multihit.length) {
				move.multihit = move.multihit[1];
				move.drain = [1, 3];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.multihit) {
				return this.chainModify(1.33);
			}
		},
		id: "flipout",
		name: "Flip Out",
	},
	"lastnightmare": {
		shortDesc: "When this Pokemon faints, the opponent is damaged for 25% of their max HP and falls asleep.",
		id: "lastnightmare",
		name: "Last Nightmare",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && !target.hp) {
				this.damage(source.maxhp / 4, source, target);
				source.setStatus('slp', target);
			}
		},
	},
	"adaptiveabsorption": {
		shortDesc: "Immune to STAB moves. When hit by one, restores 50% of its HP.",
		onTryHit: function (target, source, move) {
			if (target !== source && source.hasType(move.type)) {
				if (!this.heal(target.maxhp / 2)) {
					this.add('-immune', target, '[msg]', '[from] ability: Adaptive Absorption');
				}
				return null;
			}
		},
		id: "adaptiveabsorption",
		name: "Adaptive Absorption",
	},
	'brilliantbrightness': {
		shortDesc: "Resets foe's stat changes upon switch in. This pokémon cannot have it's status lowered by external means, and doing so will reduce the foe's attack by one stage.",
		onStart: function(source) {
			this.useMove('Haze', source);
		},
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					delete boost[i];
					this.boost({atk: -1}, target, source);
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Brilliant Brightness", "[of] " + target);
		},
		id: "brilliantbrightness",
		name: "Brilliant Brightness",
	},
	"recoveryshield": {
		shortDesc: "Shadow Shield + Regenerator.",
		onSwitchOut: function (pokemon) {
			pokemon.heal(pokemon.maxhp / 3);
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				return this.chainModify(0.5);
			}
		},
		isUnbreakable: true,
		id: "recoveryshield",
		name: "Recovery Shield",
	},
	"airbornelighting": {
		shortDesc: "This Pokemon draws Electric & Ground moves to itself to raise Sp. Atk by 1; Electric & Ground immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric' || move.type === 'Ground') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Airborne Lighting');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Electric' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Airborne Lighting');
				}
				return this.effectData.target;
			}
		},
		id: "airbornelighting",
		name: "Airborne Lighting",
	},
	"sonar": {
		shortDesc: "Immune to sound based and Ground-type moves.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground' || move.flags['sound']) {
				this.add('-immune', target, '[msg]', '[from] ability: S.O.N.A.R');
				return null;
			}
		},
		id: "sonar",
		name: "S.O.N.A.R",
	},
	"threateningglare": {
		shortDesc: "If another Pokémon's attack brings it down past 50% of its HP, that Pokémon is forced out.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				source.switchFlag = true;
				target.switchFlag = false;
				this.add('-activate', target, 'ability: Threatening Glare');
			}
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (!target.hp || effect.effectType === 'Move') return;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				source.switchFlag = true;
				this.add('-activate', target, 'ability: Threatening Glare');
			}
		},
		id: "threateningglare",
		name: "Threatening Glare",
	},
	"diamondshield": {
		shortDesc: "While this Pokemon is active, Rock type Pokemon receive 3/4 damage from all attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.type === 'Rock') {
				return this.chainModify(0.75);
			}
		},
		id: "diamondshield",
		name: "Diamond Shield",
	},
	"sunsteelskin": {
		shortDesc: "Immune to Water and Fire. Unaffected by stat drops (that aren't self-inflicted). If hit by a Water or Fire move, or when it would have a stat lowered, recovers 25% of its max HP. Heals 12.5% of its max HP every turn that it's in Sun. This ability cannot be bypassed.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water' || move.type === 'Fire') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				return null;
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.heal(target.maxhp / 8, target, target);
			}
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					this.heal(target.maxhp / 4);
					this.add('-ability', target, 'Clear Absorb');
				}
			}
		},
		isUnbreakable: true,
		id: "sunsteelskin",
		name: "Sunsteel Skin",
	},
	"mudabsorb": {
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water & Ground moves; Water & Ground immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water' || move.type === 'Ground') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Mud Absorb');
				}
				return null;
			}
		},
		id: "mudabsorb",
		name: "Mud Absorb",
	},
	"fluffyfur": {
		shortDesc: "This Pokemon takes 1/2 damage from contact moves, 2x damage from Fire moves. Doubled Defense.",
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		  onModifyDefPriority: 6,
		  onModifyDef: function (def) {
			return this.chainModify(2);
		},
		id: "fluffyfur",
		name: "Fluffy Fur",
	},
	"laserbeam": {
		shortDesc: "Steel-types lose 25% of their HP when switching out.",
		onFoeSwitchOut: function (pokemon) {
			if (pokemon.hasType('Steel')) {
			pokemon.damage(pokemon.maxhp / 4);
			}
		},
		id: "laserbeam",
		name: "Laser Beam",
	},
	"magnumopus": {
		shortDesc: "This Pokémon's stat boosts are inverted. This Pokémon's super-effective attacks deal 25% more damage.",
		onBoost: function (boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= -1;
			}
		},
		onModifyDamage: function (damage, source, target, move) {
			if (move && move.typeMod > 0) {
				return this.chainModify(1.25);
			}
		},
		id: "magnumopus",
		name: "Magnum Opus",
	},
	"adaptiveeye": {
		shortDesc: "This Pokemon's STAB moves have perfect accuracy.",
		onAnyAccuracy: function (accuracy, pokemon, move) {
			if (pokemon.hasType(move.type)) {
				return true;
			}
			return accuracy;
		},
		id: "adaptiveeye",
		name: "Adaptive Eye",
	},
	"aquabooster": {
		shortDesc: "Whenever this pokemon get hit with a water type move or scores a KO, the highest non-hp stat get boosted by a stage and recover ¼ of its max hp. Also has a water immunity.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
				this.heal(source.maxhp / 4);
			}
		},
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (target.stats[i] > bestStat) {
						stat = i;
						bestStat = target.stats[i];
					}
				}
					this.heal(target.maxhp / 4);
					this.boost({[stat]: 1}, target);
					this.add('-immune', target, '[msg]', '[from] ability: Aqua Booster');
				return null;
			}
		},
		id: "aquabooster",
		name: "Aqua Booster",
	},
	"gracefulexit": {
		shortDesc: "When this Pokemon switches out, the opponent flinches.",
		onSwitchOut: function (pokemon) {
			for (const target of pokemon.side.foe.active) {
			target.addVolatile('flinch');
			}
		},
		id: "gracefulexit",
		name: "Graceful Exit",
	},
	"coldbody": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be frozen.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('frz', target);
				}
			}
		},
		id: "coldbody",
		name: "Cold Body",
	},
	"dangerousaddiction": {
		shortDesc: "When this pokemon is hit by a move, the move's user lose an equal amount of HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move) {
				this.damage(damage, source, target);
			}
		},
		id: "dangerousaddiction",
		name: "Dangerous Addiction",
	},
	"rootrum": {
		shortDesc: "This Pokemon is immune to Ground and Grass-type moves.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Grass' || move.type === 'Ground') {
					this.add('-immune', target, '[msg]', '[from] ability: Root Rum');
				return null;
			}
		},
		id: "rootrum",
		name: "Root Rum",
	},
	"healinghell": {
		shortDesc: "Heals 1/8th of this pokemon health at the end of each turn. If poisoned, ignore poison damage and heals another 1/8th at the end of each turn (for a total of 1/4).",
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function(pokemon) {
			if (this.isTerrain('grassyterrain')) return;
			this.heal(pokemon.maxhp / 16);
		},
		onTerrain: function(pokemon) {
			if (!this.isTerrain('grassyterrain')) return;
			this.heal(pokemon.maxhp / 16);
		},
		onDamagePriority: 1,
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.maxhp / 8);
				return false;
			}
		},
		id: "healinghell",
		name: "Healing Hell",
	},
		"shatteredprism": {
		desc: "This Pokemon receives 3/4 damage from supereffective attacks This Pokémon’s Not-Very-Effective moves deal more damage against the foe. This Pokémon’s moves ignores the foe’s ability. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks and deals more damage with not-very-effective moves",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Shattered Prism neutralize');
				return this.chainModify(0.75);
			}
		},
		onModifyMove: function (move) {
			move.ignoreAbility = true;
		},
		onModifyDamage: function (damage, source, target, move) {
			if (move.typeMod < 0) {
				this.debug('Shattered Prism boost');
				return this.chainModify(1.75);
			}
		},
		isUnbreakable: true,
		id: "shatteredprism",
		name: "Shattered Prism",
	},
	"firewall": {
		shortDesc: "Upon switch-in, this Pokemon sets up Reflect or Light Screen depending on the opponent's higher Attacking stat. If they are tied, this Pokemon sets up Aurora Veil.",
		onStart: function (pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef > totalspd) {
				this.useMove('Reflect', pokemon);
			} else if (totalspd > totaldef) {
				this.useMove('Light Screen', pokemon);
			}
			else if (totalspd = totaldef) {
				this.useMove('Aurora Veil', pokemon);
			}
		},
		id: "firewall",
		name: "Firewall",
	},	
	"solarsnow": {
		shortDesc: "On switch-in, this Pokemon summons a combination of Sun and Hail.",
		onStart: function (source) {
			this.setWeather('solarsnow');
		},
		id: "solarsnow",
		name: "Solar Snow",
	},
	"beastguard": {
		desc: "The user is impervious to indirect damage. In situations where it would normally take indirect damage, its highest non-HP stat is boosted by one stage.",
		shortDesc: "Boosts this Pokemon's highest stat instead of taking indirect damage.",
		onDamage: function (damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
				return false;
			}
		},
		id: "beastguard",
		name: "Beast Guard",
	},
	"hardenedbody": {
		desc: "This Pokemon receives 3/4 damage from supereffective attacks. When hit by a supereffective attack, boosts all stats by one stage. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks and gets boosted all it's stats when hit by one.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Prism Armor neutralize');
				return this.chainModify(0.75);
			}
		},
		onHit: function (target, source, move) {
			if (move.typeMod > 0) {
			this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1});
				}
		},
		isUnbreakable: true,
		id: "hardenedbody",
		name: "Hardened Body",
	},
		"friskybeast": {
		shortDesc: "Upon switchin, identifies the highest invested stat of the opponent and boosts its corresponding stat by one stage.",
		onStart: function (pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in target.stats) {
					if (target.stats[i] > bestStat) {
						stat = i;
						bestStat = target.stats[i];
					}
				}
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Frisky Beast', 'boost');
					activated = true;
				}
				this.boost({[stat]: 1}, pokemon);
				
			}
		},
		id: "friskybeast",
		name: "Frisky Beast",
	},
		"uninhabitable": {
		shortDesc: "If this Pokemon is on the field, Grass-type moves won't work.",
		id: "uninhabitable",
		onAnyTryMove: function (target, source, effect) {
			if (move.type === 'Grass') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Uninhabitable', effect, '[of] ' + target);
				return false;
			}
		},
		name: "Uninhabitable",
	},
		"crushing": {
		shortDesc: "Recoil from moves used against this Pokemon is doubled.",
		onAfterDamage: function (damage, target, source, move) {
			if (effect.id === 'recoil') {
				move.recoil *= 2;
			}
		},
		id: "crushing",
		name: "crushing",
	},
		"gtolerance": {
		shortDesc: "This Pokemon is immune to moves with 1/2 or less of their PP remaining.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.pp*2 <= move.maxpp) {
				this.add('-immune', target, '[msg]', '[from] ability: G-Tolerance');
				return null;
			}
		},
		id: "gtolerance",
		name: "G-Tolerance",
	},
		"aeroform": {
		desc: "If this Pokemon is a Polyform2, its type changes to the current weather condition's type, and its ability changes so that it can summon said weather for the rest of the battle",
		shortDesc: "Changes type and ability for the rest of the battle to account for the weather, which will be summoned by the new ability.",
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Polyform2' || pokemon.transformed) return;
			let forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				forme = 'Polyform2-Sunny';
				break;
                        case 'solarsnow':
				forme = 'Polyform2-Sunsnow';
				break;
			case 'raindance':
			case 'primordialsea':
				forme = 'Polyform2-Rainy';
				break;
			case 'hail':
				forme = 'Polyform2-Snowy';
				break;
			case 'sandstorm':
				forme = 'Polyform2-Sandy';
				break;
			default:
				if (pokemon.template.speciesid !== 'polyform2') forme = 'Polyform2';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]', '[from] ability: Aeroform');
			}
		},
		id: "aeroform",
		name: "Aeroform",
	},
		"therapeutic": {
		desc: "This Pokemon is healed by 1/8 of its max HP each turn when statused; unaffected by status's secondary effects (except sleep) i.e. Poison's HP loss, Thunder Wave's Speed Drop, and Burn's Attack drop.",
		shortDesc: "This Pokemon is healed by 1/8 of its max HP each turn when statused; Statuses are ignored.",
		onDamagePriority: 1,
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox' || effect.id === 'brn') {
				this.heal(target.maxhp / 8);
				return false;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.status === 'brn') {
				return this.chainModify(2);
			}
			},
		onModifySpe: function (spe, pokemon) {
			if (pokemon.status === 'par') {
				return this.chainModify(2);
			}
			},
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
				if (pokemon.status === 'par' || pokemon.status === 'slp') {
					this.heal(target.maxhp / 8);
				}
		},
                //TODO: Allow holder to move if Frozen; Prevent Full Paralysis
		id: "therapeutic",
		name: "Therapeutic",
	},
		"recklessbody": {
		shortDesc: "The bearer's attacks with recoil or crash damage have 1.1x power and have no recoil/crash damage.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return this.chainModify(1.1);
			}
		},
               onDamage: function (damage, target, source, effect) {
		if (effect.id === 'recoil' || effect.id === 'jumpkick' || effect.id === 'highjumpkick') {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			      if (this.activeMove.id !== 'struggle') return null;
		        }
		},
		id: "recklessbody",
		name: "Reckless Body",
	},
		"weatherfront": {
		desc: "Cherform's type and form change depending on weather (Grass/fire in sun, Grass/water in rain, Grass/ice in hail, Grass/rock in sandstorm) and the Sp. Att. and Sp. Def. stats of the user and allies are boosted 50% in all weathers.",
		shortDesc: "Changes holder's secondary type in weather and buffs allies' Special stats.",
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Cherform' || pokemon.transformed) return;
			let forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
                        case 'solarsnow':
				if (pokemon.template.speciesid !== 'cherformsunny') forme = 'Cherform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.template.speciesid !== 'cherformrainy') forme = 'Cherform-Rainy';
				break;
			case 'hail':
				if (pokemon.template.speciesid !== 'cherformsnowy') forme = 'Cherform-Snowy';
				break;
			case 'sandstorm':
				if (pokemon.template.speciesid !== 'cherformsandy') forme = 'Cherform-Sandy';
				break;
			default:
				if (pokemon.template.speciesid !== 'cherform') forme = 'Cherform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]', '[from] ability: Weather Front');
			}
		},
		onModifySpAPriority: 3,
		onAllyModifySpA: function (atk) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherform') return;
			if (this.isWeather()) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD: function (spd) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherform') return;
			if (this.isWeather()) {
				return this.chainModify(1.5);
			}
		},
		id: "weatherfront",
		name: "Weather Front",
	},
	"justiceillusion": {
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack unless it's Dark-type. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage from a non-Dark-type attack.",
		onBeforeSwitchIn: function (pokemon) {
			pokemon.illusion = null;
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				if (!pokemon.side.pokemon[i].fainted) break;
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			pokemon.illusion = pokemon.side.pokemon[i];
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (target.illusion && effect && effect.effectType === 'Move' && effect.id !== 'confused' && effect.type !== 'Dark') {
				this.singleEvent('End', this.getAbility('Illusion'), target.abilityData, target, source, effect);
			}
		},
		onEnd: function (pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				let details = pokemon.template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
			}
		},
		onFaint: function (pokemon) {
			pokemon.illusion = null;
		},
		isUnbreakable: true,
		id: "justiceillusion",
		name: "Justice Illusion",
	},
		"steamsauna": {
		shortDesc: "If the opponent uses a Water-type move, this Pokemon restores 25% of its HP and 30% chance to burn each opponent; Water immunity.",
		onTryHit: function(target, source, pokemon, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Steam Sauna');
				}
				if (move && !source.status) {
					source.trySetStatus('brn', target);
				}
			        for (const target of pokemon.side.foe.active) {
                                    let activated = false;
                                    if (!target || !this.isAdjacent(target, pokemon)) continue;
				    if (!activated) {
					activated = true;
				     }
				     if (!target.volatiles['substitute'] && this.randomChance(3, 10)){
					source.trySetStatus('brn', target);
				     }
			}
				return null;
			}
		},
		id: "steamsauna",
		name: "Steam Sauna",
	},
	"smokebody": {
		shortDesc: "Damages the opposing Pokemon for 1/8 of its HP at the end of each turn while it is asleep or if it tries to lower Dank's stats, stats cannot be lowered.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.side.foe.active) {
				if (!target || !target.hp) continue;
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					this.damage(pokemon.maxhp / 8, pokemon, pokemon);
				}
			}
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					this.damage(source.maxhp / 8, source, target);
                                        delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Smoke Body", "[of] " + target);
		},
		id: "smokebody",
		name: "Smoke Body",
	},
	"strikeandpass": {
		shortDesc: "All moves at 60 base power or below get boosted by x1.5 and gain a U-Turn switching effect.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
             move.techboost = true;
				return this.chainModify(1.5);
			}
		},
		onModifyMove: function(move) {
			if (move.target && !move.nonGhostTarget && (move.target === "normal" || move.target === "any" || move.target === "randomNormal" || move.target === "allAdjacent" || move.target === "allAdjacentFoes") && move.techboost) {
				move.selfSwitch = true;
			}
		},
		id: "strikeandpass",
		name: "Strike and Pass",
	},
	"beastsfocus": {
		shortDesc: "If PokÃ©mon would be flinched, buffs highest non-HP stat by 1 instead.",
		onFlinch: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				this.boost({[stat]: 1}, source);
			}
                       return false;
                      }
		},
		id: "beastsfocus",
		name: "Beasts Focus",
	},
	"poisonveil": {
		shortDesc: "Can't have stats lowered nor can be statused; Poison is inflicted on whoever tries to inflict either on the holder.",
		onAfterSetStatus: function (status, target, source, effect) {
			target.cureStatus();
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			this.add('-activate', target, 'ability: Poison Veil');
			// @ts-ignore
			source.trySetStatus('psn', target);
		},
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				// @ts-ignore
				if (boost[i] < 0) {
					// @ts-ignore
					source.trySetStatus('psn', target);
                      delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Poison Veil", "[of] " + target);
		},
		id: "poison",
		name: "Poison Veil",
	},
	"thermogenesis": {
		shortDesc: "This Pokemon has the resistances of fire types.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Bug' || move.type === 'Grass' || move.type === 'Steel' || move.type === 'Fairy') {
				this.debug('Thermogenesis weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Bug' || move.type === 'Grass' || move.type === 'Steel' || move.type === 'Fairy') {
				this.debug('Thermogenesis weaken');
				return this.chainModify(0.5);
			}
		},
		id: "thermogenesis",
		name: "Thermogenesis",
	},
	"echo": {
		shortDesc: "This Pokemon is immune to sound moves. Whenever a Pokemon uses a sound move, it repeats that move right after.",
		onTryHit: function (target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', target, '[msg]', '[from] ability: Echo');
				let newMove = this.getMoveCopy(move.id);
				this.useMove(newMove, this.effectData.target, source);
				return null;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (move.flags['sound']) {
			this.add('-immune', this.effectData.target, '[msg]', '[from] ability: Echo');
			let newMove = this.getMoveCopy(move.id);
			this.useMove(newMove, this.effectData.target, source);
			return null;
			}
		},
		id: "echo",
		name: "Echo",
	},
	"carelessforce": {
		shortDesc: "If this pokemon is holding an item, the item does nothing and this pokemon gets a 1.5x boost to physical moves.",
		onUpdate: function(pokemon) {
                  this.add('-start', pokemon, 'Embargo', '[silent]');
                },
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.item) {
				return this.chainModify(1.5);
			}
		},
		id: "carelessforce",
		name: "Careless Force",
	},
	"photosyntheticgrace": {
		shortDesc: "If Sunny Day is active, this Pokemon's stats are doubled. In any other weather, this Pokemon's stats are quartered.",

		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
                        else if (this.isWeather()){
                                return this.chainModify(0.25);
                        }
		},
		onModifySpAPriority: 5,
		onModifySpA: function(spa) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
                        else if (this.isWeather()){
                                return this.chainModify(0.25);
                        }
		},
		onModifyDefPriority: 5,
		onModifyDef: function(def) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
                       else if (this.isWeather()){
                                return this.chainModify(0.25);
                        }
		},
		onModifySpDPriority: 5,
		onModifySpD: function(spd) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
                       else if (this.isWeather()){
                                return this.chainModify(0.25);
                        }
		},
		onModifySpe: function (spe) {
			if (this.isWeather(['sunnyday', 'desolateland', 'solarsnow'])) {
				return this.chainModify(2);
			}
                       else if (this.isWeather()){
                                return this.chainModify(0.25);
                        }
		},
		id: "photosyntheticgrace",
		name: "Photosynthetic Grace",
	},
	"completelyserious": {
		desc: "Moves of 70 BP or less gain a 33% damage bonus. They also do double damage, and the userâ€™s raw Speed is doubled, if the user consumes or is not holding a Held Item.",
		shortDesc: "Moves of 70BP or less deal x2.667 damage. Holder's raw speed is doubled if there isn't a held item.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 70) {
				this.debug('Technician boost');
				return this.chainModify(2.667);
			}
		},
		onModifySpe: function (spe, pokemon) {
			if (!pokemon.item) {
				return this.chainModify(2);
			}
		},
		id: "completelyserious",
		name: "Completely Serious",
	},
	"minefield": {
		shortDesc: "If the opponent uses a Ground-type move against this Pokemon, it becomes trapped; Ground immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				this.add('-immune', target, '[msg]', '[from] ability: Mine Field');
				source.addVolatile('trapped', source, move, 'trapper')
				return null;
			}
		},
		id: "minefield",
		name: "Mine Field",
	},
	"greekfire": {
		shortDesc: "Immune to fire type moves. If hit by one, its own fire attacks are boosted by 1.5 and the opponent loses 1/8 max HP.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Greek Fire');
				        this.damage(source.maxhp / 8, source, target);
				}
				return null;
			}
		},
		onEnd: function(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(target) {
				this.add('-start', target, 'ability: Greek Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					return this.chainModify(1.5);
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'ability: Greek Fire', '[silent]');
			}
		},
		id: "greekfire",
		name: "Greek Fire",
	},
	"grassyheal": {
		shortDesc: "Activates Grassy Terrain for 5 turns when the Pokemon enters a battle. HP is restored by 1/8th of the maximum HP every turn while Grassy Terrain is active. Immune to Poison under Grassy Terrain.",
		onStart: function (source) {
			this.setTerrain('grassyterrain');
		},
		onSetStatus: function (status, target, source, effect) {
			if (this.isTerrain('grassyterrain') && (status.id === 'psn' || status.id === 'tox')) {
				if (effect && effect.status) this.add('-immune', target, '[msg]', '[from] ability: Grassy Heal');
				return false;
			}
		},
	       onResidual: function (pokemon) {
			if (this.isTerrain('grassyterrain')) this.heal(target.maxhp / 8);
			},
		id: "grassyheal",
		name: "Grassy Heal",
	},
	"dragonhide": {
		shortDesc: "Deals 1/8 recoil to the opponent whenever this Pokemon is statused. Status effects are removed upon switching out.",
		onAfterDamage: function (damage, target, source, move) {
			if (target.status) {
				this.damage(damage/8, source, target);
			}
		},
		onSwitchOut: function(pokemon) {
			pokemon.cureStatus();
		},
		id: "dragonhide",
		name: "dragonhide",
	},
	"choochoo": {
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onBeforeMovePriority: 9,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.removeVolatile('choochoo') && pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Choo Choo');
				pokemon.cureStatus();
			}
			pokemon.addVolatile('choochoo');
		},
		effect: {
			duration: 2,
		},
		id: "choochoo",
		name: "Choo Choo",
	},
	'tollbooth': {
		shortDesc: "Pokemon that switch out while this Pokemon is active have their held item removed. If this Pokemon is not holding an item, it gains the removed item.",
		beforeTurnCallback: function (source, target) {
		  for (const side of this.sides) {
                        if (side === target.side) continue;
			if (target.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', pokemon, item.name, '[from] ability: Toll Booth', '[of] ' + source);
                                        if (!source.item) source.setItem(item);
				}
			}
                     }
		},
                //TODO: Check to see if it's implemented correctly
		id: "tollbooth",
		name: "Toll Booth",
	},
	"eyeofhorus": {
		shortDesc: "Technician + Inner Focus",
		onFlinch: false,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		id: "eyeofhorus",
		name: "Eye of Horus",
	},
	"insidioustentacles": {
		shortDesc: "This Pokemon's contact moves lower a hit target's highest stat by one stage and trap it.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function (move, source, target) {
			if (!move || !move.flags['contact']) return;
			let activated = false;
                        let stat = 'atk';
                        let bestStat = 0;
                        for (let i in target.stats) {
                            if (target.stats[i] > bestStat) {
                                stat = i;
                                bestStat = target.stats[i];
                            }
                        }
                        if (!target.volatiles['substitute']) {
                            this.boost({[stat]: -1}, target, source);
                            if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
                        }
		},
                //TODO: Check to see if it's implemented correctly
		id: "insidioustentacles",
		name: "Insidious Tentacles",
	},
	"burningheart": {
		shortDesc: "Special Attack is raised by 1 stage if this Pokemon is hit with a Fire-type attack or scores a KO. Immunity to Fire-type attacks and burns.",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Burning Heart');
				}
				return null;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Fire') {
				this.boost({spa: 1}, this.effectData.target);
			}
		},
		onUpdate: function (pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Burning Heart');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Burning Heart');
			return false;
		},
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa: 1}, source);
			}
		},
		id: "burningheart",
		name: "Burning Heart",
	},
	"ogresswamp": {
		shortDesc: "Poison heals user by 1/4 HP each turn. Secondary effects of moves are replaced with a 100% chance to badly poison the foe.",
		onDamagePriority: 1,
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.maxhp / 4);
				return false;
			}
		},
		onModifyMove: function (move, pokemon) {
			if (move.secondaries) {
				move.secondaries = [];
			        move.secondaries.push({
				chance: 100,
				status: 'tox',
				ability: this.getAbility('ogresswamp'),
			});
			}
		},
		id: "ogresswamp",
		name: "Ogre's Swamp",
	},
	"contrabubble": {
		shortDesc: "Reverses the effectiveness of Fire and Water attacks on all active Pokemon, and the effects of burn on this Pokemon.",
		onEffectiveness: function (typeMod, target, type, move) {
			if (move.type === 'Water' || move.type === 'Fire') return -typeMod;
		},
                //TODO: Check to see if this is actually implemented properly.
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.status === 'burn') {
                                //Invert Burn's reduction.
				return this.chainModify(4);
			}
		},
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.heal(target.maxhp / 16);
				return false;
			}
		},
		id: "contrabubble",
		name: "Contra-Bubble",
	},
	"brokenheart": {
		shortDesc: "Soul-Heart + Pressure",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Broken Heart');
		},
		onAnyFaint: function () {
			this.boost({spa: 1}, this.effectData.target);
		},
		onDeductPP: function (target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		id: "brokenheart",
		name: "Broken Heart",
	},
	"lazycamo": {
		shortDesc: "This Pokemon is under the effects of Protean every other turn.",
		onPrepareHit: function (source, target, move) {
			if (source.removeVolatile('lazycamo')) {
			        if (move.hasBounced) return;
			        let type = move.type;
			        if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] Lazy Camo');
			    }
			}
			source.addVolatile('lazycamo');
		},
		effect: {
			duration: 2,
		},
		id: "lazycamo",
		name: "Lazy Camo",
	},
	"fungalshield": {
		desc: "Takes half damage from direct attacks at full HP. If the shield is broken by a contact move, the offender is inflicted with either Sleep, Paralysis or Poison. Cannot be bypassed by ability ignoring abilities and moves.",
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved. Inflicts a status if a contact move breaks the shield.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Shadow Shield weaken');
				return this.chainModify(0.5);
			}
		},
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status && source.runStatusImmunity('powder') && (damage + source.hp >= source.maxhp)) {
				let r = this.random(30);
				if (r < 11) {
					source.setStatus('slp', target);
				} else if (r < 21) {
					source.setStatus('par', target);
				} else {
					source.setStatus('psn', target);
				}
			}
		},
		isUnbreakable: true,
		id: "fungalshield",
		name: "Fungal Shield",
	},
	"normalizedenemy": {
		shortDesc: "If this Pokemon is active, then enemies' moves will turn Normal-type.",
		onFoeModifyMovePriority: 1,
		onFoeModifyMove: function (move, pokemon) {
			if (!(move.isZ && move.category !== 'Status') && !['hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'weatherball'].includes(move.id)) {
				move.type = 'Normal';
			}
		},
		id: "normalizedenemy",
		name: "Normalized Enemy",
	},
	"manapotion": {
		shortDesc: "Powers up Fairy-type moves by 33%. When an item is consumed, the power of Fairy-type moves is doubled instead.",
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fairy') {
				return this.chainModify(1.33);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fairy') {
				return this.chainModify(1.33);
			}
		},
		onAfterUseItem: function (item, pokemon) {
			if (pokemon !== this.effectData.target) return;
			pokemon.addVolatile('manapotion');
		},
		onTakeItem: function (item, pokemon) {
			pokemon.addVolatile('manapotion');
		},
		onEnd: function (pokemon) {
			pokemon.removeVolatile('manapotion');
		},
		effect: {
	                onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fairy' && !attacker.item) {
				return this.chainModify(1.5);
			}
                        },
		      onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fairy' && !attacker.item) {
				return this.chainModify(1.5);
			}
		        },
		},
		id: "manapotion",
		name: "Mana Potion",
	},
	"piercinggaze": {
		desc: "This Pokémon cannot be inflicted with a move’s secondary effect. Any move with a secondary effect used against this Pokémon loses 2 PP instead of 1.",
		shortDesc: "Immune to secondary effects. Any move that would otherwise have one uses up 2PP instead of 1.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Piercing Gaze');
		},
		onDeductPP: function (target, source, moves) {
			if (target.side === source.side || !move.secondaries) return;
			return 1;
		},
		onModifySecondaries: function (secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},

		id: "piercinggaze",
		name: "Piercing Gaze",
	},
	"pressuredinnards": {
		shortDesc: "If this Pokémon is KOed with a move, that move loses all its PP.",
		id: "pressuredinnards",
		name: "Pressured Innards",
		onFaint: function (target, source, effect) {
				if (!source || source.fainted || !effect) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove && source.lastMove) {
					for (const moveSlot of source.moveSlots) {
						if (moveSlot.id === source.lastMove.id) {
							moveSlot.pp = 0;
							this.add('-activate', source, 'ability: Pressured Innards', this.getMove(source.lastMove.id).name);
						}
					}
				}
			},
	},
	"extremist": {
		desc: "Upon scoring a KO, its most proficient stat rises two stages, while its least proficient stat drops one stage.",
		shortDesc: "If it KOs another Pokemon, this Pokemon gets +2 to its highest stat and -1 to its lowest.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let statalpha = 'atk';
                                let statbeta = 'atk';
				let bestStat = 0;
                                let worstStat = source.stats['atk'];
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						statalpha = i;
						bestStat = source.stats[i];
					}
					if (source.stats[i] < worstStat) {
						statbeta = i;
						worstStat = source.stats[i];
					}
				}
                                if (bestStat !== worstStat){
				  this.boost({[statalpha]: 2, [statbeta]: -1}, source);
                                } else {
                                  //Event that literally every single stat on this mon is equal
                                  this.boost({atk: 2, spe: -1}, source);
                                }
			}
		},
		id: "extremist",
		name: "Extremist",
	},
	"quarantine": {
		shortDesc: "Attacks against this Pokémon use one extra PP. This Pokémon cannot be inflicted with status conditions of any kind, including Taunt.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Quarantine');
		},
		onDeductPP: function (target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		onUpdate: function (pokemon) {
			if (pokemon.status) {
				this.add('-activate', pokemon, 'ability: Quarantine');
				pokemon.cureStatus();
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Quarantine');
			return false;
		},
		onTryHit: function (pokemon, target, move) {
			if (move.id === 'taunt') {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Quarantine (where\'d rev get this part again?)');
				return null;
			}
		},
		id: "quarantine",
		name: "Quarantine",
	},
	"blazingcontrary": {
		shortDesc: "Inverts stat changes that happen to the user, but only if the Pokémon's HP is above 1/3 of it's HP.",
		onBoost: function (boost, target, source, effect) {
			if ((effect && effect.id === 'zpower') || target.hp > target.maxhp / 3) return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= -1;
			}
		},
		id: "blazingcontrary",
		name: "Blazing Contrary",
	},
	"optimize": {
		desc: "This Pokemon's secondary typing changes depending on what plate or Z-Crystal it is holding. This Pokemon's Normal-type moves also become that type and have 1.2x power.",
		shortDesc: "Secondary typing and Normal-type moves change to match its plate or Z-Crystal. Moves that would otherwise be Normal-type have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = pokemon.getItem().onPlate;
				move.optimizeBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.optimizeBoosted) return this.chainModify([0x1333, 0x1000]);
		},
                //TODO: Have Form Changes for A Rave-Alola
		id: "optimize",
		name: "Optimize",
	},
	"tetraforce": {
		desc: "Attacks with secondary effects lose their effects, gain a 30% boost in power and ignore hindering abilities. LO recoil gets ignored.",
		shortDesc: "This Pokemon's attacks with secondary effects have 1.3x power and ignores abilities; nullifies the effects.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Tetra Force');
		},
		onModifyMove: function (move, pokemon) {
			if (move.secondaries) {
			        move.ignoreAbility = true;
				delete move.secondaries;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([0x14CD, 0x1000]);
		},
		id: "tetraforce",
		name: "Tetra Force",
		// TODO: Ignore hindering abilities
	},
	"torrenttempo": {
		shortDesc: "Instead of being confused, this Pokémon gets a 50% boost to its Water-type moves.",
		onUpdate: function (pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Torrent Tempo');
				pokemon.removeVolatile('confusion');
            pokemon.addVolatile('torrenttempo');
			}
		},
		onHit: function (target, source, move) {
			if (move && move.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (target) {
				this.add('-start', target, 'ability: Torrent Tempo');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, attacker, defender, move) {
				if (move.type === 'Water') {
					this.debug('Torrent Tempo boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function (atk, attacker, defender, move) {
				if (move.type === 'Water') {
					this.debug('Torrent Tempo boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'ability: Torrent Tempo', '[silent]');
			},
		},
		id: "torrenttempo",
		name: "Torrent Tempo",
	},
	"torrentialrage": {
		shortDesc: "At half HP gets a 50% boost to Water moves that lasts even once outside of that range or through Mega Evolution.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
                                source.addVolatile('torrentialrage');
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (target) {
				this.add('-start', target, 'ability: Torrential Rage');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, attacker, defender, move) {
				if (move.type === 'Water') {
					this.debug('Torrential Rage boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function (atk, attacker, defender, move) {
				if (move.type === 'Water') {
					this.debug('Torrential Rage boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'ability: Torrential Rage', '[silent]');
			},
		},
		id: "torrentialrage",
		name: "Torrent Rage",
	},
	"flutteringheart": {
		shortDesc: "After another Pokemon uses a special attack, this pokemon uses the same move. Special Attack is raised by one stage after knocking out an opponent.",
		onAnyTryPrimaryHit: function (target, source, move) {
			if (target === source || move.category !== 'Special') return;
                        let newMove = this.getMoveCopy(move.id);
                        this.useMove(newMove, this.effectData.target, source);
		},
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa: 1}, source);
			}
		},
		id: "flutteringheart",
		name: "Fluttering Heart",
	},
	"vexingvalor": {
		desc: "On switch-in, the PP of all of this Pokemon's moves are halved and this Pokemon's attack is raised two stages.",
		shortDesc: "Halves all of this Pokemon's moves' PP upon switch-in, but raises Attack by two stages.",
		onStart: function (pokemon) {
			this.boost({atk: 2});
                        //TODO: Cut down its PP on every move here
		},
		onDeductPP: function (source, target) {
			return 1;
		},
		id: "vexingvalor",
		name: "Vexing Valor",
	},
	"fearless": {
		shortDesc: "The priority of all the user's Flying type attacks are at +1, as long as its attack is not lowered.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying' && pokemon.boosts.atk >= 0) return priority + 1;
		},
		id: "fearless",
		name: "Fearless",
	},
	"limbenhancers": {
		desc: "When this Pokemon knocks out an opponent, this Pokemon's highest non-HP non-Defense stat is raised by one stage along with its Defense.",
		shortDesc: "This Pokemon's Defense and other highest stat are raised by 1 if it attacks and KOes another Pokemon.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat && source.stats[i] !== pokemon.getStat('def', true, true)) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1, def: 1}, source);
			}
		},
		id: "limbenhancers",
		name: "Limb Enhancers",
	},
	"mirrormirror": {
		desc: "On switchin, transforms the foe it is facing into this Pokémon. If it was going to use a move, it uses it after it transforms.",
		shortDesc: "On switch-in, the opponent transforms into it.",
		onStart: function (pokemon) {
			if (this.activeMove && this.activeMove.id === 'skillswap') return;
			let target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				target.transformInto(pokemon, target, this.getAbility('imposter'));
			}
		},
		id: "mirrormirror",
		name: "Mirror Mirror",
	},
	"voltboost": {
		shortDesc: "Teravolt + Speed Boost.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Volt Boost');
		},
		onModifyMove: function (move) {
			move.ignoreAbility = true;
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe: 1});
			}
		},
		id: "voltboost",
		name: "Volt Boost",
	},
	"nightterror": {
		shortDesc: "No Guard + Bad Dreams.",
		onAnyAccuracy: function (accuracy, target, source, move) {
			if (move && (source === this.effectData.target || target === this.effectData.target)) {
				return true;
			}
			return accuracy;
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.side.foe.active) {
				if (!target || !target.hp) continue;
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					this.damage(target.maxhp / 8, target, pokemon);
				}
			}
		},
		id: "nightterror",
		name: "Night Terror",
	},
	"mercilessbeast": {
		shortDesc: "If it lands a hit on a poisoned Pokémon, its most proficient stat goes up by 1.",
		onSourceHit: function (target, source, move) {
			if (target && ['psn', 'tox'].includes(target.status)){
                            	if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
			}
                        }
		},
		id: "mercilessbeast",
		name: "Merciless Beast",
	},
	"ability": {
		shortDesc: "Fire-type attacking moves have their power doubled and their PP halved.",
                //TODO: PP Deduction
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Blaze boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Blaze boost');
				return this.chainModify(2);
			}
		},
		id: "ability",
		name: "Ability",
	},
	"typetrap": {
		desc: "Prevents Pokemon from leaving the battle arena if they are the same type as the Plate/Z-Crystal Nose God is holding.",
		shortDesc: "Prevents adjacent foes from choosing to switch if they match the type of a held Plate/Z-Crystal.",
                //TODO: (Possibly) implement form changes
		onFoeTrapPokemon: function (pokemon) {
			if (pokemon.hasType(pokemon.getItem().onPlate) && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType(pokemon.getItem().onPlate)) && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "typetrap",
		name: "Type Trap",
	},
	"constellation": {
		shortDesc: "Contact Moves used by the holder don't make contact; whenever the holder uses a contact move, its status is cured.",
		onModifyMove: function (move, pokemon) {
                        if (move.flags['contact']){
			      pokemon.cureStatus();
                        }
			delete move.flags['contact'];
		},
		id: "constellation",
		name: "Constellation",
	},
	"lavadive": {
                Desc: "On odd-numbered turns, Fire-type moves have 1.5x power. On even-numbered turns, Fire-type moves have 0.5x power.",
		shortDesc: "Power of Fire-type moves alternates between x1.5 and x0.5 when it attacks.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (attacker.removeVolatile('lavadive') && move.type === 'Fire') {
				this.debug('Lava Dive reduction');
				return this.chainModify(0.5);
			}
                        else if (move.type === 'Fire') {
				this.debug('Lava Dive boost');
				return this.chainModify(1.5);
                        }
			attacker.addVolatile('lavadive');
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (attacker.removeVolatile('lavadive') && move.type === 'Fire') {
				this.debug('Lava Dive reduction');
				return this.chainModify(0.5);
			}
                        else if (move.type === 'Fire') {
				this.debug('Lava Dive boost');
				return this.chainModify(1.5);
                        }
			attacker.addVolatile('lavadive');
		},
		effect: {
			duration: 2,
		},
		id: "lavadive",
		name: "Lava Dive",
	},
	"disguiseburden": {
		desc: "The first time the Pokémon is hit while its disguise is up, the damage will be negated, busting the disguise and doubling its speed. If switched back in, its disguise will still be busted, but the speed boost will be gone.",
		shortDesc: "The first hit this Pokemon takes in battle deals 0 neutral damage and doubles its Speed.",
		onDamagePriority: 1,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.template.speciesid === 'mimiblim' && !target.transformed) {
				this.add('-activate', target, 'ability: Disguise Burden');
				this.effectData.busted = true;
				target.addVolatile('disguiseburden');
				return 0;
			}
		},
		onEffectiveness: function (typeMod, target, type, move) {
			if (!this.activeTarget) return;
			let pokemon = this.activeTarget;
			if (pokemon.template.speciesid !== 'mimiblim' || pokemon.transformed || (pokemon.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates))) return;
			if (!pokemon.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate: function (pokemon) {
			if (pokemon.template.speciesid === 'mimiblim' && this.effectData.busted) {
				let template = this.getTemplate('Mimiblim-Busted');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
			}
		},
		effect: {
			onModifySpe: function (spe, pokemon) {
				return this.chainModify(2);
			},
			onEnd: function (pokemon) {
			pokemon.removeVolatile('disguiseburden');
			},
		},
		id: "disguiseburden",
		name: "Disguise Burden",
	},
	"twofaced": {
		desc: "This Pokemon's stat changes are reversed, unless they affect this Pokemon's highest non-HP stat. When this Pokemon recieves a stat change affected by the first part of this ability or knocks out an opponent, its highest non-HP stat is raised by one stage. If two stats are tied for the highest, neither of them are affected by the inverse stat changes.",
		shortDesc: "All stats except for the highest have inverted stat changes. The highest stat is boosted whenever this Pokemon lands a KO or has a different stat changed.",
		onBoost: function (boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
			for (let i in boost) {
				// @ts-ignore
                                if (source.stats[i] != bestStat){
				   boost[i] *= -1;
                                   this.boost({[stat]: 1}, source);
                                }
			}
		},
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]: 1}, source);
			}
		},
		id: "twofaced",
		name: "Two-Faced",
	},
	"genometree": {
         desc: "The user's Normal- and Fighting-type attacks ignore stat changes and Ghost's immunities. If the user attacks a boosted or Ghost-type Pokémon with a Normal- or Fighting-type attack, then the user's highest non-HP stat is boosted by 1 stage.",
		shortDesc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves. If it does so or hits a boosted Pokemon with such a move, boosts its highest stat.",
		onModifyMovePriority: -5,
		onModifyMove: function (move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onSourceHit: function (target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status' && (move.type === 'Normal' || move.type === 'Fighting')) {
				  let buffed = false;
                                  for (let i in target.boosts) { 
                                  if (target.boosts[i] > 0){
				    source.boosts[i] = target.boosts[i];
                                    buffed = true;
                                  }
                                  if (buffed === true || target.hasType('Ghost')){
				    let stat = 'atk';
				    let bestStat = 0;
				    for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				    }
				    this.boost({[stat]: 1}, source);
											 }
			}
			}
		},
		id: "genometree",
		name: "Genome Tree",
	},
	"blessedprotection": {
		shortDesc: "Infiltrator effects + when a move break this Pokémon’s substitute, that move gets disabled until the target switches out.",
		onModifyMove: function (move) {
			move.infiltrates = true;
		},
                //Code to disable moves that break the substitute is under Substitute.
		id: "blessedprotection",
		name: "Blessed Protection",
	},


	// FE End
	"absolutezero": {
		shortDesc: "Freezes foes that make contact with the user.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('frz', target);
			}
		},
		id: "absolutezero",
		name: "Absolute Zero",
	},
	"acidicpoison": {
		shortDesc: "This Pokemon can hit Steel types with Poison moves.",
		onModifyMovePriority: -5,
		onModifyMove: function(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		id: "acidicpoison",
		name: "Acidic Poison",
		rating: 3,
		num: 113,
	},
	"adaptability": {
		desc: "This Pokemon's moves that match one of its types have a same-type attack bonus (STAB) of 2 instead of 1.5.",
		shortDesc: "This Pokemon's same-type attack bonus (STAB) is 2 instead of 1.5.",
		onModifyMove: function(move) {
			move.stab = 2;
		},
		id: "adaptability",
		name: "Adaptability",
		rating: 4,
		num: 91,
	},
	"aftermath": {
		desc: "If this Pokemon is knocked out with a contact move, that move's user loses 1/4 of its maximum HP, rounded down. If any active Pokemon has the Ability Damp, this effect is prevented.",
		shortDesc: "If this Pokemon is KOed with a contact move, that move's user loses 1/4 its max HP.",
		id: "aftermath",
		name: "Aftermath",
		onAfterDamageOrder: 1,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && !target.hp) {
				this.damage(source.maxhp / 4, source, target);
			}
		},
		rating: 2.5,
		num: 106,
	},
	"aerilate": {
		desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Flying';
				if (move.category !== 'Status') pokemon.addVolatile('aerilate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "aerilate",
		name: "Aerilate",
		rating: 4,
		num: 185,
	},
	"airlock": {
		shortDesc: "While this Pokemon is active, the effects of weather conditions are disabled.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Air Lock');
		},
		suppressWeather: true,
		id: "airlock",
		name: "Air Lock",
		rating: 3,
		num: 76,
	},
	"allotropize": {
		desc: "This Pokemon's Water-type moves become Ice-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Water-type moves become Ice type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Water' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Ice';
				if (move.category !== 'Status') pokemon.addVolatile('allotropize');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "allotropize",
		name: "Allotropize",
		rating: 4,
		num: 174,
	},
	"analytic": {
		desc: "The power of this Pokemon's move is multiplied by 1.3 if it is the last to move in a turn. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon's attacks have 1.3x power if it is the last to move in a turn.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, pokemon) {
			let boosted = true;
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (let i = 0; i < allActives.length; i++) {
				let target = allActives[i];
				if (target === pokemon) continue;
				if (this.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				this.debug('Analytic boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "analytic",
		name: "Analytic",
		rating: 2.5,
		num: 148,
	},
	"ancientarmor": {
		desc: "This Pokémon's weaknesses due to its Rock typing are ignored.",
		shortDesc: "This Pokémon's weaknesses due to its Rock typing are ignored.",
		onEffectiveness: function(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && type === 'Rock' && typeMod > 0) {
				this.add('-activate', '', 'ancientarmor');
				return 0;
			}
		},
		id: "ancientarmor",
		name: "Ancient Armor",
		rating: 2.5,
		num: 148,
	},
	"angerpoint": {
		desc: "If this Pokemon, but not its substitute, is struck by a critical hit, its Attack is raised by 12 stages.",
		shortDesc: "If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.",
		onHit: function(target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({
					atk: 6
				});
				this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
			}
		},
		id: "angerpoint",
		name: "Anger Point",
		rating: 2,
		num: 83,
	},
	"anticipation": {
		desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective on this Pokemon, or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, while Hidden Power, Judgment, Natural Gift, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move.",
		onStart: function(pokemon) {
			let targets = pokemon.side.foe.active;
			for (let i = 0; i < targets.length; i++) {
				if (!targets[i] || targets[i].fainted) continue;
				for (let j = 0; j < targets[i].moveset.length; j++) {
					let move = this.getMove(targets[i].moveset[j].move);
					if (move.category !== 'Status' && (this.getImmunity(move.type, pokemon) && this.getEffectiveness(move.type, pokemon) > 0 || move.ohko)) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
		id: "anticipation",
		name: "Anticipation",
		rating: 1,
		num: 107,
	},
	"archeroflegend": {
		shortDesc: "This Pokemon's non-contact moves have their power multiplied by 1.3.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (!move.flags['contact']) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "archeroflegend",
		name: "Archer Of Legend",
		rating: 3.5,
		num: 181,
	},
	"arenatrap": {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or are airborne.",
		shortDesc: "Prevents adjacent foes from choosing to switch unless they are airborne.",
		onFoeTrapPokemon: function(pokemon) {
			if (!this.isAdjacent(pokemon, this.effectData.target)) return;
			if (pokemon.isGrounded()) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!this.isAdjacent(pokemon, source)) return;
			if (pokemon.isGrounded(!pokemon.knownType)) { // Negate immunity if the type is unknown
				pokemon.maybeTrapped = true;
			}
		},
		id: "arenatrap",
		name: "Arena Trap",
		rating: 4.5,
		num: 71,
	},
	"aromaveil": {
		desc: "This Pokemon and its allies cannot be affected by Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		shortDesc: "Protects user/allies from Attract, Disable, Encore, Heal Block, Taunt, and Torment.",
		onAllyTryAddVolatile: function(status, target, source, effect) {
			if (status.id in {
					attract: 1,
					disable: 1,
					encore: 1,
					healblock: 1,
					taunt: 1,
					torment: 1
				}) {
				if (effect.effectType === 'Move') {
					this.add('-activate', this.effectData.target, 'ability: Aroma Veil', '[of] ' + target);
				}
				return null;
			}
		},
		id: "aromaveil",
		name: "Aroma Veil",
		rating: 1.5,
		num: 165,
	},
	"aurabreak": {
		desc: "While this Pokemon is active, the effects of the Abilities Dark Aura and Fairy Aura are reversed, multiplying the power of Dark- and Fairy-type moves, respectively, by 3/4 instead of 1.33.",
		shortDesc: "While this Pokemon is active, the Dark Aura and Fairy Aura power modifier is 0.75x.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Aura Break');
		},
		onAnyTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			source.addVolatile('aurabreak');
		},
		effect: {
			duration: 1,
		},
		id: "aurabreak",
		name: "Aura Break",
		rating: 1.5,
		num: 188,
	},
	"baddreams": {
		desc: "Causes adjacent opposing Pokemon to lose 1/8 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
		shortDesc: "Causes sleeping adjacent foes to lose 1/8 of their max HP at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (!pokemon.hp) return;
			for (let i = 0; i < pokemon.side.foe.active.length; i++) {
				let target = pokemon.side.foe.active[i];
				if (!target || !target.hp) continue;
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					this.damage(target.maxhp / 8, target, pokemon);
				}
			}
		},
		id: "baddreams",
		name: "Bad Dreams",
		rating: 2,
		num: 123,
	},
	"battery": {
		shortDesc: "This Pokemon's allies have the power of their special attacks multiplied by 1.3.",
		onBasePowerPriority: 8,
		onAllyBasePower: function(basePower, attacker, defender, move) {
			if (attacker !== this.effectData.target && move.category === 'Special') {
				this.debug('Battery boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "battery",
		name: "Battery",
		rating: 0,
		num: 217,
	},
	"battlearmor": {
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
		onCriticalHit: false,
		id: "battlearmor",
		name: "Battle Armor",
		rating: 1,
		num: 4,
	},
	"battlebond": {
		desc: "If this Pokemon is a Greninja, it transforms into Ash-Greninja after knocking out a Pokemon. As Ash-Greninja, its Water Shuriken has 20 base power and always hits 3 times.",
		shortDesc: "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 20 power, hits 3x.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move' && source.template.speciesid === 'greninja' && source.hp && !source.transformed && source.side.foe.pokemonLeft) {
				this.add('-activate', source, 'ability: Battle Bond');
				let template = this.getTemplate('Greninja-Ash');
				source.formeChange(template);
				source.baseTemplate = template;
				source.details = template.species + (source.level === 100 ? '' : ', L' + source.level) + (source.gender === '' ? '' : ', ' + source.gender) + (source.set.shiny ? ', shiny' : '');
				this.add('detailschange', source, source.details);
			}
		},
		onModifyMove: function(move, attacker) {
			if (move.id === 'watershuriken' && attacker.template.species === 'Greninja-Ash') {
				move.multihit = 3;
			}
		},
		id: "battlebond",
		name: "Battle Bond",
		rating: 3,
		num: 210,
	},
	"beastboost": {
		desc: "This Pokemon's highest stat is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's highest stat is raised by 1 if it attacks and KOes another Pokemon.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({
					[stat]: 1
				}, source);
			}
		},
		id: "beastboost",
		name: "Beast Boost",
		rating: 3.5,
		num: 224,
	},
	"berserk": {
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage from an attack bringing it to 1/2 or less of its maximum HP, its Special Attack is raised by 1 stage. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 when it reaches 1/2 or less of its max HP.",
		onAfterMoveSecondary: function(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				this.boost({
					spa: 1
				});
			}
		},
		id: "berserk",
		name: "Berserk",
		rating: 2.5,
		num: 201,
	},
	"bigpecks": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Defense stat stage.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0) {
				delete boost['def'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
			}
		},
		id: "bigpecks",
		name: "Big Pecks",
		rating: 0.5,
		num: 145,
	},
	"blaze": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Fire-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Fire attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		id: "blaze",
		name: "Blaze",
		rating: 2,
		num: 66,
	},
	"bubbleguard": {
		shortDesc: "This Pokemon's Defense is doubled.",
		onModifyDefPriority: 6,
		onModifyDef: function(def) {
			return this.chainModify(2);
		},
		id: "bubbleguard",
		name: "Bubble Guard",
		rating: 3.5,
		num: 169,
	},
	"bulletproof": {
		desc: "This Pokemon is immune to ballistic moves. Ballistic moves include Bullet Seed, Octazooka, Barrage, Rock Wrecker, Zap Cannon, Acid Spray, Aura Sphere, Focus Blast, and all moves with Ball or Bomb in their name.",
		shortDesc: "Makes user immune to ballistic moves (Shadow Ball, Sludge Bomb, Focus Blast, etc).",
		onTryHit: function(pokemon, target, move) {
			if (move.flags['bullet']) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Bulletproof');
				return null;
			}
		},
		id: "bulletproof",
		name: "Bulletproof",
		rating: 3,
		num: 171,
	},
	"chargedhairs": {
		shortDesc: "Pokemon making contact with this Pokemon will be paralyzed.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('par', target);
			}
		},
		id: "chargedhairs",
		name: "Charged Hairs",
		rating: 2,
		num: 9,
	},
	"cheekpouch": {
		desc: "If this Pokemon eats a Berry, it restores 1/3 of its maximum HP, rounded down, in addition to the Berry's effect.",
		shortDesc: "If this Pokemon eats a Berry, it restores 1/3 of its max HP after the Berry's effect.",
		onEatItem: function(item, pokemon) {
			this.heal(pokemon.maxhp / 3);
		},
		id: "cheekpouch",
		name: "Cheek Pouch",
		rating: 2,
		num: 167,
	},
	"chlorophyll": {
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
		onModifySpe: function(spe) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2);
			}
		},
		id: "chlorophyll",
		name: "Chlorophyll",
		rating: 2.5,
		num: 34,
	},
	"clearbody": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Clear Body", "[of] " + target);
		},
		id: "clearbody",
		name: "Clear Body",
		rating: 2,
		num: 29,
	},
	"cloudnine": {
		shortDesc: "While this Pokemon is active, the effects of weather conditions are disabled.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Cloud Nine');
		},
		suppressWeather: true,
		id: "cloudnine",
		name: "Cloud Nine",
		rating: 3,
		num: 13,
	},
	"colorchange": {
		desc: "This Pokemon's type changes to match the type of the last move that hit it, unless that type is already one of its types. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's type changes to the type of a move it's hit by, unless it has the type.",
		onAfterMoveSecondary: function(target, source, move) {
			if (!target.hp) return;
			let type = move.type;
			if (target.isActive && move.effectType === 'Move' && move.category !== 'Status' && type !== '???' && !target.hasType(type)) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] Color Change');
				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const decision = this.willMove(target);
					if (decision && decision.move.id === 'curse') {
						decision.targetLoc = -1;
					}
				}
			}
		},
		id: "colorchange",
		name: "Color Change",
		rating: 1,
		num: 16,
	},
	"comatose": {
		desc: "This Pokemon cannot be statused, and is considered to be asleep. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "This Pokemon cannot be statused, and is considered to be asleep.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Comatose');
		},
		onSetStatus: function(status, target, source, effect) {
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Comatose');
			return false;
		},
		// Permanent sleep "status" implemented in the relevant sleep-checking effects
		isUnbreakable: true,
		id: "comatose",
		name: "Comatose",
		rating: 3,
		num: 213,
	},
	"competitive": {
		desc: "This Pokemon's Special Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function(boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({
					spa: 2
				}, null, null, null, true);
			}
		},
		id: "competitive",
		name: "Competitive",
		rating: 2.5,
		num: 172,
	},
	"compoundeyes": {
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		onSourceModifyAccuracy: function(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return accuracy * 1.3;
		},
		id: "compoundeyes",
		name: "Compound Eyes",
		rating: 3.5,
		num: 14,
	},
	"contrary": {
		shortDesc: "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.",
		onBoost: function(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				boost[i] *= -1;
			}
		},
		id: "contrary",
		name: "Contrary",
		rating: 4,
		num: 126,
	},
	"corrosion": {
		shortDesc: "This Pokemon can poison or badly poison other Pokemon regardless of their typing.",
		// Implemented in sim/pokemon.js:Pokemon#setStatus
		id: "corrosion",
		name: "Corrosion",
		rating: 2.5,
		num: 212,
	},
	"cursedbody": {
		desc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled unless one of the attacker's moves is already disabled.",
		shortDesc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled.",
		onAfterDamage: function(damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move' && !move.isFutureMove) {
				if (this.random(10) < 3) {
					source.addVolatile('disable', this.effectData.target);
				}
			}
		},
		id: "cursedbody",
		name: "Cursed Body",
		rating: 2,
		num: 130,
	},
	"cutecharm": {
		desc: "There is a 30% chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender.",
		shortDesc: "30% chance of infatuating Pokemon of the opposite gender if they make contact.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.addVolatile('attract', this.effectData.target);
				}
			}
		},
		id: "cutecharm",
		name: "Cute Charm",
		rating: 1,
		num: 56,
	},
	"damp": {
		desc: "While this Pokemon is active, Self-Destruct, Explosion, and the Ability Aftermath are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, Self-Destruct, Explosion, and Aftermath have no effect.",
		id: "damp",
		onAnyTryMove: function(target, source, effect) {
			if (effect.id === 'selfdestruct' || effect.id === 'explosion') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Damp', effect, '[of] ' + target);
				return false;
			}
		},
		onAnyDamage: function(damage, target, source, effect) {
			if (effect && effect.id === 'aftermath') {
				return false;
			}
		},
		name: "Damp",
		rating: 1,
		num: 6,
	},
	"dancer": {
		desc: "After another Pokemon uses a dance move, this Pokemon uses the same move. Moves used by this Ability cannot be copied again.",
		shortDesc: "After another Pokemon uses a dance move, this Pokemon uses the same move.",
		id: "dancer",
		onAnyAfterMove: function(source, target, move) {
			if (!this.effectData.target.hp || source === this.effectData.target || move.isExternal) return;
			if (move.flags['dance']) {
				this.faintMessages();
				this.add('-activate', this.effectData.target, 'ability: Dancer');
				this.runMove(move.id, this.effectData.target, 0, this.getAbility('dancer'), undefined, true);
			}
		},
		name: "Dancer",
		rating: 2.5,
		num: 216,
	},
	"darkaura": {
		desc: "While this Pokemon is active, the power of Dark-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, a Dark move used by any Pokemon has 1.33x power.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Dark Aura');
		},
		onAnyTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Dark') {
				source.addVolatile('aura');
			}
		},
		id: "darkaura",
		name: "Dark Aura",
		rating: 3,
		num: 186,
	},
	"dashingpunches": {
		shortDesc: "Any attacks with 80 bp or less get a +1 to priority.",
		onModifyPriority: function(priority, pokemon, target, move, basePower) {
			if (move.category !== 'Status')
				if (move.basePower < 81) return priority + 1;
		},
		id: "dashingpunches",
		name: "Dashing Punches",
		rating: 4,
	},
	"dazzling": {
		desc: "While this Pokemon is active, priority moves from opposing Pokemon targeted at allies are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, allies are protected from opposing priority moves.",
		onFoeTryMove: function(target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Dazzling', effect, '[of] ' + target);
				return false;
			}
		},
		id: "dazzling",
		name: "Dazzling",
		rating: 3.5,
		num: 219,
	},
	"defeatist": {
		desc: "While this Pokemon has 1/2 or less of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		id: "defeatist",
		name: "Defeatist",
		rating: -1,
		num: 129,
	},
	"defiant": {
		desc: "This Pokemon's Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function(boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({
					atk: 2
				}, null, null, null, true);
			}
		},
		id: "defiant",
		name: "Defiant",
		rating: 2.5,
		num: 128,
	},
	"deltastream": {
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land or Primordial Sea.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
		onStart: function(source) {
			this.setWeather('deltastream');
		},
		onAnySetWeather: function(target, source, weather) {
			if (this.getWeather().id === 'deltastream' && !(weather.id in {
					desolateland: 1,
					primordialsea: 1,
					deltastream: 1
				})) return false;
		},
		onEnd: function(pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('deltastream')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "deltastream",
		name: "Delta Stream",
		rating: 5,
		num: 191,
	},
	"desolateland": {
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Primordial Sea.",
		shortDesc: "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.",
		onStart: function(source) {
			this.setWeather('desolateland');
		},
		onAnySetWeather: function(target, source, weather) {
			if (this.getWeather().id === 'desolateland' && !(weather.id in {
					desolateland: 1,
					primordialsea: 1,
					deltastream: 1
				})) return false;
		},
		onEnd: function(pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('desolateland')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "desolateland",
		name: "Desolate Land",
		rating: 5,
		num: 190,
	},
	"disarmingpheromones": {
		desc: "While this Pokemon is active, priority moves from opposing Pokemon targeted at allies are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, allies are protected from opposing priority moves.",
		onFoeTryMove: function(target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Dazzling', effect, '[of] ' + target);
				return false;
			}
		},
		id: "disarmingpheromones",
		name: "Disarming Pheromones",
		rating: 3.5,
		num: 219,
	},
	"disguise": {
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Busted Form. Confusion damage also breaks the disguise.",
		shortDesc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage.",
		onDamagePriority: 1,
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.template.speciesid === 'mimikyu' && !target.transformed) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onEffectiveness: function(typeMod, type, move) {
			if (!this.activeTarget) return;
			let pokemon = this.activeTarget;
			if (pokemon.template.speciesid !== 'mimikyu' || pokemon.transformed) return;
			if (!pokemon.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate: function(pokemon) {
			if (pokemon.template.speciesid === 'mimikyu' && this.effectData.busted) {
				let template = this.getTemplate('Mimikyu-Busted');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
			}
		},
		id: "disguise",
		name: "Disguise",
		rating: 4,
		num: 209,
	},
	"download": {
		desc: "On switch-in, this Pokemon's Attack or Special Attack is raised by 1 stage based on the weaker combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "On switch-in, Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			let totaldef = 0;
			let totalspd = 0;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				totaldef += foeactive[i].getStat('def', false, true);
				totalspd += foeactive[i].getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({
					spa: 1
				});
			} else if (totalspd) {
				this.boost({
					atk: 1
				});
			}
		},
		id: "download",
		name: "Download",
		rating: 4,
		num: 88,
	},
	"drizzle": {
		shortDesc: "On switch-in, this Pokemon summons Rain Dance.",
		onStart: function(source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'kyogre') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('raindance');
		},
		id: "drizzle",
		name: "Drizzle",
		rating: 4.5,
		num: 2,
	},
	"drought": {
		shortDesc: "On switch-in, this Pokemon summons Sunny Day.",
		onStart: function(source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'groudon') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			this.setWeather('sunnyday');
		},
		id: "drought",
		name: "Drought",
		rating: 4.5,
		num: 70,
	},
	"dryskin": {
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day.",
		shortDesc: "This Pokemon is healed 1/4 by Water, 1/8 by Rain; is hurt 1.25x by Fire, 1/8 by Sun.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Dry Skin');
				}
				return null;
			}
		},
		onBasePowerPriority: 7,
		onFoeBasePower: function(basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.type === 'Fire') {
				return this.chainModify(1.25);
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 8);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.maxhp / 8, target, target);
			}
		},
		id: "dryskin",
		name: "Dry Skin",
		rating: 3,
		num: 87,
	},
	"earlybird": {
		shortDesc: "This Pokemon's sleep counter drops by 2 instead of 1.",
		id: "earlybird",
		name: "Early Bird",
		// Implemented in statuses.js
		rating: 2.5,
		num: 48,
	},
	"effectspore": {
		desc: "30% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep.",
		shortDesc: "30% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
				let r = this.random(100);
				if (r < 11) {
					source.setStatus('slp', target);
				} else if (r < 21) {
					source.setStatus('par', target);
				} else if (r < 30) {
					source.setStatus('psn', target);
				}
			}
		},
		id: "effectspore",
		name: "Effect Spore",
		rating: 2,
		num: 27,
	},
	"electricefflux": {
		shortDesc: "On switch-in, the battlefield is overcharged with electricity until this Ability is not active in battle.",
		onStart: function(source) {
			this.setTerrain('electricefflux');
		},
		onAnySetTerrainr: function(target, source, terrain) {
			if (this.getTerrain().id === 'electricefflux' && !(terrain.id in {
					electricefflux: 1,
					psychicpour: 1,
					grassygush: 1,
					mistymount: 1
				})) return false;
		},
		onEnd: function(pokemon) {
			if (this.terrainData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('electricefflux')) {
						this.terrainData.source = target;
						return;
					}
				}
			}
			this.clearTerrain();
		},
		id: "electricefflux",
		name: "Electric Efflux",
		rating: 5,
		num: 50001,
	},
	"electricsurge": {
		shortDesc: "On switch-in, this Pokemon summons Electric Terrain.",
		onStart: function(source) {
			this.setTerrain('electricterrain');
		},
		id: "electricsurge",
		name: "Electric Surge",
		rating: 4,
		num: 226,
	},
	"emergencyexit": {
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it immediately switches out to a chosen ally. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect. This effect applies to both direct and indirect damage, except Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage.",
		shortDesc: "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.",
		onAfterMoveSecondary: function(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				source.switchFlag = false;
				this.add('-activate', target, 'ability: Emergency Exit');
			}
		},
		onAfterDamage: function(damage, target, source, effect) {
			if (!target.hp || effect.effectType === 'Move') return;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				this.add('-activate', target, 'ability: Emergency Exit');
			}
		},
		id: "emergencyexit",
		name: "Emergency Exit",
		rating: 2,
		num: 194,
	},
	"ruggedshield": {
		desc: "This Pokemon is immune to Ice-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Ice-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Ice moves; Ice immunity.",
		onAfterDamageOrder: 1,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target);
			}
		},
		onSourceModifyDamage: function(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fighting') mod *= 0.5;
			if (move.type === 'Steel') mod *= 0.5;
			return this.chainModify(mod);
		},
		id: "ruggedshield",
		name: "Rugged Shield",
		rating: 3.5,
		num: 10,
	},
	"fairyaura": {
		desc: "While this Pokemon is active, the power of Fairy-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, a Fairy move used by any Pokemon has 1.33x power.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyTryPrimaryHit: function(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Fairy') {
				source.addVolatile('aura');
			}
		},
		id: "fairyaura",
		name: "Fairy Aura",
		rating: 3,
		num: 187,
	},
	"filter": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(0.75);
			}
		},
		id: "filter",
		name: "Filter",
		rating: 3,
		num: 111,
	},
	"fistmaster": {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.5.",
		shortDesc: "This Pokemon's punch-based attacks have 1.5x power. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify(1.5);
			}
		},
		id: "fistmaster",
		name: "Fist Master",
		rating: 3,
		num: 89,
	},
	"flamebody": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be burned.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('brn', target);
				}
			}
		},
		id: "flamebody",
		name: "Flame Body",
		rating: 2,
		num: 49,
	},
	"flareboost": {
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 1.5.",
		shortDesc: "While this Pokemon is burned, its special attacks have 1.5x power.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(1.5);
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 2.5,
		num: 138,
	},
	"flashfire": {
		desc: "This Pokemon is immune to Fire-type moves. The first time it is hit by a Fire-type move, its attacking stat is multiplied by 1.5 while using a Fire-type attack as long as it remains active and has this Ability. If this Pokemon is frozen, it cannot be defrosted by Fire-type attacks.",
		shortDesc: "This Pokemon's Fire attacks do 1.5x damage if hit by one Fire move; Fire immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		onEnd: function(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
		id: "flashfire",
		name: "Flash Fire",
		rating: 3,
		num: 18,
	},
	"flex": {
		shortDesc: "This Pokemon's Attack is raised by 1 stage after it is damaged by a move.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({
					atk: 1
				});
			}
		},
		id: "flex",
		name: "Flex",
		rating: 3,
		num: 192,
	},
	"flowergift": {
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		onStart: function(pokemon) {
			delete this.effectData.forme;
		},
		onUpdate: function(pokemon) {
			if (!pokemon.isActive || pokemon.baseTemplate.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				if (pokemon.template.speciesid !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine');
					this.add('-formechange', pokemon, 'Cherrim-Sunshine', '[msg]', '[from] ability: Flower Gift');
				}
			} else {
				if (pokemon.template.speciesid === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim');
					this.add('-formechange', pokemon, 'Cherrim', '[msg]', '[from] ability: Flower Gift');
				}
			}
		},
		onModifyAtkPriority: 3,
		onAllyModifyAtk: function(atk) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD: function(spd) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 2.5,
		num: 122,
	},
	"flowerpower": {
		shortDesc: "If Grassy or Misty Terrain is active, this Pokemon's Special Attack is multiplied by 1.5 and its Fairy and Grass moves deal 1.5x damage.",
		onModifyDefPriority: 6,
		onModifySpA: function(pokemon) {
			if (this.isTerrain('grassyterrain') || this.isTerrain('mistyterrain')) return this.chainModify(1.5);
		},
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Grass' || move.type === 'Fairy') {
				if (this.isTerrain('grassyterrain') || this.isTerrain('mistyterrain')) return this.chainModify(1.5);
			}
		},
		id: "grasspelt",
		name: "Grass Pelt",
		rating: 0.5,
		num: 179,
	},
	"flowerveil": {
		desc: "Grass-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a major status condition inflicted on them by other Pokemon.",
		shortDesc: "This side's Grass types can't have stats lowered or status inflicted by other Pokemon.",
		onAllyBoost: function(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add('-fail', this.effectData.target, 'unboost', '[from] ability: Flower Veil', '[of] ' + target);
		},
		onAllySetStatus: function(status, target, source, effect) {
			if (target.hasType('Grass')) {
				if (!effect || !effect.status) return false;
				this.add('-activate', this.effectData.target, 'ability: Flower Veil', '[of] ' + target);
				return null;
			}
		},
		id: "flowerveil",
		name: "Flower Veil",
		rating: 0,
		num: 166,
	},
	"fluffy": {
		desc: "This Pokemon receives 1/2 damage from contact moves, but double damage from Fire moves.",
		shortDesc: "This Pokemon takes 1/2 damage from contact moves, 2x damage from Fire moves.",
		// TODO: are either of these effects actually base power modifiers?
		onSourceModifyDamage: function(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		id: "fluffy",
		name: "Fluffy",
		rating: 2.5,
		num: 218,
	},
	"forecast": {
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm.",
		onUpdate: function(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (this.effectiveWeather()) {
				case 'sunnyday':
				case 'desolateland':
					if (pokemon.template.speciesid !== 'castformsunny') forme = 'Castform-Sunny';
					break;
				case 'raindance':
				case 'primordialsea':
					if (pokemon.template.speciesid !== 'castformrainy') forme = 'Castform-Rainy';
					break;
				case 'hail':
					if (pokemon.template.speciesid !== 'castformsnowy') forme = 'Castform-Snowy';
					break;
				default:
					if (pokemon.template.speciesid !== 'castform') forme = 'Castform';
					break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]', '[from] ability: Forecast');
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 3,
		num: 59,
	},
	"forewarn": {
		desc: "On switch-in, this Pokemon is alerted to the move with the highest power, at random, known by an opposing Pokemon.",
		shortDesc: "On switch-in, this Pokemon is alerted to the foes' move with the highest power.",
		onStart: function(pokemon) {
			let targets = pokemon.side.foe.active;
			let warnMoves = [];
			let warnBp = 1;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].fainted) continue;
				for (let j = 0; j < targets[i].moveset.length; j++) {
					let move = this.getMove(targets[i].moveset[j].move);
					let bp = move.basePower;
					if (move.ohko) bp = 160;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [
							[move, targets[i]]
						];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, targets[i]]);
					}
				}
			}
			if (!warnMoves.length) return;
			let warnMove = warnMoves[this.random(warnMoves.length)];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove[0], '[of] ' + warnMove[1]);
		},
		id: "forewarn",
		name: "Forewarn",
		rating: 1,
		num: 108,
	},
	'forsee': {
		shortDesc: "Uses Future Sight on switch out.",
		onSwitchOut: function(pokemon) {
			this.add('-ability', pokemon, 'Foresee');
			this.useMove('Future Sight', pokemon);
		},
		id: "forsee",
		name: "Forsee",
	},
	"friendguard": {
		shortDesc: "This Pokemon's allies receive 3/4 damage from other Pokemon's attacks.",
		id: "friendguard",
		name: "Friend Guard",
		onAnyModifyDamage: function(damage, source, target, move) {
			if (target !== this.effectData.target && target.side === this.effectData.target.side) {
				this.debug('Friend Guard weaken');
				return this.chainModify(0.75);
			}
		},
		rating: 0,
		num: 132,
	},
	"frisk": {
		shortDesc: "On switch-in, this Pokemon identifies the held items of all opposing Pokemon.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				if (foeactive[i].item) {
					this.add('-item', foeactive[i], foeactive[i].getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
				}
			}
		},
		id: "frisk",
		name: "Frisk",
		rating: 1.5,
		num: 119,
	},
	"fullmetalbody": {
		desc: "Prevents other Pokemon from lowering this Pokemon's stat stages. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", "[of] " + target);
		},
		isUnbreakable: true,
		id: "fullmetalbody",
		name: "Full Metal Body",
		rating: 2,
		num: 230,
	},
	"furcoat": {
		shortDesc: "This Pokemon's Defense is doubled.",
		onModifyDefPriority: 6,
		onModifyDef: function(def) {
			return this.chainModify(2);
		},
		id: "furcoat",
		name: "Fur Coat",
		rating: 3.5,
		num: 169,
	},
	"galewings": {
		shortDesc: "If this Pokemon is at full HP, its Flying-type moves have their priority increased by 1.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.type === 'Flying' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		id: "galewings",
		name: "Gale Wings",
		rating: 3,
		num: 177,
	},
	"galvanize": {
		desc: "This Pokemon's Normal-type moves become Electric-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Electric type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Electric';
				if (move.category !== 'Status') pokemon.addVolatile('galvanize');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "galvanize",
		name: "Galvanize",
		rating: 4,
		num: 206,
	},
	"gluttony": {
		shortDesc: "When this Pokemon has 1/2 or less of its maximum HP, it uses certain Berries early.",
		id: "gluttony",
		name: "Gluttony",
		rating: 1.5,
		num: 82,
	},
	"gooey": {
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Gooey');
				this.boost({
					spe: -1
				}, source, target, null, true);
			}
		},
		id: "gooey",
		name: "Gooey",
		rating: 2.5,
		num: 183,
	},
	"grasspelt": {
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 1.5.",
		onModifyDefPriority: 6,
		onModifyDef: function(pokemon) {
			if (this.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		id: "grasspelt",
		name: "Grass Pelt",
		rating: 0.5,
		num: 179,
	},
	"grassygush": {
		shortDesc: "On switch-in, the battlefield is covered with a layer of thick grass until this Ability is not active in battle.",
		onStart: function(source) {
			this.setTerrain('grassygush');
		},
		onAnySetTerrain: function(target, source, terrain) {
			if (this.getTerrain().id === 'grassygush' && !(terrain.id in {
					electricefflux: 1,
					psychicpour: 1,
					grassygush: 1,
					mistymount: 1
				})) return false;
		},
		onEnd: function(pokemon) {
			if (this.terrainData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('grassygush')) {
						this.terrainData.source = target;
						return;
					}
				}
			}
			this.clearTerrain();
		},
		id: "grassygush",
		name: "Grassy Gush",
		rating: 5,
		num: 50003,
	},
	"grassysurge": {
		shortDesc: "On switch-in, this Pokemon summons Grassy Terrain.",
		onStart: function(source) {
			this.setTerrain('grassyterrain');
		},
		id: "grassysurge",
		name: "Grassy Surge",
		rating: 4,
		num: 229,
	},
	"guts": {
		desc: "If this Pokemon has a major status condition, its Attack is multiplied by 1.5; burn's physical damage halving is ignored.",
		shortDesc: "If this Pokemon is statused, its Attack is 1.5x; ignores burn halving physical damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "guts",
		name: "Guts",
		rating: 3,
		num: 62,
	},
	"harvest": {
		desc: "If the last item this Pokemon used is a Berry, there is a 50% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 100%.",
		shortDesc: "If last item used is a Berry, 50% chance to restore it each end of turn. 100% in Sun.",
		id: "harvest",
		name: "Harvest",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland']) || this.random(2) === 0) {
				if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		rating: 2.5,
		num: 139,
	},
	"healer": {
		desc: "There is a 30% chance of curing an adjacent ally's major status condition at the end of each turn.",
		shortDesc: "30% chance of curing an adjacent ally's status at the end of each turn.",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].hp && this.isAdjacent(pokemon, allyActive[i]) && allyActive[i].status && this.random(10) < 3) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive[i].cureStatus();
				}
			}
		},
		rating: 0,
		num: 131,
	},
	"heatproof": {
		desc: "The power of Fire-type attacks against this Pokemon is halved, and burn damage taken is halved.",
		shortDesc: "The power of Fire-type attacks against this Pokemon is halved; burn damage halved.",
		onBasePowerPriority: 7,
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 2;
			}
		},
		id: "heatproof",
		name: "Heatproof",
		rating: 2.5,
		num: 85,
	},
	"heavymetal": {
		shortDesc: "This Pokemon's weight is doubled.",
		onModifyWeight: function(weight) {
			return weight * 2;
		},
		id: "heavymetal",
		name: "Heavy Metal",
		rating: -1,
		num: 134,
	},
	"honeygather": {
		shortDesc: "No competitive use.",
		id: "honeygather",
		name: "Honey Gather",
		rating: 0,
		num: 118,
	},
	"hugepower": {
		shortDesc: "This Pokemon's Attack is doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.chainModify(2);
		},
		id: "hugepower",
		name: "Huge Power",
		rating: 5,
		num: 37,
	},
	"hustle": {
		desc: "This Pokemon's Attack is multiplied by 1.5 and the accuracy of its physical attacks is multiplied by 0.8.",
		shortDesc: "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.",
		// This should be applied directly to the stat as opposed to chaining witht he others
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.modify(atk, 1.5);
		},
		onModifyMove: function(move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number') {
				move.accuracy *= 0.8;
			}
		},
		id: "hustle",
		name: "Hustle",
		rating: 3,
		num: 55,
	},
	"hydration": {
		desc: "This Pokemon has its major status condition cured at the end of each turn if Rain Dance is active.",
		shortDesc: "This Pokemon has its status cured at the end of each turn if Rain Dance is active.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.status && this.isWeather(['raindance', 'primordialsea'])) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				pokemon.cureStatus();
			}
		},
		id: "hydration",
		name: "Hydration",
		rating: 2,
		num: 93,
	},
	"hypercutter": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Attack stat stage.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				delete boost['atk'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
			}
		},
		id: "hypercutter",
		name: "Hyper Cutter",
		rating: 1.5,
		num: 52,
	},
	"icebody": {
		desc: "If Hail is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Hail.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp / 16);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		id: "icebody",
		name: "Ice Body",
		rating: 1.5,
		num: 115,
	},
	"illuminate": {
		shortDesc: "No competitive use.",
		id: "illuminate",
		name: "Illuminate",
		rating: 0,
		num: 35,
	},
	"illusion": {
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage.",
		onBeforeSwitchIn: function(pokemon) {
			pokemon.illusion = null;
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				if (!pokemon.side.pokemon[i].fainted) break;
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			pokemon.illusion = pokemon.side.pokemon[i];
		},
		onAfterDamage: function(damage, target, source, effect) {
			if (target.illusion && effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.singleEvent('End', this.getAbility('Illusion'), target.abilityData, target, source, effect);
			}
		},
		onEnd: function(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				let details = pokemon.template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
			}
		},
		onFaint: function(pokemon) {
			pokemon.illusion = null;
		},
		isUnbreakable: true,
		id: "illusion",
		name: "Illusion",
		rating: 4,
		num: 149,
	},
	"immunity": {
		shortDesc: "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Immunity');
			return false;
		},
		id: "immunity",
		name: "Immunity",
		rating: 2,
		num: 17,
	},
	"imposter": {
		desc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it. If there is no Pokemon at that position, this Pokemon does not Transform.",
		shortDesc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it.",
		onStart: function(pokemon) {
			if (this.activeMove && this.activeMove.id === 'skillswap') return;
			let target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				pokemon.transformInto(target, pokemon, this.getAbility('imposter'));
			}
		},
		id: "imposter",
		name: "Imposter",
		rating: 4.5,
		num: 150,
	},
	"incandescentire": {
		desc: "This Pokemon is immune to Fire-type moves and raises its Attack by 1 stage when hit by an Fire-type move. If this Pokemon is not the target of a single-target Fire-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Fire moves to itself to raise Atk by 1; Fire immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!this.boost({
						atk: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Incandescent Ire');
				}
				return null;
			}
		}
	},
	"infiltrator": {
		desc: "This Pokemon's moves ignore substitutes and the opposing side's Reflect, Light Screen, Safeguard, and Mist.",
		shortDesc: "Moves ignore substitutes and opposing Reflect, Light Screen, Safeguard, and Mist.",
		onModifyMove: function(move) {
			move.infiltrates = true;
		},
		id: "infiltrator",
		name: "Infiltrator",
		rating: 3,
		num: 151,
	},
	"innardsout": {
		desc: "If this Pokemon is knocked out with a move, that move's user loses HP equal to the amount of damage inflicted on this Pokemon.",
		shortDesc: "If this Pokemon is KOed with a move, that move's user loses an equal amount of HP.",
		id: "innardsout",
		name: "Innards Out",
		onAfterDamageOrder: 1,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.effectType === 'Move' && !target.hp) {
				this.damage(damage, source, target);
			}
		},
		rating: 2.5,
		num: 215,
	},
	"innerfocus": {
		shortDesc: "This Pokemon cannot be made to flinch.",
		onFlinch: false,
		id: "innerfocus",
		name: "Inner Focus",
		rating: 1.5,
		num: 39,
	},
	"insomnia": {
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Insomnia');
			return false;
		},
		id: "insomnia",
		name: "Insomnia",
		rating: 2,
		num: 15,
	},
	"intimidate": {
		desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({
						atk: -1
					}, foeactive[i], pokemon);
				}
			}
		},
		id: "intimidate",
		name: "Intimidate",
		rating: 3.5,
		num: 22,
	},
	"ironbarbs": {
		desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target);
			}
		},
		id: "ironbarbs",
		name: "Iron Barbs",
		rating: 3,
		num: 160,
	},
	"ironfist": {
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2.",
		shortDesc: "This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		id: "ironfist",
		name: "Iron Fist",
		rating: 3,
		num: 89,
	},
	"justified": {
		shortDesc: "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark-type move.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.type === 'Dark') {
				this.boost({
					atk: 1
				});
			}
		},
		id: "justified",
		name: "Justified",
		rating: 2,
		num: 154,
	},
	"keeneye": {
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage.",
		shortDesc: "This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0) {
				delete boost['accuracy'];
				if (!effect.secondaries) this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", "[of] " + target);
			}
		},
		onModifyMove: function(move) {
			move.ignoreEvasion = true;
		},
		id: "keeneye",
		name: "Keen Eye",
		rating: 1,
		num: 51,
	},
	"klutz": {
		desc: "This Pokemon's held item has no effect. This Pokemon cannot use Fling successfully. Macho Brace, Power Anklet, Power Band, Power Belt, Power Bracer, Power Lens, and Power Weight still have their effects.",
		shortDesc: "This Pokemon's held item has no effect, except Macho Brace. Fling cannot be used.",
		// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
		id: "klutz",
		name: "Klutz",
		rating: -1,
		num: 103,
	},
	"lanakilaforce": {
		shortDesc: "This Pokemon's Ice and Fairy-type attacks have their power multiplied by 1.3 in Hail.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('hail')) {
				if (move.type === 'Ice' || move.type === 'Fairy') {
					this.debug('Lanakila Boost');
					return this.chainModify(1.3);
				}
			}
		},
		id: "lanakilaforce",
		name: "Lanakila Force",
		rating: 3,
		num: 200,
	},
	"leafguard": {
		desc: "If Sunny Day is active, this Pokemon cannot gain a major status condition and Rest will fail for it.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.",
		onSetStatus: function(status, target, source, effect) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				if (effect && effect.status) this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
				return false;
			}
		},
		onTryAddVolatile: function(status, target) {
			if (status.id === 'yawn' && this.isWeather(['sunnyday', 'desolateland'])) {
				this.add('-immune', target, '[msg]', '[from] ability: Leaf Guard');
				return null;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 1,
		num: 102,
	},
	"levitate": {
		desc: "This Pokemon is immune to Ground. Gravity, Ingrain, Smack Down, Thousand Arrows, and Iron Ball nullify the immunity.",
		shortDesc: "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it.",
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		id: "levitate",
		name: "Levitate",
		rating: 3.5,
		num: 26,
	},
	"lightmetal": {
		shortDesc: "This Pokemon's weight is halved.",
		onModifyWeight: function(weight) {
			return weight / 2;
		},
		id: "lightmetal",
		name: "Light Metal",
		rating: 1,
		num: 135,
	},
	"lightningrod": {
		desc: "This Pokemon is immune to Electric-type moves and raises its Special Attack by 1 stage when hit by an Electric-type move. If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Electric moves to itself to raise Sp. Atk by 1; Electric immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({
						spa: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function(target, source, source2, move) {
			if (move.type !== 'Electric' || move.id in {
					firepledge: 1,
					grasspledge: 1,
					waterpledge: 1
				}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
				}
				return this.effectData.target;
			}
		},
		id: "lightningrod",
		name: "Lightning Rod",
		rating: 3.5,
		num: 32,
	},
	"limber": {
		shortDesc: "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Limber');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'par') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Limber');
			return false;
		},
		id: "limber",
		name: "Limber",
		rating: 1.5,
		num: 7,
	},
	"liquidooze": {
		shortDesc: "This Pokemon damages those draining HP from it for as much as they would heal.",
		id: "liquidooze",
		onSourceTryHeal: function(damage, target, source, effect) {
			this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
			let canOoze = {
				drain: 1,
				leechseed: 1,
				strengthsap: 1
			};
			if (canOoze[effect.id]) {
				this.damage(damage);
				return 0;
			}
		},
		name: "Liquid Ooze",
		rating: 1.5,
		num: 64,
	},
	"liquidvoice": {
		desc: "This Pokemon's sound-based moves become Water-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Water type.",
		onModifyMovePriority: -1,
		onModifyMove: function(move) {
			if (move.flags['sound']) {
				move.type = 'Water';
			}
		},
		id: "liquidvoice",
		name: "Liquid Voice",
		rating: 2.5,
		num: 204,
	},
	"homein": {
		desc: "Prevents adjacent opposing Bug and Grass-type Pokemon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent Bug and Grass-type foes from choosing to switch.",
		onFoeTrapPokemon: function(pokemon) {
			if (pokemon.hasType('Bug') || pokemon.hasType('Grass') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType('Bug')) || pokemon.hasType('Gras') && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "homein",
		name: "Home-In",
		rating: 4.5,
		num: 42,
	},
	"longreach": {
		shortDesc: "This Pokemon's attacks do not make contact with the target.",
		onModifyMove: function(move) {
			delete move.flags['contact'];
		},
		id: "longreach",
		name: "Long Reach",
		rating: 1.5,
		num: 203,
	},
	"loudspeaker": {
		shortDesc: "This Pokemon's sound moves have their power multiplied by 1.3.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				return this.chainModify(1.5);
			}
		},
		id: "loudspeaker",
		name: "Loudspeaker",
		rating: 3.5,
		num: 181,
	},
	"lovingembrace": {
		shortDesc: "This Pokemon's contact moves confuse the target; Confused Pokemon cannot switch out.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function(move, source, target) {
			if (!move || !move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			if (!(target.gender === 'M' && source.gender === 'F') && !(target.gender === 'F' && source.gender === 'M')) {
				move.secondaries.push({
					chance: 100,
					volatileStatus: 'confusion',
				});
			} else {
				move.secondaries.push({
					chance: 100,
					status: 'attract',
				});
			}
		},
		id: "lovingembrace",
		name: "Loving Embrace",
		rating: 2,
		num: 143,
	},
	"magicbounce": {
		desc: "This Pokemon blocks certain status moves and instead uses the move against the original user.",
		shortDesc: "This Pokemon blocks certain status moves and bounces them back to the user.",
		id: "magicbounce",
		name: "Magic Bounce",
		onTryHitPriority: 1,
		onTryHit: function(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide: function(target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, this.effectData.target, source);
			return null;
		},
		effect: {
			duration: 1,
		},
		rating: 4.5,
		num: 156,
	},
	"magicguard": {
		desc: "This Pokemon can only be damaged by direct attacks. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage.",
		shortDesc: "This Pokemon can only be damaged by direct attacks.",
		onDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		id: "magicguard",
		name: "Magic Guard",
		rating: 4.5,
		num: 98,
	},
	"magician": {
		desc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack. Does not affect Doom Desire and Future Sight.",
		shortDesc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack.",
		onSourceHit: function(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status') {
				if (source.item || source.volatiles['gem'] || source.volatiles['fling']) return;
				let yourItem = target.takeItem(source);
				if (!yourItem) return;
				if (!source.setItem(yourItem)) {
					target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
					return;
				}
				this.add('-item', source, yourItem, '[from] ability: Magician', '[of] ' + target);
			}
		},
		id: "magician",
		name: "Magician",
		rating: 1.5,
		num: 170,
	},
	"magmaarmor": {
		shortDesc: "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.cureStatus();
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'frz') return false;
		},
		id: "magmaarmor",
		name: "Magma Armor",
		rating: 0.5,
		num: 40,
	},
	"magnetpull": {
		desc: "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent Steel-type foes from choosing to switch.",
		onFoeTrapPokemon: function(pokemon) {
			if (pokemon.hasType('Steel') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if ((!pokemon.knownType || pokemon.hasType('Steel')) && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "magnetpull",
		name: "Magnet Pull",
		rating: 4.5,
		num: 42,
	},
	"marvelscale": {
		desc: "If this Pokemon has a major status condition, its Defense is multiplied by 1.5.",
		shortDesc: "If this Pokemon is statused, its Defense is 1.5x.",
		onModifyDefPriority: 6,
		onModifyDef: function(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "marvelscale",
		name: "Marvel Scale",
		rating: 2.5,
		num: 63,
	},
	"megalauncher": {
		desc: "This Pokemon's pulse moves have their power multiplied by 1.5. Heal Pulse restores 3/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse moves have 1.5x power. Heal Pulse heals 3/4 target's max HP.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(1.5);
			}
		},
		id: "megalauncher",
		name: "Mega Launcher",
		rating: 3.5,
		num: 178,
	},
	"merciless": {
		shortDesc: "This Pokemon's attacks are critical hits if the target is poisoned.",
		onModifyCritRatio: function(critRatio, source, target) {
			if (target && target.status in {
					'psn': 1,
					'tox': 1
				}) return 5;
		},
		id: "merciless",
		name: "Merciless",
		rating: 2,
		num: 196,
	},
	"minus": {
		desc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpAPriority: 5,
		onModifySpA: function(spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "minus",
		name: "Minus",
		rating: 0,
		num: 58,
	},
	"mistymount": {
		shortDesc: "On switch-in, the battlefield is covered in thick mist until this Ability is not active in battle.",
		onStart: function(source) {
			this.setTerrain('mistymount');
		},
		onAnySetTerrain: function(target, source, terrain) {
			if (this.getTerrain().id === 'mistymount' && !(terrain.id in {
					electricefflux: 1,
					psychicpour: 1,
					grassygush: 1,
					mistymount: 1
				})) return false;
		},
		onEnd: function(pokemon) {
			if (this.terrainData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('mistymount')) {
						this.terrainData.source = target;
						return;
					}
				}
			}
			this.clearTerrain();
		},
		id: "mistymount",
		name: "Misty Mount",
		rating: 5,
		num: 50004,
	},
	"mistysurge": {
		shortDesc: "On switch-in, this Pokemon summons Misty Terrain.",
		onStart: function(source) {
			this.setTerrain('mistyterrain');
		},
		id: "mistysurge",
		name: "Misty Surge",
		rating: 4,
		num: 228,
	},
	"moldbreaker": {
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		onModifyMove: function(move) {
			move.ignoreAbility = true;
		},
		id: "moldbreaker",
		name: "Mold Breaker",
		rating: 3.5,
		num: 104,
	},
	"moody": {
		desc: "This Pokemon has a random stat raised by 2 stages and another stat lowered by 1 stage at the end of each turn.",
		shortDesc: "Raises a random stat by 2 and lowers another stat by 1 at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			let stats = [];
			let boost = {};
			for (let statPlus in pokemon.boosts) {
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = 2;
			stats = [];
			for (let statMinus in pokemon.boosts) {
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = -1;
			this.boost(boost);
		},
		id: "moody",
		name: "Moody",
		rating: 5,
		num: 141,
	},
	"motordrive": {
		desc: "This Pokemon is immune to Electric-type moves and raises its Speed by 1 stage when hit by an Electric-type move.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by an Electric move; Electric immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({
						spe: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Motor Drive');
				}
				return null;
			}
		},
		id: "motordrive",
		name: "Motor Drive",
		rating: 3,
		num: 78,
	},
	"moxie": {
		desc: "This Pokemon's Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 1 stage if it attacks and KOes another Pokemon.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({
					atk: 1
				}, source);
			}
		},
		id: "moxie",
		name: "Moxie",
		rating: 3.5,
		num: 153,
	},
	"multiscale": {
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		id: "multiscale",
		name: "Multiscale",
		rating: 4,
		num: 136,
	},
	"multitype": {
		shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate or Z-Crystal.",
		// Multitype's type-changing itself is implemented in statuses.js
		id: "multitype",
		name: "Multitype",
		rating: 4,
		num: 121,
	},
	"mummy": {
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect the Abilities Multitype or Stance Change.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		id: "mummy",
		name: "Mummy",
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				let oldAbility = source.setAbility('mummy', source, 'mummy', true);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.getAbility(oldAbility).name, '[of] ' + source);
				}
			}
		},
		rating: 2,
		num: 152,
	},
	"moltenshield": {
		desc: "If a Pokemon uses a Fighting-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fighting-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Fighting') {
				this.debug('Molten Shield weaken');
				return this.chainModify(0.5);
			}
		},
		id: "moltenshield",
		name: "Molten Shield",
		rating: 3.5,
		num: 47,
	},
	"naturalcure": {
		shortDesc: "This Pokemon has its major status condition cured when it switches out.",
		onCheckShow: function(pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;
			let active = pokemon.side.active;
			let cureList = [];
			let noCureCount = 0;
			for (let i = 0; i < active.length; i++) {
				let curPoke = active[i];
				// pokemon not statused
				if (!curPoke || !curPoke.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				let template = Dex.getTemplate(curPoke.species);
				// pokemon can't get Natural Cure
				if (Object.values(template.abilities).indexOf('Natural Cure') < 0) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!template.abilities['1'] && !template.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}
				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}
			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured
				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', "(" + cureList.length + " of " + pokemon.side.name + "'s pokemon " + (cureList.length === 1 ? "was" : "were") + " cured by Natural Cure.)");
				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = false;
				}
			}
		},
		onSwitchOut: function(pokemon) {
			if (!pokemon.status) return;
			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;
			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.setStatus('');
			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) delete pokemon.showCure;
		},
		id: "naturalcure",
		name: "Natural Cure",
		rating: 3.5,
		num: 30,
	},
	"noguard": {
		shortDesc: "Every move used by or against this Pokemon will always hit.",
		onAnyAccuracy: function(accuracy, target, source, move) {
			if (move && (source === this.effectData.target || target === this.effectData.target)) {
				return true;
			}
			return accuracy;
		},
		id: "noguard",
		name: "No Guard",
		rating: 4,
		num: 99,
	},
	"normalize": {
		desc: "This Pokemon's moves are changed to be Normal type and have their power multiplied by 1.2. This effect comes before other effects that change a move's type.",
		shortDesc: "This Pokemon's moves are changed to be Normal type and have 1.2x power.",
		onModifyMovePriority: 1,
		onModifyMove: function(move, pokemon) {
			if (!move.isZ && move.id !== 'struggle' && this.getMove(move.id).type !== 'Normal') {
				move.type = 'Normal';
			}
			if (move.category !== 'Status') pokemon.addVolatile('normalize');
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "normalize",
		name: "Normalize",
		rating: -1,
		num: 96,
	},
	"oblivious": {
		desc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability while affected cures it.",
		shortDesc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit: function(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Oblivious');
				return null;
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 1,
		num: 12,
	},
	"overcoat": {
		shortDesc: "This Pokemon is immune to powder moves and damage from Sandstorm or Hail.",
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		onTryHitPriority: 1,
		onTryHit: function(target, source, move) {
			if (move.flags['powder'] && target !== source && this.getImmunity('powder', target)) {
				this.add('-immune', target, '[msg]', '[from] ability: Overcoat');
				return null;
			}
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 2.5,
		num: 142,
	},
	"overgrow": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, its attacking stat is multiplied by 1.5 while using a Grass-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Grass attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		id: "overgrow",
		name: "Overgrow",
		rating: 2,
		num: 65,
	},
	"owntempo": {
		shortDesc: "This Pokemon cannot be confused. Gaining this Ability while confused cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Own Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile: function(status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit: function(target, source, move) {
			if (move && move.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
			}
		},
		id: "owntempo",
		name: "Own Tempo",
		rating: 1,
		num: 20,
	},
	"papercut": {
		desc: "This Pokemon's contact moves have their power multiplied by 1.33.",
		shortDesc: "This Pokemon's contact moves have 1.33x power.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				this.debug('Paper Cut boost');
				return this.chainModify(1.33);
			}
		},
		id: "papercut",
		name: "Paper Cut",
		rating: 3,
		num: 89,
	},
	"parentalbond": {
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage quartered. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage quartered.",
		onPrepareHit: function(source, target, move) {
			if (move.id in {
					iceball: 1,
					rollout: 1
				}) return;
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit && !move.isZ) {
				move.multihit = 2;
				source.addVolatile('parentalbond');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower) {
				if (this.effectData.hit) {
					this.effectData.hit++;
					return this.chainModify(0.25);
				} else {
					this.effectData.hit = 1;
				}
			},
			onSourceModifySecondaries: function(secondaries, target, source, move) {
				if (move.id === 'secretpower' && this.effectData.hit < 2) {
					// hack to prevent accidentally suppressing King's Rock/Razor Fang
					return secondaries.filter(effect => effect.volatileStatus === 'flinch');
				}
			},
			onAnyAfterMove: function() {
				this.effectData.target.removeVolatile('parentalbond');
			},
		},
		id: "parentalbond",
		name: "Parental Bond",
		rating: 5,
		num: 184,
	},
	"ph0": {
		shortDesc: "This Pokemon can hit Steel types with Poison type moves.",
		onModifyMovePriority: -5,
		onModifyMove: function(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		id: "ph0",
		name: "pH0",
		rating: 3,
		num: 113,
	},
	"pickup": {
		shortDesc: "If this Pokemon has no item, it finds one used by an adjacent Pokemon this turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.item) return;
			let pickupTargets = [];
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (let i = 0; i < allActives.length; i++) {
				let target = allActives[i];
				if (target.lastItem && target.usedItemThisTurn && this.isAdjacent(pokemon, target)) {
					pickupTargets.push(target);
				}
			}
			if (!pickupTargets.length) return;
			let randomTarget = pickupTargets[this.random(pickupTargets.length)];
			pokemon.setItem(randomTarget.lastItem);
			randomTarget.lastItem = '';
			let item = pokemon.getItem();
			this.add('-item', pokemon, item, '[from] ability: Pickup');
		},
		id: "pickup",
		name: "Pickup",
		rating: 0.5,
		num: 53,
	},
	"pickpocket": {
		desc: "If this Pokemon has no item, it steals the item off a Pokemon that makes contact with it. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "If this Pokemon has no item, it steals the item off a Pokemon making contact with it.",
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				if (target.item) {
					return;
				}
				let yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-item', target, yourItem, '[from] ability: Pickpocket', '[of] ' + source);
			}
		},
		id: "pickpocket",
		name: "Pickpocket",
		rating: 1,
		num: 124,
	},
	'pigsty': {
		shortDesc: "1.5x boost to Ground-type moves, uses Mud Sport on switchin.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Ground') {
				this.debug('Pigsty boost');
				return this.chainModify(1.5);
			}
		},
		onStart: function(source) {
			this.add('-ability', source, 'Pigsty');
			this.useMove('Mud Sport', source);
		},
		id: "pigsty",
		name: "Pigsty",
	},
	"pixilate": {
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Fairy';
				if (move.category !== 'Status') pokemon.addVolatile('pixilate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "pixilate",
		name: "Pixilate",
		rating: 4,
		num: 182,
	},
	"plus": {
		desc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Sp. Atk is 1.5x.",
		onModifySpAPriority: 5,
		onModifySpA: function(spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		id: "plus",
		name: "Plus",
		rating: 0,
		num: 57,
	},
	"poisonheal": {
		desc: "If this Pokemon is poisoned, it restores 1/8 of its maximum HP, rounded down, at the end of each turn instead of losing HP.",
		shortDesc: "This Pokemon is healed by 1/8 of its max HP each turn when poisoned; no HP loss.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.maxhp / 8);
				return false;
			}
		},
		id: "poisonheal",
		name: "Poison Heal",
		rating: 4,
		num: 90,
	},
	"poisonpoint": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be poisoned.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('psn', target);
				}
			}
		},
		id: "poisonpoint",
		name: "Poison Point",
		rating: 2,
		num: 38,
	},
	"poisontouch": {
		shortDesc: "This Pokemon's contact moves have a 30% chance of poisoning.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function(move) {
			if (!move || !move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'psn',
				ability: this.getAbility('poisontouch'),
			});
		},
		id: "poisontouch",
		name: "Poison Touch",
		rating: 2,
		num: 143,
	},
	"powerconstruct": {
		desc: "If this Pokemon is a Zygarde in its 10% or 50% Forme, it changes to Complete Forme when it has 1/2 or less of its maximum HP at the end of the turn.",
		shortDesc: "If Zygarde 10%/50%, changes to Complete if at 1/2 max HP or less at end of turn.",
		onResidualOrder: 27,
		onResidual: function(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Zygarde' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.template.speciesid === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Power Construct');
			let template = this.getTemplate('Zygarde-Complete');
			pokemon.formeChange(template);
			pokemon.baseTemplate = template;
			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);
			pokemon.setAbility(template.abilities['0']);
			pokemon.baseAbility = pokemon.ability;
			let newHP = Math.floor(Math.floor(2 * pokemon.template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		id: "powerconstruct",
		name: "Power Construct",
		rating: 4,
		num: 211,
	},
	"powerfist": {
		onModifyMovePriority: -2,
		onModifyMove: function(move) {
			if (move.flags['contact']) {
				if (move.category !== 'Status') {
					move.category = 'Special';
				}
			}
		},
		id: "powerfist",
		name: "Power Fist",
		rating: 4,
		num: 2000,
	},
	"powerofalchemy": {
		desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "This Pokemon copies the Ability of an ally that faints.",
		onAllyFaint: function(target) {
			if (!this.effectData.target.hp) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {
				comatose: 1,
				flowergift: 1,
				forecast: 1,
				illusion: 1,
				imposter: 1,
				multitype: 1,
				stancechange: 1,
				trace: 1,
				wonderguard: 1,
				zenmode: 1
			};
			if (bannedAbilities[target.ability]) return;
			this.add('-ability', this.effectData.target, ability, '[from] ability: Power of Alchemy', '[of] ' + target);
			this.effectData.target.setAbility(ability);
		},
		id: "powerofalchemy",
		name: "Power of Alchemy",
		rating: 0,
		num: 223,
	},
	"prankster": {
		shortDesc: "This Pokemon's Status moves have priority raised by 1, but Dark types are immune.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
		onModifyMove: function(move) {
			if (move && move.category === 'Status') {
				move.pranksterBoosted = true;
			}
		},
		id: "prankster",
		name: "Prankster",
		rating: 4,
		num: 158,
	},
	"pressure": {
		desc: "If this Pokemon is the target of an opposing Pokemon's move, that move loses one additional PP.",
		shortDesc: "If this Pokemon is the target of a foe's move, that move loses one additional PP.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP: function(target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		id: "pressure",
		name: "Pressure",
		rating: 1.5,
		num: 46,
	},
	"primordialsea": {
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Desolate Land.",
		shortDesc: "On switch-in, heavy rain begins until this Ability is not active in battle.",
		onStart: function(source) {
			this.setWeather('primordialsea');
		},
		onAnySetWeather: function(target, source, weather) {
			if (this.getWeather().id === 'primordialsea' && !(weather.id in {
					desolateland: 1,
					primordialsea: 1,
					deltastream: 1
				})) return false;
		},
		onEnd: function(pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('primordialsea')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "primordialsea",
		name: "Primordial Sea",
		rating: 5,
		num: 189,
	},
	"prismarmor": {
		desc: "This Pokemon receives 3/4 damage from supereffective attacks. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Prism Armor neutralize');
				return this.chainModify(0.75);
			}
		},
		isUnbreakable: true,
		id: "prismarmor",
		name: "Prism Armor",
		rating: 3,
		num: 232,
	},
	"protean": {
		desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type.",
		shortDesc: "This Pokemon's type changes to match the type of the move it is about to use.",
		onPrepareHit: function(source, target, move) {
			if (move.hasBounced) return;
			let type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] Protean');
			}
		},
		id: "protean",
		name: "Protean",
		rating: 4,
		num: 168,
	},
	"psychicpour": {
		shortDesc: "On switch-in, the battlefield is washed over with a psychic energy until this Ability is not active in battle.",
		onStart: function(source) {
			this.setTerrain('psychicpour');
		},
		onAnySetTerrain: function(target, source, terrain) {
			if (this.getTerrain().id === 'psychicpour' && !(terrain.id in {
					electricefflux: 1,
					psychicpour: 1,
					grassygush: 1,
					mistymount: 1
				})) return false;
		},
		onEnd: function(pokemon) {
			if (this.terrainData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('psychicpour')) {
						this.terrainData.source = target;
						return;
					}
				}
			}
			this.clearTerrain();
		},
		id: "psychicpour",
		name: "Psychic Pour",
		rating: 5,
		num: 50002,
	},
	"psychicsurge": {
		shortDesc: "On switch-in, this Pokemon summons Psychic Terrain.",
		onStart: function(source) {
			this.setTerrain('psychicterrain');
		},
		id: "psychicsurge",
		name: "Psychic Surge",
		rating: 4,
		num: 227,
	},
	"purepower": {
		shortDesc: "This Pokemon's Attack is doubled.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk) {
			return this.chainModify(2);
		},
		id: "purepower",
		name: "Pure Power",
		rating: 5,
		num: 74,
	},
	"pyromaniac": {
		shortDesc: "This Pokemon's attacks are critical hits if the target is burned.",
		onModifyCritRatio: function(critRatio, source, target) {
			if (target && target.status in {
					'brn': 1
				}) return 5;
		},
		id: "pyromaniac",
		name: "Pyromaniac",
		rating: 2,
		num: 196,
	},
	"queenlymajesty": {
		desc: "While this Pokemon is active, priority moves from opposing Pokemon targeted at allies are prevented from having an effect.",
		shortDesc: "While this Pokemon is active, allies are protected from opposing priority moves.",
		onFoeTryMove: function(target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Queenly Majesty', effect, '[of] ' + target);
				return false;
			}
		},
		id: "queenlymajesty",
		name: "Queenly Majesty",
		rating: 3.5,
		num: 214,
	},
	"quickfeet": {
		desc: "If this Pokemon has a major status condition, its Speed is multiplied by 1.5; the Speed drop from paralysis is ignored.",
		shortDesc: "If this Pokemon is statused, its Speed is 1.5x; ignores Speed drop from paralysis.",
		onModifySpe: function(spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		id: "quickfeet",
		name: "Quick Feet",
		rating: 2.5,
		num: 95,
	},
	"ragemotor": {
		shortDesc: "This Pokemon uses Discharge after it is damaged.",
		onAfterDamage: function(damage, target, source, move) {
			if (!this.effectData.target.hp || source === this.effectData.target || move.isExternal) return;
			this.faintMessages();
			this.add('-activate', this.effectData.target, 'ability: Rage Motor');
			this.runMove("discharge", this.effectData.target, 0, this.getAbility('ragemotor'), undefined, true);
		},
		id: "ragemotor",
		name: "Rage Motor",
		rating: 3,
		num: 192,
	},
	"raindish": {
		desc: "If Rain Dance is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Rain Dance is active, this Pokemon heals 1/16 of its max HP each turn.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 16);
			}
		},
		id: "raindish",
		name: "Rain Dish",
		rating: 1.5,
		num: 44,
	},
	"rattled": {
		desc: "This Pokemon's Speed is raised by 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({
					spe: 1
				});
			}
		},
		id: "rattled",
		name: "Rattled",
		rating: 1.5,
		num: 155,
	},
	"receiver": {
		desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "This Pokemon copies the Ability of an ally that faints.",
		onAllyFaint: function(target) {
			if (!this.effectData.target.hp) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {
				comatose: 1,
				flowergift: 1,
				forecast: 1,
				illusion: 1,
				imposter: 1,
				multitype: 1,
				stancechange: 1,
				trace: 1,
				wonderguard: 1,
				zenmode: 1
			};
			if (bannedAbilities[target.ability]) return;
			this.add('-ability', this.effectData.target, ability, '[from] ability: Receiver', '[of] ' + target);
			this.effectData.target.setAbility(ability);
		},
		id: "receiver",
		name: "Receiver",
		rating: 0,
		num: 222,
	},
	"reckless": {
		desc: "This Pokemon's attacks with recoil or crash damage have their power multiplied by 1.2. Does not affect Struggle.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage have 1.2x power; not Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		id: "reckless",
		name: "Reckless",
		rating: 3,
		num: 120,
	},
	"refrigerate": {
		desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.type === 'Normal' && move.id !== 'naturalgift' && !move.isZ) {
				move.type = 'Ice';
				if (move.category !== 'Status') pokemon.addVolatile('refrigerate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "refrigerate",
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	"regalreversal": {
		shortDesc: "Super-effective attacks used against this Pokemon have their damage reduced by 25% and do 50% recoil to the user.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				return this.chainModify(0.75);
				move.regalRecoil = true;
			}
		},
		onFoeModifyMove: function(move) {
			if (move.regalRecoil = true) {
				move.recoil = [1, 2];
			}
		},
		id: "regalreversal",
		name: "Regal Reversal",
	},
	"regenerator": {
		shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.",
		onSwitchOut: function(pokemon) {
			pokemon.heal(pokemon.maxhp / 3);
		},
		id: "regenerator",
		name: "Regenerator",
		rating: 4,
		num: 144,
	},
	"ribbonguard": {
		desc: "This Pokemon receives 3/4 damage from contact moves.",
		shortDesc: "This Pokemon takes 3/4 damage from contact moves.",
		onSourceModifyDamage: function(damage, source, target, move) {
			let mod = 1;
			if (move.flags['contact']) mod *= 0.75;
			return this.chainModify(mod);
		},
		id: "ribbonguard",
		name: "Ribbon Guard",
		rating: 2.5,
		num: 218,
	},
	"earthrejuvenation": {
		desc: "This Pokemon is immune to Ground-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Ground-type move. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Sandstorm.",
		shortDesc: "This Pokemon is healed 1/4 by Ground, 1/8 by Sand.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Earth Rejuvenation');
				}
				return null;
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'sandstorm') {
				this.heal(target.maxhp / 8);
			}
		},
		id: "earthrejuvenation",
		name: "Earth Rejuvenation",
		rating: 3,
		num: 87,
	},
	"rivalry": {
		desc: "This Pokemon's attacks have their power multiplied by 1.25 against targets of the same gender or multiplied by 0.75 against targets of the opposite gender. There is no modifier if either this Pokemon or the target is genderless.",
		shortDesc: "This Pokemon's attacks do 1.25x on same gender targets; 0.75x on opposite gender.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.25);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.75);
				}
			}
		},
		id: "rivalry",
		name: "Rivalry",
		rating: 0.5,
		num: 79,
	},
	"rkssystem": {
		shortDesc: "If this Pokemon is a Silvally, its type changes to match its held Memory.",
		// RKS System's type-changing itself is implemented in statuses.js
		id: "rkssystem",
		name: "RKS System",
		rating: 4,
		num: 225,
	},
	"rockhead": {
		desc: "This Pokemon does not take recoil damage besides Struggle, Life Orb, and crash damage.",
		shortDesc: "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') return null;
		},
		id: "rockhead",
		name: "Rock Head",
		rating: 3,
		num: 69,
	},
	"roughskin": {
		desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.damage(source.maxhp / 8, source, target);
			}
		},
		id: "roughskin",
		name: "Rough Skin",
		rating: 3,
		num: 24,
	},
	"runaway": {
		shortDesc: "No competitive use.",
		id: "runaway",
		name: "Run Away",
		rating: 0,
		num: 50,
	},
	"sandforce": {
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 1.3x in Sandstorm; immunity to it.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandforce",
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	"sandrush": {
		desc: "If Sandstorm is active, this Pokemon's Speed is doubled. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is doubled; immunity to Sandstorm.",
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather('sandstorm')) {
				return this.chainModify(2);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandrush",
		name: "Sand Rush",
		rating: 2.5,
		num: 146,
	},
	"sandstream": {
		shortDesc: "On switch-in, this Pokemon summons Sandstorm.",
		onStart: function(source) {
			this.setWeather('sandstorm');
		},
		id: "sandstream",
		name: "Sand Stream",
		rating: 4.5,
		num: 45,
	},
	"sandveil": {
		desc: "If Sandstorm is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's evasiveness is 1.25x; immunity to Sandstorm.",
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracy: function(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		id: "sandveil",
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	"sapsipper": {
		desc: "This Pokemon is immune to Grass-type moves and raises its Attack by 1 stage when hit by a Grass-type move.",
		shortDesc: "This Pokemon's Attack is raised 1 stage if hit by a Grass move; Grass immunity.",
		onTryHitPriority: 1,
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({
						atk: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide: function(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass') {
				this.boost({
					atk: 1
				}, this.effectData.target);
			}
		},
		id: "sapsipper",
		name: "Sap Sipper",
		rating: 3.5,
		num: 157,
	},
	"schooling": {
		desc: "On switch-in, if this Pokemon is a Wishiwashi that is level 20 or above and has more than 1/4 of its maximum HP left, it changes to School Form. If it is in School Form and its HP drops to 1/4 of its maximum HP or less, it changes to Solo Form at the end of the turn. If it is in Solo Form and its HP is greater than 1/4 its maximum HP at the end of the turn, it changes to School Form.",
		shortDesc: "If user is Wishiwashi, changes to School Form if it has > 1/4 max HP, else Solo Form.",
		onStart: function(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		id: "schooling",
		name: "Schooling",
		rating: 2.5,
		num: 208,
	},
	"scrappy": {
		shortDesc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
		onModifyMovePriority: -5,
		onModifyMove: function(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	"seismicvibration": {
		desc: "This Pokemon's Sound moves become Physical Ground-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Sound moves become Physical, Ground type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function(move, pokemon) {
			if (move.flags['sound']) {
				move.type = 'Ground';
				move.category = 'Physical';
				if (move.category !== 'Status') pokemon.addVolatile('seismicvibration');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x1333, 0x1000]);
			},
		},
		id: "seismicvibration",
		name: "Seismic Vibration",
		rating: 4,
		num: 174,
	},
	"serenegrace": {
		shortDesc: "This Pokemon's moves have their secondary effect chance doubled.",
		onModifyMovePriority: -2,
		onModifyMove: function(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
		id: "serenegrace",
		name: "Serene Grace",
		rating: 4,
		num: 32,
	},
	"shadowshield": {
		desc: "If this Pokemon is at full HP, damage taken from attacks is halved. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Shadow Shield weaken');
				return this.chainModify(0.5);
			}
		},
		isUnbreakable: true,
		id: "shadowshield",
		name: "Shadow Shield",
		rating: 4,
		num: 231,
	},
	"shadowtag": {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or also have this Ability.",
		shortDesc: "Prevents adjacent foes from choosing to switch unless they also have this Ability.",
		onFoeTrapPokemon: function(pokemon) {
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
		id: "shadowtag",
		name: "Shadow Tag",
		rating: 5,
		num: 23,
	},
	"shedskin": {
		desc: "This Pokemon has a 33% chance to have its major status condition cured at the end of each turn.",
		shortDesc: "This Pokemon has a 33% chance to have its status cured at the end of each turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.hp && pokemon.status && this.random(3) === 0) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
		id: "shedskin",
		name: "Shed Skin",
		rating: 3.5,
		num: 61,
	},
	"sheerforce": {
		desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed.",
		shortDesc: "This Pokemon's attacks with secondary effects have 1.3x power; nullifies the effects.",
		onModifyMove: function(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				pokemon.addVolatile('sheerforce');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function(basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]);
			},
		},
		id: "sheerforce",
		name: "Sheer Force",
		rating: 4,
		num: 125,
	},
	"shellarmor": {
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
		onCriticalHit: false,
		id: "shellarmor",
		name: "Shell Armor",
		rating: 1,
		num: 75,
	},
	"shielddust": {
		shortDesc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack.",
		onModifySecondaries: function(secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		id: "shielddust",
		name: "Shield Dust",
		rating: 2.5,
		num: 19,
	},
	"shieldsdown": {
		desc: "If this Pokemon is a Minior, it changes to its Core forme if it has 1/2 or less of its maximum HP, and changes to Meteor Form if it has more than 1/2 its maximum HP. This check is done on switch-in and at the end of each turn. While in its Meteor Form, it cannot become affected by major status conditions. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "If Minior, switch-in/end of turn it changes to Core at 1/2 max HP or less, else Meteor.",
		onStart: function(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Minior' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.template.speciesid === 'minior') {
					pokemon.formeChange('Minior-Meteor');
					this.add('-formechange', pokemon, 'Minior-Meteor', '[from] ability: Shields Down');
				}
			} else {
				if (pokemon.template.speciesid !== 'minior') {
					pokemon.formeChange(pokemon.set.species);
					this.add('-formechange', pokemon, pokemon.set.species, '[from] ability: Shields Down');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Minior' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.template.speciesid === 'minior') {
					pokemon.formeChange('Minior-Meteor');
					this.add('-formechange', pokemon, 'Minior-Meteor', '[msg]', '[from] ability: Shields Down');
				}
			} else {
				if (pokemon.template.speciesid !== 'minior') {
					pokemon.formeChange(pokemon.set.species);
					this.add('-formechange', pokemon, pokemon.set.species, '[msg]', '[from] ability: Shields Down');
				}
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (target.template.speciesid !== 'miniormeteor' || target.transformed) return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Shields Down');
			return false;
		},
		onTryAddVolatile: function(status, target) {
			if (target.template.speciesid !== 'miniormeteor' || target.transformed) return;
			if (status.id !== 'yawn') return;
			this.add('-immune', target, '[msg]', '[from] ability: Shields Down');
			return null;
		},
		isUnbreakable: true,
		id: "shieldsdown",
		name: "Shields Down",
		rating: 2.5,
		num: 197,
	},
	"simple": {
		shortDesc: "If this Pokemon's stat stages are raised or lowered, the effect is doubled instead.",
		onBoost: function(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				boost[i] *= 2;
			}
		},
		id: "simple",
		name: "Simple",
		rating: 4,
		num: 86,
	},
	"skilllink": {
		shortDesc: "This Pokemon's multi-hit attacks always hit the maximum number of times.",
		onModifyMove: function(move) {
			if (move.multihit && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		id: "skilllink",
		name: "Skill Link",
		rating: 4,
		num: 92,
	},
	"slowstart": {
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.",
		onStart: function(pokemon) {
			pokemon.addVolatile('slowstart');
		},
		onEnd: function(pokemon) {
			delete pokemon.volatiles['slowstart'];
			this.add('-end', pokemon, 'Slow Start', '[silent]');
		},
		effect: {
			duration: 5,
			onStart: function(target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe: function(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd: function(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
		id: "slowstart",
		name: "Slow Start",
		rating: -2,
		num: 112,
	},
	"slushrush": {
		shortDesc: "If Hail is active, this Pokemon's Speed is doubled.",
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather('hail')) {
				return this.chainModify(2);
			}
		},
		id: "slushrush",
		name: "Slush Rush",
		rating: 2.5,
		num: 202,
	},
	"sniper": {
		shortDesc: "If this Pokemon strikes with a critical hit, the damage is multiplied by 1.5.",
		onModifyDamage: function(damage, source, target, move) {
			if (move.crit) {
				this.debug('Sniper boost');
				return this.chainModify(1.5);
			}
		},
		id: "sniper",
		name: "Sniper",
		rating: 1,
		num: 97,
	},
	"snowcloak": {
		desc: "If Hail is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon's evasiveness is 1.25x; immunity to Hail.",
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyAccuracy: function(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('hail')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},
	"snowwarning": {
		shortDesc: "On switch-in, this Pokemon summons Hail.",
		onStart: function(source) {
			this.setWeather('hail');
		},
		id: "snowwarning",
		name: "Snow Warning",
		rating: 4,
		num: 117,
	},
	"solarpower": {
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x; loses 1/8 max HP per turn.",
		onModifySpAPriority: 5,
		onModifySpA: function(spa, pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.maxhp / 8, target, target);
			}
		},
		id: "solarpower",
		name: "Solar Power",
		rating: 1.5,
		num: 94,
	},
	"solidrock": {
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
		onSourceModifyDamage: function(damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.75);
			}
		},
		id: "solidrock",
		name: "Solid Rock",
		rating: 3,
		num: 116,
	},
	"soulheart": {
		desc: "This Pokemon's Special Attack is raised by 1 stage when another Pokemon faints.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 stage when another Pokemon faints.",
		onAnyFaint: function() {
			this.boost({
				spa: 1
			}, this.effectData.target);
		},
		id: "soulheart",
		name: "Soul-Heart",
		rating: 3.5,
		num: 220,
	},
	"soundproof": {
		shortDesc: "This Pokemon is immune to sound-based moves, including Heal Bell.",
		onTryHit: function(target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', target, '[msg]', '[from] ability: Soundproof');
				return null;
			}
		},
		onAllyTryHitSide: function(target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', this.effectData.target, '[msg]', '[from] ability: Soundproof');
			}
		},
		id: "soundproof",
		name: "Soundproof",
		rating: 2,
		num: 43,
	},
	"speedboost": {
		desc: "This Pokemon's Speed is raised by 1 stage at the end of each full turn it has been on the field.",
		shortDesc: "This Pokemon's Speed is raised 1 stage at the end of each full turn on the field.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({
					spe: 1
				});
			}
		},
		id: "speedboost",
		name: "Speed Boost",
		rating: 4.5,
		num: 3,
	},
	"spreadingflames": {
		shortDesc: "This Pokemon's contact moves have a 30% chance of burning.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function(move) {
			if (!move || !move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 100,
				status: 'brn',
				ability: this.getAbility('spreadingflames'),
			});
		},
		id: "spreadingflames",
		name: "Spreading Flames",
		rating: 2,
		num: 143,
	},
	"stakeout": {
		shortDesc: "This Pokemon's attacks deal double damage if the target switched in this turn.",
		onModifyDamage: function(damage, source, target) {
			if (!target.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		id: "stakeout",
		name: "Stakeout",
		rating: 2.5,
		num: 198,
	},
	"stall": {
		shortDesc: "This Pokemon moves last among Pokemon using the same or greater priority moves.",
		onModifyPriority: function(priority) {
			return Math.round(priority) - 0.1;
		},
		id: "stall",
		name: "Stall",
		rating: -1,
		num: 100,
	},
	"stamina": {
		shortDesc: "This Pokemon's Defense is raised by 1 stage after it is damaged by a move.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({
					def: 1
				});
			}
		},
		id: "stamina",
		name: "Stamina",
		rating: 3,
		num: 192,
	},
	"stancechange": {
		desc: "If this Pokemon is an Aegislash, it changes to Blade Forme before attempting to use an attacking move, and changes to Shield Forme before attempting to use King's Shield.",
		shortDesc: "If Aegislash, changes Forme to Blade before attacks and Shield before King's Shield.",
		onBeforeMovePriority: 0.5,
		onBeforeMove: function(attacker, defender, move) {
			if (attacker.template.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			let targetSpecies = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.template.species !== targetSpecies && attacker.formeChange(targetSpecies)) {
				this.add('-formechange', attacker, targetSpecies, '[from] ability: Stance Change');
			}
		},
		id: "stancechange",
		name: "Stance Change",
		rating: 5,
		num: 176,
	},
	"static": {
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be paralyzed.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.trySetStatus('par', target);
				}
			}
		},
		id: "static",
		name: "Static",
		rating: 2,
		num: 9,
	},
	"steadfast": {
		shortDesc: "If this Pokemon flinches, its Speed is raised by 1 stage.",
		onFlinch: function(pokemon) {
			this.boost({
				spe: 1
			});
		},
		id: "steadfast",
		name: "Steadfast",
		rating: 1,
		num: 80,
	},
	"steelworker": {
		shortDesc: "This Pokemon's Steel-type attacks have their power multiplied by 1.5.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		id: "steelworker",
		name: "Steelworker",
		rating: 3,
		num: 200,
	},
	"stench": {
		shortDesc: "This Pokemon's attacks without a chance to flinch have a 10% chance to flinch.",
		onModifyMove: function(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (let i = 0; i < move.secondaries.length; i++) {
					if (move.secondaries[i].volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		id: "stench",
		name: "Stench",
		rating: 0.5,
		num: 1,
	},
	"stickyhold": {
		shortDesc: "This Pokemon cannot lose its held item due to another Pokemon's attack.",
		onTakeItem: function(item, pokemon, source) {
			if (this.suppressingAttackEvents() && pokemon !== this.activePokemon || !pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		id: "stickyhold",
		name: "Sticky Hold",
		rating: 1.5,
		num: 60,
	},
	"stormdrain": {
		desc: "This Pokemon is immune to Water-type moves and raises its Special Attack by 1 stage when hit by a Water-type move. If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon draws Water moves to itself to raise Sp. Atk by 1; Water immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({
						spa: 1
					})) {
					this.add('-immune', target, '[msg]', '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function(target, source, source2, move) {
			if (move.type !== 'Water' || move.id in {
					firepledge: 1,
					grasspledge: 1,
					waterpledge: 1
				}) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Storm Drain');
				}
				return this.effectData.target;
			}
		},
		id: "stormdrain",
		name: "Storm Drain",
		rating: 3.5,
		num: 114,
	},
	"strongjaw": {
		desc: "This Pokemon's bite-based attacks have their power multiplied by 1.5.",
		shortDesc: "This Pokemon's bite-based attacks have 1.5x power. Bug Bite is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				return this.chainModify(1.5);
			}
		},
		id: "strongjaw",
		name: "Strong Jaw",
		rating: 3,
		num: 173,
	},
	"sturdy": {
		desc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. OHKO moves fail when used against this Pokemon.",
		shortDesc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. Immune to OHKO.",
		onTryHit: function(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		id: "sturdy",
		name: "Sturdy",
		rating: 3,
		num: 5,
	},
	"suctioncups": {
		shortDesc: "This Pokemon cannot be forced to switch out by another Pokemon's attack or item.",
		onDragOutPriority: 1,
		onDragOut: function(pokemon) {
			this.add('-activate', pokemon, 'ability: Suction Cups');
			return null;
		},
		id: "suctioncups",
		name: "Suction Cups",
		rating: 2,
		num: 21,
	},
	"superluck": {
		shortDesc: "This Pokemon's critical hit ratio is raised by 1 stage.",
		onModifyCritRatio: function(critRatio) {
			return critRatio + 1;
		},
		id: "superluck",
		name: "Super Luck",
		rating: 1.5,
		num: 105,
	},
	"supremesamurai": {
		shortDesc: "The user's Blade-based moves (Cross Poison, Cut, Fury Cutter, Leaf Blade, Megahorn, Night Slash, Psycho Cut, Razor Shell, Sacred Sword, Secret Sword, Slash, Smart Strike, Solar Blade, X-Scissor) are always a critical hit.",
		onModifyMove: function(move) {
			if (move.name === 'Cross Poison' || move.name === 'Cut' || move.name === 'Fury Cutter' || move.name === 'Leaf Blade' || move.name === 'Megahorn' || move.name === 'Night Slash' || move.name === 'Psycho Cut' || move.name === 'Razor Shell' || move.name === 'Sacred Sword' || move.name === 'Secret Sword' || move.name === 'Slash' || move.name === 'Smart Strike' || move.name === 'Solar Blade' || move.name === 'X-Scissor') {
				move.willCrit = true;
			}
		},
		id: "supremesamurai",
		name: "Supreme Samurai",
	},
	"surgesurfer": {
		shortDesc: "If Electric Terrain is active, this Pokemon's Speed is doubled.",
		onModifySpe: function(spe) {
			if (this.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		id: "surgesurfer",
		name: "Surge Surfer",
		rating: 2,
		num: 207,
	},
	"swarm": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Bug-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Bug attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		id: "swarm",
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	"sweetveil": {
		shortDesc: "This Pokemon and its allies cannot fall asleep.",
		id: "sweetveil",
		name: "Sweet Veil",
		onAllySetStatus: function(status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				return null;
			}
		},
		onAllyTryAddVolatile: function(status, target) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				return null;
			}
		},
		rating: 2,
		num: 175,
	},
	"swiftswim": {
		shortDesc: "If Rain Dance is active, this Pokemon's Speed is doubled.",
		onModifySpe: function(spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
		id: "swiftswim",
		name: "Swift Swim",
		rating: 2.5,
		num: 33,
	},
	"symbiosis": {
		desc: "If an ally uses its item, this Pokemon gives its item to that ally immediately. Does not activate if the ally's item was stolen or knocked off.",
		shortDesc: "If an ally uses its item, this Pokemon gives its item to that ally immediately.",
		onAllyAfterUseItem: function(item, pokemon) {
			let sourceItem = this.effectData.target.getItem();
			if (!sourceItem) return;
			if (!this.singleEvent('TakeItem', item, this.effectData.target.itemData, this.effectData.target, pokemon, this.effectData, item)) return;
			sourceItem = this.effectData.target.takeItem();
			if (!sourceItem) {
				return;
			}
			if (pokemon.setItem(sourceItem)) {
				this.add('-activate', this.effectData.target, 'ability: Symbiosis', sourceItem, '[of] ' + pokemon);
			}
		},
		id: "symbiosis",
		name: "Symbiosis",
		rating: 0,
		num: 180,
	},
	"synchronize": {
		desc: "If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon, that Pokemon receives the same major status condition.",
		shortDesc: "If another Pokemon burns/poisons/paralyzes this Pokemon, it also gets that status.",
		onAfterSetStatus: function(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz') return;
			this.add('-activate', target, 'ability: Synchronize');
			source.trySetStatus(status, target, {
				status: status.id,
				id: 'synchronize'
			});
		},
		id: "synchronize",
		name: "Synchronize",
		rating: 2,
		num: 28,
	},
	"tangledfeet": {
		shortDesc: "This Pokemon's evasiveness is doubled as long as it is confused.",
		onModifyAccuracy: function(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target && target.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return accuracy * 0.5;
			}
		},
		id: "tangledfeet",
		name: "Tangled Feet",
		rating: 1,
		num: 77,
	},
	"tanglinghair": {
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Tangling Hair');
				this.boost({
					spe: -1
				}, source, target, null, null, true);
			}
		},
		id: "tanglinghair",
		name: "Tangling Hair",
		rating: 2.5,
		num: 221,
	},
	"technician": {
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 1.5. Does affect Struggle.",
		shortDesc: "This Pokemon's moves of 60 power or less have 1.5x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		id: "technician",
		name: "Technician",
		rating: 4,
		num: 101,
	},
	"telepathy": {
		shortDesc: "This Pokemon does not take damage from attacks made by its allies.",
		onTryHit: function(target, source, move) {
			if (target !== source && target.side === source.side && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Telepathy');
				return null;
			}
		},
		id: "telepathy",
		name: "Telepathy",
		rating: 0,
		num: 140,
	},
	"teravolt": {
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		onModifyMove: function(move) {
			move.ignoreAbility = true;
		},
		id: "teravolt",
		name: "Teravolt",
		rating: 3.5,
		num: 164,
	},
	"thickfat": {
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Ice-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		id: "thickfat",
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	"tintedlens": {
		shortDesc: "This Pokemon's attacks that are not very effective on a target deal double damage.",
		onModifyDamage: function(damage, source, target, move) {
			if (move.typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		id: "tintedlens",
		name: "Tinted Lens",
		rating: 3.5,
		num: 110,
	},
	"torrent": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Water-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Water attacks do 1.5x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		id: "torrent",
		name: "Torrent",
		rating: 2,
		num: 67,
	},
	"toxicboost": {
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 1.5.",
		shortDesc: "While this Pokemon is poisoned, its physical attacks have 1.5x power.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
				return this.chainModify(1.5);
			}
		},
		id: "toxicboost",
		name: "Toxic Boost",
		rating: 3,
		num: 137,
	},
	"toughclaws": {
		shortDesc: "This Pokemon's contact moves have their power multiplied by 1.3.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		id: "toughclaws",
		name: "Tough Claws",
		rating: 3.5,
		num: 181,
	},
	"trace": {
		desc: "On switch-in, this Pokemon copies a random adjacent opposing Pokemon's Ability. If there is no Ability that can be copied at that time, this Ability will activate as soon as an Ability can be copied. Abilities that cannot be copied are Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Schooling, Stance Change, Trace, and Zen Mode.",
		shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
		onUpdate: function(pokemon) {
			if (!pokemon.isStarted) return;
			let possibleTargets = pokemon.side.foe.active.filter(foeActive => foeActive && this.isAdjacent(pokemon, foeActive));
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				let ability = this.getAbility(target.ability);
				let bannedAbilities = {
					comatose: 1,
					disguise: 1,
					flowergift: 1,
					forecast: 1,
					illusion: 1,
					imposter: 1,
					multitype: 1,
					schooling: 1,
					stancechange: 1,
					trace: 1,
					zenmode: 1
				};
				if (bannedAbilities[target.ability]) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				pokemon.setAbility(ability);
				return;
			}
		},
		id: "trace",
		name: "Trace",
		rating: 3,
		num: 36,
	},
	"triage": {
		shortDesc: "This Pokemon's healing moves have their priority increased by 3.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.flags['heal']) return priority + 3;
		},
		id: "triage",
		name: "Triage",
		rating: 3.5,
		num: 205,
	},
	"truant": {
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onBeforeMovePriority: 9,
		onBeforeMove: function(pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant', pokemon, 'ability: Truant');
				return false;
			}
			pokemon.addVolatile('truant');
		},
		effect: {
			duration: 2,
		},
		id: "truant",
		name: "Truant",
		rating: -2,
		num: 54,
	},
	"turboblaze": {
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onModifyMove: function(move) {
			move.ignoreAbility = true;
		},
		id: "turboblaze",
		name: "Turboblaze",
		rating: 3.5,
		num: 163,
	},
	"unaware": {
		desc: "This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
		id: "unaware",
		name: "Unaware",
		onAnyModifyBoost: function(boosts, target) {
			let source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		rating: 3,
		num: 109,
	},
	"unburden": {
		desc: "If this Pokemon loses its held item for any reason, its Speed is doubled. This boost is lost if it switches out or gains a new item or Ability.",
		shortDesc: "Speed is doubled on held item loss; boost is lost if it switches, gets new item/Ability.",
		onAfterUseItem: function(item, pokemon) {
			if (pokemon !== this.effectData.target) return;
			pokemon.addVolatile('unburden');
		},
		onTakeItem: function(item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		onEnd: function(pokemon) {
			pokemon.removeVolatile('unburden');
		},
		effect: {
			onModifySpe: function(spe, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(2);
				}
			},
		},
		id: "unburden",
		name: "Unburden",
		rating: 3.5,
		num: 84,
	},
	"undergrow": {
		shortDesc: "Uses Ingrain upon switch-in.",
		onStart: function(source) {
			this.add('-ability', pokemon, 'Undergrow');
			this.useMove('Ingrain', source);
		},
		id: "undergrow",
		name: "Undergrow",
	},
	"unnerve": {
		shortDesc: "While this Pokemon is active, it prevents opposing Pokemon from using their Berries.",
		onPreStart: function(pokemon) {
			this.add('-ability', pokemon, 'Unnerve', pokemon.side.foe);
		},
		onFoeTryEatItem: false,
		id: "unnerve",
		name: "Unnerve",
		rating: 1.5,
		num: 127,
	},
	"victorystar": {
		shortDesc: "This Pokemon and its allies' moves have their accuracy multiplied by 1.1.",
		onAllyModifyMove: function(move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.1;
			}
		},
		id: "victorystar",
		name: "Victory Star",
		rating: 2.5,
		num: 162,
	},
	"vitalspirit": {
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Vital Spirit');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Vital Spirit');
			return false;
		},
		id: "vitalspirit",
		name: "Vital Spirit",
		rating: 2,
		num: 72,
	},
	"voltabsorb": {
		desc: "This Pokemon is immune to Electric-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Electric-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Electric moves; Electric immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
		id: "voltabsorb",
		name: "Volt Absorb",
		rating: 3.5,
		num: 10,
	},
	"waterabsorb": {
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.",
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				return null;
			}
		},
		id: "waterabsorb",
		name: "Water Absorb",
		rating: 3.5,
		num: 11,
	},
	"waterbubble": {
		desc: "This Pokemon's Water-type attacks have their power doubled, the power of Fire-type attacks against this Pokemon is halved, and this Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.",
		onBasePowerPriority: 7,
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onUpdate: function(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Bubble');
			return false;
		},
		id: "waterbubble",
		name: "Water Bubble",
		rating: 4,
		num: 199,
	},
	"watercompaction": {
		shortDesc: "This Pokemon's Defense is raised 2 stages after it is damaged by a Water-type move.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.type === 'Water') {
				this.boost({
					def: 2
				});
			}
		},
		id: "watercompaction",
		name: "Water Compaction",
		rating: 2,
		num: 195,
	},
	"waterveil": {
		shortDesc: "This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Veil');
			return false;
		},
		id: "waterveil",
		name: "Water Veil",
		rating: 2,
		num: 41,
	},
	"weakarmor": {
		desc: "If a physical attack hits this Pokemon, its Defense is lowered by 1 stage and its Speed is raised by 2 stages.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 2.",
		onAfterDamage: function(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({
					def: -1,
					spe: 2
				});
			}
		},
		id: "weakarmor",
		name: "Weak Armor",
		rating: 1,
		num: 133,
	},
	"whitesmoke": {
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: White Smoke", "[of] " + target);
		},
		id: "whitesmoke",
		name: "White Smoke",
		rating: 2,
		num: 73,
	},
	"wimpout": {
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it immediately switches out to a chosen ally. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect. This effect applies to both direct and indirect damage, except Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage.",
		shortDesc: "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.",
		onAfterMoveSecondary: function(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				source.switchFlag = false;
				this.add('-activate', target, 'ability: Wimp Out');
			}
		},
		onAfterDamage: function(damage, target, source, effect) {
			if (!target.hp || effect.effectType === 'Move') return;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
				target.switchFlag = true;
				this.add('-activate', target, 'ability: Wimp Out');
			}
		},
		id: "wimpout",
		name: "Wimp Out",
		rating: 2,
		num: 193,
	},
	"wonderguard": {
		shortDesc: "This Pokemon can only be damaged by supereffective moves and indirect damage.",
		onTryHit: function(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-immune', target, '[msg]', '[from] ability: Wonder Guard');
				return null;
			}
		},
		id: "wonderguard",
		name: "Wonder Guard",
		rating: 5,
		num: 25,
	},
	"wonderskin": {
		desc: "All non-damaging moves that check accuracy have their accuracy changed to 50% when used on this Pokemon. This change is done before any other accuracy modifying effects.",
		shortDesc: "Status moves with accuracy checks are 50% accurate when used on this Pokemon.",
		onModifyAccuracyPriority: 10,
		onModifyAccuracy: function(accuracy, target, source, move) {
			if (move.category === 'Status' && typeof move.accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 50;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 2,
		num: 147,
	},
	"wrestler": {
		shortDesc: "This Pokemon's Fighting-type attacks have their power multiplied by 1.5.",
		onBasePowerPriority: 8,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fighting') {
				this.debug('Wrestler boost');
				return this.chainModify(1.5);
			}
		},
		id: "wrestler",
		name: "Wrestler",
		rating: 3,
		num: 200,
	},
	"zenmode": {
		desc: "If this Pokemon is a Darmanitan, it changes to Zen Mode if it has 1/2 or less of its maximum HP at the end of a turn. If Darmanitan's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Standard Mode. If Darmanitan loses this Ability while in Zen Mode it reverts to Standard Mode immediately.",
		shortDesc: "If Darmanitan, at end of turn changes Mode to Standard if > 1/2 max HP, else Zen.",
		onResidualOrder: 27,
		onResidual: function(pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitan') {
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitanzen') {
				pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
				pokemon.removeVolatile('zenmode');
			}
		},
		onEnd: function(pokemon) {
			if (!pokemon.volatiles['zenmode'] || !pokemon.hp) return;
			pokemon.transformed = false;
			delete pokemon.volatiles['zenmode'];
			if (pokemon.formeChange('Darmanitan')) {
				this.add('-formechange', pokemon, 'Darmanitan', '[silent]');
			}
		},
		effect: {
			onStart: function(pokemon) {
				if (pokemon.template.speciesid === 'darmanitanzen' || !pokemon.formeChange('Darmanitan-Zen')) return;
				this.add('-formechange', pokemon, 'Darmanitan-Zen', '[from] ability: Zen Mode');
			},
			onEnd: function(pokemon) {
				if (!pokemon.formeChange('Darmanitan')) return;
				this.add('-formechange', pokemon, 'Darmanitan', '[from] ability: Zen Mode');
			},
		},
		id: "zenmode",
		name: "Zen Mode",
		rating: -1,
		num: 161,
	},
	// CAP
	"mountaineer": {
		shortDesc: "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.",
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit: function(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[msg]', '[from] ability: Mountaineer');
				return null;
			}
		},
		id: "mountaineer",
		isNonstandard: true,
		name: "Mountaineer",
		rating: 3.5,
		num: -2,
	},
	"rebound": {
		desc: "On switch-in, this Pokemon blocks certain status moves and instead uses the move against the original user.",
		shortDesc: "On switch-in, blocks certain status moves and bounces them back to the user.",
		id: "rebound",
		isNonstandard: true,
		name: "Rebound",
		onTryHitPriority: 1,
		onTryHit: function(target, source, move) {
			if (this.effectData.target.activeTurns) return;
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide: function(target, source, move) {
			if (this.effectData.target.activeTurns) return;
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, this.effectData.target, source);
			return null;
		},
		effect: {
			duration: 1,
		},
		rating: 3.5,
		num: -3,
	},
	"persistent": {
		shortDesc: "The duration of certain field effects is increased by 2 turns if used by this Pokemon.",
		id: "persistent",
		isNonstandard: true,
		name: "Persistent",
		// implemented in the corresponding move
		rating: 3.5,
		num: -4,
	},
	"volcanichaze": {
		desc: "On switch-in, this Pokemon lowers the Speed of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Speed of adjacent opponents by 1 stage.",
		onStart: function(pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Volcanic Haze', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({
						spe: -1
					}, foeactive[i], pokemon);
				}
			}
		},
		id: "volcanichaze",
		name: "Volcanic Haze",
		rating: 3.5,
		num: 22,
	},
};
