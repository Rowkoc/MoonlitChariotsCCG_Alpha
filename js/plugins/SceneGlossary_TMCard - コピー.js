/*:
 * @plugindesc SceneGlossaryでTMCardのスキル名・説明を表示する拡張（修正版）
 * @author 
 *
 * @help
 * カードに設定されたスキルの名前と説明文を表示する機能を追加しました。
 * * <SGパラメータ表示:ON> (または <SGCardStatus:ON>) があるアイテムで、
 * 以下の情報を自動取得します：
 * * 1. TMCardの <unitSkill:n> タグで指定されたスキルの名前と説明
 * 2. それがない場合は、アイテム自体の説明文
 *
 * 座標調整用タグ（アイテムのメモ欄）:
 * <SGパラメータX:400>  (デフォルト: 400)
 * <SGパラメータY:20>   (デフォルト: 20)
 * <SGパラメータ幅:300> (デフォルト: 300)
 */

(function() {
    'use strict';

    if (typeof Window_Glossary === 'undefined' || typeof TMPlugin === 'undefined' || !TMPlugin.Card) {
        return;
    }

    // メタデータの取得ヘルパー関数
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

    var _Window_Glossary_drawItem = Window_Glossary.prototype.drawItem;
    var _Window_Glossary_clearItem = Window_Glossary.prototype.clearItem;
    var _Window_Glossary_getGlossaryBitmap = Window_Glossary.prototype.getGlossaryBitmap;
    var _Window_Glossary_drawPicture = Window_Glossary.prototype.drawPicture;

    Window_Glossary.prototype.isCardMode = function() {
        if (!this._itemData) return false;
        var meta = this._itemData.meta;
        // SGCard, SGカード, または SGパラメータ表示 がある場合にカードモードと判定
        return !!(meta['SGCard'] || meta['SGカード'] || meta['Card'] || meta['カード'] || meta['SGパラメータ表示'] || meta['SGCardStatus']);
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
            var finalH = ch * scale;
            
            var x = 0;
            if (align === 'center') x = (this.contentsWidth() - finalW) / 2;
            if (align === 'right')  x = this.contentsWidth() - finalW;
            
            x += offsetX;
            y += offsetY;

            // カード生成と描画
            var card = new Game_Card(item);
            this._cardSprite = new Sprite_Card(card);
            var ax = this._cardSprite.anchor ? this._cardSprite.anchor.x : 0.5;
            var ay = this._cardSprite.anchor ? this._cardSprite.anchor.y : 0.5;
            
            // Sprite_Cardは中心座標基準(anchor 0.5)の場合が多いので補正
            var targetX = this.standardPadding() + x + (finalW * ax);
            var targetY = this.standardPadding() + y + (finalH * ay);

            // updateで位置とスケールを固定
            this._cardSprite.update = function() {
                Sprite_Card.prototype.update.call(this);
                this.x = targetX;
                this.y = targetY;
                this.scale.set(scale, scale);
            };
            this.addChild(this._cardSprite);

            // パラメータ表示 (メタタグで制御)
            if (getMeta(item, ['パラメータ表示', 'CardStatus']) === 'ON') {
                this.drawTMCardStatus(item);
            }

            // 追加ピクチャがあれば描画 (Glossary標準機能)
            if (this.drawPlusPicture) this.drawPlusPicture();
            
        } else {
            // カードモードでない場合は通常描画
            _Window_Glossary_drawPicture.call(this, bitmap, text, y);
        }
    };

// TMCard.js の Window_DeckEditStatus.prototype.refresh を参考に拡張
    Window_Glossary.prototype.drawTMCardStatus = function(item) {
        var px = Number(getMeta(item, ['パラメータX', 'StatusX']) || 400);
        var py = Number(getMeta(item, ['パラメータY', 'StatusY']) || 20);
        var pWidth = Number(getMeta(item, ['パラメータ幅', 'StatusWidth']) || 360);
        var lineHeight = this.lineHeight();

        // 1. 各種パラメータの取得
        var hp   = item.meta.cardHp || 0;
        var atk  = item.meta.cardAtk || 0;
        var cost = item.meta.cardCost || 0;
        var element = item.meta.cardElement || ""; // 属性

        // 2. スキル情報の取得 (TMCard.js の仕様に準拠)
        var unitSkillId  = Number(item.meta.unitSkill || 0);
        var partySkillId = Number(item.meta.partySkill || 0);

        var unitSkill  = $dataSkills[unitSkillId];
        var partySkill = $dataSkills[partySkillId];

        // 描画開始
        this.contents.fontSize = 24;

        // --- A. 基本ステータス (Cost, HP, ATK, Element) ---
        var paramNames = TMPlugin.Card.ParamNames || ['名前', 'レア度', 'コスト', 'HP', '攻撃力'];
        var labels = [paramNames[2], paramNames[3], paramNames[4], "属性"];
        var values = [cost, hp, atk, element];

        for (var i = 0; i < labels.length; i++) {
            var ty = py + i * lineHeight;
            this.changeTextColor(this.systemColor());
            this.drawText(labels[i], px, ty, 100);
            this.changeTextColor(this.normalColor());
            this.drawText(values[i], px + 100, ty, pWidth - 100, 'left');
        }

        var currentY = py + labels.length * lineHeight + 10;

        // --- B. ユニットスキル (Unit Skill) ---
        if (unitSkill) {
            this.changeTextColor(this.systemColor());
            var labelUnit = TMPlugin.Card.Parameters['unitSkillText'] || 'ユニットスキル';
            this.drawText(labelUnit + "：", px, currentY, pWidth);
            
            currentY += lineHeight;
            this.changeTextColor(this.normalColor());
            var iconBox = unitSkill.iconIndex > 0 ? Window_Base._iconWidth + 4 : 0;
            if (unitSkill.iconIndex > 0) {
                this.drawIcon(unitSkill.iconIndex, px, currentY);
            }
            this.drawText(unitSkill.name, px + iconBox, currentY, pWidth - iconBox);
            
            currentY += lineHeight;
            this.contents.fontSize = 20;
            this.drawTextEx(unitSkill.description, px, currentY);
            this.contents.fontSize = 24;
            currentY += lineHeight * 2.5; // 説明文の行数分あける
        }

        // --- C. パーティスキル (Party Skill) ---
        if (partySkill) {
            this.changeTextColor(this.systemColor());
            var labelParty = TMPlugin.Card.Parameters['partySkillText'] || 'パーティスキル';
            this.drawText(labelParty + "：", px, currentY, pWidth);
            
            currentY += lineHeight;
            this.changeTextColor(this.normalColor());
            var pIconBox = partySkill.iconIndex > 0 ? Window_Base._iconWidth + 4 : 0;
            if (partySkill.iconIndex > 0) {
                this.drawIcon(partySkill.iconIndex, px, currentY);
            }
            this.drawText(partySkill.name, px + pIconBox, currentY, pWidth - pIconBox);
            
            currentY += lineHeight;
            this.contents.fontSize = 20;
            this.drawTextEx(partySkill.description, px, currentY);
            this.contents.fontSize = 24;
        }

        // スキルが全くない場合は、アイテム自体の説明を表示
        if (!unitSkill && !partySkill) {
            this.changeTextColor(this.normalColor());
            this.contents.fontSize = 20;
            this.drawTextEx(item.description, px, currentY);
        }
    };
})();