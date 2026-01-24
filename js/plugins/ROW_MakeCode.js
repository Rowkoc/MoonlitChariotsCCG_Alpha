//=============================================================================
// ROW_MakeCode.js
// ショップで選択中のアイテムに応じてピクチャを表示するプラグイン
//=============================================================================

/*:
 * @plugindesc 文字列や数値を「ひらがな・カタカナ」の短いコードに変換・復元するライブラリです。
 * @author Rowkoc
 *
 * @help
 * このプラグインはライブラリです。単体では機能しません。
 * 他のプラグインやスクリプトから呼び出して使用します。
 * * ■ グローバル関数
 * DeckCodeSystem.encode(name, itemId, cardIds)
 * -> デッキコード文字列を返します。
 * * DeckCodeSystem.decode(codeString)
 * -> { name, itemId, cardIds } のオブジェクトを返します。
 */

var DeckCodeSystem = DeckCodeSystem || {};

(function() {
    'use strict';

    // 攪拌用のシード値（この数字を変えると生成されるコードが全く別物になります）
    var SECRET_SEED = 12345; 
    var CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";

    // 簡易的なデータ攪拌（Xorshift）
    function shuffle(buffer) {
        var seed = SECRET_SEED;
        return buffer.map(function(b) {
            seed = (seed ^ (seed << 13)) ^ (seed >> 17) ^ (seed << 5);
            return b ^ (Math.abs(seed) & 0xFF);
        });
    }

    // チェックサム（末尾1バイトに整合性チェック用データを付与）
    function addChecksum(buffer) {
        var sum = buffer.reduce(function(a, b) { return a + b; }, 0);
        buffer.push(sum & 0xFF);
        return buffer;
    }

    function verifyAndRemoveChecksum(buffer) {
        var last = buffer.pop();
        var sum = buffer.reduce(function(a, b) { return a + b; }, 0);
        return (last === (sum & 0xFF)) ? buffer : null;
    }

    function stringToBytes(str) {
        var escaped = unescape(encodeURIComponent(str));
        return escaped.split('').map(function(c) { return c.charCodeAt(0); });
    }

    function bytesToString(bytes) {
        try {
            return decodeURIComponent(escape(String.fromCharCode.apply(null, bytes)));
        } catch (e) { return "Unknown"; }
    }

    DeckCodeSystem.encode = function(name, itemId, cardIds) {
    	// 安全対策を追加
        name = name || "";          // nullやundefinedなら空文字にする
        itemId = itemId || 0;       // nullやundefinedなら0にする
        cardIds = cardIds || [];    // nullなら空配列にする
        // ここまで
        var nameBytes = stringToBytes(name);
        // [名前長, 名前..., アイテムID(2), カード数, カードID(各2)...]
        var buffer = [nameBytes.length].concat(nameBytes);
        buffer.push(itemId >> 8, itemId & 0xFF, cardIds.length);
        cardIds.forEach(function(id) { buffer.push(id >> 8, id & 0xFF); });

        // 複雑化：整合性チェックの付与 ＋ データの攪拌
        buffer = addChecksum(buffer);
        buffer = shuffle(buffer);

        var binStr = buffer.map(function(b) { return ("00000000" + b.toString(2)).slice(-8); }).join('');
        var encoded = "";
        for (var i = 0; i < binStr.length; i += 6) {
            var chunk = (binStr.substr(i, 6) + "000000").substr(0, 6);
            encoded += CHARS[parseInt(chunk, 2)];
        }
        return encoded;
    };

    DeckCodeSystem.decode = function(code) {
        if (!code) return null;
        var binStr = "";
        for (var i = 0; i < code.length; i++) {
            var val = CHARS.indexOf(code[i]);
            if (val === -1) continue;
            binStr += ("000000" + val.toString(2)).slice(-6);
        }
        var bytes = [];
        for (var j = 0; j < binStr.length; j += 8) {
            if (j + 8 > binStr.length) break;
            bytes.push(parseInt(binStr.substr(j, 8), 2));
        }

        // 逆転処理：攪拌を戻す ＋ チェックサム確認
        bytes = shuffle(bytes);
        bytes = verifyAndRemoveChecksum(bytes);
        if (!bytes) return null;

        try {
            var offset = 0;
            var nameLen = bytes[offset++];
            var name = bytesToString(bytes.slice(offset, offset + nameLen));
            offset += nameLen;
            var itemId = (bytes[offset++] << 8) | bytes[offset++];
            var cardCount = bytes[offset++];
            var cardIds = [];
            for (var k = 0; k < cardCount; k++) {
                cardIds.push((bytes[offset++] << 8) | bytes[offset++]);
            }
            return { name: name, itemId: itemId, cardIds: cardIds };
        } catch (e) { return null; }
    };
})();