//=============================================================================
// TMPlugin - カードゲーム (Core)
// ファイル名: TMCard_Core.js
// バージョン: 0.1.7b (Split Edition)
//=============================================================================

/*:
 * @plugindesc カードゲームの基本設定およびパラメータ管理用コアファイルです。
 * 他の拡張ファイル (Logic, Sprite, Scene) よりも先に読み込んでください。
 * @author tomoaky (Edit by Rowkoc)
 *
 * @param vnResult
 * @desc カードゲームの結果が代入されるゲーム変数番号。
 * 初期値: 1
 * @default 1
 *
 * @param vnMaxDeck
 * @desc 登録可能なデッキの最大数として扱うゲーム変数番号。
 * 初期値: 2
 * @default 2
 *
 * @param vnMaxCard
 * @desc 組み込めるカードの最大数として扱うゲーム変数番号。
 * 初期値: 3
 * @default 3
 *
 * @param vnMaxCost
 * @desc デッキのコスト上限として扱うゲーム変数番号。
 * 初期値: 4
 * @default 4
 *
 * @param vnDeckCode
 * @desc デッキコード生成時に一時的に値を入れるゲーム変数番号。
 * 初期値: 5
 * @default 5
 *
 * @param vnEnemyCode
 * @desc マッチング相手から送られてきたコードが入るゲーム変数番号。
 * 初期値: 6
 * @default 6
 *
 * @param fixCardNum
 * @desc デッキのカード枚数を最大値に固定するかどうか。
 * 初期値: 1 ( 0 で少ない枚数を許可 / 1 で最大値に限定 )
 * @default 1
 *
 * @param sameCard
 * @desc 同じカードを複数組み込めるかどうか。
 * 初期値: 1 ( 0 で組み込めない / 1 で組み込める )
 * @default 1
 *
 * @param useItemCard
 * @desc アイテムカードを利用するかどうか。
 * 初期値: 1 ( 0 で利用しない / 1 で利用する )
 * @default 1
 *
 * @param useAutoText
 * @desc カードグラフィックをスクリプトで生成するかどうか。
 * 初期値: 1 ( 0 で画像そのまま / 1 で自動生成 )
 * @default 1
 *
 * @param commandDeckEdit
 * @desc メニューのデッキ編集コマンド。
 * 初期値: デッキ編集
 * @default デッキ編集
 * * @param statusWindowWidth
 * @desc デッキ編集のカードステータスウィンドウの幅。
 * 初期値: 360
 * @default 360
 *
 * @param maxAtk
 * @desc 攻撃力の上限。
 * 初期値: 8
 * @default 8
 *
 * @param maxTurn
 * @desc このターン数を超えたら引き分けにする。
 * 初期値: 50
 * @default 50
 *
 * @param animationAttack
 * @desc 攻撃のアニメーション番号。
 * 初期値: 1
 * @default 1
 * @require 1
 * @type animation
 * * @param animationEnemyAttack
 * @desc 攻撃のアニメーション番号（エネミーカード）。
 * 初期値: 1
 * @default 1
 * @require 1
 * @type animation
 * * @param animationTypeBonus
 * @desc タイプボーナスのアニメーション番号。
 * 初期値: 52
 * @default 52
 * @require 1
 * @type animation
 * * @param paramNames
 * @desc 各種パラメータの名称。
 * 初期値: 名前 レア度 コスト ＨＰ 攻撃力 タイプ スキル 固有スキル 継承スキル 属性
 * @default 名前 レア度 コスト ＨＰ 攻撃力 タイプ スキル 固有スキル 継承スキル 属性
 *
 * @param itemCardParamNames
 * @desc アイテムカードの各種パラメータのの名称。
 * 初期値: ため時間 基本効果 特殊効果
 * @default ため時間 基本効果 特殊効果
 *
 * @param typeIcons
 * @desc カードタイプのアイコン番号。
 * 初期値: 76 77 81 79 176
 * @default 76 77 81 79 176
 *
 * @param typeSpeed
 * @desc カードタイプのスピード値。
 * 初期値: 1 4 0 2
 * @default 1 4 0 2
 *
 * @param elementIcons
 * @desc カード属性のアイコン番号。
 * 初期値: 64 65 66 67 68 69 70 71
 * @default 64 65 66 67 68 69 70 71
 *
 * @param rareNames
 * @desc カード稀少度の名称。
 * 初期値: Common Uncommon Rare Legend
 * @default Common Uncommon Rare Legend
 *
 * @param costIcon
 * @desc コスト表示のアイコン番号。
 * 初期値: 87
 * @default 87
 *
 * @param costIconSpace
 * @desc コスト表示のアイコン間隔。
 * 初期値: 20
 * @default 20
 *
 * @param positionNames
 * @desc カードポジションの名称。
 * 初期値: 1st 2nd 3rd 4th 5th
 * @default 1st 2nd 3rd 4th 5th
 *
 * @param itemCardPositionName
 * @desc アイテムカードのポジションの名称。
 * 初期値: ITM
 * @default ITM
 *
 * @param deckNames
 * @desc デッキの名称。
 * 初期値: デッキＡ デッキＢ デッキＣ デッキＤ デッキＥ
 * @default デッキＡ デッキＢ デッキＣ デッキＤ デッキＥ
 *
 * @param playerCardPositions
 * @desc プレイヤーカードの表示座標。
 * 初期値: 128,264 272,184 368,184 464,184 560,184
 * @default 128,264 272,184 368,184 464,184 560,184
 *
 * @param playerItemCardPosition
 * @desc プレイヤーアイテムカードの表示座標。
 * 初期値: 272,344
 * @default 272,344
 *
 * @param enemyCardPositions
 * @desc エネミーカードの表示座標。
 * 初期値: 688,264 544,344 448,344 352,344 256,344
 * @default 688,264 544,344 448,344 352,344 256,344
 *
 * @param enemyItemCardPosition
 * @desc エネミーアイテムカードの表示座標。
 * 初期値: 544,184
 * @default 544,184
 *
 * @param numberPositions
 * @desc ＨＰと攻撃力の表示座標。
 * 初期値: 128,488 208,456 688,488 608,456
 * @default 128,488 208,456 688,488 608,456
 * * @param messageWindowY
 * @type number
 * @desc カードゲームのメッセージウィンドウＹ座標
 * 初期値: 544
 * @default 544
 *
 * @param swAutoMode
 * @desc オートモードのON/OFFを切り替えるスイッチ番号。
 * 初期値: 10
 * @default 10
 *
 * @param vnBattleSpeed
 * @desc バトル速度(1=通常, 2=倍速, 3=爆速)を管理する変数番号。
 * 初期値: 11
 * @default 11
 * * @param resultImageWin
 * @desc 勝利時に表示する画像ファイル名(img/pictures/)
 * 初期値: result_win
 * @default result_win
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param resultImageLose
 * @desc 敗北時に表示する画像ファイル名(img/pictures/)
 * 初期値: result_lose
 * @default result_lose
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param resultImageDraw
 * @desc 引き分け時に表示する画像ファイル名(img/pictures/)
 * 初期値: result_draw
 * @default result_draw
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @requiredAssets img/pictures/c_back_0
 * @requiredAssets img/pictures/c_back_1
 * @requiredAssets img/pictures/c_back_2
 * @requiredAssets img/pictures/c_back_3
 * @requiredAssets img/pictures/c_back_i
 * @requiredAssets img/pictures/c_cursor
 * @requiredAssets img/pictures/c_frame_0
 * @requiredAssets img/pictures/c_frame_1
 * @requiredAssets img/pictures/c_frame_2
 * @requiredAssets img/pictures/c_frame_3
 * @requiredAssets img/pictures/c_frame_4
 * @requiredAssets img/pictures/c_frame_5
 * @requiredAssets img/pictures/c_frame_6
 * @requiredAssets img/pictures/c_frame_7
 * @requiredAssets img/pictures/c_frame_i
 * @requiredAssets img/pictures/c_rare_0
 * @requiredAssets img/pictures/c_rare_1
 * @requiredAssets img/pictures/c_rare_2
 * @requiredAssets img/pictures/c_rare_3
 * @requiredAssets img/pictures/c_rare_4
 * @requiredAssets img/pictures/c_rare_5
 * @requiredAssets img/pictures/c_rare_6
 * @requiredAssets img/pictures/c_rare_7
 * @requiredAssets img/pictures/card_0
 * @requiredAssets img/pictures/knockout
 * @noteParam cardImage
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 * * @noteParam knockoutImage
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 * * @noteParam cardAttackAnimation
 * @noteRequire 1
 * @noteType animation
 * @noteData items
 * * @help
 * TMPlugin - カードゲーム ver0.1.7b (Core)
 * ※このプラグインは分割されています。Core, Logic, Sprite, Sceneを全て導入してください。
 * ※プラグインパラメータの設定はこのCoreファイルで行います。
 */

