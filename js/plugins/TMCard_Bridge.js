/*:
 * @plugindesc TMCardの機能を外部から使いやすくするブリッジプラグイン
 */
(function() {
    // TMPlugin.Card に便利な関数を定義しておく
    
    /**
     * 指定したビットマップにカードを描画する
     * @param {Bitmap} bitmap 描画先のビットマップ
     * @param {Object} item $dataItems のデータ
     */
    TMPlugin.Card.drawToBitmap = function(bitmap, item, x, y) {
        var card = new Game_Card(item);
        var sprite = new Sprite_Card(card);
        // Sprite_Cardの描画結果をBitmapに転写する処理など
    };
    
    // アイテム購入画面の改造例（Window_ShopStatusの書き換えなど）
    var _Window_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
    Window_ShopStatus.prototype.refresh = function() {
        _Window_ShopStatus_refresh.call(this);
        // 前のスプライトを確実に消去
        if (this._cardSprite) {
            this.removeChild(this._cardSprite);
            this._cardSprite = null;
        }

        // アイテムが存在し、かつカード用データ（cardCost等）がある場合のみ実行
        if (this._item && this._item.meta && (this._item.meta.cardCost !== undefined)) {
            
            // A. 透明な入れ物（親スプライト）を作成
            this._cardContainer = new Sprite();
            
            // B. 入れ物の位置を決める（ここを好きな数値に変えれば、カードが動きます！）
            // 1. ウィンドウ自体の中心座標を計算
            var centerX = this.width / 2;
            var centerY = this.height / 2;

            // 2. 入れ物の位置をウィンドウの中心に設定
            // ここに数値を足し引きすれば「中心からどれくらいズラすか」を指定できます
            this._cardContainer.x = centerX + 0; // 右にズラすならプラス
            this._cardContainer.y = centerY + 0; // 下にズラすならプラス

            // C. カードの実体を作成
            var card = new Game_Card(this._item);
            
            // D. カードのスプライトを作成
            this._cardSprite = new Sprite_Card(card);
            this._cardSprite.anchor.set(0.5, 0.5);
            
            // E. カードを「入れ物」の中に入れる
            this._cardContainer.addChild(this._cardSprite);
            
            // F. 「入れ物」をウィンドウ本体に追加する
            this.addChild(this._cardContainer);

            // --- ここまで ---

            // カード画像の読み込みと更新を強制的に開始させる
            this._cardSprite.update();
        }
        
    };

	// =================================================================
    // ピクチャとしてカードを表示する機能
    // =================================================================
/**
     * @param {number} scaleX 拡大率（幅） 100基準
     * @param {number} scaleY 拡大率（高さ） 100基準
     * @param {number} opacity 不透明度 0〜255
     */
    Game_Screen.prototype.showCardPicture = function(picId, itemId, x, y, scaleX, scaleY, opacity) {
        var item = $dataItems[itemId];
        if (!item) return;

        // 標準のピクチャ表示機能を呼び出す（拡大率と不透明度を渡す）
        // 引数: ID, 名前, 原点(0:左上), X, Y, 拡大X, 拡大Y, 不透明度, 合成
        this.showPicture(picId, '', 0, x, y, scaleX, scaleY, opacity, 0);
        
        var picture = this.picture(picId);
        picture._isCard = true;
        picture._cardItemId = itemId;
    };

    var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.call(this);
        var picture = this.picture();
        
        if (picture && picture._isCard) {
            if (!this._cardSprite || this._cardItemId !== picture._cardItemId) {
                if (this._cardSprite) this.removeChild(this._cardSprite);
                
                var card = new Game_Card($dataItems[picture._cardItemId]);
                this._cardSprite = new Sprite_Card(card);
                this._cardSprite.anchor.set(0.5, 0.5);
                this.addChild(this._cardSprite);
                this._cardItemId = picture._cardItemId;
                
                // 元のピクチャの描画を消すために透明な1x1ビットマップを作成
                this.bitmap = new Bitmap(1, 1);
            }
        } else if (this._cardSprite) {
            this.removeChild(this._cardSprite);
            this._cardSprite = null;
        }
    };

    // =================================================================
    // プラグインコマンド
    // ShowCard [番号] [アイテムID] [X] [Y] [拡大率X] [拡大率Y] [不透明度]
    // =================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ShowCard') {
            var picId   = Number(args[0]);
            var itemId  = Number(args[1]);
            var x       = Number(args[2] || 0);
            var y       = Number(args[3] || 0);
            var scaleX  = Number(args[4] === undefined ? 100 : args[4]);
            var scaleY  = Number(args[5] === undefined ? 100 : args[5]);
            var opacity = Number(args[6] === undefined ? 255 : args[6]);
            
            $gameScreen.showCardPicture(picId, itemId, x, y, scaleX, scaleY, opacity);
        }
    };
    
})();