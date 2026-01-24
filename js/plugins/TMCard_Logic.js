//=============================================================================
// TMPlugin - カードゲーム (Logic)
// ファイル名: TMCard_Logic.js
//=============================================================================

/*:
 * @plugindesc カードゲームのロジック処理ファイルです。Coreの後に読み込んでください。
 * @author tomoaky (Edit by Rowkoc)
 */

var Imported = Imported || {};
Imported.TMCard_Logic = true;

(function() {

	//-----------------------------------------------------------------------------
	// Game_CardBattle
	//
	function Game_CardBattle() {
		this.initialize.apply(this, arguments);
	}
    window.Game_CardBattle = Game_CardBattle; // グローバル公開

	Game_CardBattle.prototype.initialize = function() {
		this._maxAtk = TMPlugin.Card.MaxAtk;
		this._battleFinished = false;
	};

	Object.defineProperties(Game_CardBattle.prototype, {
		maxAtk: { get: function() { return this._maxAtk; }, configurable: true },
		turn: { get: function() { return this._turn; }, configurable: true }
	});

	Game_CardBattle.prototype.setDecks = function(enemyName, enemyItemCardId, enemyCardIds) {
		this._maxAtk = TMPlugin.Card.MaxAtk;
		this._battleFinished = false;
		var playerName = $gameParty.battleMembers().length === 0 ? 'プレイヤー' : $gameParty.leader().name();
		var playerItemCard = $gameParty.itemCard();
		this._playerDeck = new Game_Deck(playerName, playerItemCard ? playerItemCard.id : 0, $gameParty.activeDeck().concat());
		this._enemyDeck = new Game_EnemyDeck(enemyName, enemyItemCardId, enemyCardIds);
		this._turn = this.makeOrders();
		this._firstAttack = this._turn;
		this._startPlayer = this._turn;
		this._playerActive= false;
		this._enemyActive= false;
		this._turnCount = 0;
		this._cardDeath = false;
		this._phase = 0;
		this._damage = 0;
		this._typeBonus = true;
		this._messages = [];
		this._waitCount = 0;
		this.addMessage(0, 'ラウンド ' + (this._turnCount+1));
		AudioManager.playSe({"name":"Bell1","volume":90,"pitch":100,"pan":0})
	};

	Game_CardBattle.prototype.makeOrders = function() {
		var a = this._playerDeck.cost();
		var b = this._enemyDeck.cost();
		a = this._playerDeck.card(0).spd();
		b = this._enemyDeck.card(0).spd();
		console.log("turn Check a="+a+", b="+b);
		if (a !== b) return a > b;
		a = this._playerDeck.card(0).hp();
		b = this._enemyDeck.card(0).hp();
		if (a !== b) return a < b;
		a = this._playerDeck.card(0).atk();
		b = this._enemyDeck.card(0).atk();
		if (a !== b) return a < b;
		a =Math.random();
    	b =Math.random();
    	return a >= b;
		return false;
	};

	Game_CardBattle.prototype.checkOrders = function(attacker, target, turn) {
    	var a = attacker.spd();
    	var b = target.spd();
    	console.log("turn Check a="+a+", b="+b+", this._turn="+turn);
    	if (a >= b) return turn;
        console.log("順番反転");
    	return !turn;
  	};

	Game_CardBattle.prototype.playerDeck = function() {
		return this._playerDeck;
	};

	Game_CardBattle.prototype.enemyDeck = function() {
		return this._enemyDeck;
	};
	
	Game_CardBattle.prototype.turnCount = function() {
		return this._turnCount+1;
	};

	Game_CardBattle.prototype.attackerDeck = function() {
		return this._turn ? this._playerDeck : this._enemyDeck;
	};

	Game_CardBattle.prototype.targetDeck = function() {
		return this._turn ? this._enemyDeck : this._playerDeck;
	};

	Game_CardBattle.prototype.changeMaxAtk = function(value) {
		this._maxAtk = Math.max(value, 1);
	};

	Game_CardBattle.prototype.update = function() {
		this.updateWaitCount();
		this._playerDeck.update();
		this._enemyDeck.update();
		if (this.isPhaseUpdateEnable()) {
			if (this._phase === 0) {
				this.updatePreparationPhase();
			} else if (this._phase === 1) {
				this.updateCalculationPhase();
			} else if (this._phase === 2) {
				this.updateAttackPhase();
			} else if (this._phase === 3) {
				this.updateJudgmentPhase();
			} else if (this._phase === 4) {
				this.updateEndPhase();
			} else {
				this._battleFinished = true;
			}
		}
	};

	Game_CardBattle.prototype.updateWaitCount = function() {
		if (this._waitCount > 0) {
			var speed = Math.max($gameVariables.value(TMPlugin.Card.VNBattleSpeed), 1);
			this._waitCount -= speed;
			if (this._waitCount < 0) this._waitCount = 0;
		}
	};

	Game_CardBattle.prototype.isPhaseUpdateEnable = function() {
		if (this._messages.length > 0) return false;
		if (this._waitCount > 0) return false;
		if (this._playerDeck.isAnyCardShaked()) return false;
		if (this._enemyDeck.isAnyCardShaked()) return false;
		return true;
	};

	Game_CardBattle.prototype.updatePreparationPhase = function() {
		var attacker = this.attackerDeck();
		var target = this.targetDeck();
		attacker.card().open();
		target.card().open();
		attacker.initTurnStart();
		this.addMessage(0, attacker.userName() + 'のターン');
		this.updateRebound(attacker);
		console.log("～～～～～準備フェイズ～～～～～");
		console.log("▼攻撃側スキルチェック");
		this.checkSkill(attacker, target, true);
		console.log("▼防御側スキルチェック");
		this.checkSkill(target, attacker, false);
		this._phase += 1;
	};

	Game_CardBattle.prototype.updateCalculationPhase = function() {
		var attacker = this.attackerDeck();
		var target = this.targetDeck();
		if (target.hp === 0){
			console.log("※計算フェイズスキップ");
    	}else{
			this.addMessage(0, attacker.card().name() + ' の攻撃');
			this._damage = attacker.atk;
			this.applyTypeBonus(attacker, target);
			console.log("～～～～～計算フェイズ～～～～～");
			console.log("▼攻撃側スキルチェック");
			this.checkSkill(attacker, target, true);
			console.log("▼防御側スキルチェック");
			this.checkSkill(target, attacker, false);
			attacker.setPow(this._damage);
		}
		this._phase += 1;
	};

	Game_CardBattle.prototype.updateAttackPhase = function() {
		var attacker = this.attackerDeck();
		var target = this.targetDeck();
		var animationId = attacker.card().attackAnimation();
		if (target.hp === 0){
			console.log("※攻撃フェイズスキップ");
	    }else{
	    	console.log("～～～～～ダメージフェイズ～～～～～");
	    	console.log(attacker.card().name()+"の攻撃ダメージ = "+this._damage);
	    	target.setPow(this._damage);
			target.gainHp(-this._damage);
			if (this._turn) {
				this.addMessage(2, animationId || TMPlugin.Card.AnimationAttack);
			} else {
				this.addMessage(1, animationId || TMPlugin.Card.AnimationEnemyAttack);
			}
			this.addMessage(0, target.card().name() + ' に ' + this._damage + ' ダメージ');
			this.addMessage(4, 0);
			
			for (;;) {
				var attackerLastHp = attacker.hp;
				var targetLastHp = target.hp;
				this.checkSkill(attacker, target, true);
				this.checkSkill(target, attacker, false);
				if (attackerLastHp === attacker.hp && targetLastHp === target.hp) break;
			}
			this.addMessage(4, 0);
		}
		this._phase += 1;
	};

	Game_CardBattle.prototype.updateJudgmentPhase = function() {
		var attacker = this.attackerDeck();
		var target = this.targetDeck();
		attacker.refreshItemCardTone();
		target.refreshItemCardTone();
		console.log("～～～～～ジャッジフェイズ～～～～～");
		
		if (attacker.hp === 0){
            var bonus = attacker.card().cost();
            target.gainBp(bonus);
			attacker.knockout();
    		if (attacker.hp > 0) {
    			console.log("控えHP更新:"+ attacker.hp);
        		attacker.setDrawNumber(attacker.hp, attacker.atk, attacker.pow, attacker.bp);
    		}
    		this.addMessage(0, '撃破ボーナス! ' + target.userName() + ' 戦況値 +' + bonus);
			this._cardDeath =true;
		}
		if (target.hp === 0){
            var bonus = target.card().cost();
            attacker.gainBp(bonus);
			target.knockout();
			console.log("控えHP更新:"+ target.hp);
    		if (target.hp > 0) {
        		target.setDrawNumber(target.hp, target.atk, target.pow, target.bp);
    		}
    		this.addMessage(0, '撃破ボーナス! ' + attacker.userName() + ' 戦況値 +' + bonus);
			this._cardDeath =true	
		}
		console.log("cardDeath = "+this._cardDeath);
		this._phase += this.judgeWinLoss() ? 2 : 1;
	};

	Game_CardBattle.prototype.updateEndPhase = function() {
		if (this._turn){
			this._playerActive=true;
		}else{ 
		    this._enemyActive=true;
		}
		console.log("～～～～～エンドフェイズ～～～～～");
		console.log("ラウンド" + (this._turnCount+1)+" this._turn="+this._turn+", P-Active="+this._playerActive+". E-Active="+this._enemyActive);
		
		this._turn = !this._turn;

		if ((this._cardDeath)){
			console.log("===============死亡更新===============") ;
			this._turnCount += 1;
			this._playerActive=false;
			this._enemyActive =false;
			
			var attacker = this.attackerDeck();
			var target = this.targetDeck();
			if (!(attacker===null)&&!(target===null)){
				console.log("attacker = "+attacker.card(attacker.lose).name()+", target = "+target.card(target.lose).name());
				this._turn = this.checkOrders(attacker.card(attacker.lose), target.card(target.lose), this._turn);
			}
			this._firstAttack = this._turn;
			this.addMessage(0, 'ラウンド ' + (this._turnCount+1));
			AudioManager.playSe({"name":"Move1","volume":90,"pitch":120,"pan":0})
    	}else{
    		if ((this._playerActive)&&(this._enemyActive)){
				this._turnCount += 1;
				this._playerActive=false;
				this._enemyActive =false;
				this.addMessage(0, 'ラウンド ' + (this._turnCount+1));
				AudioManager.playSe({"name":"Move1","volume":90,"pitch":120,"pan":0})
			}
		} 
    	
    	this._cardDeath = false;
    	console.log("<<<<<<<<<<<<<<<<<<<<<<ラウンド" + (this._turnCount+1)+">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		if (this._turnCount === TMPlugin.Card.MaxTurn) {
			this.addMessage(3, 1);
			this.addMessage(0, '時間切れ');
			this.addMessage(0, '');
			
            var pBp = this._playerDeck.bp;
            var eBp = this._enemyDeck.bp;
            this.addMessage(0, '戦況値判定: ' + pBp + ' vs ' + eBp);

            if (pBp > eBp) {
                this.addMessage(3, 2);
                this.addMessage(0, '戦況値により ' + this._playerDeck.userName() + ' の勝利!');
                $gameVariables.setValue(TMPlugin.Card.VNResult, 2);
            } else if (eBp > pBp) {
                this.addMessage(3, 1);
                this.addMessage(0, '戦況値により 敗北...');
                $gameVariables.setValue(TMPlugin.Card.VNResult, 1);
            } else {
                this.addMessage(3, 1);
			    this.addMessage(0, '引き分け');
			    $gameVariables.setValue(TMPlugin.Card.VNResult, 0);
            }
			
			this._phase = 5;
		} else {
			this._phase = 0;
		}
	};

	Game_CardBattle.prototype.updateRebound = function(attacker) {
		if (attacker.isStateAffected(2) && attacker.atk < this.maxAtk) {
			attacker.atk += 1;
			this.addMessage(0, 'スキルの反動!! ' + TMPlugin.Card.ParamNames[4] + ' + 1');
		}
		if (attacker.isStateAffected(3) && attacker.atk > 1) {
			attacker.atk -= 1;
			this.addMessage(0, 'スキルの反動!! ' + TMPlugin.Card.ParamNames[4] + ' - 1');
		}
	};

	Game_CardBattle.prototype.applyTypeBonus = function(attacker, target) {
		if (this._typeBonus && $gameSystem.isTypeBonusEnabled()) {
			var a = attacker.cardType();
			var b = target.cardType();
			if ((a === 0 && b === 2) || (a === 1 && b === 0) ||
					(a === 2 && b === 1) || (a === 3 && b === 3)) {
				this._damage += 1;
				this.addMessage(this._turn ? 1 : 2, TMPlugin.Card.AnimationTypeBonus);
				this.addMessage(0, 'タイプボーナス!! 与えるダメージ + 1');
			}
		}
	};

	Game_CardBattle.prototype.checkSkill = function(attacker, target, active) {
		var deckSize = attacker.size();
		for (var i = 0; attacker.lose > i ; i++) {
			console.log("attacker.lose:"+ attacker.lose + ", i ="+i );
			var tmpNum = i;
			this.useSkill(attacker, tmpNum, target, active);
		}
		
		this.useSkill(attacker, deckSize, target, active);
		
		if (attacker.isItemCardReady()) {
			this.useSkill(attacker, deckSize + 1, target, active);
			this.useSkill(attacker, deckSize + 2, target, active);
		}
	};

	Game_CardBattle.prototype.judgeWinLoss = function() {
		if (this.isGameover()) {
			this._cardDeath = false;
			this._playerActive=false;
			this._enemyActive =false;
			this.addMessage(0, '勝負あり!!');
			this.addMessage(4, 120);
			if (this._playerDeck.lose === this._playerDeck.size() &&
					this._enemyDeck.lose === this._enemyDeck.size()) {
				this.addMessage(3, 1);
				this.addMessage(0, '引き分け');
				$gameVariables.setValue(TMPlugin.Card.VNResult, 0);
			} else if (this._playerDeck.lose === this._playerDeck.size()) {
				this.addMessage(3, 1);
				this.addMessage(0, '負けてしまった…');
				$gameVariables.setValue(TMPlugin.Card.VNResult, 1);
			} else {
				this.addMessage(3, 2);
				this.addMessage(0, this._playerDeck.userName() + ' の勝ち');
				$gameVariables.setValue(TMPlugin.Card.VNResult, 2);
			}
			this.addMessage(0, '');
			return true;
		}
		return false;
	};

	Game_CardBattle.prototype.isGameover = function() {
		return this._playerDeck.lose === this._playerDeck.size() ||
					 this._enemyDeck.lose === this._enemyDeck.size();
	};

	Game_CardBattle.prototype.addMessage = function(type, value) {
		var message = {
			type: type,
			value: value,
			playerHp: this._playerDeck.hp,
			playerAtk: this._playerDeck.atk.clamp(0, this.maxAtk),
			playerPow: this._playerDeck.pow,
			playerBp:  this._playerDeck.bp,
			enemyHp: this._enemyDeck.hp,
			enemyAtk: this._enemyDeck.atk.clamp(0, this.maxAtk),
			enemyPow: this._enemyDeck.pow,
			enemyBp:   this._enemyDeck.bp
		};
		this._messages.push(message);
		console.log("playerDeck.hp="+this._playerDeck.hp);
	};

	Game_CardBattle.prototype.getMessage = function() {
		if (this._messages.length > 0) {
			var message = this._messages.shift();
			
			this._playerDeck.setDrawNumber(message.playerHp, message.playerAtk,message.playerPow, message.playerBp);
			this._enemyDeck.setDrawNumber(message.enemyHp, message.enemyAtk,message.enemyPow, message.enemyBp);
			switch (message.type) {
			case 1:
				this._playerDeck.card().startAnimation(message.value, false, 0);
				break;
			case 2:
				this._enemyDeck.card().startAnimation(message.value, false, 0);
				break;
			case 3:
				if (message.value === 1) {
					BattleManager.playDefeatMe();
				} else if (message.value === 2) {
					BattleManager.playVictoryMe();
				}
				BattleManager.replayBgmAndBgs();
				break;
			case 4:
				this._waitCount = message.value;
				break;
			case 5:
				if (message.value) {
					this._playerDeck.itemCard().open();
				} else {
					this._enemyDeck.itemCard().open();
				}
				break;
			default:
				return message.value;
			}
		}
		return null;
	};

	Game_CardBattle.prototype.useSkill = function(user, index, target, active) {
		var skill = user.skill(index);
		if (!skill) return;
		
		console.log("Skill:"+ skill.name+", 発動:"+this.meetsConditions(skill, user, index, target, active));
		if (!this.meetsConditions(skill, user, index, target, active)) return;
		
        var bpCost = skill.meta.cardBpCost ? Number(skill.meta.cardBpCost) : 0;
        if (bpCost > 0) {
            user.gainBp(-bpCost);
        }
		
		var effect = skill.meta.cardEffect.split(',').map(Number);
		var param = effect[1];
		if (index > user.size()) {
			userCardName = user.itemCard().name();
			this.addMessage(5, active ? this._turn : !this._turn);
		} else {
			userCardName = user.card().name();
		}
		console.log("user:"+userCardName+", "+"Skill:"+ skill.name);
		
		var targetCardName = target.card().name();
		var animTargetInvert = false;
		var message = null;
		switch (effect[0]) {
		case 1:
			this._damage = Math.max(this._damage + param, 0);
			user.setPow(this._damage);
			message = '与えるダメージ ' + (param < 0 ? '- ' : '+ ') + Math.abs(param);
			break;
		case 2:
			this._damage *= 2;
			user.setPow(this._damage);
			message = '与えるダメージ 2 倍';
			break;
		case 3:
			this._damage = Math.max(this._damage + param, 0);
			user.setPow(this._damage);
			message = '受けるダメージ ' + (param < 0 ? '- ' : '+ ') + Math.abs(param);
			break;
		case 4:
			this._damage = Math.ceil(this._damage/2);
			user.setPow(this._damage);
			message = '受けるダメージ 半分';
			break;
		case 5:
			target.addState(1);
			message = targetCardName + ' の継承スキルを無効化';
			break;
		case 6:
			this._phase = 2;
			message = '相手の攻撃を無視';
			break;
		case 7:
			user.gainHp(param);
			user.setPow(param);
			message = TMPlugin.Card.ParamNames[3] + (param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 8:
			user.gainAtk(param);
			user.setPow(user.atk);
			message = TMPlugin.Card.ParamNames[4] + (param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 9:
			user.gainAtk(param - user.atk);
			user.setPow(user.atk);
			message = TMPlugin.Card.ParamNames[4] + ' が ' + param + ' になった';
			break;
		case 10:
			target.gainHp(param);
			target.setPow(param);
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[3] +
								(param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 11:
			target.gainAtk(param);
			target.setPow(target.atk);
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[4] +
								(param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 12:
			target.gainAtk(param - target.atk);
			target.setPow(target.atk);
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[4] +
								'が ' + param + ' になった';
			break;
		case 13:
			if (param === 0) {
				user.gainAtk(this.maxAtk - user.atk);
				user.setPow(user.atk);
				message = userCardName + ' の' + TMPlugin.Card.ParamNames[4] + 'が 最大 になった';
			} else {
				target.gainAtk(this.maxAtk - target.atk);
				target.setPow(target.atk);
				message = targetCardName + ' の' + TMPlugin.Card.ParamNames[4] + 'が 最大 になった';
			}
			break;
		case 14:
			this._damage = Math.max(this._damage + param, 0);
			user.gainHp(-param);
			user.setPow(this._damage);
			message = '与えるダメージ ' + (param < 0 ? '- ' : '+ ') + Math.abs(param) + ' / ' +
								 TMPlugin.Card.ParamNames[3] + (param < 0 ? ' + ' : ' - ') + Math.abs(param);
			break;
		case 15:
			if (param === 0) {
				var tempValue = user.hp;
				user.gainHp(target.hp - user.hp);
				target.gainHp(tempValue - target.hp);
				message = TMPlugin.Card.ParamNames[3] + '入れ替え';
			} else {
				var tempValue = user.atk;
				user.gainAtk(target.atk - user.atk);
				target.gainAtk(tempValue - target.atk);
				message = TMPlugin.Card.ParamNames[4] + '入れ替え';
			}
			break;
		case 16:
			if (param === 0) {
				var n = Math.floor((user.hp + target.hp) / 2);
				user.gainHp(n - user.hp);
				target.gainHp(n - target.hp);
				message = TMPlugin.Card.ParamNames[3] + '平均化';
			} else {
				var n = Math.floor((user.atk + target.atk) / 2);
				user.gainAtk(n - user.atk);
				target.gainAtk(n - target.atk);
				message = TMPlugin.Card.ParamNames[4] + '平均化';
			}
			break;
		case 17:
			target.gainHp(-param);
			animTargetInvert = true;
			message = targetCardName + ' に ' + param + ' ダメージ';
			break;
		case 18:
			user.gainHp(-param);
			target.gainHp(-param);
			message = userCardName + ' と ' + targetCardName + ' に ' +
								param + ' ダメージ';
			break;
		case 19:
			user.gainHp(+param);
			target.gainHp(-param);
			animTargetInvert = true;
			message = targetCardName + ' からHPを ' + param + ' 吸収した';
			break;
		case 20:
			user.changeSkill(index, target.skill(target.lose).id);
			message = '相手の' + TMPlugin.Card.ParamNames[7] + 'をコピー';
			break;
		case 21:
			user.changeSkill(index, target.skill(target.lose).id);
			target.changeSkill(target.lose, 0);
			message = '相手の' + TMPlugin.Card.ParamNames[7] + 'を奪った';
			break;
		case 22:
			target.changeSkill(target.lose, param);
			message = targetCardName + ' の ' + TMPlugin.Card.ParamNames[7] +
								'が ' + $dataSkills[param].name + ' になった';
			break;
		case 23:
			target.changeSkill(target.size(), param);
			message = targetCardName + ' の ' + TMPlugin.Card.ParamNames[8] +
								'が ' + $dataSkills[param].name + ' になった';
			break;
		case 24:
			user.resetSkillCount();
			message = userCardName + ' の ' + TMPlugin.Card.ParamNames[6] + 'が復活';
			break;
		case 25:
			this._typeBonus = false;
			message = '以降のタイプボーナスを無効化';
			break;
		case 26:
			this.changeMaxAtk(param);
			message = TMPlugin.Card.ParamNames[4] + '上限が' + param + ' に変更';
			break;
		case 27:
			this.changeMaxAtk(this.maxAtk + param);
			message = TMPlugin.Card.ParamNames[4] + '上限 ' + (param < 0 ? '- ' : '+ ') +
								Math.abs(param);
			break;
		case 28:
			this.changeMaxAtk(user.atk);
			message = TMPlugin.Card.ParamNames[4] + '上限が' + this.maxAtk + ' に変更';
			break;
		case 29:
			if (param === 0) {
				user.gainAtk(1 - user.atk);
				user.addState(2);
				message = userCardName + ' の' + TMPlugin.Card.ParamNames[4] + 'が 1 になった';
			} else {
				target.gainAtk(1 - target.atk);
				target.addState(2);
				message = targetCardName + ' の' + TMPlugin.Card.ParamNames[4] + 'が 1 になった';
			}
			break;
		case 30:
			if (param === 0) {
				user.gainAtk(this.maxAtk - user.atk);
				user.addState(3);
				message = userCardName + ' の' + TMPlugin.Card.ParamNames[4] + 'が 最大 になった';
			} else {
				target.gainAtk(this.maxAtk - target.atk);
				target.addState(3);
				message = targetCardName + ' の' + TMPlugin.Card.ParamNames[4] + 'が 最大 になった';
			}
			break;
		case 31:
			var count = 0;
			var tmp = skill.meta.cardEffect.split(',');
			var paramF = tmp[1];
  			for (var i = 0; i < user.size(); i++) {
    			if (user.card(i).faction().includes(paramF)) count++;
  			}
  			user.gainAtk(count);
  			message = 'デッキの'+paramF+'で' + TMPlugin.Card.ParamNames[4] + (count < 0 ? ' - ' : ' + ') + Math.abs(count);
			break
		case 32:
			var tmp = user.atk*param;
			target.gainHp(-tmp);
			animTargetInvert = true;
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 33:
			var tmp = Math.max(target.atk-user.atk, 0)*param;
			target.gainHp(-tmp);
			animTargetInvert = true;
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 34:
			var tmp = Math.max(target.hp-user.hp, 0)*param;
			target.gainHp(-tmp);
			animTargetInvert = true;
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 35:
			target.gainHp(-target.atk);
			animTargetInvert = true;
			this._phase = 2;
			message = targetCardName + ' にカウンター ' + target.atk + ' ダメージ';
			break;
		case 36:
			var tmp = Math.ceil(user.hp*param);
			user.gainAtk(tmp);
			user.setPow(tmp);
			animTargetInvert = true;
			message = TMPlugin.Card.ParamNames[4] + (param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 37:
			user.gainAtk(user.hp-user.atk);
			user.setPow(user.atk);
			animTargetInvert = true;
			message = TMPlugin.Card.ParamNames[4] + ' が ' + param + ' になった';
			break;
		case 38:
			var tmp = Math.ceil(target.hp*param);
			user.gainHP(-tmp);
			user.setPow(tmp);
			animTargetInvert = true;
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 39:
			var tmp = Math.ceil(target.hp - param);
			target.gainHP(-tmp);
			target.setPow(tmp);
			animTargetInvert = true;
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[3] +
								'が ' + param + ' になった';
			break;
		case 40:
			target.gainHp(-param);
			target.gainAtk(-param)
			animTargetInvert = true;
			target.setPow(param);
			message = targetCardName + ' に ' + param + ' ダメージ' + ' と' + TMPlugin.Card.ParamNames[4] +
								(param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 41:
			target.gainHp(-param);
			target.gainAtk(-1)
			animTargetInvert = true;
			target.setPow(param);
			message = targetCardName + ' に ' + param + ' ダメージ' + '! ' + TMPlugin.Card.ParamNames[4] + 'が下がった。';
			break;
		case 42:
			var tmp = param;
    		if (user.cardFaction().includes('帝国')){
    			tmp = param +1;
    			this._damage = Math.max(this._damage + tmp, 0);
    			console.log("帝国ボーナス "+ tmp + "ダメージ =" + this._damage);
    		}else{
    			this._damage = Math.max(this._damage + tmp, 0);
				console.log("帝国ボーナス未発生、ダメージ =" + this._damage);
    		}
			user.gainHp(-1);
			user.setPow(this._damage);
			message = userCardName + ' のHPを消費し、与えるダメージ ' + (tmp < 0 ? '- ' : '+ ') + Math.abs(tmp);
			break;
		case 43:
			if (target.hp === param){
				target.gainHp(-param);
				target.setPow(param);
				message = targetCardName + ' に ' + param + ' ダメージ';
			}else{
				var tmp;
				if (target.hp > param){
					tmp = Math.ceil((target.hp - param) / 2);
					target.gainHp(-tmp);
					target.setPow(tmp);
					message = targetCardName + ' に'+ tmp+' ダメージ';
				}else{
					tmp = Math.ceil((param - target.hp) / 2);
					target.gainHp(tmp);
					target.setPow(tmp);
					message = targetCardName + ' を'+tmp+' 回復';
				}
			}
			animTargetInvert = true;
			break;
		case 50:
			user.gainBp(param);
			message = '戦況値 ' + (param < 0 ? '- ' : '+ ') + Math.abs(param);
			break;
		case 51:
			target.gainBp(-param);
			message = targetCardName + 'の戦況値 - ' + Math.abs(param);
			break;
		}
		
		var isPlayer = active ? this._turn : !this._turn;
		if (animTargetInvert){
    		this.addMessage(isPlayer ? 2 : 1, skill.animationId);
    	}else{
    		this.addMessage(isPlayer ? 1 : 2, skill.animationId);
    	}	
		this.addMessage(0, userCardName + ' の ' + skill.name + ' 発動!!');
		this.addMessage(0, message);
		console.log(userCardName + ' の ' + skill.name + ' 発動!!')
		user.useSkill(index);
	};

	Game_CardBattle.prototype.meetsConditions = function(skill, user, index, target, active) {
		if (!user.checkSkillCount(index)) return false;
		if (user.isSkillUsed(index)) return false;
		
        var bpCost = skill.meta.cardBpCost ? Number(skill.meta.cardBpCost) : 0;
        if (user.bp < bpCost) return false;
		
		if (!this.meetsEffectConditions(skill, active)) return false;
		var rules = skill.meta.cardRules;
		if (rules) {
			rules = rules.split(' ');
			for (var i = 0; i < rules.length; i++) {
				var rule = rules[i].split(',').map(Number);
				var param = rule[1];
				switch (rule[0]) {
				case 1:
					if (!active || this._phase !== param) return false;
					break;
				case 2:
					if (active || this._phase !== param) return false;
					break;
				case 3:
					if (user.turnCount !== param) return false;
					break;
				case 4:
					if (param === -1 && user.cardType() === target.cardType()) return false;
					if (param === -2 && user.cardType() !== target.cardType()) return false;
					if (param >= 0 && target.cardType() !== param) return false;
					break;
				case 5:
					if (param === -1 && user.cardElement() === target.cardElement()) return false;
					if (param === -2 && user.cardElement() !== target.cardElement()) return false;
					if (param >= 0 && target.cardElement() !== param) return false;
					break;
				case 6:
					if (param === -1 && user.cardRare() === target.cardRare()) return false;
					if (param === -2 && user.cardRare() !== target.cardRare()) return false;
					if (param >= 0 && target.cardRare() !== param) return false;
					break;
				case 7:
					if (target.lose !== param) return false;
					break;
				case 8:
					if (target.hp < param) return false;
					break;
				case 9:
					if (target.hp > param) return false;
					break;
				case 10:
					if (target.hp !== param) return false;
					break;
				case 11:
					if (target.hp % 2 !== param) return false;
					break;
				case 12:
					if (target.atk < param) return false;
					break;
				case 13:
					if (target.atk > param) return false;
					break;
				case 14:
					if (target.atk !== param) return false;
					break;
				case 15:
					if (target.atk % 2 !== param) return false;
					break;
				case 16:
					if (user.cardType() !== param) return false;
					break;
				case 17:
					if (user.cardElement() !== param) return false;
					break;
				case 18:
					if (user.cardRare() !== param) return false;
					break;
				case 19:
					if (user.lose !== param) return false;
					break;
				case 20:
					if (user.hp < param) return false;
					break;
				case 21:
					if (user.hp > param) return false;
					break;
				case 22:
					if (user.hp !== param) return false;
					break;
				case 23:
					if (user.hp % 2 !== param) return false;
					break;
				case 24:
					if (user.atk < param) return false;
					break;
				case 25:
					if (user.atk > param) return false;
					break;
				case 26:
					if (user.atk !== param) return false;
					break;
				case 27:
					if (user.atk % 2 !== param) return false;
					break;
				case 28:
					var result = false;
					for (var i = 0; i <= index; i++) {
						if (user.skill(i).id === param) result = true;
					}
					if (!result) return false;
					break;
				case 29:
					if (user.cardCost() >= target.cardCost()) return false;
					break;
				case 30:
					if (user.cardCost() <= target.cardCost()) return false;
					break;
				case 31:
					for (var i = 0; i < user.size(); i++) {
						if (user.card(i).type() !== user.cardType()) return false;
					}
					break;
				case 32:
					for (var i = 0; i < user.size(); i++) {
						if (user.card(i).element() !== user.cardElement()) return false;
					}
					break;
				case 33:
					if (user.cost() < param) return false;
					break;
				case 34:
					if (user.cost() > param) return false;
					break;
				case 35:
					if (Math.random()*100 > param) return false;
					break;
				case 36:
					var tmp =rules[i].split(',');
					var paramF = tmp[1];
					const factions = user.cardFaction();
					console.log("factions="+factions+", param="+paramF+", check:"+factions);
  					if (!factions.includes(paramF)) return false;
					break;
				case 37:
					var tmp =rules[i].split(',');
					var factionName = tmp[1];
  					var countRequired = rule[2] || 1;
  					var count = 0;
  					for (var i = 0; i < user.size(); i++) {
    					if (user.card(i).faction().includes(factionName)) count++;
  					}
  					if (count < countRequired) return false;
  					break;
  				case 38:
					if (user.turnCount < param) return false;
					break;
				case 39:
					if (this._turnCount > param) return false;
					break;
				case 40:
					if (this._turnCount < param) return false;
					break;
				case 41:
					if (this._turnCount % 2 !== param) return false;
				case 42:
					if (user.bp < param) return false;
				case 43:
					if (user.bp > param) return false;
				case 44:
					if (target.bp - user.bp < param) return false;
				case 45:
					if (target.bp - user.bp > param) return false;
				}
			}
		}
		return true;
	};

	Game_CardBattle.prototype.meetsEffectConditions = function(skill, active) {
		if (!skill.meta.cardEffect) return false;
		var effect = skill.meta.cardEffect.split(',').map(Number);
		if ([1, 2, 14].contains(effect[0])) {
			return active && this._phase === 1;
		} else if ([3, 4].contains(effect[0])) {
			return !active && this._phase === 1;
		} else if ([6].contains(effect[0])) {
			return !active && this._phase === 0;
		} else if ([17, 18].contains(effect[0])) {
			return active && this._phase === 0;
		}
		return true;
	};

	var $gameCardBattle = new Game_CardBattle();
    window.$gameCardBattle = $gameCardBattle; // グローバルアクセス

	//-----------------------------------------------------------------------------
	// Game_Deck
	//
	function Game_Deck() {
		this.initialize.apply(this, arguments);
	}
    window.Game_Deck = Game_Deck;

	Object.defineProperties(Game_Deck.prototype, {
		lose: { get: function() { return this._lose; }, configurable: true },
		turnCount: { get: function() { return this._turnCount; }, configurable: true },
		chargeTime: { get: function() { return this._chargeTime; }, configurable: true },
		hp: { get: function() { return this._hp; }, configurable: true },
		atk: { get: function() { return this._atk; }, configurable: true },
		pow: { get: function() { return this._pow; }, configurable: true },
		hpDraw: { get: function() { return this._hpDraw; }, configurable: true },
		atkDraw: { get: function() { return this._atkDraw; }, configurable: true },
		powDraw: { get: function() { return this._powDraw; }, configurable: true },
		bp: { get: function() { return this._bp; }, configurable: true },
        bpDraw: { get: function() { return this._bpDraw; }, configurable: true }
	});

	Game_Deck.prototype.initialize = function(userName, itemCardId, cardIds) {
		this._userName = userName;
		this._itemCardId = itemCardId;
		this._cardIds = cardIds;
		this.initMembers();
		this.initCardStatus();
		this.initCardPositions();
		this._bp = TMPlugin.Card.BP_Config.initial;
    	this._bpDraw = this._bp;
	};
	
	Game_Deck.prototype.initMembers = function() {
		this._lose = 0;
		this._cost = 0;
		this._cards = [];
		this._skills = [];
		this._skillCount = [];
		this._usedSkills = [];
		this._chargeTime = 0;
		for (var i = 0; i < this._cardIds.length; i++) {
			if (this._cardIds[i] === 0) continue;
			var card = new Game_Card(this._cardIds[i]);
			var index = this._cards.length;
			if (index > 0) card.setScale(0.5, 0.5);
			this._cards.push(card);
			this._skills.push(card.partySkill());
			this._skillCount.push(0);
			this._cost += card.cost();
		}
		this._skills.push(null);
		this._skillCount.push(0);
		if (this._itemCardId !== 0) {
			this._itemCard = new Game_Card(this._itemCardId);
			this._itemCard.setScale(0.5, 0.5);
			this._skills.push(this._itemCard.unitSkill());
			this._skills.push(this._itemCard.partySkill());
			this._skillCount.push(0);
			this._skillCount.push(0);
			this._cost += this._itemCard.cost();
		}
		this._hpDraw = 0;
		this._atkDraw = 0;
		this._powDraw = 0;
	};

	Game_Deck.prototype.initCardStatus = function() {
		console.log("●カード情報を初期化");
		this._turnCount = 0;
		this._states = [];
		var card = this.card();
		this._hp = card.hp();
		this._atk = card.atk().clamp(0, $gameCardBattle.maxAtk);
		this._spd = card.spd();
		this._pow = card.atk().clamp(0, $gameCardBattle.maxAtk);
		console.log("card.name="+card.name()+", [hp,atk,spd]=["+this._hp+","+this._atk+","+this._spd+"], pow="+this._pow);
		this._faction = card.faction();
		this._skills[this.size()] = card.unitSkill();
	};

	Game_Deck.prototype.initCardPositions = function() {
		for (var i = 0; i < this.size(); i++) {
			this.card(i).setPosition(TMPlugin.Card.PlayerCardPositions[i][0],
															 TMPlugin.Card.PlayerCardPositions[i][1])
		}
		if (this._itemCard) {
			this._itemCard.setPosition(TMPlugin.Card.PlayerItemCardPosition[0],
																 TMPlugin.Card.PlayerItemCardPosition[1])
		}
	};

	Game_Deck.prototype.initTurnStart = function() {
		this._usedSkills = [];
		this._turnCount += 1;
		this.decreaseChargeTime();
	};

	Game_Deck.prototype.decreaseChargeTime = function() {
		if (this._chargeTime > 0) {
			this._chargeTime -= 1;
			if (this._chargeTime === 0) this.refreshItemCardTone();
		}
	};

	Game_Deck.prototype.refreshItemCardTone = function() {
		if (!this._itemCard) return;
		var value = this.isItemCardReady() ? 0 : 255;
		this._itemCard.changeColorToneGray(value);
	};

	Game_Deck.prototype.knockout = function() {
		this.card()._knockout = true;
		console.log('戦闘不能で'+this.card().name()+'がknockout='+this.card()._knockout);
		this.card().changeColorToneGray(255);
		AudioManager.playSe({"name":"Crow","volume":90,"pitch":120,"pan":0})
		this._lose += 1;
		if (this._lose < this.size()) this.setNextCard();
	};

	Game_Deck.prototype.setNextCard = function() {
		this.initCardStatus();
		this.resetSkillCount();
		this.refreshCardPositions();
		this._hpDraw = this._hp;
		this._atkDraw = this._atk;
		this._powDraw = this._pow;
	};

	Game_Deck.prototype.refreshCardPositions = function() {
		var size = this.size();
		for (var i = 0; i < size; i++) {
			var index = (i - this._lose + size) % size;
			var x = TMPlugin.Card.PlayerCardPositions[index][0];
			var y = TMPlugin.Card.PlayerCardPositions[index][1];
			var scale = index === 0 ? 1.0 : 0.5;
			this.card(i).setMove(x, y, scale, scale);
		}
	};

	Game_Deck.prototype.isAnyCardShaked = function() {
		return this._cards.some(function(card) {
			return card.isShaking();
		});
	};

	Game_Deck.prototype.gainHp = function(value) {
		this._hp = Math.max(this._hp + value, 0);
		if (value < 0){
				AudioManager.playSe({"name":"Damage2","volume":90,"pitch":100,"pan":0})
			}else{
				if (value > 0){
					AudioManager.playSe({"name":"Heal3","volume":90,"pitch":100,"pan":0})
				}
		}
		const spriteset = SceneManager._scene._spriteset;
    	if (spriteset && typeof spriteset.startDamageDisplay === "function") {
        	spriteset.startDamageDisplay($gameCardBattle._turn, value);
        	console.log("gainHP side="+$gameCardBattle._turn+", damage="+ value);
    	}
	};

	Game_Deck.prototype.gainAtk = function(value) {
		this._atk += value;
		this._atk = this._atk.clamp(0, $gameCardBattle.maxAtk);
	};
	
	Game_Deck.prototype.setPow = function(value) {
		this._pow = value;
	};

	Game_Deck.prototype.addState = function(stateId) {
		this._states.push(stateId);
	};

	Game_Deck.prototype.isStateAffected = function(stateId) {
		return this._states.contains(stateId);
	};
	
    Game_Deck.prototype.gainBp = function(value) {
        this._bp = Math.max(this._bp + value, 0);
    };	

	Game_Deck.prototype.setDrawNumber = function(hpDraw, atkDraw, powDraw, bpDraw) {
		if (this._hpDraw > hpDraw) this.card().shake();
		this._hpDraw = hpDraw;
		this._atkDraw = atkDraw;
		this._powDraw = powDraw;
		if (bpDraw !== undefined) this._bpDraw = bpDraw;
	};

	Game_Deck.prototype.resetSkillCount = function() {
		for (var i = 0; i <= this.size(); i++) {
			this._skillCount[i] = 0;
		}
	};

	Game_Deck.prototype.checkSkillCount = function(index) {
		var skill = $dataSkills[this._skills[index]];
		var maxCount = skill.meta.cardRepeats ? +skill.meta.cardRepeats : 0;
		return this._skillCount[index] < maxCount;
	};

	Game_Deck.prototype.isSkillUsed = function(index) {
		return this._usedSkills[index];
	};

	Game_Deck.prototype.changeSkill = function(index, skillId) {
		this._skills[index] = skillId;
	};

	Game_Deck.prototype.useSkill = function(index) {
		if (index > this.size()) {
			this._chargeTime = this.itemCard().hp() + 1;
		}
		this._skillCount[index] += 1;
		this._usedSkills[index] = true;
	};

	Game_Deck.prototype.isItemCardReady = function() {
		if (this._itemCardId === 0) return false;
		return this._chargeTime === 0;
	};

	Game_Deck.prototype.userName = function() {
		return this._userName;
	};

	Game_Deck.prototype.size = function() {
		return this._cards.length;
	};

	Game_Deck.prototype.cost = function() {
		return this._cost;
	};

	Game_Deck.prototype.skill = function(index) {
		return $dataSkills[this._skills[index]];
	};

	Game_Deck.prototype.card = function(index) {
		if (index == null) index = this._lose;
		return this._cards[index];
	};

	Game_Deck.prototype.itemCard = function() {
		return this._itemCard;
	};

	Game_Deck.prototype.cardCost = function(index) {
		return this.card(index).cost();
	};

	Game_Deck.prototype.cardType = function(index) {
		return this.card(index).type();
	};

	Game_Deck.prototype.cardElement = function(index) {
		return this.card(index).element();
	};

	Game_Deck.prototype.cardRare = function(index) {
		return this.card(index).rare();
	};
	
	Game_Deck.prototype.cardFaction = function(index) {
		return this.card(index).faction();
	};

	Game_Deck.prototype.factionCount = function(factionName) {
		let count = 0;
		for (let i = 0; i < this.size(); i++) {
			if (this.card(i).cardFaction().includes(factionName)) {
				count++;
    		}
  		}
  		return count;
	};
	Game_Deck.prototype.factionCountAny = function(factionList) {
  		let count = 0;
		for (let i = 0; i < this.size(); i++) {
    		const factions = this.card(i).cardFaction();
    		if (factions.some(f => factionList.includes(f))) {
      			count++;
   			}
  		}
 		return count;
	};

	Game_Deck.prototype.update = function() {
		for (var i = 0; i < this.size(); i++) {
			this.card(i).update();
		}
	};

	//-----------------------------------------------------------------------------
	// Game_EnemyDeck
	//
	function Game_EnemyDeck() {
		this.initialize.apply(this, arguments);
	}
    window.Game_EnemyDeck = Game_EnemyDeck;

	Game_EnemyDeck.prototype = Object.create(Game_Deck.prototype);
	Game_EnemyDeck.prototype.constructor = Game_EnemyDeck;

	Game_EnemyDeck.prototype.initialize = function(userName, itemCardId, cardIds) {
		Game_Deck.prototype.initialize.call(this, userName, itemCardId, cardIds);
	};

	Game_EnemyDeck.prototype.initCardPositions = function() {
		for (var i = 0; i < this.size(); i++) {
			this.card(i).setPosition(TMPlugin.Card.EnemyCardPositions[i][0],
															 TMPlugin.Card.EnemyCardPositions[i][1])
		}
		if (this._itemCard) {
			this._itemCard.setPosition(TMPlugin.Card.EnemyItemCardPosition[0],
																 TMPlugin.Card.EnemyItemCardPosition[1])
		}
	};

	Game_EnemyDeck.prototype.refreshCardPositions = function() {
		var size = this.size();
		for (var i = 0; i < size; i++) {
			var index = (i - this._lose + size) % size;
			var x = TMPlugin.Card.EnemyCardPositions[index][0];
			var y = TMPlugin.Card.EnemyCardPositions[index][1];
			var scale = index === 0 ? 1.0 : 0.5;
			this.card(i).setMove(x, y, scale, scale);
		}
	};

	//-----------------------------------------------------------------------------
	// Game_Card
	//
	function Game_Card() {
		this.initialize.apply(this, arguments);
	}
	window.Game_Card = Game_Card;

	Game_Card.prototype.initialize = function(cardId) {
		this._cardId = Math.abs(cardId);
		this._item = $dataItems[this._cardId];
		this._hide = cardId < 0;
		this.initMembers();
		this._knockout = false;
	};
	
    Game_Card.prototype.style = function() {
        return (this._item && this._item.meta.cardStyle) ? this._item.meta.cardStyle : 'default';
    };
    
    Game_Card.prototype.layout = function() {
        var styleName = this.style();
        return TMPlugin.Card.Layouts[styleName] || TMPlugin.Card.Layouts['default'];
    };
	
	Game_Card.prototype.initMembers = function() {
		this._x = 0;
		this._y = 0;
		this._shiftX = 0;
		this._scaleX = 1.0;
		this._scaleY = 1.0;
		this._shakeX = 0;
		this._shakeAngle = 0.0;
		this._moveCount = 64;
		this._targetPosition = [0, 0, 1.0, 1.0];
		this._lastPosition = [0, 0, 1.0, 1.0];
		this._animations = [];
		this._colorToneGray = 0;
	};

	Game_Card.prototype.isAnimationRequested = function() {
		return this._animations.length > 0;
	};

	Game_Card.prototype.shiftAnimation = function() {
		return this._animations.shift();
	};

	Game_Card.prototype.startAnimation = function(animationId, mirror, delay) {
		var data = { animationId: animationId, mirror: mirror, delay: delay };
		this._animations.push(data);
	};

	Game_Card.prototype.setPosition = function(x, y) {
		this._x = x;
		this._y = y;
		this._targetPosition[0] = x;
		this._targetPosition[1] = y;
	};

	Game_Card.prototype.setScale = function(scaleX, scaleY) {
		this._scaleX = scaleX;
		this._scaleY = scaleY;
		this._targetPosition[2] = scaleX;
		this._targetPosition[3] = scaleY;
	};

	Game_Card.prototype.setMove = function(x, y, scaleX, scaleY) {
		this._lastPosition = [this._x, this._y, this._scaleX, this._scaleY];
		this._targetPosition = [x - this._x, y - this._y,
														scaleX - this._scaleX, scaleY - this._scaleY];
		this._moveCount = 0;
	};

	Game_Card.prototype.shake = function() {
		this._shakeX = 32;
		this._shakeAngle = 0.0;
	};

	Game_Card.prototype.isShaking = function() {
		return this._shakeX > 0;
	};

	Game_Card.prototype.screenX = function() {
		return this._x + this._shiftX;
	};

	Game_Card.prototype.screenY = function() {
		return this._y;
	};

	Game_Card.prototype.scaleX = function() {
		return this._scaleX;
	};

	Game_Card.prototype.scaleY = function() {
		return this._scaleY;
	};

	Game_Card.prototype.isHiding = function() {
		return this._hide;
	};

	Game_Card.prototype.open = function() {
		this._hide = false;
	};
	
	Game_Card.prototype.isKnockout = function() {
		return this._knockout;
	};

	Game_Card.prototype.colorToneGray = function() {
		return this._colorToneGray;
	};

	Game_Card.prototype.changeColorToneGray = function(colorToneGray) {
		this._colorToneGray = colorToneGray;
	};

	Game_Card.prototype.fileName = function() {
		return this._item.meta.cardImage || 'card_' + this._cardId;
	};
	
	Game_Card.prototype.knockoutName = function() {
		return this._item.meta.knockoutImage || 'knockout';
	};

	Game_Card.prototype.id = function() {
		return this._cardId;
	};

	Game_Card.prototype.name = function() {
		return this._item ? this._item.name : '';
	};

	Game_Card.prototype.cost = function() {
		return this._item ? +this._item.meta.cardCost : 0;
	};

	Game_Card.prototype.hp = function() {
		return this._item ? +this._item.meta.cardHp : 0;
	};

	Game_Card.prototype.atk = function() {
		return this._item ? +this._item.meta.cardAtk : 0;
	};
	
	Game_Card.prototype.spd = function() {
		return this._item ? +this._item.meta.cardSpd : 0;
	};
	
	Game_Card.prototype.pow = function() {
		return this._item ? +this._item.meta.cardAtk : 0;
	};

	Game_Card.prototype.type = function() {
		return this._item ? +this._item.meta.cardType : 0;
	};

	Game_Card.prototype.element = function() {
		return this._item ? +this._item.meta.cardElement : 0;
	};
	
	Game_Card.prototype.faction = function() {
    	if (!this._item || !this._item.meta.cardFaction) return [];
    		return this._item.meta.cardFaction.split(',').map(function(faction) {
        	return faction.trim();
    	});
	};
		
	Game_Card.prototype.factions = function() {
    	if (!this._item || !this._item.meta || !this._item.meta.cardFaction) return [];
    	return this._item.meta.cardFaction.split(',').map(s => s.trim());
	};
	
	Game_Card.prototype.rare = function() {
		return this._item ? +this._item.meta.cardRare : 0;
	};
	
	Game_Card.prototype.isFoil = function() {
    	return this._item && !!this._item.meta.Foil;
	};

	Game_Card.prototype.unitSkill = function() {
		return this._item ? +this._item.meta.unitSkill : 0;
	};

	Game_Card.prototype.unitSkillB = function() {
    	return this._item ? +this._item.meta.unitSkillB : 0;
  	};

	Game_Card.prototype.partySkill = function() {
		return this._item ? +this._item.meta.partySkill : 0;
	};

	Game_Card.prototype.attackAnimation = function() {
		return this._item ? +this._item.meta.cardAttackAnimation : 0;
	};

	Game_Card.prototype.update = function() {
		if (this.isShaking()) {
			this._shakeAngle += 0.7;
			this._shakeX -= 1;
			this._shiftX = Math.floor(Math.cos(this._shakeAngle) * this._shakeX);
		}
		if (this._moveCount < 64) {
			this._moveCount += 4;
			var d = Math.sin(this._moveCount * Math.PI / 128);
			this._x = this._lastPosition[0] + d * this._targetPosition[0];
			this._y = this._lastPosition[1] + d * this._targetPosition[1];
			this._scaleX = this._lastPosition[2] + d * this._targetPosition[2];
			this._scaleY = this._lastPosition[3] + d * this._targetPosition[3];
		}
	};
})();