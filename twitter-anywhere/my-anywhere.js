/*
Twitter @Anywhereをのサンプル

参考
http://wpxtreme.jp/how-to-use-twitter-at-anywhere-with-wordpress

このファイルを読み込む前に
<script src="http://platform.twitter.com/anywhere.js?id=アナタのAPIキー&v=1" type="text/javascript"></script>
しておくこと
*/

//var myTwitter; // Twitter オブジェクト用変数。

// @Anywhere を初期化。初期化完了後は onAnywhereLoad をコールバック！
twttr.anywhere(onAnywhereLoad /*, ウインドウコンテキストも指定可能 */);


// @Anywhere 初期化コールバック。オレ達専用の初期化はここで行う。
function onAnywhereLoad(twitter){
  /*初期設定*/
  //myTwitter = twitter; // オレ達用に @Anywhere から授けられた Twitter オブジェクトを保存しておく。

	//@xxxにTwitterへのリンクを張る
  twitter.linkifyUsers();
	//@xxxの情報をポップアップで表示
  twitter.hovercards(); //Twitter IDをみつけると、ユーザ情報を表示する


	//フォローボタンの表示
  twitter('#follow-buttom').followButton(my_twitter_id);

	//tweetボタンの表示
  twitter('#twit-box').tweetBox({
    height: 100,
    width: 150,
    label: 'つぃーと',
    defaultContent: "ツィートしてね！"
  });

  //現在ログインしているユーザの情報の表示
  if (twitter.currentUser) {
    var currentUser = twitter.currentUser;
    var screenName = currentUser.attributes.screen_name;
    var profileImage = currentUser.attributes.profile_image_url;
    var elemImg = document.createElement('img')
    elemImg.src = profileImage;
    var element=document.getElementById("twitter-connect");
    var textNode = document.createTextNode("Logged in as " + screenName);
    element.appendChild(elemImg);
    element.appendChild(textNode);
  } else {
    twitter("#twitter-connect").connectButton();
  };

	//検索結果の表示
	var encodedQuery = encodeURI(twitter_query);
  var statuses = twitter.search(encodedQuery);

  var elemBox = document.getElementById("status-box");

  window.alert(statuses);
}


