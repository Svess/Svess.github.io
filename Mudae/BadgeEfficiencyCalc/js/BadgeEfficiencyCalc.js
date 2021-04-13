Vue.component("value-input", {
	props: {
		id: String,
		label: String,
		faIcon: String,
		value: Number,
		minTick: Number,
		maxTick: Number,
		tickVals: Array,
		isRank: Boolean
	},
	template: `
                  <div class="value-input">
                    <div class="form-group">
                      <label :for="id">{{label}}</label>
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text"><i :class="'fas fa-' + faIcon"></i></span>
                        </div>
                        <input type="number" class="form-control" id="claimRank" :placeholder="label" :value="value" @input="updateValue" :min="minTick" pattern="\d+" required>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="btn-group d-flex">
                      <button v-for="tick of allTicks" type="button" class="btn btn-light" :value="tick.value" @click="changeValue">{{tick.label}}</button>
                    </div>
                    </div>
                  </div>
                `,
	computed: {
		allTicks: function () {
			this.tickVals.sort();
			ticks = [];
			tick_labels = [];

			for (let val of this.tickVals.reverse()) {
				tick = {
					value: this.isRank ? val : -1 * val
				};
				tick.label = tick.value > 0 ? `+${tick.value}` : tick.value;
				ticks.push(tick);
			}

			for (let val of this.tickVals.reverse()) {
				tick = {
					value: this.isRank ? -1 * val : val
				};
				tick.label = tick.value > 0 ? `+${tick.value}` : tick.value;
				ticks.push(tick);
			}

			if (this.maxTick) {
				if (this.isRank) {
					ticks.unshift({
						value: this.maxTick,
						label: `Max: ${this.maxTick}`
					});
					ticks.push({
						value: this.minTick,
						label: `Min: ${this.minTick}`
					});
				} else {
					ticks.unshift({
						value: this.minTick,
						label: `Min: ${this.minTick}`
					});
					ticks.push({
						value: this.maxTick,
						label: `Max: ${this.maxTick}`
					});
				}
			} else {
				ticks.splice(ticks.length / 2, 0, {
					value: this.minTick,
					label: this.minTick
				});
			}
			return ticks;
		}
	},
	methods: {
		updateValue: function (event) {
			this.$emit("input", event.target.value);
		},
		changeValue: function (event) {
			value_change = Number(event.target.value);
			label = event.target.innerText;
			if (label.startsWith("+") || label.startsWith("-")) {
				this.value = Math.max(this.value + value_change, this.minTick);
			} else {
				this.value = value_change;
			}
			this.$emit("input", this.value);
		}
	}
});

