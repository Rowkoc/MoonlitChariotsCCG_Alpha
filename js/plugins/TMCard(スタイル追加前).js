//=============================================================================
// TMPlugin - カードゲーム(Rowkoc Edit)
// バージョン: 0.1.7b
// 最終更新日: 2019/05/14
// 配布元　　: https://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc デッキ構成で勝敗が決まるタイプのカードゲームが
 * 遊べるようになります。
 *
 * @author tomoaky (https://hikimoki.sakura.ne.jp/)
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
 * 
 * @param statusWindowWidth
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
 * 
 * @param animationEnemyAttack
 * @desc 攻撃のアニメーション番号（エネミーカード）。
 * 初期値: 1
 * @default 1
 * @require 1
 * @type animation
 * 
 * @param animationTypeBonus
 * @desc タイプボーナスのアニメーション番号。
 * 初期値: 52
 * @default 52
 * @require 1
 * @type animation
 * 
 * @param paramNames
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
 * 
 * @param messageWindowY
 * @type number
 * @desc カードゲームのメッセージウィンドウＹ座標
 * 初期値: 544
 * @default 544
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
 * 
 * @noteParam knockoutImage
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 * 
 * @noteParam cardAttackAnimation
 * @noteRequire 1
 * @noteType animation
 * @noteData items
 * 
 * @help
 * TMPlugin - カードゲーム ver0.1.7b
 *
 * 使い方:
 *
 *   このプラグインを動作させるために必要な準備等については配布サイトを
 * 　参照してください。
 *
 *   このプラグインは RPGツクールMV Version 1.6.1 で動作確認をしています。
 *
 *   このプラグインはMITライセンスのもとに配布しています、商用利用、
 *   改造、再配布など、自由にお使いいただけます。
 *
 * 
 * メモ欄タグ (アイテム):
 * 
 *   <cardCost:1>
 *     このアイテムをコスト 1 のカードとして扱うようになります。
 * 
 *   <cardHp:10>
 *     このアイテムのカードとしての耐久値を 10 に設定します。
 * 
 *   <cardAtk:2>
 *     このアイテムのカードとしての攻撃力を 2 に設定します。 
 * 
 *   <cardType:0>
 *     このアイテムのカードタイプを 0 番のものに設定します。
 *     タイプ値が 4 のカードはアイテムカードとして扱われます。
 * 
 *   <cardElement:1>
 *     このアイテムのカード属性を 1 番のものに設定します。
 * 
 *   <cardRare:2>
 *     このアイテムのカード稀少度を 2 番のものに設定します。
 * 
 *   <unitSkill:20>
 *     このアイテムの固有スキルとして 20 番のスキルを設定します。
 * 
 *   <partySkill:21>
 *     このアイテムのパーティスキルとして 21 番のスキルを設定します。
 * 
 *   <cardAttackAnimation:2>
 *     このアイテムの攻撃アニメーションを 2 番に設定します。
 *     省略された場合はプラグインパラメータ『animationAttack』及び
 *     『animationEnemyAttack』が適用されます。
 * 
 *   <cardImage:sample_card>
 *     img/pictures フォルダ内の sample_card.png というファイルを
 *     カード画像として設定します。
 *     このタグがない場合 card_ という文字列にアイテム番号を
 *     付与したファイル名になります。
 *
 *
 *   メモ欄タグ (スキル):
 *
 *   <cardEffect:1,2> 
 *     カードスキルとしての効果を設定します。
 * 
 *   <cardRules:2,0 7,5>
 *     カードスキルとしての発動条件を設定します。
 *     半角スペースで区切ることで複数の条件を設定できます。
 * 
 *   <cardRepeats:2>
 *     カードスキルの効果が発動する回数を設定します。
 *
 * 
 * プラグインコマンド:
 * 
 *   startCardBattle 村人Ａ 0 1,2,3
 *     対戦相手の名前、アイテムカード番号、デッキ(カンマで区切ったカード番号)
 *     を指定してカードゲームを開始します。
 *     プレイヤーが使用するデッキは、カードがセットされているデッキの中で
 *     最も上にあるものとなります。
 * 
 *   startDeckSelect 村人Ａ 0 1,2,3
 *     カードゲーム開始前にプレイヤーがデッキを選択することができます。
 *     デッキ選択がキャンセルされた場合、結果変数に -1 が代入されます。
 * 
 *   isDeckReady 1
 *     プレイヤーが有効なデッキをひとつ以上組んでいるかどうかを判定します。
 *     カードゲームが可能な状態であれば、指定した番号のゲームスイッチが
 *     オンになり、不可能な状態(カードをセットしたデッキがない)であれば
 *     オフになります。
 * 
 *   startDeckEdit
 *     デッキ編集シーンを呼び出します。
 * 
 *   disableTypeBonus
 *     タイプボーナスの機能を無効にします。
 *     ゲーム開始時にはタイプボーナスが有効になっています。
 * 
 *   enableTypeBonus
 *     無効にしたタイプボーナスの機能を元に戻します。
 *	
 * 
 * 注意:
 * 
 *   登録できるデッキの最大数が 0 の場合、メインメニューにデッキ編集コマンドが
 *   表示されなくなります。
 */

var Imported = Imported || {};
Imported.TMCard = true;

var TMPlugin = TMPlugin || {};
TMPlugin.Card = {};
TMPlugin.Card.Parameters = PluginManager.parameters('TMCard'); //ファイル名変えたときに、ここも変える必要あるっぽい。
TMPlugin.Card.VNResult	= +(TMPlugin.Card.Parameters['vnResult'] || 1);
TMPlugin.Card.VNMaxDeck = +(TMPlugin.Card.Parameters['vnMaxDeck'] || 2);
TMPlugin.Card.VNMaxCard = +(TMPlugin.Card.Parameters['vnMaxCard'] || 3);
TMPlugin.Card.VNMaxCost = +(TMPlugin.Card.Parameters['vnMaxCost'] || 4);
TMPlugin.Card.VNDeckCode = +(TMPlugin.Card.Parameters['vnDeckCode'] || 5); //デッキコードを入れる変数
TMPlugin.Card.VNEnemyCode = +(TMPlugin.Card.Parameters['vnEnemyCode'] || 6); //オンライン対戦のコードを入れる変数
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
TMPlugin.Card.ParamNames = TMPlugin.Card.Parameters['paramNames'].split(' ');
TMPlugin.Card.ItemCardParamNames = TMPlugin.Card.Parameters['itemCardParamNames'].split(' ');
TMPlugin.Card.TypeIcons = TMPlugin.Card.Parameters['typeIcons'].split(' ').map(Number);
TMPlugin.Card.TypeSpeed = TMPlugin.Card.Parameters['typeSpeed'].split(' ').map(Number);
TMPlugin.Card.ElementIcons = TMPlugin.Card.Parameters['elementIcons'].split(' ').map(Number);
TMPlugin.Card.RareNames = TMPlugin.Card.Parameters['rareNames'].split(' ');
TMPlugin.Card.CostIcon = +(TMPlugin.Card.Parameters['costIcon'] || 87);
TMPlugin.Card.CostIconSpace = +(TMPlugin.Card.Parameters['costIconSpace'] || 20);
TMPlugin.Card.PositionNames = TMPlugin.Card.Parameters['positionNames'].split(' ');
TMPlugin.Card.ItemCardPositionName = TMPlugin.Card.Parameters['itemCardPositionName'] || 'ITM';
TMPlugin.Card.DeckNames = TMPlugin.Card.Parameters['deckNames'].split(' ');
TMPlugin.Card.PlayerCardPositions = TMPlugin.Card.Parameters['playerCardPositions'].split(' ').map(function(pos) {
	return pos.split(',').map(Number);
});
TMPlugin.Card.PlayerItemCardPosition = TMPlugin.Card.Parameters['playerItemCardPosition'].split(',').map(Number);
TMPlugin.Card.EnemyCardPositions = TMPlugin.Card.Parameters['enemyCardPositions'].split(' ').map(function(pos) {
	return pos.split(',').map(Number);
});
TMPlugin.Card.EnemyItemCardPosition = TMPlugin.Card.Parameters['enemyItemCardPosition'].split(',').map(Number);
TMPlugin.Card.NumberPositions = TMPlugin.Card.Parameters['numberPositions'].split(' ').map(function(pos) {
	return pos.split(',').map(Number);
});
TMPlugin.Card.MessageWindowY = +(TMPlugin.Card.Parameters['messageWindowY'] || 544);

//--------戦況値(BP)関連追加-------
// --- ここから追加 (Config for Battle Status) ---
TMPlugin.Card.BP_Config = {
    initial: 5,       // 戦況値の初期値
    maxDisplay: 50,    // ゲージが最大になる数値（これを超えても数値は増えるがゲージは満タン）
    
    // UI配置設定
    gaugeY: 60,        // ゲージのY座標
    gaugeHeight: 16,   // ゲージの太さ
    gaugeWidth: 250,   // 片側のゲージの最大長さ
    centerGap: 40,     // 中央の隙間（VS表示用）
    
    textY: 30,         // 数値テキストのY座標
    fontSize: 24,      // フォントサイズ
    
    // 色設定 (CSS形式)
    colorPlayer: '#4488ff', // プレイヤーゲージ色
    colorEnemy:  '#ff4444', // 敵ゲージ色
    colorBack:   '#000000'  // 背景色
};
// --- ここまで追加 ---




//---------------------------------ここまで


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
} // TMPlugin.InterpreterBase

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

	// 指定したデッキを返す
	Game_Party.prototype.deck = function(index) {
		if (this._deck[index] == null) {
			this._deck[index] = [];
			for (var i = 0; i < this.maxCard(); i++) {
				this._deck[index][i] = 0;
			}
		}
		return this._deck[index];
	};

	// アクティブデッキを返す
	Game_Party.prototype.activeDeck = function() {
		return this.deck(this._activeDeck);
	};

	// 指定したデッキのカードオブジェクトの配列を返す
	Game_Party.prototype.cards = function(index) {
		var deck = this.deck(index);
		return deck.map(function(cardId) {
			return $dataItems[cardId];
		});
	};

	// 指定したデッキのアイテムカードオブジェクトを返す
	Game_Party.prototype.itemCard = function(index) {
		if (index == null) index = this._activeDeck;
		if (this._itemCards[index] == null) this._itemCards[index] = 0;
		return $dataItems[this._itemCards[index]];
	};

	// 指定したデッキの合計コストを返す
	Game_Party.prototype.deckCost = function(index) {
		var cards = this.cards(index).concat(this.itemCard(index));
		return cards.reduce(function(r, card) {
			return r + (card ? +card.meta.cardCost : 0);
		}, 0);
	};

	// 指定したデッキが有効かどうかを返す
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

	// 有効なデッキがひとつ以上あるかどうかを返す
	Game_Party.prototype.isDeckReady = function() {
		for (var i = 0; i < this.maxDeck(); i++) {
			if (this.isDeckValid(i)) return true;
		}
		return false;
	};

	// アクティブデッキを設定する
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

	// カードをデッキにセットする
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
	
	// デッキからコードを作る。
	Game_Party.prototype.createCode = function(index) {
		// 汎用プラグインが導入されているかチェック
        if (typeof DeckCodeSystem === 'undefined') {
            console.error("DeckCodeSystem.js プラグインが見つかりません。");
            return "ERROR";
        }
		console.log("インデックス="+index);
		//index でデッキ内容を取得して、エネミー表記に変換する。
		// 1. デッキ情報の取得
		var cardIds = this.deck(index);
		
		console.log("選択デッキ="+cardIds);
		// 2. アイテムIDの取得（安全策として_itemCardsが存在するか確認）
        var itemId = 0;
        if (this._itemCards && this._itemCards[index]) {
            itemId = this._itemCards[index];
        }
        // 3. デッキ名（ここではリーダーの名前を使用）
        // ※必要に応じて "デッキA" のような固定文字列に変えてもOKです
        var dName = $gameParty.leader() ? $gameParty.leader().name() : "NoName";

		console.log(dName+", "+itemId+", "+cardIds);
		
        // 4. 汎用プラグインを呼び出して変換
		var code = DeckCodeSystem.encode(dName, itemId, cardIds);
        
		console.log("生成コード: " + code);
		return code;
		
		
		//テキストからコードを生成して、code に代入。
		//var code = 'test';
		//
		//return code;
	};
	
	//コードからエネミー用デッキを作る。
	//Game_Party.prototype.convertCode = function(text) {
	//  //デッキコードを複合化して、頭にプレイヤー名をくっつける。
	//	var deck = "テスト用のエネミー 0 17,17,17,17";
	//	retturn deck;
	//};
	
	

	//-----------------------------------------------------------------------------
	// Game_CardBattle
	//

	function Game_CardBattle() {
		this.initialize.apply(this, arguments);
	}

	Game_CardBattle.prototype.initialize = function() {
		this._maxAtk = TMPlugin.Card.MaxAtk;
	};

	Object.defineProperties(Game_CardBattle.prototype, {
		maxAtk: { get: function() { return this._maxAtk; }, configurable: true },
		turn: { get: function() { return this._turn; }, configurable: true }
	});

	Game_CardBattle.prototype.setDecks = function(enemyName, enemyItemCardId, enemyCardIds) {
		this._maxAtk = TMPlugin.Card.MaxAtk;
		var playerName = $gameParty.battleMembers().length === 0 ? 'プレイヤー' : $gameParty.leader().name();
		var playerItemCard = $gameParty.itemCard();
		this._playerDeck = new Game_Deck(playerName, playerItemCard ? playerItemCard.id : 0, $gameParty.activeDeck().concat());
		this._enemyDeck = new Game_EnemyDeck(enemyName, enemyItemCardId, enemyCardIds);
		this._turn = this.makeOrders();
		this._firstAttack = this._turn; //プレイヤー初手番をとれたか？
		this._startPlayer = this._turn; //最初の先手番を記録しておく。
		this._playerActive= false; //ラウンドカウント用
		this._enemyActive= false;  //ラウンドカウント用
		this._turnCount = 0;
		this._cardDeath = false; //直前のカード死亡判定
		this._phase = 0;
		this._damage = 0;
		this._typeBonus = true;
		this._messages = [];
		this._waitCount = 0;
		this.addMessage(0, 'ラウンド ' + (this._turnCount+1)); //最初のラウンド表示
		
		AudioManager.playSe({"name":"Bell1","volume":90,"pitch":100,"pan":0})
	};

	// 先攻を決定する (プレイヤーが先攻なら true を返す)
	Game_CardBattle.prototype.makeOrders = function() {
		// 合計コスト比較
		var a = this._playerDeck.cost();
		var b = this._enemyDeck.cost();
		//if (a !== b) return a < b;
		// 先鋒カードのスピード比較
		//a = TMPlugin.Card.TypeSpeed[this._playerDeck.cardType(0)];
		//b = TMPlugin.Card.TypeSpeed[this._enemyDeck.cardType(0)];
		//if (a !== b) return a > b;
		// Row追加：先鋒カードのSPD比較。
		a = this._playerDeck.card(0).spd();
		b = this._enemyDeck.card(0).spd();
		console.log("turn Check a="+a+", b="+b);
		if (a !== b) return a > b;
		// 先鋒カードのＨＰ比較
		a = this._playerDeck.card(0).hp();
		b = this._enemyDeck.card(0).hp();
		if (a !== b) return a < b;
		// 先鋒カードの攻撃力比較
		a = this._playerDeck.card(0).atk();
		b = this._enemyDeck.card(0).atk();
		if (a !== b) return a < b;
		// Row追記：ランダム決定
		a =Math.random();
    	b =Math.random();
    	return a >= b;
		// ここまでで決着がつかなければ敵が先攻
		return false;
	};
	// Row追記:先攻を更新 (攻撃役が早ければそのまま)
	Game_CardBattle.prototype.checkOrders = function(attacker, target, turn) {
    	// カードのSPD比較
    	var a = attacker.spd();
    	var b = target.spd();
    	console.log("turn Check a="+a+", b="+b+", this._turn="+turn);
    	// 速度に差がなければそのまま返す
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
	
	//表示用ラウンド数を取得
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
				AudioManager.stopMe();
				SceneManager.pop();
			}
		}
	};

	Game_CardBattle.prototype.updateWaitCount = function() {
		if (this._waitCount > 0) this._waitCount -= 1;
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
		if (target.hp === 0){  //すでにHP 0 になっていたらスキップする。Row追記
			console.log("※計算フェイズスキップ");
    	}else{
			this.addMessage(0, attacker.card().name() + ' の攻撃');
			this._damage = attacker.atk; //基礎ダメージを入れる。
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
		if (target.hp === 0){  //すでにHP 0 になっていたらスキップする。
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
			
			for (;;) { //変動アニメーション?//変動がなくなるまで繰り返す。
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
		
		// ★変更: 撃破時に相手のコスト分、戦況値(BP)を加算する
		if (attacker.hp === 0){
            var bonus = attacker.card().cost(); // コスト取得
            target.gainBp(bonus);               // 相手に加算
            
            
            
            
			attacker.knockout();
			// ★追加: 控えカードがいる場合、新カードのHPを描画用に即時セットする
    		if (attacker.hp > 0) {
    			console.log("控えHP更新:"+ attacker.hp);
        		attacker.setDrawNumber(attacker.hp, attacker.atk, attacker.pow, attacker.bp);
    		}
    		this.addMessage(0, '撃破ボーナス! ' + target.userName() + ' 戦況値 +' + bonus);
			this._cardDeath =true;
		}
		if (target.hp === 0){
            var bonus = target.card().cost();   // コスト取得
            attacker.gainBp(bonus);             // 相手に加算
            

			target.knockout();
			// ★追加: 控えカードがいる場合、新カードのHPを描画用に即時セットする
			console.log("控えHP更新:"+ target.hp);
    		if (target.hp > 0) {
        		target.setDrawNumber(target.hp, target.atk, target.pow, target.bp);
    		}
    		this.addMessage(0, '撃破ボーナス! ' + attacker.userName() + ' 戦況値 +' + bonus);
			this._cardDeath =true	
		}
        // ここまで変更
		
		console.log("cardDeath = "+this._cardDeath);
		this._phase += this.judgeWinLoss() ? 2 : 1; //勝敗ついてたら結果、そうでなければEndPhaseへ。
	};

	Game_CardBattle.prototype.updateEndPhase = function() {
		//ラウンド行動済みチェック
		if (this._turn){
			this._playerActive=true; //プレイヤーターンだったらtrue
		}else{ 
		    this._enemyActive=true; //エネミーターンだったらtrue
		}
		console.log("～～～～～エンドフェイズ～～～～～");
		console.log("ラウンド" + (this._turnCount+1)+" this._turn="+this._turn+", P-Active="+this._playerActive+". E-Active="+this._enemyActive);
		
		this._turn = !this._turn; //ターンプレイヤー入れ替え
		

		if ((this._cardDeath)){ //直前で死んでるときはラウンド仕切り直し
			console.log("===============死亡更新===============") ; //死んだときの更新通知
			this._turnCount += 1; //行動済み関係なくターン進める
			this._playerActive=false; //ラウンド行動状態初期化
			this._enemyActive =false; //ラウンド行動状態初期化
			
			var attacker = this.attackerDeck(); //次手番
			var target = this.targetDeck(); //直前手番のデッキ
			//ここで素早さ判定を入れる(※ここでデッキ枚数が一緒じゃないと、カードが読めなくて止まるのでNullチェック
			if (!(attacker===null)&&!(target===null)){ //両方とも残りのデッキがある。
				console.log("attacker = "+attacker.card(attacker.lose).name()+", target = "+target.card(target.lose).name());
				this._turn = this.checkOrders(attacker.card(attacker.lose), target.card(target.lose), this._turn);
			}
			this._firstAttack = this._turn; //最新の情報に更新
			this.addMessage(0, 'ラウンド ' + (this._turnCount+1));
			AudioManager.playSe({"name":"Move1","volume":90,"pitch":120,"pan":0})
    	}else{ //死んでない場合    	
    		if ((this._playerActive)&&(this._enemyActive)){//両方とも行動済みならターンを増やす。
				this._turnCount += 1;
				this._playerActive=false;
				this._enemyActive =false;
				this.addMessage(0, 'ラウンド ' + (this._turnCount+1));
				AudioManager.playSe({"name":"Move1","volume":90,"pitch":120,"pan":0})
			}
		} 
    	
    	//ここに書くと毎アクション後に処理が走る。
    	
    	this._cardDeath = false; //カード死亡判定を初期化
    	console.log("<<<<<<<<<<<<<<<<<<<<<<ラウンド" + (this._turnCount+1)+">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		//ここまであたり
		if (this._turnCount === TMPlugin.Card.MaxTurn) { //ターンが最大の時。
			this.addMessage(3, 1);
			this.addMessage(0, '時間切れ');
			this.addMessage(0, '');
			
			// ★変更: 戦況値判定
            var pBp = this._playerDeck.bp;
            var eBp = this._enemyDeck.bp;
            this.addMessage(0, '戦況値判定: ' + pBp + ' vs ' + eBp);

            if (pBp > eBp) {
                this.addMessage(3, 2); // 勝ちジングル
                this.addMessage(0, '戦況値により ' + this._playerDeck.userName() + ' の勝利!');
                $gameVariables.setValue(TMPlugin.Card.VNResult, 2);
            } else if (eBp > pBp) {
                this.addMessage(3, 1); // 負けジングル
                this.addMessage(0, '戦況値により 敗北...');
                $gameVariables.setValue(TMPlugin.Card.VNResult, 1);
            } else {
                this.addMessage(3, 1);
			    this.addMessage(0, '引き分け');
			    $gameVariables.setValue(TMPlugin.Card.VNResult, 0);
            }
            // 変更終わり
			
			//$gameVariables.setValue(TMPlugin.Card.VNResult, 3);
			
			this._phase = 5;
		} else {
			this._phase = 0;
		}
	};

	// スキルの反動
	Game_CardBattle.prototype.updateRebound = function(attacker) {
		// 毎ターン攻撃力 +1
		if (attacker.isStateAffected(2) && attacker.atk < this.maxAtk) {
			attacker.atk += 1;
			this.addMessage(0, 'スキルの反動!! ' + TMPlugin.Card.ParamNames[4] + ' + 1');
		}
		// 毎ターン攻撃力 -1
		if (attacker.isStateAffected(3) && attacker.atk > 1) {
			attacker.atk -= 1;
			this.addMessage(0, 'スキルの反動!! ' + TMPlugin.Card.ParamNames[4] + ' - 1');
		}
	};

	// タイプボーナスの適用
	Game_CardBattle.prototype.applyTypeBonus = function(attacker, target) {
		if (this._typeBonus && $gameSystem.isTypeBonusEnabled()) {
			var a = attacker.cardType();
			var b = target.cardType();
			if ((a === 0 && b === 2) || (a === 1 && b === 0) ||
					(a === 2 && b === 1) || (a === 3 && b === 3)) { //両方バランス型の時が追加されている。
				this._damage += 1;
				this.addMessage(this._turn ? 1 : 2, TMPlugin.Card.AnimationTypeBonus);
				this.addMessage(0, 'タイプボーナス!! 与えるダメージ + 1');
			}
		}
	};

	// スキル発動チェック
	Game_CardBattle.prototype.checkSkill = function(attacker, target, active) {
		// 使用者、対象、 true/false を参照。；
		var deckSize = attacker.size();
		
		
		
		//継承スキルを使う。死んでるやつのインデックスを大きい方から順番に。
		//最初に死んでるやつが見つかったらそこでブレークする。
		//console.log("継承スキル？");
		//console.log("attacker.lose:"+ attacker.lose);
		//for (var i = attacker.lose; i > 0; i--) { //死亡数が1以上の時さかのぼる。
		for (var i = 0; attacker.lose > i ; i++) { //死亡数が0以上の時順次上がっていく。
			console.log("attacker.lose:"+ attacker.lose + ", i ="+i );
			//var tmpNum = i-1; //先に足しちゃった分引いてる。 
			var tmpNum = i;
			this.useSkill(attacker, tmpNum, target, active); //i から1少ないインデックスを参照。
			//if (attacker.isStateAffected(1)) break; //ステートが戦闘不能だとbreak
		}
		
		//固有スキルを使う。
		//console.log("固有スキル？");
		this.useSkill(attacker, deckSize, target, active);
		
		if (attacker.isItemCardReady()) {
			//console.log("アイテム発動");
			this.useSkill(attacker, deckSize + 1, target, active);
			this.useSkill(attacker, deckSize + 2, target, active);
			//固有スキルを、デッキサイズ＋1,2 のところに追加している。（固有2個にするならやり方検討。）
		}
	};

	// 勝敗判定
	Game_CardBattle.prototype.judgeWinLoss = function() {
		if (this.isGameover()) {
			this._cardDeath = false; //カード死亡判定を初期化
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

	// 決着が着いているかを返す
	Game_CardBattle.prototype.isGameover = function() {
		return this._playerDeck.lose === this._playerDeck.size() ||
					 this._enemyDeck.lose === this._enemyDeck.size();
	};

	// メッセージの追加
	Game_CardBattle.prototype.addMessage = function(type, value) {
		var message = {
			type: type,
			value: value,
			playerHp: this._playerDeck.hp,
			playerAtk: this._playerDeck.atk.clamp(0, this.maxAtk), //攻撃力最小値を1に変更。
			playerPow: this._playerDeck.pow,
			playerBp:  this._playerDeck.bp, // ★戦況値追加
			enemyHp: this._enemyDeck.hp,
			enemyAtk: this._enemyDeck.atk.clamp(0, this.maxAtk),
			enemyPow: this._enemyDeck.pow,
			enemyBp:   this._enemyDeck.bp   // ★戦況値追加
		};
		this._messages.push(message);
		console.log("playerDeck.hp="+this._playerDeck.hp);
	};

	// たまっているメッセージを返す
	Game_CardBattle.prototype.getMessage = function() {
		if (this._messages.length > 0) {
			var message = this._messages.shift();
			
			this._playerDeck.setDrawNumber(message.playerHp, message.playerAtk,message.playerPow, message.playerBp); //ここにpowと戦況値bpを追加。
			this._enemyDeck.setDrawNumber(message.enemyHp, message.enemyAtk,message.enemyPow, message.enemyBp);
			switch (message.type) { //メッセージタイプで処理を分岐
			case 1:
				this._playerDeck.card().startAnimation(message.value, false, 0);
				break;
			case 2:
				this._enemyDeck.card().startAnimation(message.value, false, 0);
				break;
			case 3: //勝敗判定&ジングル
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

	// スキルの使用
	Game_CardBattle.prototype.useSkill = function(user, index, target, active) {
		//console.log("useSkill:"+ index +", active:"+active); // スキルインデックス確認
		var skill = user.skill(index);
		if (!skill) return;
		
		console.log("Skill:"+ skill.name+", 発動:"+this.meetsConditions(skill, user, index, target, active)); //スキル名表示
		if (!this.meetsConditions(skill, user, index, target, active)) return; //発動条件を満たしているか
		
		// ▼▼▼ 追加: BPコストの消費 ▼▼▼
        var bpCost = skill.meta.cardBpCost ? Number(skill.meta.cardBpCost) : 0;
        if (bpCost > 0) {
            user.gainBp(-bpCost);
            // 消費したことをメッセージログに出したい場合は以下の行のコメントアウトを外してください
            // this.addMessage(0, 'BP消費 ' + bpCost);
        }
        // ▲▲▲ 追加終わり ▲▲▲
		
		var effect = skill.meta.cardEffect.split(',').map(Number);
		var param = effect[1];
		if (index > user.size()) { //アイテムカードかどうか？
			userCardName = user.itemCard().name();
			this.addMessage(5, active ? this._turn : !this._turn);
		} else {
			userCardName = user.card().name();
		}
		console.log("user:"+userCardName+", "+"Skill:"+ skill.name); //使用者とスキル名表示
		
		var targetCardName = target.card().name();
		var animTargetInvert = false; //Row追記：アニメーション再生対象を反転するか？
		var message = null;
		switch (effect[0]) {
		case 1:	 // 相手に与えるダメージ＋○○
			this._damage = Math.max(this._damage + param, 0);
			user.setPow(this._damage);
			message = '与えるダメージ ' + (param < 0 ? '- ' : '+ ') + Math.abs(param);
			break;
		case 2:	 // 相手に与えるダメージが２倍になる
			this._damage *= 2;
			user.setPow(this._damage);
			message = '与えるダメージ 2 倍';
			break;
		case 3:	 // 相手から受けるダメージ＋○○
			this._damage = Math.max(this._damage + param, 0);
			user.setPow(this._damage);
			message = '受けるダメージ ' + (param < 0 ? '- ' : '+ ') + Math.abs(param);
			break;
		case 4:	 // 相手から受けるダメージが半分になる
			//this._damage /= 2;
			this._damage = Math.ceil(this._damage/2); //端数切り上げ処理。
			user.setPow(this._damage);
			message = '受けるダメージ 半分';
			break;
		case 5:	 // 相手の継承スキルを無効化
			target.addState(1);
			message = targetCardName + ' の継承スキルを無効化';
			break;
		case 6:	 // 相手の攻撃をスルー
			this._phase = 2;
			//AudioManager.playSe({"name":"Evasion1","volume":90,"pitch":100,"pan":0})
			message = '相手の攻撃を無視';
			break;
		case 7:	 // 自分のHP＋○○
			user.gainHp(param);
			user.setPow(param);
			message = TMPlugin.Card.ParamNames[3] + (param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 8:	 // 自分の攻撃力＋○○
			user.gainAtk(param);
			user.setPow(user.atk);
			message = TMPlugin.Card.ParamNames[4] + (param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 9:	 // 自分の攻撃力を○○にする
			user.gainAtk(param - user.atk);
			user.setPow(user.atk);
			message = TMPlugin.Card.ParamNames[4] + ' が ' + param + ' になった';
			break;
		case 10:	// 相手のHP＋○○
			target.gainHp(param);
			target.setPow(param);
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[3] +
								(param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 11:	// 相手の攻撃力＋○○
			target.gainAtk(param);
			target.setPow(target.atk);
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[4] +
								(param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 12:	// 相手の攻撃力を○○にする
			target.gainAtk(param - target.atk);
			target.setPow(target.atk);
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[4] +
								'が ' + param + ' になった';
			break;
		case 13:	// ○○の攻撃力を最大にする ( 0 = 自分 / 1 = 相手 )
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
		case 14:	// 自分のHP－○○、与えるダメージ＋○○
			this._damage = Math.max(this._damage + param, 0);
			user.gainHp(-param);
			user.setPow(this._damage);
			message = '与えるダメージ ' + (param < 0 ? '- ' : '+ ') + Math.abs(param) + ' / ' +
								 TMPlugin.Card.ParamNames[3] + (param < 0 ? ' + ' : ' - ') + Math.abs(param);
			break;
		case 15:	// 自分と相手の○○を入れ替える ( 0 = HP / 1 = 攻撃力 )
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
		case 16:	// 自分と相手の○○を平均化 ( 0 = HP / 1 = 攻撃力 )
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
		case 17:	// 相手に○○のダメージ
			target.gainHp(-param);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = targetCardName + ' に ' + param + ' ダメージ';
			break;
		case 18:	// 自分と相手に○○のダメージ
			user.gainHp(-param);
			target.gainHp(-param);
			message = userCardName + ' と ' + targetCardName + ' に ' +
								param + ' ダメージ';
			break;
		case 19:  // HPドレイン○○ Row追記
			user.gainHp(+param);
			target.gainHp(-param);
			animTargetInvert = true;
			message = targetCardName + ' からHPを ' + param + ' 吸収した';
			break;
		case 20:	// 自分の継承スキルを相手と同じにする
			user.changeSkill(index, target.skill(target.lose).id);
			message = '相手の' + TMPlugin.Card.ParamNames[7] + 'をコピー';
			break;
		case 21:	// 相手の継承スキルを奪う
			user.changeSkill(index, target.skill(target.lose).id);
			target.changeSkill(target.lose, 0);
			message = '相手の' + TMPlugin.Card.ParamNames[7] + 'を奪った';
			break;
		case 22:	// 相手の継承スキルを○○にすりかえる
			target.changeSkill(target.lose, param);
			message = targetCardName + ' の ' + TMPlugin.Card.ParamNames[7] +
								'が ' + $dataSkills[param].name + ' になった';
			break;
		case 23:	// 相手の固有スキルを○○にすりかえる
			target.changeSkill(target.size(), param);
			message = targetCardName + ' の ' + TMPlugin.Card.ParamNames[8] +
								'が ' + $dataSkills[param].name + ' になった';
			break;
		case 24:	// 使用済みスキルが復活する
			user.resetSkillCount();
			message = userCardName + ' の ' + TMPlugin.Card.ParamNames[6] + 'が復活';
			break;
		case 25:	// 以降のタイプボーナスを無効化
			this._typeBonus = false;
			message = '以降のタイプボーナスを無効化';
			break;
		case 26:	// 以降の攻撃力上限を○○にする
			this.changeMaxAtk(param);
			message = TMPlugin.Card.ParamNames[4] + '上限が' + param + ' に変更';
			break;
		case 27:	// 以降の攻撃力上限＋○○
			this.changeMaxAtk(this.maxAtk + param);
			message = TMPlugin.Card.ParamNames[4] + '上限 ' + (param < 0 ? '- ' : '+ ') +
								Math.abs(param);
			break;
		case 28:	// 自分の攻撃力を以降の攻撃力上限にする
			this.changeMaxAtk(user.atk);
			message = TMPlugin.Card.ParamNames[4] + '上限が' + this.maxAtk + ' に変更';
			break;
		case 29:	// 攻撃力を１にするが、毎ターン攻撃力＋１ ( 0 = 自分 / 1 = 相手 )
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
		case 30:	// 攻撃力を最大にするが、毎ターン攻撃力ー１ ( 0 = 自分 / 1 = 相手 )
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
		case 31:	// 指定種族の数分攻撃力上昇 Row追記
			var count = 0;
			//paramを文字列で取り直す。
			var tmp = skill.meta.cardEffect.split(','); //文字列用に取得しなおし。
			var paramF = tmp[1];
  			for (var i = 0; i < user.size(); i++) {
    			if (user.card(i).faction().includes(paramF)) count++;
  			}
  			user.gainAtk(count);
  			message = 'デッキの'+paramF+'で' + TMPlugin.Card.ParamNames[4] + (count < 0 ? ' - ' : ' + ') + Math.abs(count);
			break
		case 32:	// 相手にatkのn倍のダメージ
			var tmp = user.atk*param;
			target.gainHp(-tmp);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 33:	// 相手にatkの差のn倍のダメージ
			var tmp = Math.max(target.atk-user.atk, 0)*param;
			target.gainHp(-tmp);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 34:	// 相手にHPの差のn倍のダメージ
			var tmp = Math.max(target.hp-user.hp, 0)*param;
			target.gainHp(-tmp);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 35:	 // カウンター(相手の攻撃をスルー+相手攻撃力で反撃）
			target.gainHp(-target.atk);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			this._phase = 2;
			//AudioManager.playSe({"name":"Evasion1","volume":90,"pitch":100,"pan":0})
			message = targetCardName + ' にカウンター ' + target.atk + ' ダメージ';
			break;
		case 36:	 // 自分の攻撃力にHPのx倍を追加（切り上げ）
			var tmp = Math.ceil(user.hp*param);
			user.gainAtk(tmp);
			user.setPow(tmp);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = TMPlugin.Card.ParamNames[4] + (param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 37:	 // 自分の攻撃力をHPの値にする
			user.gainAtk(user.hp-user.atk);
			user.setPow(user.atk);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = TMPlugin.Card.ParamNames[4] + ' が ' + param + ' になった';
			break;
		case 38:	 // 相手のHPをx倍のダメージ。
			var tmp = Math.ceil(target.hp*param);
			user.gainHP(-tmp);
			user.setPow(tmp);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = targetCardName + ' に ' + tmp + ' ダメージ';
			break;
		case 39:	// 相手のHPを○○にする
			var tmp = Math.ceil(target.hp - param);
			target.gainHP(-tmp);
			target.setPow(tmp);
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			message = targetCardName + ' の' + TMPlugin.Card.ParamNames[3] +
								'が ' + param + ' になった';
			break;
		case 40:	// 相手に○○のダメージ+atk-○○
			target.gainHp(-param);
			target.gainAtk(-param)
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			target.setPow(param);
			message = targetCardName + ' に ' + param + ' ダメージ' + ' と' + TMPlugin.Card.ParamNames[4] +
								(param < 0 ? ' - ' : ' + ') + Math.abs(param);
			break;
		case 41:	// 相手に○○のダメージ+atk-1
			target.gainHp(-param);
			target.gainAtk(-1)
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			target.setPow(param);
			message = targetCardName + ' に ' + param + ' ダメージ' + '! ' + TMPlugin.Card.ParamNames[4] + 'が下がった。';
			break;
			
		
		case 42:	 // 帝国の指揮
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
		
		case 43:	// 13恐怖症
			// paramの値に近づくようにする。
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
			animTargetInvert = true; //Row追記：アニメ表示位置を反転
			break;
		case 50:	// 自分の戦況値＋○○
			user.gainBp(param);
			message = '戦況値 ' + (param < 0 ? '- ' : '+ ') + Math.abs(param);
			break;
		case 51:	// 相手の戦況値を減らす
			target.gainBp(-param);
			message = targetCardName + 'の戦況値 - ' + Math.abs(param);
			break;
		
		//========ここより上に追記していく==========-
		}
		
		var isPlayer = active ? this._turn : !this._turn;
		if (animTargetInvert){ //Row追記 アニメ表示先指定の反転処理。
    		this.addMessage(isPlayer ? 2 : 1, skill.animationId); //敵ターゲットならアニメプレイヤーを逆転。	
    	}else{
    		this.addMessage(isPlayer ? 1 : 2, skill.animationId); //1ならプレイヤー、2なら相手にアニメを再生。
    	}	
		this.addMessage(0, userCardName + ' の ' + skill.name + ' 発動!!');
		this.addMessage(0, message);
		console.log(userCardName + ' の ' + skill.name + ' 発動!!')
		user.useSkill(index);
	};

	// 発動条件のチェック
	Game_CardBattle.prototype.meetsConditions = function(skill, user, index, target, active) {
		if (!user.checkSkillCount(index)) return false;
		if (user.isSkillUsed(index)) return false;
		
		// ▼▼▼ 追加: BPコストチェック ▼▼▼
        var bpCost = skill.meta.cardBpCost ? Number(skill.meta.cardBpCost) : 0;
        if (user.bp < bpCost) return false;
        // ▲▲▲ 追加終わり ▲▲▲
		
		if (!this.meetsEffectConditions(skill, active)) return false;
		var rules = skill.meta.cardRules;
		if (rules) {
			rules = rules.split(' '); // 半角で区切ってるのを別のルールと認識
			for (var i = 0; i < rules.length; i++) { //設定ルールぶん回す（全部Trueで返ればOK)
				var rule = rules[i].split(',').map(Number); //1つのルール内の値をカンマでパラメータ分け
				var param = rule[1];
				switch (rule[0]) {
				case 1:	// 自分のターンの○○フェイズ
					if (!active || this._phase !== param) return false;
					break;
				case 2:	// 相手のターンの○○フェイズ
					if (active || this._phase !== param) return false;
					break;
				case 3:	 // ターン指定
					if (user.turnCount !== param) return false;
					break;
				case 4:	 // 相手が○○タイプ
					if (param === -1 && user.cardType() === target.cardType()) return false;
					if (param === -2 && user.cardType() !== target.cardType()) return false;
					if (param >= 0 && target.cardType() !== param) return false;
					break;
				case 5:	 // 相手が○○属性
					if (param === -1 && user.cardElement() === target.cardElement()) return false;
					if (param === -2 && user.cardElement() !== target.cardElement()) return false;
					if (param >= 0 && target.cardElement() !== param) return false;
					break;
				case 6:	 // 相手の稀少度が○○
					if (param === -1 && user.cardRare() === target.cardRare()) return false;
					if (param === -2 && user.cardRare() !== target.cardRare()) return false;
					if (param >= 0 && target.cardRare() !== param) return false;
					break;
				case 7:	 // 相手のポジションが○○
					if (target.lose !== param) return false;
					break;
				case 8:	 // 相手のHPが○○以上
					if (target.hp < param) return false;
					break;
				case 9:	 // 相手のHPが○○以下
					if (target.hp > param) return false;
					break;
				case 10:	// 相手のHPが○○になった
					if (target.hp !== param) return false;
					break;
				case 11:	// 相手のHPが○○ ( 0 = 偶数 / 1 = 奇数 )
					if (target.hp % 2 !== param) return false;
					break;
				case 12:	// 相手の攻撃力が○○以上
					if (target.atk < param) return false;
					break;
				case 13:	// 相手の攻撃力が○○以下
					if (target.atk > param) return false;
					break;
				case 14:	// 相手の攻撃力が○○になった
					if (target.atk !== param) return false;
					break;
				case 15:	// 相手の攻撃力が○○ ( 0 = 偶数 / 1 = 奇数)
					if (target.atk % 2 !== param) return false;
					break;
				case 16:	// 自分が○○タイプ
					if (user.cardType() !== param) return false;
					break;
				case 17:	// 自分が○○属性
					if (user.cardElement() !== param) return false;
					break;
				case 18:	// 自分の稀少度が○○
					if (user.cardRare() !== param) return false;
					break;
				case 19:	// 自分のポジションが○○
					if (user.lose !== param) return false;
					break;
				case 20:	// 自分のHPが○○以上
					if (user.hp < param) return false;
					break;
				case 21:	// 自分のHPが○○以下
					if (user.hp > param) return false;
					break;
				case 22:	// 自分のHPが○○になった
					if (user.hp !== param) return false;
					break;
				case 23:	// 自分のHPが○○ ( 0 = 偶数 / 1 = 奇数)
					if (user.hp % 2 !== param) return false;
					break;
				case 24:	// 自分の攻撃力が○○以上
					if (user.atk < param) return false;
					break;
				case 25:	// 自分の攻撃力が○○以下
					if (user.atk > param) return false;
					break;
				case 26:	// 自分の攻撃力が○○になった
					if (user.atk !== param) return false;
					break;
				case 27:	// 自分の攻撃力が○○ ( 0 = 偶数 / 1 = 奇数)
					if (user.atk % 2 !== param) return false;
					break;
				case 28:	// 自分が○○を継承している
					var result = false;
					for (var i = 0; i <= index; i++) {
						if (user.skill(i).id === param) result = true;
					}
					if (!result) return false;
					break;
				case 29:	// 自分のコストが相手より低い
					if (user.cardCost() >= target.cardCost()) return false;
					break;
				case 30:	// 自分のコストが相手より高い
					if (user.cardCost() <= target.cardCost()) return false;
					break;
				case 31:	// 自分のカードタイプが統一されている
					for (var i = 0; i < user.size(); i++) {
						if (user.card(i).type() !== user.cardType()) return false;
					}
					break;
				case 32:	// 自分のデッキのカード属性が統一されている
					for (var i = 0; i < user.size(); i++) {
						if (user.card(i).element() !== user.cardElement()) return false;
					}
					break;
				case 33:	// 自分のデッキの合計コストが○○以上
					if (user.cost() < param) return false;
					break;
				case 34:	// 自分のデッキの合計コストが○○以下
					if (user.cost() > param) return false;
					break;
				case 35:  //○パーセントで成功 Row追記
					if (Math.random()*100 > param) return false;
					break;
				case 36: //自分が特定種族を含む Row追記
					var tmp =rules[i].split(','); //文字列用に取得しなおし。
					var paramF = tmp[1];
					const factions = user.cardFaction();
					console.log("factions="+factions+", param="+paramF+", check:"+factions);
  					if (!factions.includes(paramF)) return false;
  					
					break;
				case 37: //特定種族が一定数以上 Row追記
					var tmp =rules[i].split(','); //文字列用に取得しなおし。
					var factionName = tmp[1];
  					var countRequired = rule[2] || 1;
  					var count = 0;
  					
  					for (var i = 0; i < user.size(); i++) {
    					if (user.card(i).faction().includes(factionName)) count++;
  					}
  					if (count < countRequired) return false;
  					break;
  				case 38:	 // 指定ターン以降 Row追記
					if (user.turnCount < param) return false;
					break;
				case 39:	 // 指定ラウンド以前 Row追記
					if (this._turnCount > param) return false;
					break;
				case 40:	 // 指定ラウンド以降 Row追記
					if (this._turnCount < param) return false;
					break;
				case 41:	// ラウンドが○○ ( 0 = 偶数 / 1 = 奇数) Row追記
					if (this._turnCount % 2 !== param) return false;
				case 42:	// BPが○○以上
					if (user.bp < param) return false;
				case 43:	// BPが○○以下
					if (user.bp > param) return false;
				case 44:	//BPが相手より○○以上
					if (target.bp - user.bp < param) return false;
				case 45:	// BPが相手より○○小さい
					if (target.bp - user.bp > param) return false;
				} //Switch 閉じ
			} //for閉じ
		} //rules 閉じ
		return true;
	};

	// スキル効果の発動タイミング判定
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

	//-----------------------------------------------------------------------------
	// Game_Deck
	//

	function Game_Deck() {
		this.initialize.apply(this, arguments);
	}

	Object.defineProperties(Game_Deck.prototype, { //オブジェクト定義
		lose: { get: function() { return this._lose; }, configurable: true },
		turnCount: { get: function() { return this._turnCount; }, configurable: true },
		chargeTime: { get: function() { return this._chargeTime; }, configurable: true },
		hp: { get: function() { return this._hp; }, configurable: true },
		atk: { get: function() { return this._atk; }, configurable: true },
		pow: { get: function() { return this._pow; }, configurable: true },
		hpDraw: { get: function() { return this._hpDraw; }, configurable: true },
		atkDraw: { get: function() { return this._atkDraw; }, configurable: true },
		powDraw: { get: function() { return this._powDraw; }, configurable: true },
		//戦況値(bp)追加分
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
		this._bp = TMPlugin.Card.BP_Config.initial; // ★追加: 戦況値初期化
    	this._bpDraw = this._bp;                    // ★追加: 表示用戦況値
	};
	
	//デッキの初期設定
	Game_Deck.prototype.initMembers = function() {
		this._lose = 0;
		this._cost = 0;
		this._cards = [];
		this._skills = [];
		this._skillCount = [];
		this._usedSkills = [];
		this._chargeTime = 0;
		for (var i = 0; i < this._cardIds.length; i++) {//カードリストの枚数分繰り返し。
			if (this._cardIds[i] === 0) continue;
			var card = new Game_Card(this._cardIds[i]);
			var index = this._cards.length;
			if (index > 0) card.setScale(0.5, 0.5);
			this._cards.push(card);
			this._skills.push(card.partySkill()); //継承スキルセット
			this._skillCount.push(0);
			this._cost += card.cost();
		}
		this._skills.push(null);
		this._skillCount.push(0);
		if (this._itemCardId !== 0) { //アイテムが設定されているなら
			this._itemCard = new Game_Card(this._itemCardId);
			this._itemCard.setScale(0.5, 0.5);
			//アイテムカードのスキル2種を配列にプッシュ
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
		this._atk = card.atk().clamp(0, $gameCardBattle.maxAtk); //カードの攻撃力を最大攻撃力にクランプ
		//row カードスピードの追加
		this._spd = card.spd();
		this._pow = card.atk().clamp(0, $gameCardBattle.maxAtk); //効果量表示用の保存場所(初期値は攻撃力）
		console.log("card.name="+card.name()+", [hp,atk,spd]=["+this._hp+","+this._atk+","+this._spd+"], pow="+this._pow);
		//Row追記；種族配列を追加する。
		this._faction = card.faction();
		//this._faction.push(card.faction()); //種族をプッシュ 1 
		this._skills[this.size()] = card.unitSkill(); //スキル配列の該当箇所にスキルを代入
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

	// ターン開始時の初期化処理
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

	// 戦闘不能時の処理
	Game_Deck.prototype.knockout = function() {
		this.card()._knockout = true; // やられ状態にする。row追記
		console.log('戦闘不能で'+this.card().name()+'がknockout='+this.card()._knockout);
		this.card().changeColorToneGray(255); //カードの色をグレーに変えている。
		AudioManager.playSe({"name":"Crow","volume":90,"pitch":120,"pan":0})
		this._lose += 1;
		
		
		//このタイミングでスプライト更新できるか？
		
		if (this._lose < this.size()) this.setNextCard(); //次カードを戦闘にセットする。
	};

	// 次のカードをセット
	Game_Deck.prototype.setNextCard = function() {
		this.initCardStatus();
		this.resetSkillCount();
		this.refreshCardPositions();
		this._hpDraw = this._hp;
		this._atkDraw = this._atk;
		this._powDraw = this._pow;
	};

	// カードの位置をリフレッシュ
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
		//HP変化時にスプライトを表示するようにした（Row追記)
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
	
	//現在ダメージ値を呼び出せるようにセット
	Game_Deck.prototype.setPow = function(value) {
		this._pow = value;
	};

	// 状態の付加
	Game_Deck.prototype.addState = function(stateId) {
		this._states.push(stateId);
	};

	// 指定した状態が付加されているかを返す
	Game_Deck.prototype.isStateAffected = function(stateId) {
		return this._states.contains(stateId);
	};
	
	// ★追加: 戦況値の操作
    Game_Deck.prototype.gainBp = function(value) {
        this._bp = Math.max(this._bp + value, 0);
    };	
	

	Game_Deck.prototype.setDrawNumber = function(hpDraw, atkDraw, powDraw, bpDraw) { //第3パラメータに powDrawを追加
		if (this._hpDraw > hpDraw) this.card().shake();
		this._hpDraw = hpDraw;
		this._atkDraw = atkDraw;
		this._powDraw = powDraw;
		if (bpDraw !== undefined) this._bpDraw = bpDraw; // ★戦況値追加
	};

	// スキル使用回数のリセット
	Game_Deck.prototype.resetSkillCount = function() {
		for (var i = 0; i <= this.size(); i++) {
			this._skillCount[i] = 0;
		}
	};

	// 指定したスキルの使用回数が残っているかを返す
	Game_Deck.prototype.checkSkillCount = function(index) {
		var skill = $dataSkills[this._skills[index]];
		var maxCount = skill.meta.cardRepeats ? +skill.meta.cardRepeats : 0;
		return this._skillCount[index] < maxCount;
	};

	// 指定したスキルがターン内に使用済みかどうかを返す
	Game_Deck.prototype.isSkillUsed = function(index) {
		return this._usedSkills[index];
	};

	// スキルを変更する
	Game_Deck.prototype.changeSkill = function(index, skillId) {
		this._skills[index] = skillId;
	};

	// スキル使用による後処理
	Game_Deck.prototype.useSkill = function(index) {
		if (index > this.size()) {
			this._chargeTime = this.itemCard().hp() + 1;
		}
		this._skillCount[index] += 1;
		this._usedSkills[index] = true;
	};

	// アイテムカードが発動可能かどうかを返す
	Game_Deck.prototype.isItemCardReady = function() {
		if (this._itemCardId === 0) return false;
		return this._chargeTime === 0;
	};

	// ユーザー名を返す
	Game_Deck.prototype.userName = function() {
		return this._userName;
	};

	// デッキサイズを返す
	Game_Deck.prototype.size = function() {
		return this._cards.length;
	};

	// デッキの合計コスト値を返す
	Game_Deck.prototype.cost = function() {
		return this._cost;
	};

	// 指定したインデックスのスキルオブジェクトを返す
	Game_Deck.prototype.skill = function(index) {
		return $dataSkills[this._skills[index]];
	};

	// 指定したカードを返す
	Game_Deck.prototype.card = function(index) {
		if (index == null) index = this._lose;
		return this._cards[index];
	};

	// アイテムカードを返す
	Game_Deck.prototype.itemCard = function() {
		return this._itemCard;
	};

	// カードのコスト値を返す
	Game_Deck.prototype.cardCost = function(index) {
		return this.card(index).cost();
	};

	// カードのタイプ値を返す
	Game_Deck.prototype.cardType = function(index) {
		return this.card(index).type();
	};

	// カードの属性値を返す
	Game_Deck.prototype.cardElement = function(index) {
		return this.card(index).element();
	};

	// カードの稀少度を返す
	Game_Deck.prototype.cardRare = function(index) {
		return this.card(index).rare();
	};
	
	// カードの種族を返す
	Game_Deck.prototype.cardFaction = function(index) {
		return this.card(index).faction();
	};

	
	// デッキ内の種族数のカウントを返す Row追加 未テスト
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

	// カードの位置をリフレッシュ
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

	Game_Card.prototype.initialize = function(cardId) {
		this._cardId = Math.abs(cardId);
		this._item = $dataItems[this._cardId];
		this._hide = cardId < 0;
		this.initMembers();
		this._knockout = false; //やられ状態 Row追記
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

	// 位置の変更
	Game_Card.prototype.setPosition = function(x, y) {
		this._x = x;
		this._y = y;
		this._targetPosition[0] = x;
		this._targetPosition[1] = y;
	};

	// 拡大率の変更
	Game_Card.prototype.setScale = function(scaleX, scaleY) {
		this._scaleX = scaleX;
		this._scaleY = scaleY;
		this._targetPosition[2] = scaleX;
		this._targetPosition[3] = scaleY;
	};

	// 移動先の設定
	Game_Card.prototype.setMove = function(x, y, scaleX, scaleY) {
		this._lastPosition = [this._x, this._y, this._scaleX, this._scaleY];
		this._targetPosition = [x - this._x, y - this._y,
														scaleX - this._scaleX, scaleY - this._scaleY];
		this._moveCount = 0;
	};

	// 揺らす
	Game_Card.prototype.shake = function() {
		this._shakeX = 32;
		this._shakeAngle = 0.0;
	};

	// 揺れているかどうかを返す
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
	
	//やられ状態の確認 Row追記
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
	
	//Row追加：カード速度
	Game_Card.prototype.spd = function() {
		return this._item ? +this._item.meta.cardSpd : 0;
	};
	
	//Row追加：基礎パワー(基本的には攻撃力）
	Game_Card.prototype.pow = function() {
		return this._item ? +this._item.meta.cardAtk : 0;
	};

	Game_Card.prototype.type = function() {
		return this._item ? +this._item.meta.cardType : 0;
	};

	Game_Card.prototype.element = function() {
		return this._item ? +this._item.meta.cardElement : 0;
	};
	
	//Row追加：カードタイプ(種族-列挙型)
	Game_Card.prototype.faction = function() {
		//console.log("metaFaction:"+this._item.meta.cardFaction);
    	//return this._item ? this._item.meta.cardFaction : 'なし';
    	if (!this._item || !this._item.meta.cardFaction) return []; //アイテム未定義かFaction定義が無ければ無を返す。
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

	Game_Card.prototype.unitSkill = function() {
		return this._item ? +this._item.meta.unitSkill : 0;
	};
	//Row 追加：固有2個目
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

	//-----------------------------------------------------------------------------
	// Game_Interpreter //プラグインコマンド
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
			var enemyItemCardId = +arr[1]; //アイテムカードIDを入れる
			var enemyCardIds = arr[2].split(',').map(Number);
			SceneManager.push(Scene_DeckSelect);
			SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			
		} else if (command === 'generateDeckCode') { //デッキコードを生成して変数に返す。
			// var arr = args.map(this.convertEscapeCharactersTM, this); //arrにプラグインコマンドの配列を分割している。
			//var enemyName = arr[0];
			//var enemyItemCardId = +arr[1]; //アイテムカードIDを入れる
			//var enemyCardIds = arr[2].split(',').map(Number); 
			SceneManager.push(Scene_DeckSelect_Code); //コード返す用のデッキ選択シーンに飛ばす。
			//SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			
		} else if (command === 'startCodeBattle') { //相手のデッキコードでバトル
			// 1. 変数からコード文字列を取得
			var code = $gameVariables.value(TMPlugin.Card.VNEnemyCode);
		
			// 2. デコード実行（戻り値はオブジェクト、失敗時は null）
			var data = DeckCodeSystem.decode(code);
		
			if (data) {
				// 成功時：オブジェクトから直接データを取り出す
				var enemyName = data.name;
				var enemyItemCardId = data.itemId;
				var enemyCardIds = data.cardIds; // 既に配列 [1, 2, 3] になっているので変換不要です

				SceneManager.push(Scene_CardBattle);
				SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			} else {
				// 失敗時：不正なコードだった場合の処理
				console.error("デッキコードの読み込みに失敗しました。");
				AudioManager.playSe({"name":"Buzzer1","volume":90,"pitch":100,"pan":0});
			}
			
		}else if (command === 'startCodeDeckSelect') { //デッキ出力先コードを読み込んで、その相手とバトル
			// 1. 変数からコード文字列を取得
			var code = $gameVariables.value(TMPlugin.Card.VNDeckCode);
		
			// 2. デコード実行（戻り値はオブジェクト、失敗時は null）
			var data = DeckCodeSystem.decode(code);
		
			if (data) {
				// 成功時：オブジェクトから直接データを取り出す
				var enemyName = data.name;
				var enemyItemCardId = data.itemId;
				var enemyCardIds = data.cardIds; // 既に配列 [1, 2, 3] になっているので変換不要です

				SceneManager.push(Scene_DeckSelect);
				SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			} else {
				// 失敗時：不正なコードだった場合の処理
				console.error("デッキコードの読み込みに失敗しました。");
				AudioManager.playSe({"name":"Buzzer1","volume":90,"pitch":100,"pan":0});
			}
		
			//変数参照でコードからデッキに変換。
			//var arr = DeckCodeSystem.decode($gameVariables.value(TMPlugin.Card.VNDeckCode)); 
			//var arr = args.map(this.convertEscapeCharactersTM, this); //参考用。プラグインコマンド引数。
			//var enemyName = arr[0];
			//var enemyItemCardId = +arr[1]; //アイテムカードIDを入れる
			//var enemyCardIds = arr[2].split(',').map(Number);
			//SceneManager.push(Scene_DeckSelect);
			//SceneManager.prepareNextScene(enemyName, enemyItemCardId, enemyCardIds);
			
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
	
	//-----------------------------------------------------------------------------
	// Sprite_Card
	//

	function Sprite_Card() {
		this.initialize.apply(this, arguments);
	}
	
	window.Sprite_Card = Sprite_Card; //外部から参照できるように追加

	Sprite_Card.prototype = Object.create(Sprite_Base.prototype);
	Sprite_Card.prototype.constructor = Sprite_Card;

	Sprite_Card.prototype.initialize = function(card) {
		Sprite_Base.prototype.initialize.call(this);
		this.bitmap = new Bitmap(192, 288);
		this.bitmap.smooth = true;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this._hide = card.isHiding();
		this._knockout = card.isKnockout(); //ノックアウト状態のフラグ
		this.setCard(card);
	};

	Sprite_Card.prototype.initMembers = function() {
		this._colorToneGray = 0;
	};

	Sprite_Card.prototype.setCard = function(card) {
		this._card = card;
		this.initMembers();
		this.loadCardBitmap();
	};

	Sprite_Card.prototype.loadCardBitmap = function() {
		
		
		if (this._hide || this._card.id() === 0) {
			this._cardBitmap = ImageManager.loadPicture('card_0'); //裏面
		} else {
			
			if (this._knockout|| this._card.id() === 0){ //やられ状態
				this._cardBitmap	= ImageManager.loadPicture(this._card.knockoutName());
				console.log('cardbitmap差し替え'); //ここは反応
			}else{
			
			this._cardBitmap	= ImageManager.loadPicture(this._card.fileName());
			this._knockoutBitmap = ImageManager.loadPicture(this._card.knockoutName()); //やられ画像追加 Row追記
			if (TMPlugin.Card.UseAutoText) { // 自動生成の場合、カード枠等を上書きする。
				if (this._card.type() === 4) {
					this._backBitmap	= ImageManager.loadPicture('c_back_i');
					this._frameBitmap = ImageManager.loadPicture('c_frame_i');
				} else {
					this._backBitmap	= ImageManager.loadPicture('c_back_' + this._card.type());
					this._frameBitmap = ImageManager.loadPicture('c_frame_' + this._card.element());
				}
				this._rareBitmap	= ImageManager.loadPicture('c_rare_' + this._card.rare());
			}
			} //やられ追加カッコ
		}
		
		this._bitmapLoading = true;
	};

	//カード画像描画
	Sprite_Card.prototype.createCardBitmap = function() {
		this.bitmap.clear();
		
		if (this._knockout){
			this.bitmap.blt(this._backBitmap, 0, 0, 192, 288, 0, 0);
			this.bitmap.blt(this._cardBitmap, 0, 0, 192, 288, 0, 0); //cardBitmap に入っている物を直接描画。
			this.bitmap.blt(this._frameBitmap, 0, 0, 192, 288, 0, 0);
			//this.bitmap.blt(this._knockoutBitmap, 0, 0, 192, 288, 0, 0); //やられ画像を描画するblt
			console.log('やられ画像'); //ここも反応
			//フォント設定(カード名)
			this.bitmap.fontSize = 18;
			this.bitmap.textColor = '#ffffff';
			this.bitmap.outlineWidth = 3;
			this.bitmap.outlineColor = '#000000';
			this.bitmap.drawText(this._card.name(), 36, 10, 152, 24, 'left');
			//種族名描画
			this.bitmap.fontSize = 13;
			this.bitmap.textColor = '#ffffff';
			this.bitmap.outlineWidth = 3;
			this.bitmap.outlineColor = '#000000';
			this.bitmap.drawText(this._card.faction(), 34, 31, 152, 24, 'left');
			
		}else{
		
		if (!this._hide && this._card.id() > 0 && TMPlugin.Card.UseAutoText) {
			console.log('カード画像作成');
			this.bitmap.blt(this._backBitmap, 0, 0, 192, 288, 0, 0);
			this.bitmap.blt(this._cardBitmap, 0, 0, 192, 288, 0, 0);
			this.bitmap.blt(this._frameBitmap, 0, 0, 192, 288, 0, 0);
			
			// this.bitmap.blt(this._rareBitmap, 0, 0, 192, 288, 0, 0); レアリティアイコン画像描画
			this.drawIcon(TMPlugin.Card.TypeIcons[this._card.type()], 8, 10, 24, 24);
			//コスト分のアイコンを描画
			//for (var i = 0; i < this._card.cost(); i++) {
			//	this.drawIcon(TMPlugin.Card.CostIcon, 160, i * TMPlugin.Card.CostIconSpace + 44, 24, 24);
			//}
			
			//フォント設定(カード名)
			this.bitmap.fontSize = 18;
			this.bitmap.textColor = '#ffffff';
			this.bitmap.outlineWidth = 3;
			this.bitmap.outlineColor = '#000000';
			this.bitmap.drawText(this._card.name(), 36, 10, 152, 24, 'left');
			
			//スキルアイコンとスキル名の描画
			var unitSkill = $dataSkills[this._card.unitSkill()];
			if (unitSkill) {
				this.drawIcon(unitSkill.iconIndex, 8, 226, 24, 24);
				this.bitmap.drawText(unitSkill.name, 32, 226, 152, 24, 'left');
			}
			var partySkill = $dataSkills[this._card.partySkill()];
			if (partySkill) {
				this.drawIcon(partySkill.iconIndex, 8, 254, 24, 24);
				this.bitmap.drawText(partySkill.name, 32, 254, 152, 24, 'left');
			}
			//ここまで
			
			//種族名描画
			this.bitmap.fontSize = 13;
			this.bitmap.textColor = '#ffffff';
			this.bitmap.outlineWidth = 3;
			this.bitmap.outlineColor = '#000000';
			this.bitmap.drawText(this._card.faction(), 34, 31, 152, 24, 'left');
			
			//パラメータ数値描画
			this.bitmap.fontSize = 28;
			this.bitmap.textColor = '#ffffff';
			this.bitmap.outlineWidth = 3;
			this.bitmap.outlineColor = '#000000';
			this.bitmap.drawText(this._card.hp(), 22, 185, 48, 32, 'center');
			if (this._card.type() < 4) { //アイテムでなければ攻撃力を描画。
				this.bitmap.drawText(this._card.atk(), 83, 185, 48, 32, 'center');
				//ROW追記。速度も描画
				this.bitmap.drawText(this._card.spd(), 148, 185, 48, 32, 'center');
			}
		} else {
			this.bitmap.blt(this._cardBitmap, 0, 0, 192, 288, 0, 0); //cardBitmap に入っている物を直接描画。
		}
		} //やられ追記
		this._bitmapLoading = false;
	};

	Sprite_Card.prototype.drawIcon = function(iconIndex, x, y, width, height) {
		var bitmap = ImageManager.loadSystem('IconSet');
		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var sx = iconIndex % 16 * pw;
		var sy = Math.floor(iconIndex / 16) * ph;
		this.bitmap.blt(bitmap, sx, sy, pw, ph, x, y, width, height);
	};

	// おもてにする
	Sprite_Card.prototype.open = function() {
		this._hide = false;
		this.loadCardBitmap();
	};
	
	Sprite_Card.prototype.defeat = function() {
		this._knockout = true;
		this.loadCardBitmap();
	};

	Sprite_Card.prototype.update = function() {
		Sprite_Base.prototype.update.call(this);
		if (this._bitmapLoading && ImageManager.isReady()) { //最初の1回だけカード作成をしている。
			this.createCardBitmap();
		}
		this.x = this._card.screenX();
		this.y = this._card.screenY();
		this.scale.x = this._card.scaleX();
		this.scale.y = this._card.scaleY();
		if (this._hide && !this._card.isHiding()) this.open();
		this.updateCardImage();		
		this.updateAnimation();
		this.updateColorTone();
	};

	Sprite_Card.prototype.updateAnimation = function() {
		this.setupAnimation();
	};

	Sprite_Card.prototype.setupAnimation = function() {
		while (this._card.isAnimationRequested()) {
			var data = this._card.shiftAnimation();
			var animation = $dataAnimations[data.animationId];
			var mirror = data.mirror;
			var delay = animation.position === 3 ? 0 : data.delay;
			this.startAnimation(animation, mirror, delay);
			for (var i = 0; i < this._animationSprites.length; i++) {
				var sprite = this._animationSprites[i];
			}
		}
	};

	Sprite_Card.prototype.updateColorTone = function() {
		if (this._colorToneGray !== this._card.colorToneGray()) {
			this._colorToneGray = this._card.colorToneGray();
			this.setColorTone([0, 0, 0, this._colorToneGray]);
		}
	};
	
	//グレスケにするのと同じ要領で updateImageで作り直せるか？
	Sprite_Card.prototype.updateCardImage = function() {
		if (this._card._knockout && !this._knockout){ //カード側がやられ、スプライトがやられでないとき
			console.log(this._card.name()+' のカード, やられ作り直し');
			this.defeat();
			this.createCardBitmap();
		}
	}
	


	Sprite_Card.prototype.isGray = function() {
		return this._colorToneGray === 255;
	};

	//-----------------------------------------------------------------------------
	// Sprite_Number
	//

	function Sprite_Number() {
		this.initialize.apply(this, arguments);
	}

	Sprite_Number.prototype = Object.create(Sprite.prototype);
	Sprite_Number.prototype.constructor = Sprite_Number;

	Sprite_Number.prototype.initialize = function(x, y, width, height, fontSize,textColor, outlineWidth, outlineColor) {
		Sprite.prototype.initialize.call(this);
		this.bitmap = new Bitmap(width, height);
		this.bitmap.fontSize = fontSize;
		this.bitmap.textColor = textColor;
		this.bitmap.outlineWidth = outlineWidth;
		this.bitmap.outlineColor = outlineColor;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.x = x;
		this.y = y;
		this._currentNumber = 0;
		this._newNumber = 0;
		this._waitCount = 0;
		this.refresh();
	};

	Sprite_Number.prototype.setNumber = function(value) {
		if (this._newNumber !== value) {
			this._newNumber = value;
			this.updateNumber();
		}
	};

	Sprite_Number.prototype.update = function() {
		Sprite.prototype.update.call(this);
		if (this._waitCount > 0) {
			this._waitCount -= 1;
		} else {
			this.updateNumber();
		}
	};
	
	Sprite_Number.prototype.setChangeStartHandler = function(callback) {
    	this._onChangeStart = callback;
	};

	Sprite_Number.prototype.updateNumber = function() {
		if (this._currentNumber !== this._newNumber) {
			if (this._currentNumber < this._newNumber) {
				this._currentNumber += 1;
			} else {
				this._currentNumber -= 1;
			}
			this.refresh();
			this._waitCount = 3;
		}
	};

	Sprite_Number.prototype.refresh = function() {
		this.bitmap.clear();
		var width = this.bitmap.width;
		var height = this.bitmap.height;
		this.bitmap.drawText(this._currentNumber + '', 0, 0, width, height, 'center');
	};
	
	//ダメージ表示用に追加
	Sprite_Number.prototype.isChanging = function() {
    	return this._value !== this._targetValue;
	};

	//-----------------------------------------------------------------------------
	// Sprite_TurnCursor アクティブプレイヤーアイコン（回転⇔）の描画
	//

	function Sprite_TurnCursor() {
		this.initialize.apply(this, arguments);
	}

	Sprite_TurnCursor.prototype = Object.create(Sprite.prototype);
	Sprite_TurnCursor.prototype.constructor = Sprite_TurnCursor;

	Sprite_TurnCursor.prototype.initialize = function() {
		Sprite.prototype.initialize.call(this);
		this.bitmap = ImageManager.loadPicture('c_cursor');
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this._turn = null;
		var x = TMPlugin.Card.NumberPositions[0][0] +
						(TMPlugin.Card.NumberPositions[2][0] - TMPlugin.Card.NumberPositions[0][0]) / 2;
		var y = TMPlugin.Card.NumberPositions[0][1] +
						(TMPlugin.Card.NumberPositions[2][1] - TMPlugin.Card.NumberPositions[0][1]) / 2;
		this.move(x, y);
		this._lastPosition = [this.x, this.y];
		this._targetPosition = [this.x, this.y];
		this._moveCount = 8;
		this._scaleCount = 0;
	};

	Sprite_TurnCursor.prototype.update = function() {
		this.rotation += 0.02;
		this._scaleCount += 1;
		if (this._scaleCount >= 240) this._scaleCount = 0;
		this.scale.x = Math.sin(Math.PI * this._scaleCount / 120) * 0.2 + 1.0;
		this.scale.y = this.scale.x;
		if (this._turn !== $gameCardBattle.turn) {
			this._turn = $gameCardBattle.turn;
			this.setMove.apply(this, TMPlugin.Card.NumberPositions[this._turn ? 0 : 2]);
		}
		if (this._moveCount < 8) {
			this._moveCount += 1;
			var d = Math.sin(this._moveCount * Math.PI / 16);
			this.x = this._lastPosition[0] + d * this._targetPosition[0];
			this.y = this._lastPosition[1] + d * this._targetPosition[1];
		}
	};

	Sprite_TurnCursor.prototype.setMove = function(x, y) {
		this._lastPosition = [this.x, this.y];
		this._targetPosition = [x - this.x, y - this.y];
		this._moveCount = 0;
	};

	//-----------------------------------------------------------------------------
	// Spriteset_CardBattle
	//

	function Spriteset_CardBattle() {
		this.initialize.apply(this, arguments);
	}

	Spriteset_CardBattle.prototype = Object.create(Spriteset_Base.prototype);
	Spriteset_CardBattle.prototype.constructor = Spriteset_CardBattle;

	Spriteset_CardBattle.prototype.initialize = function() {
		Spriteset_Base.prototype.initialize.call(this);
	};

	Spriteset_CardBattle.prototype.createLowerLayer = function() {
		Spriteset_Base.prototype.createLowerLayer.call(this);
		this.createBackground();
		this.createBattleField();
		this.createBattleback(); //ここで背景指定
		
		this.createTurnCursor();
		this.createPlayerCards();
		this.createEnemyCards();
		this.createNumberSprites();
		
		this.createBattleStatusGauge(); // ★戦況追加
	};

	Spriteset_CardBattle.prototype.createBackground = function() { //ハイケイ
		this._backgroundSprite = new Sprite();
		this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
		this._baseSprite.addChild(this._backgroundSprite);
	};

	Spriteset_CardBattle.prototype.createBattleField = function() {
		var width = Graphics.boxWidth;
		var height = Graphics.boxHeight;
		var x = (Graphics.width - width) / 2;
		var y = (Graphics.height - height) / 2;
		this._battleField = new Sprite();
		this._battleField.setFrame(x, y, width, height);
		this._battleField.x = x;
		this._battleField.y = y;
		this._baseSprite.addChild(this._battleField);
	};
	
	
	//戦況値ゲージの描画
	Spriteset_CardBattle.prototype.createBattleStatusGauge = function() {
        var conf = TMPlugin.Card.BP_Config;
        var centerX = Graphics.width / 2;
        var totalWidth = conf.gaugeWidth * 2; // 左右合わせた全長
        
        // ゲージ全体のコンテナ
        this._bpGaugeSprite = new Sprite();
        //this._baseSprite.addChild(this._bpGaugeSprite);

        // 1. ベース（敵の勢力）
        // 全長分のバーを作り、敵の色で塗りつぶす。これが背景になります。
        this._bpEnemyBar = new Sprite(new Bitmap(totalWidth, conf.gaugeHeight));
        this._bpEnemyBar.x = centerX - conf.gaugeWidth; // 左端座標
        this._bpEnemyBar.y = conf.gaugeY;
        this._bpEnemyBar.bitmap.fillAll(conf.colorEnemy);
        this._bpGaugeSprite.addChild(this._bpEnemyBar);

        // 2. フロント（プレイヤーの勢力）
        // 同じく全長分のバーを作りますが、あとで setFrame で幅を削ります。
        this._bpPlayerBar = new Sprite(new Bitmap(totalWidth, conf.gaugeHeight));
        this._bpPlayerBar.x = centerX - conf.gaugeWidth; // 敵バーと同じ位置
        this._bpPlayerBar.y = conf.gaugeY;
        this._bpPlayerBar.bitmap.fillAll(conf.colorPlayer);
        this._bpGaugeSprite.addChild(this._bpPlayerBar);

        // 3. 境界線マーカー（現在の均衡点）
        // プレイヤーバーの先端に表示する白い棒
        this._bpSlider = new Sprite(new Bitmap(4, conf.gaugeHeight + 8));
        this._bpSlider.bitmap.fillAll('#ffffff');
        this._bpSlider.anchor.x = 0.5;
        this._bpSlider.anchor.y = 0.5;
        this._bpSlider.y = conf.gaugeY + conf.gaugeHeight / 2;
        this._bpGaugeSprite.addChild(this._bpSlider);

        // 4. 中央マーカー（50:50の地点）
        // 画面中央に固定で表示する基準線
        this._bpCenterMarker = new Sprite(new Bitmap(2, conf.gaugeHeight + 16));
        this._bpCenterMarker.bitmap.fillAll('#ffff00'); // 黄色
        this._bpCenterMarker.anchor.x = 0.5;
        this._bpCenterMarker.anchor.y = 0.5;
        this._bpCenterMarker.x = centerX;
        this._bpCenterMarker.y = conf.gaugeY + conf.gaugeHeight / 2;
        this._bpGaugeSprite.addChild(this._bpCenterMarker);

        // テキスト表示（前回と同じ）
        this._bpTextSprite = new Sprite(new Bitmap(Graphics.width, 64));
        this._bpTextSprite.y = conf.textY;
        this._bpGaugeSprite.addChild(this._bpTextSprite);
        
        // 見出し（前回と同じ）
        var headerY = conf.textY - 16;
        this._bpHeaderSprite = new Sprite(new Bitmap(Graphics.width, 48));
        this._bpHeaderSprite.bitmap.fontSize = 20;
        this._bpHeaderSprite.bitmap.outlineWidth = 3;
        this._bpHeaderSprite.bitmap.drawText("BATTLE STATUS", 0, 0, Graphics.width, 32, 'center');
        this._bpHeaderSprite.y = headerY;
        this._bpGaugeSprite.addChild(this._bpHeaderSprite);
    };
	
	

	Spriteset_CardBattle.prototype.createTurnCursor = function() {
		this._turnCursorSprite = new Sprite_TurnCursor();
		this._baseSprite.addChild(this._turnCursorSprite);
	};

	Spriteset_CardBattle.prototype.createPlayerCards = function() {
		this._playerCardSprites = [];
		var playerDeck = $gameCardBattle.playerDeck();
		for (var i = 0; i < playerDeck.size(); i++) {
			this._playerCardSprites[i] = new Sprite_Card(playerDeck.card(i), false);
			this._baseSprite.addChild(this._playerCardSprites[i]);
		}
		var itemCard = playerDeck.itemCard();
		if (itemCard) {
			var sprite = new Sprite_Card(itemCard, false);
			this._playerCardSprites.push(sprite);
			this._baseSprite.addChild(sprite);
		}
	};

	Spriteset_CardBattle.prototype.createEnemyCards = function() {
		this._enemyCardSprites = [];
		var enemyDeck = $gameCardBattle.enemyDeck();
		for (var i = 0; i < enemyDeck.size(); i++) {
			var hide = false;
			this._enemyCardSprites[i] = new Sprite_Card(enemyDeck.card(i), hide);
			this._baseSprite.addChild(this._enemyCardSprites[i]);
		}
		var itemCard = enemyDeck.itemCard();
		if (itemCard) {
			var sprite = new Sprite_Card(itemCard, false);
			this._enemyCardSprites.push(sprite);
			this._baseSprite.addChild(sprite);
		}
	};
	
	//ダメージ表示開始関数(Row追記)
	Spriteset_CardBattle.prototype.startDamageDisplay = function(side, damage) {
    	this._damageDisplayDuration = 60; // 表示時間：60フレーム（1秒）
    	//this._damageTarget = side; // "player" または "enemy"
   	 	this._damageValue = damage;

    	const label = (side === true) ? this._damageLabelPlayer : this._damageLabelEnemy;
    	label.opacity = 255;
    	label.bitmap.clear();
    	console.log("side="+side+", damage="+damage);
    	const isHeal = damage > 0; //damageが負なら回復(true)
    	label.bitmap.textColor = isHeal ? "#00cc88" : "#ff4444"; // 緑:回復 / 赤:ダメージ
    	if(isHeal){
    		label.bitmap.drawText("回復: " + Math.abs(damage), 0, 0, 200, 40, "center");
    	}else{
    		label.bitmap.drawText("ダメージ: " + damage, 0, 0, 200, 40, "center");
    	}
	};
	

	//数字スプライトの作成と描画
	Spriteset_CardBattle.prototype.createNumberSprites = function() {
		//スプライト関数 (x, y, width, height, fontSize,textColor, outlineWidth, outlineColor)
		var pos = TMPlugin.Card.NumberPositions[0];
		//プレイヤーHP描画（初期値 pos[0], pos[1], 256, 128, 120, '#000000', 3, '#ffffff'
		this._playerHpSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 64, '#ffffff', 5, '#000000');
		this._baseSprite.addChild(this._playerHpSprite);
		
		//プレイヤーATK描画（初期値 Sprite_Number(pos[0], pos[1], 128, 64, 60, '#ff0000', 3, '#000000');
		pos = TMPlugin.Card.NumberPositions[1];
		this._playerAtkSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 48, '#ff3333', 3, '#000000');
		this._baseSprite.addChild(this._playerAtkSprite);
		
		pos = TMPlugin.Card.NumberPositions[2];
		this._enemyHpSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 64, '#ffffff', 5, '#000000');
		this._baseSprite.addChild(this._enemyHpSprite);
		
		pos = TMPlugin.Card.NumberPositions[3];
		this._enemyAtkSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 48, '#ff3333', 3, '#000000');
		this._baseSprite.addChild(this._enemyAtkSprite);
		
		//ダメージ表示のスプライト（テスト中）
		/*
		var pos = TMPlugin.Card.NumberPositions[0];
		this._playerPowSprite = new Sprite_Number(pos[0]+20, pos[1]+20, 128, 64, 48, '#ffff00', 5, '#000000');
		this._baseSprite.addChild(this._playerPowSprite);
		pos = TMPlugin.Card.NumberPositions[2];
		this._enemyPowSprite = new Sprite_Number(pos[0]-20, pos[1]+20, 128, 64, 48, '#ffff00', 5, '#000000');
		this._baseSprite.addChild(this._enemyPowSprite);
		*/
		
		
		//アイテムカードの場合
		if ($gameCardBattle.playerDeck().itemCard()) {
			pos = TMPlugin.Card.PlayerItemCardPosition;
			this._playerChargeTimeSprite = new Sprite_Number(pos[0], pos[1], 96, 48, 45, '#0000ff', 3, '#ffffff');
			this._baseSprite.addChild(this._playerChargeTimeSprite);
		}
		if ($gameCardBattle.enemyDeck().itemCard()) {
			pos = TMPlugin.Card.EnemyItemCardPosition;
			this._enemyChargeTimeSprite = new Sprite_Number(pos[0], pos[1], 96, 48, 45, '#0000ff', 3, '#ffffff');
			this._baseSprite.addChild(this._enemyChargeTimeSprite);
		}
		//数字下合わせ  128,450 128,510 688,450 688,510
		//数字横合わせ
		
		//この辺から追加表示内容(Row)
		// プレイヤーHPラベル
		let label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("HP", 0, 0, 256, 48, "center");
		label.x = this._playerHpSprite.x - 128 - 64;
		label.y = this._playerHpSprite.y - 24;
		this._baseSprite.addChild(label);

		// プレイヤーATKラベル
		label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("ATK", 0, 0, 256, 48, "center");
		label.x = this._playerAtkSprite.x -128 -64 -4;
		label.y = this._playerAtkSprite.y - 24;
		this._baseSprite.addChild(label);

		// 敵HPラベル
		label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("HP", 0, 0, 256, 48, "center");
		label.x = this._enemyHpSprite.x - 64;
		label.y = this._enemyHpSprite.y - 24;
		this._baseSprite.addChild(label);

		// 敵ATKラベル
		label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("ATK", 0, 0, 256, 48, "center");
		label.x = this._enemyAtkSprite.x -64;
		label.y = this._enemyAtkSprite.y - 24;
		this._baseSprite.addChild(label);
		
		//ダメージ表示スプライトを作成
		this._damageLabelPlayer = new Sprite(new Bitmap(200, 40));
		this._damageLabelPlayer.bitmap.fontSize = 22;
		this._damageLabelPlayer.x = Graphics.width / 2 - 220; // 左寄り
		this._damageLabelPlayer.y = 250;
		this._damageLabelPlayer.opacity = 0;
		this._baseSprite.addChild(this._damageLabelPlayer);

		this._damageLabelEnemy = new Sprite(new Bitmap(200, 40));
		this._damageLabelEnemy.bitmap.fontSize = 22;
		this._damageLabelEnemy.x = Graphics.width / 2 + 20; // 右寄り
		this._damageLabelEnemy.y = 230;
		this._damageLabelEnemy.opacity = 0;
		this._baseSprite.addChild(this._damageLabelEnemy);
		
		//ラウンド表示
		
		let roundLabel = new Sprite(new Bitmap(256, 48));
		roundLabel.bitmap.fontSize = 32;
		roundLabel.bitmap.outlineWidth = 5;
		roundLabel.bitmap.drawText("ROUND", 0,0, 128, 48, "center");
		roundLabel.x = Graphics.width / 2 - 64; // 
		roundLabel.y = 270;
		this._baseSprite.addChild(roundLabel);
		
		this._roundNum = new Sprite_Number(408, 350, 128, 64, 64, '#ffff00', 5, '#000000');
		this._baseSprite.addChild(this._roundNum);
		
	};

	Spriteset_CardBattle.prototype.update = function() {
		Spriteset_Base.prototype.update.call(this);
		this.updateNumberSprites();
	};

	Spriteset_CardBattle.prototype.updateNumberSprites = function() {
		//HP, ATKの更新
		this._playerHpSprite.setNumber($gameCardBattle.playerDeck().hpDraw);
		this._playerAtkSprite.setNumber($gameCardBattle.playerDeck().atkDraw);
		this._enemyHpSprite.setNumber($gameCardBattle.enemyDeck().hpDraw);
		this._enemyAtkSprite.setNumber($gameCardBattle.enemyDeck().atkDraw);
		
		//パワーの更新
		//this._playerPowSprite.setNumber($gameCardBattle.playerDeck().powDraw);
		//this._enemyPowSprite.setNumber($gameCardBattle.enemyDeck().powDraw);
		
		//ラウンドの更新
		console.log("ターン "+$gameCardBattle.turnCount());
		if ($gameCardBattle.turnCount() <= TMPlugin.Card.MaxTurn){
			
			if ($gameCardBattle.turnCount() > (TMPlugin.Card.MaxTurn-3)){
				//ラスト3ターン 色を変える。
				this._roundNum.bitmap.textColor = '#ff0000';
			}
			this._roundNum.setNumber($gameCardBattle.turnCount());
		}
		
		//アイテムクールタイム描画(スプライトが作られている場合）
		if (this._playerChargeTimeSprite) {
			this._playerChargeTimeSprite.visible = this._playerCardSprites[this._playerCardSprites.length - 1].isGray();
			this._playerChargeTimeSprite.setNumber($gameCardBattle.playerDeck().chargeTime - 1);
		}
		if (this._enemyChargeTimeSprite) {
			this._enemyChargeTimeSprite.visible = this._enemyCardSprites[this._enemyCardSprites.length - 1].isGray();
			this._enemyChargeTimeSprite.setNumber($gameCardBattle.enemyDeck().chargeTime - 1);
		}
		
		//ダメージ表示追加分
			// 表示対象ラベルの決定(_turn = true なら自分のラベルを指定）
		    const label = $gameCardBattle._turn === true ? this._damageLabelPlayer : this._damageLabelEnemy;
		    
		    const changing = this._playerHpSprite.isChanging() || this._enemyHpSprite.isChanging();
		    if (changing) { //ダメージ変化中か？
		        this._damageDisplayDuration = 60; // ダメージ変動中毎回リセット
		        label.opacity = 255;
        		label.bitmap.clear();
        		
        		const isHeal = this._damageValue < 0;
        		const valueAbs = Math.abs(this._damageValue);
        		const text = isHeal ? ("回復: " + valueAbs) : ("ダメージ: " + valueAbs);
        		
        		label.bitmap.textColor = isHeal ? "#00cc88" : "#ff4444";
        		label.bitmap.drawText(text, 0, 0, 200, 40, "center");
        		console.log('これでてる？');
		        
		    } else if (this._damageDisplayDuration > 0) {
        		// 演出が終わった後：徐々にフェードアウト
        		this._damageDisplayDuration--;
        		label.opacity = Math.max(0, label.opacity - 8);
		    } else {
		        // 完全に消す（冗長防止）
		        if (label.opacity > 0) {
		            label.opacity = Math.max(0, label.opacity - 8);
		        }
		    }
		    
		// ★追加: 戦況値ゲージの更新
        this.updateBpGauge();
		    
	};
	
	// ★追加: 戦況値更新用メソッド
    Spriteset_CardBattle.prototype.updateBpGauge = function() {
        var conf = TMPlugin.Card.BP_Config;
        var pBp = $gameCardBattle.playerDeck().bpDraw;
        var eBp = $gameCardBattle.enemyDeck().bpDraw;
        var totalWidth = conf.gaugeWidth * 2;

        // --- 数値テキスト更新 (前回と同じ) ---
        if (this._lastPBp !== pBp || this._lastEBp !== eBp) {
            this._lastPBp = pBp;
            this._lastEBp = eBp;
            
            var bmp = this._bpTextSprite.bitmap;
            bmp.clear();
            bmp.fontSize = conf.fontSize;
            bmp.outlineWidth = 4;
            
            bmp.textColor = conf.colorPlayer;
            bmp.drawText(pBp, 0, 0, Graphics.width / 2 - 40, 64, 'right');
            
            bmp.textColor = '#ffffff';
            bmp.drawText("vs", 0, 0, Graphics.width, 64, 'center');
            
            bmp.textColor = conf.colorEnemy;
            bmp.drawText(eBp, Graphics.width / 2 + 40, 0, Graphics.width / 2 - 40, 64, 'left');
        }

        // --- シーソーゲージの計算 ---
        
        var totalBp = pBp + eBp;
        var rate = 0.5; // 初期値または両方0の場合は50%（中央）
        if (totalBp > 0) {
            // 全体に対するプレイヤーの割合を計算
            rate = pBp / totalBp;
        }

        // プレイヤーバーの幅を決定
        // 例: rateが0.8なら、バーの80%が青くなり、残りの20%が背景の赤として見える
        var currentWidth = totalWidth * rate;

        // setFrame(x, y, width, height) で切り抜き範囲を変更
        this._bpPlayerBar.setFrame(0, 0, currentWidth, conf.gaugeHeight);

        // 境界線スライダーの位置を更新
        // バーの左端座標 + プレイヤーバーの長さ
        this._bpSlider.x = this._bpPlayerBar.x + currentWidth;
    };
	
	  //ここから戦闘背景用の記述
Spriteset_CardBattle.prototype.createBattleback = function() {
// TilingSprite（タイル）ではなく、通常のSprite（単体画像）として生成します
    this._back1Sprite = new Sprite();
    this._back2Sprite = new Sprite();

    // 画像を設定
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();

    // アンカー（画像の基準点）を中心に設定 (0.5, 0.5)
    // これにより、画像の中心が座標の基準になります
    this._back1Sprite.anchor.x = 0.5;
    this._back1Sprite.anchor.y = 0.5;
    this._back2Sprite.anchor.x = 0.5;
    this._back2Sprite.anchor.y = 0.5;

    // 画面の中央座標を計算
    var centerX = Graphics.width / 2;
    var centerY = Graphics.height / 2;

    // 画像を画面中央に配置
    this._back1Sprite.x = centerX;
    this._back1Sprite.y = centerY +10;
    this._back2Sprite.x = centerX;
    this._back2Sprite.y = centerY +10;

    // 画面に追加
    this._baseSprite.addChild(this._back1Sprite);
    this._baseSprite.addChild(this._back2Sprite);

};

Spriteset_CardBattle.prototype.updateBattleback = function() {
	//位置調整を画像表示時にするので要らなくなった。
};

Spriteset_CardBattle.prototype.locateBattleback = function() {
    var width = this._baseSprite.width;
    var height = this._baseSprite.height;
    var sprite1 = this._back1Sprite;
    var sprite2 = this._back2Sprite;
    sprite1.origin.x = sprite1.x + (sprite1.bitmap.width - width) / 2;
    sprite2.origin.x = sprite1.y + (sprite2.bitmap.width - width) / 2;
    if ($gameSystem.isSideView()) {
        sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
        sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
    }
};

Spriteset_CardBattle.prototype.battleback1Bitmap = function() {
    return ImageManager.loadBattleback1(this.battleback1Name());
};

Spriteset_CardBattle.prototype.battleback2Bitmap = function() {
    return ImageManager.loadBattleback2(this.battleback2Name());
};

Spriteset_CardBattle.prototype.battleback1Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name()) {
        return $gameMap.battleback1Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback1Name();
    } else {
        return '';
    }
};

Spriteset_CardBattle.prototype.battleback2Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name()) {
        return $gameMap.battleback2Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback2Name();
    } else {
        return '';
    }
};

Spriteset_CardBattle.prototype.overworldBattleback1Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback1Name();
    } else {
        return this.normalBattleback1Name();
    }
};

Spriteset_CardBattle.prototype.overworldBattleback2Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback2Name();
    } else {
        return this.normalBattleback2Name();
    }
};

Spriteset_CardBattle.prototype.normalBattleback1Name = function() {
    return (this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name());
};

Spriteset_CardBattle.prototype.normalBattleback2Name = function() {
    return (this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name());
};

Spriteset_CardBattle.prototype.terrainBattleback1Name = function(type) {
    switch (type) {
    case 24: case 25:
        return 'Wasteland';
    case 26: case 27:
        return 'DirtField';
    case 32: case 33:
        return 'Desert';
    case 34:
        return 'Lava1';
    case 35:
        return 'Lava2';
    case 40: case 41:
        return 'Snowfield';
    case 42:
        return 'Clouds';
    case 4: case 5:
        return 'PoisonSwamp';
    default:
        return null;
    }
};

Spriteset_CardBattle.prototype.terrainBattleback2Name = function(type) {
    switch (type) {
    case 20: case 21:
        return 'Forest';
    case 22: case 30: case 38:
        return 'Cliff';
    case 24: case 25: case 26: case 27:
        return 'Wasteland';
    case 32: case 33:
        return 'Desert';
    case 34: case 35:
        return 'Lava';
    case 40: case 41:
        return 'Snowfield';
    case 42:
        return 'Clouds';
    case 4: case 5:
        return 'PoisonSwamp';
    }
};

Spriteset_CardBattle.prototype.defaultBattleback1Name = function() {
    return 'Grassland';
};

Spriteset_CardBattle.prototype.defaultBattleback2Name = function() {
    return 'Grassland';
};

Spriteset_CardBattle.prototype.shipBattleback1Name = function() {
    return 'Ship';
};

Spriteset_CardBattle.prototype.shipBattleback2Name = function() {
    return 'Ship';
};

Spriteset_CardBattle.prototype.autotileType = function(z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};

	//-----------------------------------------------------------------------------
	// Window_MenuCommand
	//

	var _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
	Window_MenuCommand.prototype.addMainCommands = function() {
		_Window_MenuCommand_addMainCommands.call(this);
		if ($gameParty.maxDeck() > 0) {
			this.addCommand(TMPlugin.Card.CommandDeckEdit, 'deckEdit', true);
		}
	};

	//-----------------------------------------------------------------------------
	// Window_DeckEdit
	//

	function Window_DeckEdit() {
		this.initialize.apply(this, arguments);
	}

	Window_DeckEdit.prototype = Object.create(Window_Selectable.prototype);
	Window_DeckEdit.prototype.constructor = Window_DeckEdit;

	Window_DeckEdit.prototype.initialize = function(x, y, selectMode) {
		var width = this.windowWidth();
		var height = this.fittingHeight(Math.min($gameParty.maxDeck(), 7));
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		this._selectMode = selectMode;
		this.select(0);
		this.activate();
		this.refresh();
	};

	Window_DeckEdit.prototype.windowWidth = function() {
		return TMPlugin.Card.StatusWindowWidth;
	};

	Window_DeckEdit.prototype.update = function() {
		Window_Selectable.prototype.update.call(this);
		if (this._slotWindow) this._slotWindow.setDeckId(this.index());
	};

	Window_DeckEdit.prototype.maxItems = function() {
		return $gameParty.maxDeck();
	};

	Window_DeckEdit.prototype.drawItem = function(index) {
		var deckName = TMPlugin.Card.DeckNames[index];
		if (deckName) {
			var maxCost = $gameParty.maxCost();
			var deckCost = $gameParty.deckCost(index);
			var rect = this.itemRectForText(index);
			this.changePaintOpacity(this.isEnabled(index));
			this.drawText(deckName, rect.x, rect.y, rect.width);
			this.drawText(deckCost + '/' + maxCost, rect.x, rect.y, rect.width, 'right');
			this.changePaintOpacity(1);
		}
	};

	Window_DeckEdit.prototype.isEnabled = function(index) {
		return this._selectMode ? $gameParty.isDeckValid(index) : true;
	};

	Window_DeckEdit.prototype.isCurrentItemEnabled = function() {
		return this.isEnabled(this.index());
	};

	Window_DeckEdit.prototype.setSlotWindow = function(slotWindow) {
		this._slotWindow = slotWindow;
		this.callUpdateHelp();
	};

	Window_DeckEdit.prototype.updateHelp = function() {
		Window_Selectable.prototype.updateHelp.call(this);
		if (this._selectMode) {
			this._helpWindow.setText('使用するデッキを選択してください。');
		} else {
			this._helpWindow.setText('編集するデッキを選択してください。');
		}
	};

	//-----------------------------------------------------------------------------
	// Window_DeckEditStatus
	//

	function Window_DeckEditStatus() {
		this.initialize.apply(this, arguments);
	}

	Window_DeckEditStatus.prototype = Object.create(Window_Base.prototype);
	Window_DeckEditStatus.prototype.constructor = Window_DeckEditStatus;

	Window_DeckEditStatus.prototype.initialize = function(x, y) {
		var width = this.windowWidth();
		var height = Graphics.boxHeight - y;
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.createCardObject(0);
		this.createCardSprite();
		this.refresh();
		this.hide();
	};

	Window_DeckEditStatus.prototype.windowWidth = function() {
		return TMPlugin.Card.StatusWindowWidth;
	};

	Window_DeckEditStatus.prototype.setCard = function(card) {
		var cardId = card ? card.id : 0;
		if (this._card.id() !== cardId) {
			this.createCardObject(cardId);
			this._cardSprite.setCard(this._card);
			this.refresh();
		}
	};

	Window_DeckEditStatus.prototype.createCardObject = function(cardId) {
		this._card = new Game_Card(cardId);
		var padding = this.standardPadding();
		this._card.setPosition(padding + 96, padding + 144);
	};

	Window_DeckEditStatus.prototype.createCardSprite = function() {
		this._cardSprite = new Sprite_Card(this._card, false, 1000000);
		this.addChild(this._cardSprite);
	};

	Window_DeckEditStatus.prototype.refresh = function() { //デッキ編集時のカード情報
		this.contents.clear();
		
		if (this._card.id() > 0) {
			var x = this.textPadding() + 200;
			var width = this.contents.width - x - this.textPadding();
			var x2 = this.textPadding();
			var width2 = this.contents.width - x2 - this.textPadding();
			var x3 = x + width - Window_Base._iconWidth;
			
			var lineHeight = this.lineHeight();
			this.changeTextColor(this.systemColor());
			this.contents.fontSize = 16;
			this.drawText(TMPlugin.Card.ParamNames[2], x, lineHeight * 1, width); //コスト見出し
			this.drawText(TMPlugin.Card.ParamNames[1], x, lineHeight * 6, width); //レアリティ見出し
			if (this._card.type() === 4) { //カードタイプがアイテムの時
				this.drawText(TMPlugin.Card.ItemCardParamNames[0], x, lineHeight * 2, width); //ため時間
				this.drawText(TMPlugin.Card.ParamNames[5], x,	lineHeight * 1,	width); //タイプ見出し
				this.drawText(TMPlugin.Card.ItemCardParamNames[1], x2, lineHeight * 8, width2); //効果1
				this.drawText(TMPlugin.Card.ItemCardParamNames[2], x2, lineHeight * 11, width2);//効果2
			} else {
				//各パラメータ名(見出し)を描いている。
				this.drawText(TMPlugin.Card.ParamNames[3], x, lineHeight * 2, width);     //HP見出し
				this.drawText(TMPlugin.Card.ParamNames[4], x, lineHeight * 3, width); //攻撃力見出し
				this.drawText(TMPlugin.Card.ParamNames[5], x, lineHeight * 0, width); //タイプ見出し
				this.drawText(TMPlugin.Card.ParamNames[9], x, lineHeight * 5, width); //属性見出し
				this.drawText('速さ', x, lineHeight * 4, width); //速さ見出し
				this.drawText(TMPlugin.Card.ParamNames[7], x2, lineHeight * 8, width2);//効果1
				this.drawText(TMPlugin.Card.ParamNames[8], x2, lineHeight * 11, width2);//効果2
			}
			//ここからパラメータ描画
			this.changeTextColor(this.normalColor());
			this.contents.fontSize = 28;
			//コスト
			this.drawText(this._card.cost(), x, lineHeight * 1, width, 'right'); //コスト
			//レアリティ
			this.drawText(TMPlugin.Card.RareNames[this._card.rare()], x, lineHeight * 7 - 8, width, 'right');
			
			if (this._card.type() === 4) {
				//アイテムの時はクールタイムとタイプアイコン
				this.drawText(this._card.hp(), x, lineHeight * 2, width, 'right'); //クールタイム
				this.drawIcon(TMPlugin.Card.TypeIcons[this._card.type()], x3, lineHeight * 0); //タイプアイコン
			} else {
				this.drawText(this._card.hp(), x, lineHeight * 2, width, 'right');
				this.drawText(this._card.atk(), x, lineHeight * 3, width, 'right');
				this.drawText(this._card.spd(), x, lineHeight * 4, width, 'right');
				this.drawIcon(TMPlugin.Card.TypeIcons[this._card.type()], x3, lineHeight * 0); //タイプアイコン
				this.drawIcon(TMPlugin.Card.ElementIcons[this._card.element()], x3, lineHeight * 5); //属性アイコン
			}
			var unitSkill = $dataSkills[this._card.unitSkill()];
			if (unitSkill) this.drawSkill(unitSkill, x2, lineHeight * 9, width2);
			var partySkill = $dataSkills[this._card.partySkill()];
			if (partySkill) this.drawSkill(partySkill, x2, lineHeight * 12, width2);
		}
	};

	Window_DeckEditStatus.prototype.drawSkill = function(skill, x, y, width) { //スキル名&説明文描画
		this.contents.fontSize = 28;
		this.drawItemName(skill, x, y - 8, width);
		this.contents.fontSize = 16;
		skill.description.split('\n').map(function(text, i) {
			this.drawText(text, x, y + this.lineHeight() - 16 + i * 20, width);
		}, this);
	};

	//-----------------------------------------------------------------------------
	// Window_DeckEditSlot
	//

	function Window_DeckEditSlot() {
		this.initialize.apply(this, arguments);
	}

	Window_DeckEditSlot.prototype = Object.create(Window_Selectable.prototype);
	Window_DeckEditSlot.prototype.constructor = Window_DeckEditSlot;

	Window_DeckEditSlot.prototype.initialize = function(x, y, width) {
		var height = this.fittingHeight(this.maxItems());
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		this._deckId = 0;
		this.refresh();
	};

	Window_DeckEditSlot.prototype.setDeckId = function(deckId) {
		if (this._deckId !== deckId) {
			this._deckId = deckId;
			this.refresh();
			if (this._itemWindow) this._itemWindow.setDeckId(this._deckId);
		}
	};

	Window_DeckEditSlot.prototype.update = function() {
		Window_Selectable.prototype.update.call(this);
		if (this._itemWindow) this._itemWindow.setSlotId(this.index(),this.isItemCardSlot(this.index()));
	};

	Window_DeckEditSlot.prototype.maxItems = function() {
		return $gameParty.maxCard() + (TMPlugin.Card.UseItemCard ? 1 : 0);
	};

	Window_DeckEditSlot.prototype.item = function() {
		if (this._deckId < 0) return null;
		if (this.isItemCardSlot(this.index())) return $gameParty.itemCard(this._deckId);
		return $gameParty.cards(this._deckId)[this.index()];
	};

	Window_DeckEditSlot.prototype.isItemCardSlot = function(index) {
		return TMPlugin.Card.UseItemCard && (index === $gameParty.maxCard());
	};

	Window_DeckEditSlot.prototype.drawItem = function(index) {
		if (this.isItemCardSlot(index)) {
			var positionName = TMPlugin.Card.ItemCardPositionName;
			var card = $gameParty.itemCard(this._deckId);
		} else {
			var positionName = TMPlugin.Card.PositionNames[index];
			var card = $gameParty.cards(this._deckId)[index];
		}
		var rect = this.itemRectForText(index);
		this.changeTextColor(this.systemColor());
		this.contents.fontSize = 16;
		var positionNameWidth = this.textWidth(positionName);
		this.drawText(positionName, rect.x, rect.y, positionNameWidth);
		if (card) {
			this.changeTextColor(this.normalColor());
			this.contents.fontSize = 28;
			var x = rect.x + positionNameWidth + 8;
			this.drawItemName(card, x, rect.y, rect.width - x);
		}
	};

	Window_DeckEditSlot.prototype.isEnabled = function(index) {
		return true;
	};

	Window_DeckEditSlot.prototype.isCurrentItemEnabled = function() {
		return this.isEnabled(this.index());
	};

	Window_DeckEditSlot.prototype.setStatusWindow = function(statusWindow) {
		this._statusWindow = statusWindow;
		this.callUpdateHelp();
	};

	Window_DeckEditSlot.prototype.setItemWindow = function(itemWindow) {
		this._itemWindow = itemWindow;
		this.update();
	};

	Window_DeckEditSlot.prototype.updateHelp = function() {
		Window_Selectable.prototype.updateHelp.call(this);
		var maxCost = $gameParty.maxCost();
		var deckCost = $gameParty.deckCost(this._deckId);
		this._helpWindow.setText(TMPlugin.Card.DeckNames[this._deckId] +
														 ' ( 合計' + TMPlugin.Card.ParamNames[2] +
														 ' ' + deckCost + ' / ' + maxCost + ' )');
		if (this._statusWindow) {
			this._statusWindow.setCard(this.item());
		}
	};

	//-----------------------------------------------------------------------------
	// Window_DeckEditItem
	//

	function Window_DeckEditItem() {
		this.initialize.apply(this, arguments);
	}

	Window_DeckEditItem.prototype = Object.create(Window_ItemList.prototype);
	Window_DeckEditItem.prototype.constructor = Window_DeckEditItem;

	Window_DeckEditItem.prototype.initialize = function(x, y, width, height) {
		Window_ItemList.prototype.initialize.call(this, x, y, width, height);
		this._deckId = 0;
		this._slotId = -1;
	};

	Window_DeckEditItem.prototype.maxCols = function() {
		return 1;
	};

	Window_DeckEditItem.prototype.setDeckId = function(deckId) {
		this._deckId = deckId;
	};

	Window_DeckEditItem.prototype.setSlotId = function(slotId, itemSlot) {
		if (this._slotId !== slotId) {
			this._slotId = slotId;
			var deckCost = $gameParty.deckCost(this._deckId);
			var cards = $gameParty.cards(this._deckId);
			var card = itemSlot ? $gameParty.itemCard(this._deckId) : cards[this._slotId];
			this._capacity = $gameParty.maxCost() - deckCost + (card ? +card.meta.cardCost : 0);
			this._otherSlotCardIds = [];
			for (var i = 0; i < $gameParty.maxCard(); i++) {
				if (this._slotId !== i && cards[i]) {
					this._otherSlotCardIds.push(cards[i].id)
				}
			}
			this.refresh();
			this.resetScroll();
		}
	};

	Window_DeckEditItem.prototype.includes = function(item) {
		if (item === null) return true;
		if (item.meta.cardCost == null) return false;
		if (TMPlugin.Card.UseItemCard && this._slotId === $gameParty.maxCard()) {
			return +item.meta.cardType === 4;
		}
		return +item.meta.cardType < 4;
	};

	Window_DeckEditItem.prototype.isEnabled = function(item) {
		if (item === null) return true;
		if (!TMPlugin.Card.SameCard && this._otherSlotCardIds.contains(item.id)) {
			return false;
		}
		return this._capacity >= +item.meta.cardCost && item.id !== this._currentCardId;
	};

	Window_DeckEditItem.prototype.selectLast = function() {
	};

	Window_DeckEditItem.prototype.setStatusWindow = function(statusWindow) {
		this._statusWindow = statusWindow;
		this.callUpdateHelp();
	};

	Window_DeckEditItem.prototype.updateHelp = function() {
		if (this._statusWindow) this._statusWindow.setCard(this.item());
	};

	Window_DeckEditItem.prototype.playOkSound = function() {
	};

	//-----------------------------------------------------------------------------
	// Window_DeckSelectStatus
	//

	function Window_DeckSelectStatus() {
		this.initialize.apply(this, arguments);
	}

	Window_DeckSelectStatus.prototype = Object.create(Window_Base.prototype);
	Window_DeckSelectStatus.prototype.constructor = Window_DeckSelectStatus;

	Window_DeckSelectStatus.prototype.initialize = function(enemyName, enemyItemCardId, enemyCardIds) {
		this._enemyName = enemyName;
		this._enemyItemCardId = enemyItemCardId;
		this._enemyCardIds = enemyCardIds;
		var width = this.windowWidth();
		var height = this.fittingHeight(2) + 144;
		var x = (Graphics.boxWidth - width) / 2;
		var y = Graphics.boxHeight - height;
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.createCardObjects();
		this.createCardSprites();
		this.refresh();
	};

	Window_DeckSelectStatus.prototype.isItemCardValid = function() {
		return this._enemyItemCardId !== 0;
	};

	Window_DeckSelectStatus.prototype.windowWidth = function() {
		return (this._enemyCardIds.length + (this.isItemCardValid() ? 1 : 0)) * 112 - 16 +
					 this.standardPadding() * 2;
	};

	Window_DeckSelectStatus.prototype.createCardObjects = function() {
		this._cards = [];
		var cardIds = this._enemyCardIds.concat(); 
		if (this.isItemCardValid()) cardIds.push(this._enemyItemCardId);
		for (var i = 0; i < cardIds.length; i++) {
			var card = new Game_Card(cardIds[i]);
			var x = this.standardPadding() + i * 112 + 48;
			var y = this.standardPadding() + this.lineHeight() * 2 + 72;
			card.setPosition(x, y);
			card.setScale(0.5, 0.5);
			this._cards.push(card);
		}
	};

	Window_DeckSelectStatus.prototype.createCardSprites = function() {
		this._cardSprites = [];
		for (var i = 0; i < this._cards.length; i++) {
			var sprite = new Sprite_Card(this._cards[i], false, 1000000);
			this._cardSprites.push(sprite);
			this.addChild(sprite);
		}
	};

	Window_DeckSelectStatus.prototype.refresh = function() {
		this.contents.clear();
		this.changeTextColor(this.normalColor());
		this.drawText(this._enemyName, 0, 0, this.contents.width, 'center');
		this.changeTextColor(this.systemColor());
		for (var i = 0; i < this._enemyCardIds.length; i++) {
			var x = i * 112;
			this.drawText(TMPlugin.Card.PositionNames[i], x, this.lineHeight(), 96, 'center');
		}
		if (this.isItemCardValid()) {
			this.drawText(TMPlugin.Card.ItemCardPositionName, (this._cards.length - 1) * 112,
										this.lineHeight(), 96, 'center');
		}
	};

	//-----------------------------------------------------------------------------
	// Window_CardBattleStatus
	//

	function Window_CardBattleStatus() {
		this.initialize.apply(this, arguments);
	}

	Window_CardBattleStatus.prototype = Object.create(Window_Base.prototype);
	Window_CardBattleStatus.prototype.constructor = Window_CardBattleStatus;

	Window_CardBattleStatus.prototype.initialize = function(x, y) {
		var width = this.windowWidth();
		var height = this.lineHeight() + 20 + this.standardPadding() * 2;
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.refresh();
	};

	Window_CardBattleStatus.prototype.windowWidth = function() {
		return Graphics.boxWidth;
	};

	Window_CardBattleStatus.prototype.refresh = function() {
		this.contents.clear();
		var x = this.textPadding();
		var width = this.contents.width - x * 2;
		var lineHeight = this.lineHeight();
		this.contents.fontSize = 28;
		this.drawText($gameCardBattle.playerDeck().userName(), x, 0, width, 'left');
		this.drawText($gameCardBattle.enemyDeck().userName(), x, 0, width, 'right');
		this.contents.fontSize = 16;
		this.contents.drawText('合計' + TMPlugin.Card.ParamNames[2] + ': ' +
													 $gameCardBattle.playerDeck().cost(), x, lineHeight,
													 width, 20, 'left');
		this.contents.drawText('合計' + TMPlugin.Card.ParamNames[2] + ': ' +
													 $gameCardBattle.enemyDeck().cost(), x, lineHeight,
													 width, 20, 'right');
	};


	//-----------------------------------------------------------------------------
	// Window_CardBattleMessage
	//

	function Window_CardBattleMessage() {
		this.initialize.apply(this, arguments);
	}

	Window_CardBattleMessage.prototype = Object.create(Window_Base.prototype);
	Window_CardBattleMessage.prototype.constructor = Window_CardBattleMessage;

	Window_CardBattleMessage.prototype.initialize = function(x, y) {
		var width = this.windowWidth();
		var height = this.fittingHeight(1);
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.setBackgroundType(1);
		this._waitFlag = false;
	};

	Window_CardBattleMessage.prototype.windowWidth = function() {
		return Graphics.boxWidth;
	};

	Window_CardBattleMessage.prototype.refresh = function() {
		this.contents.clear();
		this.drawText(this._message, 0, 0, this.contents.width, 'center');
	};

	Window_CardBattleMessage.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		if (this._waitFlag) {
			if (Input.isRepeated('ok') || TouchInput.isRepeated()) {
				this._waitFlag = false;
			}
		} else {
			this._message = $gameCardBattle.getMessage(); 
			if (this._message) {
				this.refresh();
				this._waitFlag = true;
			}
		}
	};

	//-----------------------------------------------------------------------------
	// Scene_Menu
	//

	var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		_Scene_Menu_createCommandWindow.call(this);
		this._commandWindow.setHandler('deckEdit', this.commandDeckEdit.bind(this));
	};

	Scene_Menu.prototype.commandDeckEdit = function() {
		SceneManager.push(Scene_DeckEdit);
	};

	//-----------------------------------------------------------------------------
	// Scene_DeckEdit
	//

	function Scene_DeckEdit() {
		this.initialize.apply(this, arguments);
	}

	Scene_DeckEdit.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_DeckEdit.prototype.constructor = Scene_DeckEdit;

	Scene_DeckEdit.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_DeckEdit.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createDeckWindow();
		this.createStatusWindow();
		this.createSlotWindow();
		this.createItemWindow();
	};

	Scene_DeckEdit.prototype.createHelpWindow = function() {
		this._helpWindow = new Window_Help(1);
		this.addWindow(this._helpWindow);
	};

	Scene_DeckEdit.prototype.createDeckWindow = function() {
		this._deckWindow = new Window_DeckEdit(0, this._helpWindow.height, false);
		this._deckWindow.setHandler('ok',		 this.onDeckOk.bind(this));
		this._deckWindow.setHandler('cancel', this.popScene.bind(this));
		this._deckWindow.setHelpWindow(this._helpWindow);
		this.addWindow(this._deckWindow);
	};

	Scene_DeckEdit.prototype.createStatusWindow = function() {
		this._statusWindow = new Window_DeckEditStatus(0, this._helpWindow.height);
		this.addWindow(this._statusWindow);
	};

	Scene_DeckEdit.prototype.createSlotWindow = function() {
		var wx = this._statusWindow.width;
		var wy = this._helpWindow.height;
		var ww = Graphics.boxWidth - this._statusWindow.width;
		this._slotWindow = new Window_DeckEditSlot(wx, wy, ww);
		this._slotWindow.setHelpWindow(this._helpWindow);
		this._slotWindow.setStatusWindow(this._statusWindow);
		this._slotWindow.setHandler('ok',		 this.onSlotOk.bind(this));
		this._slotWindow.setHandler('cancel', this.onSlotCancel.bind(this));
		this._deckWindow.setSlotWindow(this._slotWindow);
		this.addWindow(this._slotWindow);
	};

	Scene_DeckEdit.prototype.createItemWindow = function() {
		var wx = this._slotWindow.x;
		var wy = this._slotWindow.y + this._slotWindow.height;
		var ww = Graphics.boxWidth - wx;
		var wh = Graphics.boxHeight - wy;
		this._itemWindow = new Window_DeckEditItem(wx, wy, ww, wh);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setStatusWindow(this._statusWindow);
		this._itemWindow.setHandler('ok',		 this.onItemOk.bind(this));
		this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
		this._slotWindow.setItemWindow(this._itemWindow);
		this.addWindow(this._itemWindow);
	};

	Scene_DeckEdit.prototype.onDeckOk = function() {
		this._slotWindow.activate();
		this._slotWindow.select(0);
		this._deckWindow.hide();
		this._statusWindow.show();
	};

	Scene_DeckEdit.prototype.onSlotOk = function() {
		this._itemWindow.activate();
		this._itemWindow.select(0);
	};

	Scene_DeckEdit.prototype.onSlotCancel = function() {
		this._slotWindow.deselect();
		this._deckWindow.refresh();
		this._deckWindow.activate();
		this._deckWindow.show();
		this._statusWindow.hide();
	};

	Scene_DeckEdit.prototype.onItemOk = function() {
		SoundManager.playEquip();
		$gameParty.changeCard(this._deckWindow.index(), this._slotWindow.index(),
													this._itemWindow.item());
		this._slotWindow.activate();
		this._slotWindow.refresh();
		this._itemWindow.deselect();
		this._itemWindow.refresh();
		this._statusWindow.refresh();
	};

	Scene_DeckEdit.prototype.onItemCancel = function() {
		this._slotWindow.activate();
		this._itemWindow.deselect();
	};

	//-----------------------------------------------------------------------------
	// Scene_DeckSelect
	//

	function Scene_DeckSelect() {
		this.initialize.apply(this, arguments);
	}

	Scene_DeckSelect.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_DeckSelect.prototype.constructor = Scene_DeckSelect;

	Scene_DeckSelect.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_DeckSelect.prototype.prepare = function(enemyName, enemyItemCardId, enemyCardIds) {
		this._enemyName = enemyName;
		this._enemyItemCardId = enemyItemCardId;
		this._enemyCardIds = enemyCardIds;
	};

	Scene_DeckSelect.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createDeckWindow();
		this.createSlotWindow();
		this.createStatusWindow();
	};

	Scene_DeckSelect.prototype.createHelpWindow = function() {
		this._helpWindow = new Window_Help(1);
		this.addWindow(this._helpWindow);
	};

	Scene_DeckSelect.prototype.createDeckWindow = function() {
		this._deckWindow = new Window_DeckEdit(0, this._helpWindow.height, true);
		this._deckWindow.setHandler('ok',		 this.onDeckOk.bind(this));
		this._deckWindow.setHandler('cancel', this.popScene.bind(this));
		this._deckWindow.setHelpWindow(this._helpWindow);
		this.addWindow(this._deckWindow);
	};

	Scene_DeckSelect.prototype.createSlotWindow = function() {
		var wx = this._deckWindow.width;
		var wy = this._helpWindow.height;
		var ww = Graphics.boxWidth - wx;
		this._slotWindow = new Window_DeckEditSlot(wx, wy, ww);
		this._deckWindow.setSlotWindow(this._slotWindow);
		this.addWindow(this._slotWindow);
	};

	Scene_DeckSelect.prototype.createStatusWindow = function() {
		this._statusWindow = new Window_DeckSelectStatus(this._enemyName,this._enemyItemCardId, this._enemyCardIds);
		this.addWindow(this._statusWindow);
	};

	Scene_DeckSelect.prototype.onDeckOk = function() {
		$gameParty.setActiveDeck(this._deckWindow.index());
		SceneManager.goto(Scene_CardBattle);
		SceneManager.prepareNextScene(this._enemyName, this._enemyItemCardId, this._enemyCardIds);
	};

	Scene_DeckSelect.prototype.popScene = function() {
		Scene_MenuBase.prototype.popScene.call(this);
		$gameVariables.setValue(TMPlugin.Card.VNResult, -1);
	};
	
	//-----------------------------------------------------------------------------
	// Scene_DeckSelect_Code (自作)
	// デッキ選択後、変数にデッキコードの値を返す。
	//
	function Scene_DeckSelect_Code() {
		this.initialize.apply(this, arguments);
	}

	Scene_DeckSelect_Code.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_DeckSelect_Code.prototype.constructor = Scene_DeckSelect_Code;

	Scene_DeckSelect_Code.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_DeckSelect_Code.prototype.prepare = function(enemyName, enemyItemCardId, enemyCardIds) {
		this._enemyName = enemyName;
		this._enemyItemCardId = enemyItemCardId;
		this._enemyCardIds = enemyCardIds;
	};

	Scene_DeckSelect_Code.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createDeckWindow();
		this.createSlotWindow();
	};

	Scene_DeckSelect_Code.prototype.createHelpWindow = function() {
		this._helpWindow = new Window_Help(1);
		this.addWindow(this._helpWindow);
	};

	Scene_DeckSelect_Code.prototype.createDeckWindow = function() { //デッキ選択ウィンドウ
		this._deckWindow = new Window_DeckEdit(0, this._helpWindow.height, true);
		this._deckWindow.setHandler('ok',		 this.onDeckOk.bind(this)); //決定されたらOKにデッキを返す。
		this._deckWindow.setHandler('cancel', this.popScene.bind(this));    //キャンセルされたら-1を返す。
		this._deckWindow.setHelpWindow(this._helpWindow);
		this.addWindow(this._deckWindow);
	};

	Scene_DeckSelect_Code.prototype.createSlotWindow = function() {
		var wx = this._deckWindow.width;
		var wy = this._helpWindow.height;
		var ww = Graphics.boxWidth - wx;
		this._slotWindow = new Window_DeckEditSlot(wx, wy, ww);
		this._deckWindow.setSlotWindow(this._slotWindow);
		this.addWindow(this._slotWindow);
	};

	Scene_DeckSelect_Code.prototype.onDeckOk = function() {
		Scene_MenuBase.prototype.popScene.call(this); //とりあえずキャンセルと同じように戻す？
		$gameParty.setActiveDeck(this._deckWindow.index()); //ウィンドウの選択中デッキをアクティブにする。
		$gameVariables.setValue(TMPlugin.Card.VNResult, -1); //バトル結果に -1をセット。
		var code = $gameParty.createCode(this._deckWindow.index());
		$gameVariables.setValue(TMPlugin.Card.VNDeckCode, code); //生成したデッキコード文字列を代入。
	};

	Scene_DeckSelect_Code.prototype.popScene = function() {
		Scene_MenuBase.prototype.popScene.call(this);
		$gameVariables.setValue(TMPlugin.Card.VNResult, -1); //バトル結果に -1をセット。
		$gameVariables.setValue(TMPlugin.Card.VNDeckCode, 0); //デッキコードを持っていない場合0にする。（オンラインチェックで使用）
	};



	//-----------------------------------------------------------------------------
	// Scene_CardBattle
	//

	function Scene_CardBattle() {
		this.initialize.apply(this, arguments);
	}

	Scene_CardBattle.prototype = Object.create(Scene_Base.prototype);
	Scene_CardBattle.prototype.constructor = Scene_CardBattle;

	Scene_CardBattle.prototype.initialize = function() {
		Scene_Base.prototype.initialize.call(this);
		BattleManager.saveBgmAndBgs();
		BattleManager.playBattleBgm();
	};

	Scene_CardBattle.prototype.prepare = function(enemyName, enemyItemCardId, enemyCardIds) {
		$gameCardBattle.setDecks(enemyName, enemyItemCardId, enemyCardIds);
	};

	Scene_CardBattle.prototype.create = function() {
		Scene_Base.prototype.create.call(this);
		this.createDisplayObjects();
	};

	Scene_CardBattle.prototype.createDisplayObjects = function() {
		this.createSpriteset();
		this.createWindowLayer();
		this.createAllWindows();
		
	};

	Scene_CardBattle.prototype.createSpriteset = function() {
		this._spriteset = new Spriteset_CardBattle();
		this.addChild(this._spriteset);
	};

	Scene_CardBattle.prototype.createAllWindows = function() {
		this.createStatusWindow();
		
		// ★ここに追加：ウィンドウ作成後に戦況ゲージをシーンに直接追加する
		if (this._spriteset && this._spriteset._bpGaugeSprite) {
			this.addChild(this._spriteset._bpGaugeSprite);
		}
		this.createMessageWindow();
	};

	Scene_CardBattle.prototype.createStatusWindow = function() {
		this._statusWindow = new Window_CardBattleStatus(0, 0);
		this.addWindow(this._statusWindow);
	};

	Scene_CardBattle.prototype.createMessageWindow = function() {
		this._messageWindow = new Window_CardBattleMessage(0, TMPlugin.Card.MessageWindowY);
		this.addWindow(this._messageWindow);
	};

	Scene_CardBattle.prototype.update = function() {
		this.updateMain();
		Scene_Base.prototype.update.call(this);
	};

	Scene_CardBattle.prototype.updateMain = function() {
		var active = this.isActive();
		$gameCardBattle.update(active);
	};
})();