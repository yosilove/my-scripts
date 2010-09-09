/*
Twitter @Anywhereをのサンプル

このファイルを読み込む前に
<script src="http://platform.twitter.com/anywhere.js?id=アナタのAPIキー&v=1" type="text/javascript"></script>
しておくこと
*/

var myTwitter; // Twitter オブジェクト用変数。

// @Anywhere を初期化。初期化完了後は onAnywhereLoad をコールバック！
twttr.anywhere(onAnywhereLoad /*, ウインドウコンテキストも指定可能 */);

  // @Anywhere 初期化コールバック。オレ達専用の初期化はここで行う。
function onAnywhereLoad(twitter){
  myTwitter = twitter; // オレ達用に @Anywhere から授けられた Twitter オブジェクトを保存しておく。
  myTwitter.linkifyUsers();
  myTwitter.hovercards(); //Twitter IDをみつけると、ユーザ情報を表示する
    /* ... などなど、お好みの初期処理を記述 */
}