var Imported = Imported || {};
Imported.TMCard = true; // 互換性のためTMCardとしてマーク
Imported.TMCard_Core = true;

var TMPlugin = TMPlugin || {};
TMPlugin.Card = {};
// パラメータ取得時のキーは元の 'TMCard' または現在のファイル名に合わせる必要があります
// ここでは元の 'TMCard_Core' ではなく、パラメータ定義の互換性維持のため
// 実際にPluginManagerに登録された名前(ファイル名)から取るのが安全ですが
// 簡易的にファイル名を 'TMCard_Core' とした場合、パラメータが取れない可能性があるため注意。
// ★重要★: ファイル名を 'TMCard_Core.js' にする場合、
// PluginManager.parameters('TMCard_Core') とする必要があります。
TMPlugin.Card.Parameters = PluginManager.parameters('TMCard_Core');

TMPlugin.Card.VNResult	= +(TMPlugin.Card.Parameters['vnResult'] || 1);
TMPlugin.Card.VNMaxDeck = +(TMPlugin.Card.Parameters['vnMaxDeck'] || 2);
TMPlugin.Card.VNMaxCard = +(TMPlugin.Card.Parameters['vnMaxCard'] || 3);
TMPlugin.Card.VNMaxCost = +(TMPlugin.Card.Parameters['vnMaxCost'] || 4);
TMPlugin.Card.VNDeckCode = +(TMPlugin.Card.Parameters['vnDeckCode'] || 5);
TMPlugin.Card.VNEnemyCode = +(TMPlugin.Card.Parameters['vnEnemyCode'] || 6);
TMPlugin.Card.FixCardNum = TMPlugin.Card.Parameters['fixCardNum'] === '1';
TMPlugin.Card.SameCard = TMPlugin.Card.Parameters['sameCard'] === '1';
TMPlugin.Card.UseItemCard = TMPlugin.Card.Parameters['useItemCard'] === '1';
TMPlugin.Card.UseAutoText = TMPlugin.Card.Parameters['useAutoText'] === '1';
TMPlugin.Card.CommandDeckEdit = TMPlugin.Card.Parameters['commandDeckEdit'] || 'デッキ編集';
TMPlugin.Card.StatusWindowWidth = +(TMPlugin.Card.Parameters['statusWindowWidth'] || 360);
TMPlugin.Card.MaxAtk = +(TMPlugin.Card.Parameters['maxAtk'] || 9);
TMPlugin.Card.MaxTurn = +(TMPlugin.Card.Parameters['maxTurn'] || 50);
TMPlugin.Card.AnimationAttack = +(TMPlugin.Card.Parameters['animationAttack'] || 1);
TMPlugin.Card.AnimationEnemyAttack = +(TMPlugin.Card.Parameters['animationEnemyAttack'] || 1);
TMPlugin.Card.AnimationTypeBonus = +(TMPlugin.Card.Parameters['animationTypeBonus'] || 52);
TMPlugin.Card.ParamNames = (TMPlugin.Card.Parameters['paramNames'] || '').split(' ');
TMPlugin.Card.ItemCardParamNames = (TMPlugin.Card.Parameters['itemCardParamNames'] || '').split(' ');
TMPlugin.Card.TypeIcons = (TMPlugin.Card.Parameters['typeIcons'] || '').split(' ').map(Number);
TMPlugin.Card.TypeSpeed = (TMPlugin.Card.Parameters['typeSpeed'] || '').split(' ').map(Number);
TMPlugin.Card.ElementIcons = (TMPlugin.Card.Parameters['elementIcons'] || '').split(' ').map(Number);
TMPlugin.Card.RareNames = (TMPlugin.Card.Parameters['rareNames'] || '').split(' ');
TMPlugin.Card.CostIcon = +(TMPlugin.Card.Parameters['costIcon'] || 87);
TMPlugin.Card.CostIconSpace = +(TMPlugin.Card.Parameters['costIconSpace'] || 20);
TMPlugin.Card.PositionNames = (TMPlugin.Card.Parameters['positionNames'] || '').split(' ');
TMPlugin.Card.ItemCardPositionName = TMPlugin.Card.Parameters['itemCardPositionName'] || 'ITM';
TMPlugin.Card.DeckNames = (TMPlugin.Card.Parameters['deckNames'] || '').split(' ');
TMPlugin.Card.PlayerCardPositions = (TMPlugin.Card.Parameters['playerCardPositions'] || '').split(' ').map(function(pos) {
	return pos.split(',').map(Number);
});
TMPlugin.Card.PlayerItemCardPosition = (TMPlugin.Card.Parameters['playerItemCardPosition'] || '').split(',').map(Number);
TMPlugin.Card.EnemyCardPositions = (TMPlugin.Card.Parameters['enemyCardPositions'] || '').split(' ').map(function(pos) {
	return pos.split(',').map(Number);
});
TMPlugin.Card.EnemyItemCardPosition = (TMPlugin.Card.Parameters['enemyItemCardPosition'] || '').split(',').map(Number);
TMPlugin.Card.NumberPositions = (TMPlugin.Card.Parameters['numberPositions'] || '').split(' ').map(function(pos) {
	return pos.split(',').map(Number);
});
TMPlugin.Card.MessageWindowY = +(TMPlugin.Card.Parameters['messageWindowY'] || 544);

