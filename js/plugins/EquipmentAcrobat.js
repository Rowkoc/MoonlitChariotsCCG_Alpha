//============================================================================
// EquipmentAcrobat.js
//============================================================================

/*:ja
 * @plugindesc ver1.02 ステータスで装備アイテムを描画しなくなるなど。
 * @author まっつＵＰ
 *
 * @param weapon
 * @desc このパラメータが0以外の時は
 * 武器のアイテムカテゴリを表示します。
 * @default 1
 *
 * @param armor
 * @desc このパラメータが0以外の時は
 * 防具のアイテムカテゴリを表示します。
 * @default 0
 *
 * @param key
 * @desc このパラメータが0以外の時は
 * 大事なもののアイテムカテゴリを表示します。
 * @default 1
 *
 * @param showEquip
 * @desc このパラメータが0以外の時は
 * ステータス画面で装備を表示します。
 * @default 0
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * パラメータで非表示項目を変えることができます。
 *
 * ver1.01 アイテムカテゴリから武器や防具の項目を非表示に。
 * ver1.02 プラグインパラメータの増加
 *
 * 利用規約(2019/9/7変更)：
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：まっつＵＰ
 *
 */

(function() {

var parameters = PluginManager.parameters('EquipmentAcrobat');
var EAweapon = Number(parameters['weapon'] || 1);
var EAarmor = Number(parameters['armor'] || 0);
var EAkey = Number(parameters['key'] || 1);
var EAshowEquip = Number(parameters['showEquip'] || 0);

var EAarray = [EAweapon, EAarmor, EAkey];
EAarray = EAarray.filter(function(index) {
    return !index;
});

Window_ItemCategory.prototype.maxCols = function() {
    return 4 - EAarray.length;
};

Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
    if(EAweapon) this.addCommand(TextManager.weapon,  'weapon');
    if(EAarmor) this.addCommand(TextManager.armor,   'armor');
    if(EAkey) this.addCommand(TextManager.keyItem, 'keyItem');
};

var _Window_Status_drawEquipments = Window_Status.prototype.drawEquipments;
Window_Status.prototype.drawEquipments = function(x, y) {
    if(EAshowEquip) _Window_Status_drawEquipments.call(this, x, y);
};

})();
