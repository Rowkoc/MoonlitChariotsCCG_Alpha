//=============================================================================
// TMPlugin - カードゲーム (Sprite)
// ファイル名: TMCard_Sprite.js
//=============================================================================

/*:
 * @plugindesc カードゲームの画像描画・演出処理ファイルです。Logicの後に読み込んでください。
 * @author tomoaky (Edit by Rowkoc)
 */

var Imported = Imported || {};
Imported.TMCard_Sprite = true;

(function() {

    // カードスタイル定義
    TMPlugin.Card.Layouts = {
        'default': {
            framePrefix: 'c_frame_',
            drawFrame: true,
            typeIcon:  { x: 8,  y: 10,  w: 24, h: 24, visible: true },
            name:      { x: 36, y: 10,  w: 152, h: 24, visible: true },
            faction:   { x: 34, y: 31,  w: 152, h: 24, visible: true },
            hp:        { x: 22, y: 185, w: 48,  h: 32, visible: true },
            atk:       { x: 83, y: 185, w: 48,  h: 32, visible: true },
            spd:       { x: 148,y: 185, w: 48,  h: 32, visible: true },
            unitSkillIcon: { x: 8,  y: 226, w: 24, h: 24, visible: true },
            unitSkillText: { x: 32, y: 226, w: 152, h: 24, visible: true },
            partySkillIcon:{ x: 8,  y: 254, w: 24, h: 24, visible: true },
            partySkillText:{ x: 32, y: 254, w: 152, h: 24, visible: true }
        },
        'promo': {
            framePrefix: 'p_frame_',
            drawFrame: true,
            typeIcon:  { x: 8,  y: 10,  w: 24, h: 24, visible: true },
            name:      { x: 40, y: 10,  w: 148, h: 24, visible: true }, 
            faction:   { x: 34, y: 31,  w: 152, h: 24, visible: true },
            hp:        { x: 22, y: 185, w: 48,  h: 32, visible: true },
            atk:       { x: 83, y: 185, w: 48,  h: 32, visible: true },
            spd:       { x: 148,y: 185, w: 48,  h: 32, visible: true },
            unitSkillIcon: { x: 8,  y: 226, w: 24, h: 24, visible: true },
            unitSkillText: { x: 32, y: 226, w: 152, h: 24, visible: true },
            partySkillIcon:{ x: 8,  y: 254, w: 24, h: 24, visible: true },
            partySkillText:{ x: 32, y: 254, w: 152, h: 24, visible: true }
        },
        'fullart': {
            framePrefix: '', 
            drawFrame: false, 
            typeIcon:  { x: 8,  y: 10,  w: 24, h: 24, visible: true },
            name:      { x: 10, y: 250, w: 172, h: 24, visible: true }, 
            faction:   { visible: false }, 
            hp:        { visible: false },
            atk:       { visible: false },
            spd:       { visible: false },
            unitSkillIcon: { visible: false },
            unitSkillText: { visible: false },
            partySkillIcon:{ visible: false },
            partySkillText:{ visible: false }
        }
    };

	//-----------------------------------------------------------------------------
	// Sprite_Card
	//
	function Sprite_Card() {
		this.initialize.apply(this, arguments);
	}
	window.Sprite_Card = Sprite_Card;

	Sprite_Card.prototype = Object.create(Sprite_Base.prototype);
	Sprite_Card.prototype.constructor = Sprite_Card;

	Sprite_Card.prototype.initialize = function(card) {
		Sprite_Base.prototype.initialize.call(this);
		this.bitmap = new Bitmap(192, 288);
		this.bitmap.smooth = true;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this._hide = card.isHiding();
		this._knockout = card.isKnockout();
		this.setCard(card);
		
    	this._foilSprite = new Sprite();
    	this._foilSprite.anchor.x = 0.5;
    	this._foilSprite.anchor.y = 0.5;
    	this._foilSprite.blendMode = Graphics.BLEND_SCREEN;
    	this.addChild(this._foilSprite);
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
            this._cardBitmap = ImageManager.loadPicture('card_0');
        } else {
            if (this._knockout || this._card.id() === 0) { 
                this._cardBitmap = ImageManager.loadPicture(this._card.knockoutName());
                this._backBitmap = ImageManager.loadPicture('c_back_ko');
            } else {
                this._cardBitmap = ImageManager.loadPicture(this._card.fileName());
                this._knockoutBitmap = ImageManager.loadPicture(this._card.knockoutName());

                if (TMPlugin.Card.UseAutoText) {
                    var layout = this._card.layout();

                    if (this._card.type() === 4) {
                        this._backBitmap = ImageManager.loadPicture('c_back_i');
                        this._frameBitmap = ImageManager.loadPicture('c_frame_i'); 
                    } else {
                        this._backBitmap = ImageManager.loadPicture('c_back_' + this._card.rare());
                        if (layout.drawFrame) {
                            var prefix = layout.framePrefix || 'c_frame_';
                            this._frameBitmap = ImageManager.loadPicture(prefix + this._card.element());
                        } else {
                            this._frameBitmap = null;
                        }
                    }
                    this._rareBitmap = ImageManager.loadPicture('c_rare_' + this._card.rare());
                }
            }
        }
        this._bitmapLoading = true;
    };

    Sprite_Card.prototype.createCardBitmap = function() {
        this.bitmap.clear();
        
        if (this._knockout) {
            this._foilSprite.visible = false;
            this.bitmap.blt(this._backBitmap, 0, 0, 192, 288, 0, 0);
			this.bitmap.blt(this._cardBitmap, 0, 0, 192, 288, 0, 0);
			this.bitmap.blt(this._frameBitmap, 0, 0, 192, 288, 0, 0);
			console.log('やられ画像');
			this.bitmap.fontSize = 18;
			this.bitmap.textColor = '#ffffff';
			this.bitmap.outlineWidth = 3;
			this.bitmap.outlineColor = '#000000';
			this.bitmap.drawText(this._card.name(), 36, 10, 152, 24, 'left');
			this.bitmap.fontSize = 13;
			this.bitmap.textColor = '#ffffff';
			this.bitmap.outlineWidth = 3;
			this.bitmap.outlineColor = '#000000';
			this.bitmap.drawText(this._card.faction(), 34, 31, 152, 24, 'left');
            return; 
        }

        if (!this._hide && this._card.id() > 0 && TMPlugin.Card.UseAutoText) {
            var layout = this._card.layout();

            this.bitmap.blt(this._backBitmap, 0, 0, 192, 288, 0, 0);
            this.bitmap.blt(this._cardBitmap, 0, 0, 192, 288, 0, 0);
            
            if (layout.drawFrame && this._frameBitmap) {
                this.bitmap.blt(this._frameBitmap, 0, 0, 192, 288, 0, 0);
            }

            if (layout.typeIcon && layout.typeIcon.visible) {
                this.drawIcon(TMPlugin.Card.TypeIcons[this._card.type()], layout.typeIcon.x, layout.typeIcon.y, layout.typeIcon.w, layout.typeIcon.h);
            }

            this.bitmap.textColor = '#ffffff';
            this.bitmap.outlineWidth = 3;
            this.bitmap.outlineColor = '#000000';

            if (layout.name && layout.name.visible) {
                this.bitmap.fontSize = 18;
                this.bitmap.drawText(this._card.name(), layout.name.x, layout.name.y, layout.name.w, layout.name.h, 'left');
            }

            if (layout.unitSkillIcon && layout.unitSkillIcon.visible) {
                var unitSkill = $dataSkills[this._card.unitSkill()];
                if (unitSkill) {
                    this.drawIcon(unitSkill.iconIndex, layout.unitSkillIcon.x, layout.unitSkillIcon.y, layout.unitSkillIcon.w, layout.unitSkillIcon.h);
                    this.bitmap.fontSize = 18;
                    this.bitmap.drawText(unitSkill.name, layout.unitSkillText.x, layout.unitSkillText.y, layout.unitSkillText.w, layout.unitSkillText.h, 'left');
                }
            }
            if (layout.partySkillIcon && layout.partySkillIcon.visible) {
                var partySkill = $dataSkills[this._card.partySkill()];
                if (partySkill) {
                    this.drawIcon(partySkill.iconIndex, layout.partySkillIcon.x, layout.partySkillIcon.y, layout.partySkillIcon.w, layout.partySkillIcon.h);
                    this.bitmap.fontSize = 18;
                    this.bitmap.drawText(partySkill.name, layout.partySkillText.x, layout.partySkillText.y, layout.partySkillText.w, layout.partySkillText.h, 'left');
                }
            }

            if (layout.faction && layout.faction.visible) {
                this.bitmap.fontSize = 13;
                this.bitmap.drawText(this._card.faction(), layout.faction.x, layout.faction.y, layout.faction.w, layout.faction.h, 'left');
            }

            this.bitmap.fontSize = 28;
            
            if (layout.hp && layout.hp.visible) {
                this.bitmap.drawText(this._card.hp(), layout.hp.x, layout.hp.y, layout.hp.w, layout.hp.h, 'center');
            }

            if (this._card.type() < 4) {
                if (layout.atk && layout.atk.visible) {
                    this.bitmap.drawText(this._card.atk(), layout.atk.x, layout.atk.y, layout.atk.w, layout.atk.h, 'center');
                }
                if (layout.spd && layout.spd.visible) {
                    this.bitmap.drawText(this._card.spd(), layout.spd.x, layout.spd.y, layout.spd.w, layout.spd.h, 'center');
                }
            }
        	if (this._card.isFoil()) {
            	this._foilSprite.bitmap = ImageManager.loadPicture('foil_layer');
            	this._foilSprite.visible = true;
        	} else {
            	this._foilSprite.visible = false;
        	}
        } else {
            this._foilSprite.visible = false;
            this.bitmap.blt(this._cardBitmap, 0, 0, 192, 288, 0, 0);
        }
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
		if (this._bitmapLoading && ImageManager.isReady()) {
			this.createCardBitmap();
		}
		this.x = this._card.screenX();
		this.y = this._card.screenY();
		this.scale.x = this._card.scaleX();
		this.scale.y = this._card.scaleY();
		if (this._hide && !this._card.isHiding()) this.open();
		
    	if (this._foilSprite && this._foilSprite.visible && this._foilSprite.bitmap) {
        	var speed = 0.02;
        	var time = Graphics.frameCount * speed;
        	var wave = (Math.sin(time) + 1) / 2;
    		var scaleWave = 0.9 + ((Math.sin(time) + 1) / 2) * 0.1;
    		this._foilSprite.scale.x = scaleWave;
    		this._foilSprite.scale.y = scaleWave;
        
        	var minOpacity = 10;
        	var maxOpacity = 230;
        	this._foilSprite.opacity = minOpacity + wave * (maxOpacity - minOpacity);
    	}	
		
		this.updateCardImage();		
		this.updateAnimation();
		this.updateColorTone();
	};

	Sprite_Card.prototype.updateAnimation = function() {
		this.setupAnimation();
	};

	Sprite_Card.prototype.setupAnimation = function() {
		var speed = Math.max($gameVariables.value(TMPlugin.Card.VNBattleSpeed), 1);
		var skipThreshold = 5;

		while (this._card.isAnimationRequested()) {
			var data = this._card.shiftAnimation();
			
			if (speed >= skipThreshold) {
				continue; 
			}

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
	
	Sprite_Card.prototype.updateCardImage = function() {
		if (this._card._knockout && !this._knockout){
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
	window.Sprite_Number = Sprite_Number;

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
	
	Sprite_Number.prototype.isChanging = function() {
    	return this._value !== this._targetValue;
	};

	//-----------------------------------------------------------------------------
	// Sprite_TurnCursor
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
		this.createBattleback();
		
		this.createTurnCursor();
		this.createPlayerCards();
		this.createEnemyCards();
		this.createNumberSprites();
		
		this.createBattleStatusGauge();
	};

	Spriteset_CardBattle.prototype.createBackground = function() {
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
	
	Spriteset_CardBattle.prototype.createBattleStatusGauge = function() {
        var conf = TMPlugin.Card.BP_Config;
        var centerX = Graphics.width / 2;
        var totalWidth = conf.gaugeWidth * 2;
        
        this._bpGaugeSprite = new Sprite();

        this._bpEnemyBar = new Sprite(new Bitmap(totalWidth, conf.gaugeHeight));
        this._bpEnemyBar.x = centerX - conf.gaugeWidth;
        this._bpEnemyBar.y = conf.gaugeY;
        this._bpEnemyBar.bitmap.fillAll(conf.colorEnemy);
        this._bpGaugeSprite.addChild(this._bpEnemyBar);

        this._bpPlayerBar = new Sprite(new Bitmap(totalWidth, conf.gaugeHeight));
        this._bpPlayerBar.x = centerX - conf.gaugeWidth;
        this._bpPlayerBar.y = conf.gaugeY;
        this._bpPlayerBar.bitmap.fillAll(conf.colorPlayer);
        this._bpGaugeSprite.addChild(this._bpPlayerBar);

        this._bpSlider = new Sprite(new Bitmap(4, conf.gaugeHeight + 8));
        this._bpSlider.bitmap.fillAll('#ffffff');
        this._bpSlider.anchor.x = 0.5;
        this._bpSlider.anchor.y = 0.5;
        this._bpSlider.y = conf.gaugeY + conf.gaugeHeight / 2;
        this._bpGaugeSprite.addChild(this._bpSlider);

        this._bpCenterMarker = new Sprite(new Bitmap(2, conf.gaugeHeight + 16));
        this._bpCenterMarker.bitmap.fillAll('#ffff00');
        this._bpCenterMarker.anchor.x = 0.5;
        this._bpCenterMarker.anchor.y = 0.5;
        this._bpCenterMarker.x = centerX;
        this._bpCenterMarker.y = conf.gaugeY + conf.gaugeHeight / 2;
        this._bpGaugeSprite.addChild(this._bpCenterMarker);

        this._bpTextSprite = new Sprite(new Bitmap(Graphics.width, 64));
        this._bpTextSprite.y = conf.textY;
        this._bpGaugeSprite.addChild(this._bpTextSprite);
        
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
	
	Spriteset_CardBattle.prototype.startDamageDisplay = function(side, damage) {
    	this._damageDisplayDuration = 60;
   	 	this._damageValue = damage;

    	const label = (side === true) ? this._damageLabelPlayer : this._damageLabelEnemy;
    	label.opacity = 255;
    	label.bitmap.clear();
    	console.log("side="+side+", damage="+damage);
    	const isHeal = damage > 0;
    	label.bitmap.textColor = isHeal ? "#00cc88" : "#ff4444";
    	if(isHeal){
    		label.bitmap.drawText("回復: " + Math.abs(damage), 0, 0, 200, 40, "center");
    	}else{
    		label.bitmap.drawText("ダメージ: " + damage, 0, 0, 200, 40, "center");
    	}
	};

	Spriteset_CardBattle.prototype.createNumberSprites = function() {
		var pos = TMPlugin.Card.NumberPositions[0];
		this._playerHpSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 64, '#ffffff', 5, '#000000');
		this._baseSprite.addChild(this._playerHpSprite);
		
		pos = TMPlugin.Card.NumberPositions[1];
		this._playerAtkSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 48, '#ff3333', 3, '#000000');
		this._baseSprite.addChild(this._playerAtkSprite);
		
		pos = TMPlugin.Card.NumberPositions[2];
		this._enemyHpSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 64, '#ffffff', 5, '#000000');
		this._baseSprite.addChild(this._enemyHpSprite);
		
		pos = TMPlugin.Card.NumberPositions[3];
		this._enemyAtkSprite = new Sprite_Number(pos[0], pos[1], 128, 64, 48, '#ff3333', 3, '#000000');
		this._baseSprite.addChild(this._enemyAtkSprite);
		
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
		
		let label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("HP", 0, 0, 256, 48, "center");
		label.x = this._playerHpSprite.x - 128 - 64;
		label.y = this._playerHpSprite.y - 24;
		this._baseSprite.addChild(label);

		label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("ATK", 0, 0, 256, 48, "center");
		label.x = this._playerAtkSprite.x -128 -64 -4;
		label.y = this._playerAtkSprite.y - 24;
		this._baseSprite.addChild(label);

		label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("HP", 0, 0, 256, 48, "center");
		label.x = this._enemyHpSprite.x - 64;
		label.y = this._enemyHpSprite.y - 24;
		this._baseSprite.addChild(label);

		label = new Sprite(new Bitmap(256, 48));
		label.bitmap.fontSize = 32;
		label.bitmap.outlineWidth = 5;
		label.bitmap.drawText("ATK", 0, 0, 256, 48, "center");
		label.x = this._enemyAtkSprite.x -64;
		label.y = this._enemyAtkSprite.y - 24;
		this._baseSprite.addChild(label);
		
		this._damageLabelPlayer = new Sprite(new Bitmap(200, 40));
		this._damageLabelPlayer.bitmap.fontSize = 22;
		this._damageLabelPlayer.x = Graphics.width / 2 - 220; 
		this._damageLabelPlayer.y = 250;
		this._damageLabelPlayer.opacity = 0;
		this._baseSprite.addChild(this._damageLabelPlayer);

		this._damageLabelEnemy = new Sprite(new Bitmap(200, 40));
		this._damageLabelEnemy.bitmap.fontSize = 22;
		this._damageLabelEnemy.x = Graphics.width / 2 + 20; 
		this._damageLabelEnemy.y = 230;
		this._damageLabelEnemy.opacity = 0;
		this._baseSprite.addChild(this._damageLabelEnemy);
		
		let roundLabel = new Sprite(new Bitmap(256, 48));
		roundLabel.bitmap.fontSize = 32;
		roundLabel.bitmap.outlineWidth = 5;
		roundLabel.bitmap.drawText("ROUND", 0,0, 128, 48, "center");
		roundLabel.x = Graphics.width / 2 - 64; 
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
		this._playerHpSprite.setNumber($gameCardBattle.playerDeck().hpDraw);
		this._playerAtkSprite.setNumber($gameCardBattle.playerDeck().atkDraw);
		this._enemyHpSprite.setNumber($gameCardBattle.enemyDeck().hpDraw);
		this._enemyAtkSprite.setNumber($gameCardBattle.enemyDeck().atkDraw);
		
		console.log("ターン "+$gameCardBattle.turnCount());
		if ($gameCardBattle.turnCount() <= TMPlugin.Card.MaxTurn){
			if ($gameCardBattle.turnCount() > (TMPlugin.Card.MaxTurn-3)){
				this._roundNum.bitmap.textColor = '#ff0000';
			}
			this._roundNum.setNumber($gameCardBattle.turnCount());
		}
		
		if (this._playerChargeTimeSprite) {
			this._playerChargeTimeSprite.visible = this._playerCardSprites[this._playerCardSprites.length - 1].isGray();
			this._playerChargeTimeSprite.setNumber($gameCardBattle.playerDeck().chargeTime - 1);
		}
		if (this._enemyChargeTimeSprite) {
			this._enemyChargeTimeSprite.visible = this._enemyCardSprites[this._enemyCardSprites.length - 1].isGray();
			this._enemyChargeTimeSprite.setNumber($gameCardBattle.enemyDeck().chargeTime - 1);
		}
		
	    const label = $gameCardBattle._turn === true ? this._damageLabelPlayer : this._damageLabelEnemy;
	    
	    const changing = this._playerHpSprite.isChanging() || this._enemyHpSprite.isChanging();
	    if (changing) {
	        this._damageDisplayDuration = 60;
	        label.opacity = 255;
    		label.bitmap.clear();
    		
    		const isHeal = this._damageValue < 0;
    		const valueAbs = Math.abs(this._damageValue);
    		const text = isHeal ? ("回復: " + valueAbs) : ("ダメージ: " + valueAbs);
    		
    		label.bitmap.textColor = isHeal ? "#00cc88" : "#ff4444";
    		label.bitmap.drawText(text, 0, 0, 200, 40, "center");
    		console.log('これでてる？');
	        
	    } else if (this._damageDisplayDuration > 0) {
    		this._damageDisplayDuration--;
    		label.opacity = Math.max(0, label.opacity - 8);
	    } else {
	        if (label.opacity > 0) {
	            label.opacity = Math.max(0, label.opacity - 8);
	        }
	    }
	    
        this.updateBpGauge();
	};
	
    Spriteset_CardBattle.prototype.updateBpGauge = function() {
        var conf = TMPlugin.Card.BP_Config;
        var pBp = $gameCardBattle.playerDeck().bpDraw;
        var eBp = $gameCardBattle.enemyDeck().bpDraw;
        var totalWidth = conf.gaugeWidth * 2;

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

        var totalBp = pBp + eBp;
        var rate = 0.5;
        if (totalBp > 0) {
            rate = pBp / totalBp;
        }

        var currentWidth = totalWidth * rate;
        this._bpPlayerBar.setFrame(0, 0, currentWidth, conf.gaugeHeight);
        this._bpSlider.x = this._bpPlayerBar.x + currentWidth;
    };
	
    Spriteset_CardBattle.prototype.createBattleback = function() {
        this._back1Sprite = new Sprite();
        this._back2Sprite = new Sprite();

        this._back1Sprite.bitmap = this.battleback1Bitmap();
        this._back2Sprite.bitmap = this.battleback2Bitmap();

        this._back1Sprite.anchor.x = 0.5;
        this._back1Sprite.anchor.y = 0.5;
        this._back2Sprite.anchor.x = 0.5;
        this._back2Sprite.anchor.y = 0.5;

        var centerX = Graphics.width / 2;
        var centerY = Graphics.height / 2;

        this._back1Sprite.x = centerX;
        this._back1Sprite.y = centerY +10;
        this._back2Sprite.x = centerX;
        this._back2Sprite.y = centerY +10;

        this._baseSprite.addChild(this._back1Sprite);
        this._baseSprite.addChild(this._back2Sprite);
    };

    Spriteset_CardBattle.prototype.updateBattleback = function() {};

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

})();