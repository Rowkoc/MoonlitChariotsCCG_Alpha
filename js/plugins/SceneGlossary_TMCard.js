/*:
 * @plugindesc SceneGlossaryでTMCardのデッキ編集画面風ステータスを表示する拡張
 * @author 
 *
 * @help
 * TMCard.js のデッキ編集画面に近いレイアウトで情報を表示します。
 * <SGパラメータ表示:ON> があるアイテムで有効になります。
 */

(function() {
    'use strict';

    if (typeof Window_Glossary === 'undefined' || typeof TMPlugin === 'undefined' || !TMPlugin.Card) {
        return;
    }

    // メタデータ取得用ヘルパー
    function getMeta(item, names) {
        if (!item || !item.meta) return null;
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var keys = ['SG' + name, name];
            for (var j = 0; j < keys.length; j++) {
                if (item.meta[keys[j]] !== undefined) return String(item.meta[keys[j]]).trim();
            }
        }
        return null;
    }
    
    const CARD_TYPE_CONFIG = {
        "0": { name: "猛攻", icon: 76 },
        "1": { name: "奇襲", icon: 77 },
        "2": { name: "防衛", icon: 128 },
        "3": { name: "自在", icon: 78 },
        "4": { name: "戦略", icon: 191 }
    };

    const CARD_ELEMENT_CONFIG = {
        "0": { name: "無属性", icon: 160 },
        "1": { name: "炎属性", icon: 64 },
        "2": { name: "水属性", icon: 67 },
        "3": { name: "地属性", icon: 68 },
        "4": { name: "風属性", icon: 69 },
        "5": { name: "光属性", icon: 70 },
        "6": { name: "闇属性", icon: 71 },
        "7": { name: "愛属性", icon: 84 }
    };
    
    // 自動折り返し＆フォントサイズ指定可能なテキスト描画関数を追加

    Window_Glossary.prototype.drawTextExWrap = function(text, x, y, maxWidth, fontSize) {
        if (!text) return y;
        this.contents.fontSize = fontSize;
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = fontSize + 8; // 行の高さをフォントサイズ基準に
        
        var originalReset = this.resetFontSettings;
        this.resetFontSettings = function() {
            this.contents.fontSize = fontSize;
            this.resetTextColor();
        };

        while (textState.index < textState.text.length) {
            var c = textState.text[textState.index];
            
            // 1. \n (改行文字) の場合は標準の処理に任せる（indexが進む）
            if (c === '\n') {
                this.processCharacter(textState);
            } 
            // 2. \x1b (制御文字/色変更など) の場合も標準の処理に任せる
            else if (c === '\x1b') {
                this.processCharacter(textState);
            } 
            // 3. 通常の文字の場合
            else {
                var w = this.textWidth(c);
                // 自動改行判定
                if (textState.x + w > textState.left + maxWidth) {
                    // 重要：processNewLineを呼ぶと文字が消えるため、座標だけ更新する
                    textState.x = textState.left;
                    textState.y += textState.height;
                }
                // 文字を描画して index を進める
                this.processCharacter(textState);
            }
        }
        
        this.resetFontSettings = originalReset;
        return textState.y + textState.height;
    };

    // 用語辞典ウィンドウにデッキ編集風の描画メソッドを追加
// 描画メソッド本体
 Window_Glossary.prototype.drawTMCardStatus = function(item) {
        // --- 設定 ---
        var px = Number(getMeta(item, ['パラメータX', 'StatusX']) || 5);
        var py = Number(getMeta(item, ['パラメータY', 'StatusY']) || 5);
        var pWidth = Number(getMeta(item, ['パラメータ幅', 'StatusWidth']) || 310);
        var ignoreSkillIds = [1, 2, 3, 4]; // ここに描画したくないスキルIDをカンマ区切りで入れる
        
        var baseFontSize = 20;      // 基本の文字サイズ
        var lineH = 28;             // 1行の高さ（行送り用）
        var iconSize = 32;          // アイコンのサイズ（整列用）
        var currentY = py;
        
        // 描画領域背景
        //this.contents.paintOpacity = 80;
        //this.contents.fillRect(px, currentY, pWidth, 330, this.systemColor());
        //this.contents.paintOpacity = 255;

        // パラメータ名などの取得
        var pNames = TMPlugin.Card.ParamNames || ['名前', 'レア度', 'コスト', 'HP', '攻撃力'];

        // 1. 名前
        this.contents.fontSize = baseFontSize + 4;
        this.changeTextColor(this.normalColor());
        // 名前は少し大きめに確保
        this.contents.drawText("《"+item.name+"》", px, currentY, pWidth - 36, 32, 'left');
        
        // 2. レアリティ
        var rarity = Number(item.meta.cardRare || 0);
        this.contents.fontSize = baseFontSize - 4;
        var rareName = TMPlugin.Card.RareNames[rarity];
        
        // レアリティ描画
        this.contents.drawText(rareName, px, currentY, pWidth-2, 32, 'right');
        
        currentY += (lineH + 4); 
        
        // --- 罫線 ---
        this.contents.paintOpacity = 160;
        this.contents.fillRect(px-1, currentY, pWidth+2, 1, this.normalColor());
        this.contents.paintOpacity = 255;
        
        // --- 所属 (cardFaction) ---
        var faction = item.meta.cardFaction || ""; 
        if (faction) {
            this.contents.fontSize = baseFontSize - 4;
            this.changeTextColor(this.normalColor());
            this.contents.drawText("所属：" + faction, px + 4, currentY, pWidth - 40, lineH, 'left');
            currentY += 8;
        }
        currentY += 18;
        
        this.contents.fontSize = baseFontSize;
        
        // 3. コスト
        var costVal = item.meta.cardCost || 0;
        this.changeTextColor(this.systemColor());
        this.contents.drawText(pNames[2], px, currentY, 80, 32, 'left'); // コスト
        this.changeTextColor(this.normalColor());
        this.contents.drawText(costVal, px, currentY, 80, 32, 'right'); // 数値
        
        
        // 4. カードタイプ (修正箇所: Y座標の-2を削除し、高さを32に変更)
        var typeId = item.meta.cardType !== undefined ? String(item.meta.cardType).trim() : null;
        if (typeId && CARD_TYPE_CONFIG[typeId]) {
            var typeInfo = CARD_TYPE_CONFIG[typeId];
            var ex = px + 100;
            if (typeInfo.icon > 0) {
                this.drawIcon(typeInfo.icon, ex, currentY);
            }
            this.changeTextColor(this.normalColor());
            this.contents.fontSize = baseFontSize-2;
            // アイコン(32px)に合わせてテキストも高さ32pxで描画し、垂直中央揃えにする
            this.contents.drawText(typeInfo.name, ex + 36, currentY, 100, 32, 'left');
        }
        
        // 5. 属性 (修正箇所: Y座標の-2を削除し、高さを32に変更)
        var elementId = item.meta.cardElement !== undefined ? String(item.meta.cardElement).trim() : null;
        if (elementId && CARD_ELEMENT_CONFIG[elementId]) {
            var elemInfo = CARD_ELEMENT_CONFIG[elementId];
            var ex = px + 200; // 位置調整
            
            this.changeTextColor(this.normalColor());
            if (elemInfo.icon > 0) {
                this.drawIcon(elemInfo.icon, ex, currentY);
                ex += 36;
            }
            this.contents.fontSize = baseFontSize-2;
            this.contents.drawText(elemInfo.name, ex, currentY, pWidth - ex, 32, 'left');
        }
        currentY += lineH +2; // 改行
		this.contents.fontSize = baseFontSize;
        // 6. 基本ステータス (HP, ATK, SPD)
        // カードタイプがアイテムの時は別のものにする。
        if (typeId == 4){
        	var stats = [
            	{ label: "クールタイム", value: item.meta.cardHp || 0 },
        	];
        	var ex = px;
        	stats.forEach(function(stat) {
            	this.changeTextColor(this.systemColor());
            	this.contents.drawText(stat.label, ex, currentY, 250, lineH, 'left');
            	this.changeTextColor(this.normalColor());
            	this.contents.drawText(stat.value+" ラウンド", ex, currentY, 250, lineH, 'right');
            	ex += 100; 
        	}, this);
        }else{
        	var stats = [
            	{ label: pNames[3], value: item.meta.cardHp || 0 },
            	{ label: pNames[4], value: item.meta.cardAtk || 0 },
            	{ label: "速さ",    value: item.meta.cardSpd || 0 },
        	];
        	var ex = px;
        	stats.forEach(function(stat) {
            	this.changeTextColor(this.systemColor());
            	this.contents.drawText(stat.label, ex, currentY, 80, lineH, 'left');
            	this.changeTextColor(this.normalColor());
            	this.contents.drawText(stat.value, ex, currentY, 80, lineH, 'right');
            	ex += 100; 
        	}, this);
        }
        
        currentY += lineH + 4;
        
        // --- 罫線 ---
        this.contents.paintOpacity = 100;
        this.contents.fillRect(px-1, currentY, pWidth+2, 1, this.normalColor());
        this.contents.paintOpacity = 255;
        currentY += 4;

        // --- スキル説明の描画設定 ---
        var descFontSize = 14; 

        // 7. 固有スキル (修正箇所: スキル名のY座標と高さを修正)
        var uSkillId = Number(item.meta.unitSkill || 0);
        if (uSkillId > 0 && !ignoreSkillIds.contains(uSkillId)) {
            var uSkill = $dataSkills[uSkillId];
            if (typeId == 4){
	            var uLabel = TMPlugin.Card.Parameters['unitSkillText'] || 'スキル1';
	        }else{
	        	var uLabel = TMPlugin.Card.Parameters['unitSkillText'] || '固有スキル';
	        }	
            
            
            this.contents.fontSize = baseFontSize;
            this.changeTextColor(this.normalColor());
            if (uSkill.iconIndex > 0) this.drawIcon(uSkill.iconIndex, px, currentY);
            
            // スキル名: アイコンに合わせて高さを32pxに、Y座標のずれを解消
            this.contents.drawText(uSkill.name, px + (uSkill.iconIndex > 0 ? 36 : 0), currentY, pWidth, 32, 'left');
                        
            // ラベル
            this.contents.fontSize = 12;
            this.changeTextColor(this.systemColor()); 
            this.contents.drawText(uLabel, px, currentY, pWidth-2, 32, 'right'); // ここも高さを32に合わせておくと揃います
            
            currentY += lineH + 2;
            
            // 区切り線
            this.contents.paintOpacity = 160;
            this.contents.fillRect(px-1, currentY, pWidth+2, 1, this.normalColor());
            this.contents.paintOpacity = 255;
            currentY += 4;
            
            // 説明文描画
            this.changeTextColor(this.normalColor());
            var nextY = this.drawTextExWrap(uSkill.description, px, currentY, pWidth, descFontSize);
            currentY = Math.max(nextY, currentY + descFontSize + 4) + 8;
        }

        // 8. 継承スキル (修正箇所: スキル名のY座標と高さを修正)
        var pSkillId = Number(item.meta.partySkill || 0);
        if (pSkillId > 0 && !ignoreSkillIds.contains(pSkillId)) {
            var pSkill = $dataSkills[pSkillId];
            
			if (typeId == 4){
	            var pLabel = TMPlugin.Card.Parameters['partySkillText'] || 'スキル2';
	        }else{
	        	var pLabel = TMPlugin.Card.Parameters['partySkillText'] || '継承スキル';
	        }	
            
            this.contents.fontSize = baseFontSize;
            this.changeTextColor(this.normalColor());
            if (pSkill.iconIndex > 0) this.drawIcon(pSkill.iconIndex, px, currentY);
            
            // スキル名
            this.contents.drawText(pSkill.name, px + (pSkill.iconIndex > 0 ? 36 : 0), currentY, pWidth, 32, 'left');
            
            // ラベル
            this.contents.fontSize = 12;
            //this.changeTextColor(this.systemColor());
            this.changeTextColor(this.textColor(21));
            this.contents.drawText(pLabel, px, currentY, pWidth-2, 32, 'right');
            
            currentY += lineH + 2;
            
            // 区切り線
            this.contents.paintOpacity = 160;
            this.contents.fillRect(px-1, currentY, pWidth+2, 1, this.normalColor());
            this.contents.paintOpacity = 255;
            currentY += 4;

            // 説明文描画
            this.changeTextColor(this.normalColor());
            this.drawTextExWrap(pSkill.description, px, currentY, pWidth, descFontSize);
        }

		// --- 9. フレーバーテキスト (cardFT) の描画 ---
        var flavorText = item.meta.cardFT;
        if (flavorText) {
            var ftFontSize = 16; // フレーバーテキストのフォントサイズ
            var padding = 10;    // 上の項目との最小余白
            var bottomLimit = py + 330; // 描画領域の底辺
            
            // 現在のY座標に余白を追加
            var ftY = currentY + padding;

            // 残りのスペースを計算 (底辺 - 現在の高さ)
            // 少なくとも2行分(約30〜40px)以上の空きがあるかチェック
            if (bottomLimit - ftY > ftFontSize * 2) {
            	
            	var isUSkillVisible = uSkillId > 0 && !ignoreSkillIds.contains(uSkillId);
        		var isPSkillVisible = pSkillId > 0 && !ignoreSkillIds.contains(pSkillId);
        		if (!(!isUSkillVisible && !isPSkillVisible)) {
					// 罫線（任意：スキルの説明と区別する場合）
                	this.contents.paintOpacity = 60;
                	this.contents.fillRect(px + 20, ftY, pWidth - 40, 1, this.normalColor());
                	this.contents.paintOpacity = 255;
                	ftY += 6;
            	}
                
                // 文字色を少し薄くしたり、イタリック風（MV標準では工夫が必要）にしたりできます
                //this.changeTextColor(this.systemColor()); // システムカラーなどで少し色を変える
                this.contents.paintOpacity = 180;        // 少し薄くする
                
                // 自動折り返し付きで描画
                this.drawTextExWrap(flavorText, px+10, ftY, pWidth-10, ftFontSize);
                
                this.contents.paintOpacity = 255;
                this.changeTextColor(this.normalColor());
            }
        }
        // スキルが何もない場合、アイテム説明文を書く
		// var isUSkillVisible = uSkillId > 0 && !ignoreSkillIds.contains(uSkillId);
        // var isPSkillVisible = pSkillId > 0 && !ignoreSkillIds.contains(pSkillId);
        //if (!isUSkillVisible && !isPSkillVisible) {
        //    this.drawTextExWrap(item.description, px, currentY, pWidth, descFontSize);
        //}
    };

    // 以降、既存のフック処理 (SceneGlossary_TMCard.js の以前のものを維持)
    var _Window_Glossary_drawItem = Window_Glossary.prototype.drawItem;
    var _Window_Glossary_clearItem = Window_Glossary.prototype.clearItem;
    var _Window_Glossary_getGlossaryBitmap = Window_Glossary.prototype.getGlossaryBitmap;
    var _Window_Glossary_drawPicture = Window_Glossary.prototype.drawPicture;

    Window_Glossary.prototype.isCardMode = function() {
        if (!this._itemData) return false;
        var meta = this._itemData.meta;
        return !!(meta['SGCard'] || meta['SGパラメータ表示'] || meta['SGCardStatus']);
    };

    Window_Glossary.prototype.getGlossaryBitmap = function(index) {
        if (this.isCardMode()) {
            var width  = Number(TMPlugin.Card.Parameters['cardWidth'] || 192);
            var height = Number(TMPlugin.Card.Parameters['cardHeight'] || 288);
            return new Bitmap(width, height);
        }
        return _Window_Glossary_getGlossaryBitmap.call(this, index);
    };

    Window_Glossary.prototype.drawItem = function(pageIndex, noSound) {
        this.clearCardSprite();
        _Window_Glossary_drawItem.call(this, pageIndex, noSound);
    };

    Window_Glossary.prototype.clearItem = function() {
        this.clearCardSprite();
        _Window_Glossary_clearItem.call(this);
    };

    Window_Glossary.prototype.clearCardSprite = function() {
        if (this._cardSprite) {
            this.removeChild(this._cardSprite);
            this._cardSprite = null;
        }
    };

    Window_Glossary.prototype.drawPicture = function(bitmap, text, y) {
        if (this.isCardMode()) {
            var item = this._itemData;
            var scale = Number(getMeta(item, ['ピクチャ拡大率', 'PictureScale']) || 1.0);
            var align = getMeta(item, ['ピクチャ揃え', 'PictureAlign']) || 'left';
            var offsetX = Number(getMeta(item, ['ピクチャX', 'PictureX']) || 0);
            var offsetY = Number(getMeta(item, ['ピクチャY', 'PictureY']) || 0);

            var cw = bitmap ? bitmap.width : 192;
            var ch = bitmap ? bitmap.height : 288;
            var finalW = cw * scale;
            
            var x = 0;
            if (align === 'center') x = (this.contentsWidth() - finalW) / 2;
            if (align === 'right')  x = this.contentsWidth() - finalW;
            x += offsetX;
            y += offsetY;

            var card = new Game_Card(item);
            this._cardSprite = new Sprite_Card(card);
            var ax = this._cardSprite.anchor ? this._cardSprite.anchor.x : 0.5;
            var ay = this._cardSprite.anchor ? this._cardSprite.anchor.y : 0.5;
            
            var targetX = this.standardPadding() + x + (finalW * ax);
            var targetY = this.standardPadding() + y + (ch * scale * ay);

            this._cardSprite.update = function() {
                Sprite_Card.prototype.update.call(this);
                this.x = targetX;
                this.y = targetY;
                this.scale.set(scale, scale);
            };
            this.addChild(this._cardSprite);

            if (getMeta(item, ['パラメータ表示', 'CardStatus']) === 'ON') {
                this.drawTMCardStatus(item);
            }
        } else {
            _Window_Glossary_drawPicture.call(this, bitmap, text, y);
        }
    };

})();