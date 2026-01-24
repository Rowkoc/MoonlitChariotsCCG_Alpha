//=============================================================================
// アニメーション位置調整プラグイン
// ROW_SkillAnimOffset.js
// Copyright (c) 2025 rowkoc
//=============================================================================

/*:ja
 * @plugindesc アニメーションの表示位置を調整するプラグインです。
 * @author Rowkoc
 *
 * @param OffsetYHead
 * @desc Y座標を下にずらします
 * @default 0
 * @type number
 *
 * @param OffsetYCenter
 * @desc Y座標を下にずらします
 * @default 0
 * @type number
 *
 * @param OffsetYBottom
 * @desc Y座標を下にずらします
 * @default 0
 * @type number
 *
 * @param OffsetYAll
 * @desc Y座標を下にずらします
 * @default 0
 * @type number
 *
 *
 * @help
 *
 * テスト版
 *
 */
 (function(_global) {

Sprite_Animation.prototype.updatePosition = function() { 
    if (this._animation.position === 3) { //画面全体指定の時
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;
        var param = PluginManager.parameters('ROW_SkillAnimOffset');
        this.y += Number(param.OffsetYAll);
    } else {
        var parent = this._target.parent;
        var grandparent = parent ? parent.parent : null;
        //最初にx.y座標を定義。足元を代入する。
        this.x = this._target.x;
        this.y = this._target.y;
        if (parent && grandparent && this.parent === grandparent) {
            this.x += parent.x;
            this.y += parent.y;
        }
        var param = PluginManager.parameters('ROW_SkillAnimOffset');
        if (this._animation.position === 0) {
        	//ターゲットの高さの分だけマイナス
            this.y -= this._target.height;
            this.y += Number(param.OffsetYHead);
        } else if (this._animation.position === 1) {
        	//ターゲットの高さの半分だけマイナス。
            this.y -= this._target.height / 2 ;
            this.y += Number(param.OffsetYCenter);
        } else if (this._animation.position === 2) {
            this.y += Number(param.OffsetYBottom);
        }
    }
};

})(this);