let app = new Vue({
	el: "#app",
	data: {
		bronzeValue:1000,
		silverValue:1000,
		goldValue:1000,
		sapphireValue:1000,
		rubyValue:1000,
		emeraldValue:1000,
		timeWasted:10,
		hoursPerClaim:3,
		averageCharacterValue:150,
		averageValueOfKakera:191.35803561590,
		afterSapphireIV:379.33738561590
	},
	
	
	
	computed: {
		BadgeValues: function () {
			let lst = [
				this.bronzeValue,
				this.silverValue,
				this.goldValue,
				this.sapphireValue,
				this.rubyValue,
				this.emeraldValue
			];
			let values = [];
			for (let i = 0; i < lst.length; i++) {
				for (let j = 1; j <= 4; j++) {
					values.push(lst[i]*j);
				}
			}
			return values;
		},
		
		
		SumValues: function () {
			let list = [
				this.bronzeValue,
				this.silverValue,
				this.goldValue,
				this.sapphireValue,
				this.rubyValue,
				this.emeraldValue
			];
			let sumValues = [];
			for (let i = 0; i < list.length; i++) {
				sumValues.push(list[i], list[i]*3, list[i]*6, list[i]*10);
			}
			return sumValues;
		},
		
		
		TotalCost: function () {
			return this.BadgeValues.reduce((a, b) => a + b);
		},
		
		
		BaseDailyIncome: function () {
			return Math.round(this.averageValueOfKakera*(this.timeWasted/5));
		},
		
	// Ruby Route
		RubyBase: function () {
			let cost = this.SumValues[1]+this.SumValues[5]+this.SumValues[9]+this.SumValues[19];
			let remaining = (this.TotalCost-cost)*0.75;
			let time = Math.round(cost/this.BaseDailyIncome*100)/100;
			let lst = [cost, remaining, time];
			return lst;
		},
		
		
		IncomeAfterRuby: function () {
			return Math.round(this.averageValueOfKakera*(this.timeWasted/3));
		},
		
		
		RubyRouteIncome: function () {
			let lst = [];
			//Gold IV
			lst.push(Math.round(this.averageValueOfKakera*(this.timeWasted/2)));
			//Sapphire IV
			lst.push(Math.round(this.afterSapphireIV*(this.timeWasted/3)));
			//Gold & Sapphire IV
			lst.push(Math.round(this.afterSapphireIV*(this.timeWasted/2)));
			return lst;
		},
		
		
		RubyRouteMid: function () {
			let lst = []
			// Gold -> Sapphire
			let nextBadgeCost = this.SumValues[11]-this.SumValues[9];
			let newRemaining = this.RubyBase[1]-nextBadgeCost;
			let time = Math.round(nextBadgeCost/this.IncomeAfterRuby*100)/100;
			lst.push(nextBadgeCost, newRemaining, time)
			
			nextBadgeCost = this.SumValues[15];
			newRemaining = lst[1]-nextBadgeCost;
			time = Math.round(nextBadgeCost/this.IncomeAfterRuby*100)/100;
			lst.push(nextBadgeCost, newRemaining, time)
			// Sapphire -> Gold
			nextBadgeCost = this.SumValues[15];
			newRemaining = this.RubyBase[1]-nextBadgeCost;
			time = Math.round(nextBadgeCost/this.IncomeAfterRuby*100)/100;
			lst.push(nextBadgeCost, newRemaining, time)
			
			nextBadgeCost = this.SumValues[11]-this.SumValues[9];
			newRemaining = lst[7]-nextBadgeCost;
			time = Math.round(nextBadgeCost/this.IncomeAfterRuby*100)/100;
			lst.push(nextBadgeCost, newRemaining, time)
			
			return lst;
		},
		
		
		RubyRouteEnd: function () {
			// Gold -> Sapphire
			// Sapphire -> Gold
		},
		
	// Emerald Route
		EmeraldBase: function () {
			let cost = this.SumValues[2]+this.SumValues[6]+this.SumValues[10]+this.SumValues[19];
			let remaining = this.TotalCost-cost;
			let time = Math.round(cost/this.BaseDailyIncome*100)/100;
			let lst = [cost, remaining, time];
			return lst;
		},
		
		
		IncomeAfterEmerald: function () {
			return Math.round(this.averageValueOfKakera*(this.timeWasted/3.5) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim));
		},
		
		
		EmeraldRouteIncome: function () {
			let lst = [];
			//Gold IV
			lst.push(Math.round(this.averageValueOfKakera*(this.timeWasted/3) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim)));
			//Sapphire IV
			lst.push(Math.round(this.afterSapphireIV*(this.timeWasted/3.5) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim)));
			//Ruby IV
			lst.push(Math.round(this.averageValueOfKakera*(this.timeWasted/2.5) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim)));
			//Gold & Sapphire IV
			lst.push(Math.round(this.afterSapphireIV*(this.timeWasted/3) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim)));
			//Gold & Ruby IV
			lst.push(Math.round(this.averageValueOfKakera*(this.timeWasted/2) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim)));
			//Sapphire & Ruby IV
			lst.push(Math.round(this.afterSapphireIV*(this.timeWasted/2.5) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim)));
			//Gold, Sapphire & Ruby IV
			lst.push(Math.round(this.afterSapphireIV*(this.timeWasted/2) + this.averageCharacterValue*Math.ceil(this.timeWasted/this.hoursPerClaim)));
			return lst;
		},
		
		
		EmeraldRouteMid: function () {
			// Gold -> Sapphire -> Ruby
			// Gold -> Ruby -> Sapphire
			// Sapphire -> Gold -> Ruby
			// Sapphire -> Ruby -> Gold
			// Ruby -> Gold -> Sapphire
			// Ruby -> Sapphire -> Gold
		},
		
		
		EmeraldRouteEnd: function () {
			// Gold -> Sapphire -> Ruby
			// Gold -> Ruby -> Sapphire
			// Sapphire -> Gold -> Ruby
			// Sapphire -> Ruby -> Gold
			// Ruby -> Gold -> Sapphire
			// Ruby -> Sapphire -> Gold
		}
	},
	mounted: function () {
		hljs.initHighlightingOnLoad();
	}
});
