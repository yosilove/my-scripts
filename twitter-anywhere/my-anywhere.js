/*
Twitter @Anywhereをのサンプル

参考
http://wpxtreme.jp/how-to-use-twitter-at-anywhere-with-wordpress

このファイルを読み込む前に
<script src="http://platform.twitter.com/anywhere.js?id=アナタのAPIキー&v=1" type="text/javascript"></script>
しておくこと
*/

var myTwitter; // Twitter オブジェクト用変数。

// @Anywhere を初期化。初期化完了後は onAnywhereLoad をコールバック！
twttr.anywhere(onAnywhereLoad /*, ウインドウコンテキストも指定可能 */);

/*followボタンの表示*/
function showFollow(){
  myTwitter.('#follow-buttom').followButton("twitterapi");
}

// @Anywhere 初期化コールバック。オレ達専用の初期化はここで行う。
function onAnywhereLoad(twitter){
  /*初期設定*/
  myTwitter = twitter; // オレ達用に @Anywhere から授けられた Twitter オブジェクトを保存しておく。
  myTwitter.linkifyUsers();
  myTwitter.hovercards(); //Twitter IDをみつけると、ユーザ情報を表示する

  /*関数呼び出し*/
  showFollow();
}