// 戦況値設定
TMPlugin.Card.BP_Config = {
    initial: 5,
    maxDisplay: 50,
    gaugeY: 60,
    gaugeHeight: 16,
    gaugeWidth: 250,
    centerGap: 40,
    textY: 30,
    fontSize: 24,
    colorPlayer: '#4488ff',
    colorEnemy:  '#ff4444',
    colorBack:   '#000000'
};

TMPlugin.Card.SWAutoMode = +(TMPlugin.Card.Parameters['swAutoMode'] || 10);
TMPlugin.Card.VNBattleSpeed = +(TMPlugin.Card.Parameters['vnBattleSpeed'] || 11);
TMPlugin.Card.ResultImageWin = TMPlugin.Card.Parameters['resultImageWin'] || 'result_win';
TMPlugin.Card.ResultImageLose = TMPlugin.Card.Parameters['resultImageLose'] || 'result_lose';
TMPlugin.Card.ResultImageDraw = TMPlugin.Card.Parameters['resultImageDraw'] || 'result_draw';

if (!TMPlugin.InterpreterBase) {
	TMPlugin.InterpreterBase = true;
	(function() {
		Game_Interpreter.prototype.convertEscapeCharactersTM = function(text) {
			text = text.replace(/\\/g, '\x1b');
			text = text.replace(/\x1b\x1b/g, '\\');
			text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
				return $gameVariables.value(parseInt(arguments[1]));
			}.bind(this));
			text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
				return $gameVariables.value(parseInt(arguments[1]));
			}.bind(this));
			text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
				return this.actorNameTM(parseInt(arguments[1]));
			}.bind(this));
			text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
				return this.partyMemberNameTM(parseInt(arguments[1]));
			}.bind(this));
			text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
			return text;
		};
		Game_Interpreter.prototype.actorNameTM = function(n) {
			var actor = n >= 1 ? $gameActors.actor(n) : null;
			return actor ? actor.name() : '';
		};
		Game_Interpreter.prototype.partyMemberNameTM = function(n) {
			var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
			return actor ? actor.name() : '';
		};
	})();
}

