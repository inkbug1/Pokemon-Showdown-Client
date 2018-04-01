exports.BattleMovedex = {
	"wrathofnature": {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "This move combines Fighting in its type effectiveness against the target.",
		shortDesc: "Combines Fighting in its type effectiveness.",
		id: "wrathofnature",
		name: "Wrath Of Nature",
		pp: 10,
		flags: {
			contact: 1,
			protect: 1,
			mirror: 1
		},
		onEffectiveness: function(typeMod, type, move) {
			return typeMod + this.getEffectiveness('Fighting', type);
		},
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass",
		zMovePower: 180,
		contestType: "Tough",
	},
};
