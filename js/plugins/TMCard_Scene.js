//=============================================================================
// TMPlugin - カードゲーム (Scene)
// ファイル名: TMCard_Scene.js
//=============================================================================

/*:
 * @plugindesc カードゲームのシーン・ウィンドウ管理ファイルです。Spriteの後に読み込んでください。
 * @author tomoaky (Edit by Rowkoc)
 */

var Imported = Imported || {};
Imported.TMCard_Scene = true;

(function() {

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

	Window_DeckEditStatus.prototype.refresh = function() {
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
			this.drawText(TMPlugin.Card.ParamNames[2], x, lineHeight * 1, width);
			this.drawText(TMPlugin.Card.ParamNames[1], x, lineHeight * 6, width);
			if (this._card.type() === 4) {
				this.drawText(TMPlugin.Card.ItemCardParamNames[0], x, lineHeight * 2, width);
				this.drawText(TMPlugin.Card.ParamNames[5], x,	lineHeight * 1,	width);
				this.drawText(TMPlugin.Card.ItemCardParamNames[1], x2, lineHeight * 8, width2);
				this.drawText(TMPlugin.Card.ItemCardParamNames[2], x2, lineHeight * 11, width2);
			} else {
				this.drawText(TMPlugin.Card.ParamNames[3], x, lineHeight * 2, width);
				this.drawText(TMPlugin.Card.ParamNames[4], x, lineHeight * 3, width);
				this.drawText(TMPlugin.Card.ParamNames[5], x, lineHeight * 0, width);
				this.drawText(TMPlugin.Card.ParamNames[9], x, lineHeight * 5, width);
				this.drawText('速さ', x, lineHeight * 4, width);
				this.drawText(TMPlugin.Card.ParamNames[7], x2, lineHeight * 8, width2);
				this.drawText(TMPlugin.Card.ParamNames[8], x2, lineHeight * 11, width2);
			}
			this.changeTextColor(this.normalColor());
			this.contents.fontSize = 28;
			this.drawText(this._card.cost(), x, lineHeight * 1, width, 'right');
			this.drawText(TMPlugin.Card.RareNames[this._card.rare()], x, lineHeight * 7 - 8, width, 'right');
			
			if (this._card.type() === 4) {
				this.drawText(this._card.hp(), x, lineHeight * 2, width, 'right');
				this.drawIcon(TMPlugin.Card.TypeIcons[this._card.type()], x3, lineHeight * 0);
			} else {
				this.drawText(this._card.hp(), x, lineHeight * 2, width, 'right');
				this.drawText(this._card.atk(), x, lineHeight * 3, width, 'right');
				this.drawText(this._card.spd(), x, lineHeight * 4, width, 'right');
				this.drawIcon(TMPlugin.Card.TypeIcons[this._card.type()], x3, lineHeight * 0);
				this.drawIcon(TMPlugin.Card.ElementIcons[this._card.element()], x3, lineHeight * 5);
			}
			var unitSkill = $dataSkills[this._card.unitSkill()];
			if (unitSkill) this.drawSkill(unitSkill, x2, lineHeight * 9, width2);
			var partySkill = $dataSkills[this._card.partySkill()];
			if (partySkill) this.drawSkill(partySkill, x2, lineHeight * 12, width2);
		}
	};

	Window_DeckEditStatus.prototype.drawSkill = function(skill, x, y, width) {
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
		
		var speed = Math.max($gameVariables.value(TMPlugin.Card.VNBattleSpeed), 1);
		var isAuto = $gameSwitches.value(TMPlugin.Card.SWAutoMode);

		if (this._waitFlag) {
			var input = Input.isRepeated('ok') || TouchInput.isRepeated();
			
			if (isAuto) {
				this._autoWaitCount -= speed;
				if (this._autoWaitCount <= 0) {
					input = true;
				}
			}

			if (input) {
				this._waitFlag = false;
				if (speed >= 2 && this._messageWindow) this._messageWindow.pause = false; 
			}
		} else {
			this._message = $gameCardBattle.getMessage(); 
			if (this._message) {
				this.refresh();
				this._waitFlag = true;
				
				var baseWait = 90; 
				if (speed >= 3) baseWait = 10;
				this._autoWaitCount = baseWait;
			}
		}
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
	// Scene_DeckSelect_Code
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

	Scene_DeckSelect_Code.prototype.createDeckWindow = function() {
		this._deckWindow = new Window_DeckEdit(0, this._helpWindow.height, true);
		this._deckWindow.setHandler('ok',		 this.onDeckOk.bind(this));
		this._deckWindow.setHandler('cancel', this.popScene.bind(this));
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
		Scene_MenuBase.prototype.popScene.call(this);
		$gameParty.setActiveDeck(this._deckWindow.index());
		$gameVariables.setValue(TMPlugin.Card.VNResult, -1);
		var code = $gameParty.createCode(this._deckWindow.index());
		$gameVariables.setValue(TMPlugin.Card.VNDeckCode, code);
	};

	Scene_DeckSelect_Code.prototype.popScene = function() {
		Scene_MenuBase.prototype.popScene.call(this);
		$gameVariables.setValue(TMPlugin.Card.VNResult, -1);
		$gameVariables.setValue(TMPlugin.Card.VNDeckCode, 0);
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
		ImageManager.loadPicture(TMPlugin.Card.ResultImageWin);
		ImageManager.loadPicture(TMPlugin.Card.ResultImageLose);
		ImageManager.loadPicture(TMPlugin.Card.ResultImageDraw);
		this.createDisplayObjects();
	};

	Scene_CardBattle.prototype.createDisplayObjects = function() {
		this.createSpriteset();
		this.createWindowLayer();
		this.createAllWindows();
		this.createResultLayer();
		
	};

	Scene_CardBattle.prototype.createSpriteset = function() {
		this._spriteset = new Spriteset_CardBattle();
		this.addChild(this._spriteset);
	};

	Scene_CardBattle.prototype.createAllWindows = function() {
		this.createStatusWindow();
		
		if (this._spriteset && this._spriteset._bpGaugeSprite) {
			this.addChild(this._spriteset._bpGaugeSprite);
		}
		this.createMessageWindow();
	};

	Scene_CardBattle.prototype.createStatusWindow = function() {
		this._statusWindow = new Window_CardBattleStatus(0, 0);
		this.addWindow(this._statusWindow);
	};
	
	Scene_CardBattle.prototype.createResultLayer = function() {
		this._resultSprite = new Sprite();
		this._resultSprite.anchor.x = 0.5;
		this._resultSprite.anchor.y = 0.5;
		this._resultSprite.x = Graphics.width / 2;
		this._resultSprite.y = Graphics.height / 2;
		this._resultSprite.opacity = 0;
		this.addChild(this._resultSprite);
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
		
		// バトルロジック更新
		$gameCardBattle.update(active);

		// ■追加: バトル終了演出処理
		if ($gameCardBattle._battleFinished) {
			
			// まだリザルト表示を開始していない場合
			if (!this._resultPhase) {
				this._resultPhase = 'start';
				this._resultWait = 0;
				
				// 結果変数の取得 (0:引分, 1:負け, 2:勝ち) ※TMCard仕様
				var result = $gameVariables.value(TMPlugin.Card.VNResult);
				var imageName = '';
				
				if (result === 2) {
					imageName = TMPlugin.Card.ResultImageWin;
					this._resultTotalWait = 60 * 5; // 勝利時のウェイト(60フレーム×秒
				} else if (result === 1) {
					imageName = TMPlugin.Card.ResultImageLose;
					this._resultTotalWait = 60 * 3; // 敗北時のウェイト
				} else {
					imageName = TMPlugin.Card.ResultImageDraw;
					this._resultTotalWait = 60 * 3;
				}
				
				if (imageName) {
					this._resultSprite.bitmap = ImageManager.loadPicture(imageName);
					this._resultSprite.opacity = 0;
					this._resultSprite.scale.x = 2.0; // 拡大してから縮小する演出用
					this._resultSprite.scale.y = 2.0;
				}
			}

			// フェーズごとの処理
			if (this._resultPhase === 'start') {
				// 画像をフェードイン＆縮小表示
				this._resultSprite.opacity += 20;
				if (this._resultSprite.scale.x > 1.0) {
					this._resultSprite.scale.x -= 0.05;
					this._resultSprite.scale.y -= 0.05;
				}
				if (this._resultSprite.opacity >= 255 && this._resultSprite.scale.x <= 1.0) {
					this._resultPhase = 'wait';
				}
				
			} else if (this._resultPhase === 'wait') {
				// ウェイト中 (連打スキップ防止)
				this._resultWait++;
				
				// オートモードの場合はウェイトも倍速の影響を受けるようにするなら以下を有効化
				// var speed = Math.max($gameVariables.value(TMPlugin.Card.VNBattleSpeed), 1);
				// this._resultWait += speed - 1;

				if (this._resultWait >= this._resultTotalWait) {
					this._resultPhase = 'input';
				}
				
			} else if (this._resultPhase === 'input') {
				// クリック待機
				// 画面下に「Click to Next」などを点滅させても良いかもしれません
				
				// オートモードならクリックなしで進む
				var isAuto = $gameSwitches.value(TMPlugin.Card.SWAutoMode);
				
				if (isAuto || Input.isTriggered('ok') || TouchInput.isTriggered()) {
					AudioManager.stopMe();
					SceneManager.pop();
				}
			}
		}
	};
})();