(function() {

	//-----------------------------------------------------------------------------
	// Game_System
	//
	Game_System.prototype.isTypeBonusEnabled = function() {
		return this._typeBonusEnabled == null ? true : this._typeBonusEnabled;
	};

	Game_System.prototype.setTypeBonusEnabled = function(enabled) {
		this._typeBonusEnabled = enabled;
	};

	//-----------------------------------------------------------------------------
	// Game_Party
	//
	var _Game_Party_initialize = Game_Party.prototype.initialize;
	Game_Party.prototype.initialize = function() {
		_Game_Party_initialize.call(this);
		this._deck = [];
		this._itemCards = [];
		this._activeDeck = 0;
	};

	Game_Party.prototype.maxDeck = function() {
		return $gameVariables.value(TMPlugin.Card.VNMaxDeck);
	};

	Game_Party.prototype.maxCard = function() {
		return $gameVariables.value(TMPlugin.Card.VNMaxCard);
	};

	Game_Party.prototype.maxCost = function() {
		return $gameVariables.value(TMPlugin.Card.VNMaxCost);
	};

	Game_Party.prototype.deck = function(index) {
		if (this._deck[index] == null) {
			this._deck[index] = [];
			for (var i = 0; i < this.maxCard(); i++) {
				this._deck[index][i] = 0;
			}
		}
		return this._deck[index];
	};

	Game_Party.prototype.activeDeck = function() {
		return this.deck(this._activeDeck);
	};

	Game_Party.prototype.cards = function(index) {
		var deck = this.deck(index);
		return deck.map(function(cardId) {
			return $dataItems[cardId];
		});
	};

	Game_Party.prototype.itemCard = function(index) {
		if (index == null) index = this._activeDeck;
		if (this._itemCards[index] == null) this._itemCards[index] = 0;
		return $dataItems[this._itemCards[index]];
	};

	Game_Party.prototype.deckCost = function(index) {
		var cards = this.cards(index).concat(this.itemCard(index));
		return cards.reduce(function(r, card) {
			return r + (card ? +card.meta.cardCost : 0);
		}, 0);
	};

	Game_Party.prototype.isDeckValid = function(index) {
		var deck = this.deck(index);
		if (TMPlugin.Card.FixCardNum) {
			return !deck.contains(0);
		} else {
			return deck.some(function(cardId) {
				return cardId > 0;
			});
		}
	};

	Game_Party.prototype.isDeckReady = function() {
		for (var i = 0; i < this.maxDeck(); i++) {
			if (this.isDeckValid(i)) return true;
		}
		return false;
	};

	Game_Party.prototype.setActiveDeck = function(index) {
		if (index === -1) {
			for (var i = 0; i < this.maxDeck(); i++) {
				if (this.isDeckValid(i)) {
					this._activeDeck = i;
					break;
				}
			}
		} else {
			this._activeDeck = index.clamp(0, this.maxDeck() - 1);
		}
	};

	Game_Party.prototype.changeCard = function(deckId, slotId, item) {
		if (item && !this.hasItem(item)) return;
		$gameParty.loseItem(item, 1);
		if (slotId === this.maxCard()) {
			$gameParty.gainItem(this.itemCard(deckId), 1);
			this._itemCards[deckId] = item ? item.id : 0;
		} else {
			$gameParty.gainItem(this.cards(deckId)[slotId], 1);
			var deck = this.deck(deckId);
			deck[slotId] = item ? item.id : 0;
		}
	};
	
	Game_Party.prototype.createCode = function(index) {
        if (typeof DeckCodeSystem === 'undefined') {
            console.error("DeckCodeSystem.js プラグインが見つかりません。");
            return "ERROR";
        }
		console.log("インデックス="+index);
		var cardIds = this.deck(index);
		console.log("選択デッキ="+cardIds);
        var itemId = 0;
        if (this._itemCards && this._itemCards[index]) {
            itemId = this._itemCards[index];
        }
        var dName = $gameParty.leader() ? $gameParty.leader().name() : "NoName";
		console.log(dName+", "+itemId+", "+cardIds);
		var code = DeckCodeSystem.encode(dName, itemId, cardIds);
		console.log("生成コード: " + code);
		return code;
	};

	//-----------------------------------------------------------------------------
	// Game_Interpreter
	//
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command === 'startCardBattle') {
			var arr = args.map(this.convertEscapeCharactersTM, this);
			var enemyName = arr[0];
			var enemyItemCardId = +arr[1];
			var enemyCardIds = arr[2].split(',').map(Number);
			$gameParty.setActiveDeck(-1);
			SceneManager.push(Scene_CardBattle);
			SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			
		} else if (command === 'startDeckSelect') {
			var arr = args.map(this.convertEscapeCharactersTM, this);
			var enemyName = arr[0];
			var enemyItemCardId = +arr[1];
			var enemyCardIds = arr[2].split(',').map(Number);
			SceneManager.push(Scene_DeckSelect);
			SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			
		} else if (command === 'generateDeckCode') {
			SceneManager.push(Scene_DeckSelect_Code);
			
		} else if (command === 'startCodeBattle') {
			var code = $gameVariables.value(TMPlugin.Card.VNEnemyCode);
			var data = DeckCodeSystem.decode(code);
			if (data) {
				var enemyName = data.name;
				var enemyItemCardId = data.itemId;
				var enemyCardIds = data.cardIds;
				SceneManager.push(Scene_CardBattle);
				SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			} else {
				console.error("デッキコードの読み込みに失敗しました。");
				AudioManager.playSe({"name":"Buzzer1","volume":90,"pitch":100,"pan":0});
			}
			
		}else if (command === 'startCodeDeckSelect') {
			var code = $gameVariables.value(TMPlugin.Card.VNDeckCode);
			var data = DeckCodeSystem.decode(code);
			if (data) {
				var enemyName = data.name;
				var enemyItemCardId = data.itemId;
				var enemyCardIds = data.cardIds;
				SceneManager.push(Scene_DeckSelect);
				SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			} else {
				console.error("デッキコードの読み込みに失敗しました。");
				AudioManager.playSe({"name":"Buzzer1","volume":90,"pitch":100,"pan":0});
			}
		} else if (command === 'isDeckReady') {
			var arr = args.map(this.convertEscapeCharactersTM, this);
			$gameSwitches.setValue(arr[0], $gameParty.isDeckReady());
		} else if (command === 'startDeckEdit') {
			SceneManager.push(Scene_DeckEdit);
		} else if (command === 'disableTypeBonus') {
			$gameSystem.setTypeBonusEnabled(false);
		} else if (command === 'enableTypeBonus') {
			$gameSystem.setTypeBonusEnabled(true);
		}
	};
    
    // Window_MenuCommandへの追加はCoreで行う
	var _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
	Window_MenuCommand.prototype.addMainCommands = function() {
		_Window_MenuCommand_addMainCommands.call(this);
		if ($gameParty.maxDeck() > 0) {
			this.addCommand(TMPlugin.Card.CommandDeckEdit, 'deckEdit', true);
		}
	};

    // シーン遷移の紐づけ
	var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		_Scene_Menu_createCommandWindow.call(this);
		this._commandWindow.setHandler('deckEdit', this.commandDeckEdit.bind(this));
	};

	Scene_Menu.prototype.commandDeckEdit = function() {
		SceneManager.push(Scene_DeckEdit);
	};

})();