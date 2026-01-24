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
})();