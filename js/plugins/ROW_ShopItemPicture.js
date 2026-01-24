//=============================================================================
// ROW_ShopItemPicture.js
// ショップで選択中のアイテムに応じてピクチャを表示するプラグイン
//=============================================================================

/*:
 * @plugindesc ショップで選択中のアイテムに応じてピクチャを表示します。画像は img/pictures に配置してください。
 * @author Rowkoc
 *
 * @param PictureId
 * @desc 使用するピクチャ番号（1〜100）
 * @default 20
 * @type number
 *
 * @param UseNoteTag
 * @desc メモ欄の<tag:画像ファイル名>を使う（true/false）
 * @default true
 * @type boolean
 *
 * @param X
 * @desc 表示X座標
 * @default 300
 * @type number
 *
 * @param Y
 * @desc 表示Y座標
 * @default 50
 * @type number
 */

(function() {
    const parameters = PluginManager.parameters('ROW_ShopItemPicture');
    const picId = Number(parameters['PictureId'] || 20);
    const useNote = String(parameters['UseNoteTag']) === "true";
    const posX = Number(parameters['X'] || 300);
    const posY = Number(parameters['Y'] || 50);

    const _Window_ShopBuy_updateHelp = Window_ShopBuy.prototype.updateHelp;
    Window_ShopBuy.prototype.updateHelp = function() {
        _Window_ShopBuy_updateHelp.call(this);
        const item = this.item();
        if (!item) return;

        let picName = '';

        if (useNote) {
            const match = /<pic:(.+?)>/.exec(item.note);
            if (match) {
                picName = match[1].trim();
            }
        }

        if (!picName && item.name) {
            picName = item.name.trim();
        }

        $gameScreen.showPicture(picId, picName, 1, posX, posY, 100, 100, 255, 0);
    };

    const _Scene_Shop_terminate = Scene_Shop.prototype.terminate;
    Scene_Shop.prototype.terminate = function() {
        $gameScreen.erasePicture(picId);
        _Scene_Shop_terminate.call(this);
    };
})();
