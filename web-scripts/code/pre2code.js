/*
クラス名を「code」にしたpreタグについて
 - 中身を行番号付きにする
 - 中身をダブルクリックで、タグを削除した内容を新規Windowで開く
 
 作者:yosilove
 作成:2010/11/03
*/

//タグの削除
//ただし、liは改行コードに置き換え
function tag_delete(html){

	//liを改行に置き換える
	li2n = new RegExp(/<\/li>/g);
	html = html.replace(li2n, "\n");
	
	//タグをすべて削除
	rgexp = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
	plain = html.replace(rgexp, "");
	return plain;
}

//olを使って行番号の追加
function addLineNum(source){
	var lines = source.split("\n");
	var newSource = "<code class\"srcFile\"><ol class=\"srcCode\">\n";
	
	for (n = 0; n < lines.length; n++) {
		newSource = newSource + "<li class=\"lineNum\">" + lines[n] +"</li>"; 
	}
	newSource = newSource + "</ol></code>"
	
	return newSource;
}

//ソースコードを新しいウィンドウで表示
function openByNewWindow()
{	
	//head内
	//id要素を新しいWindowのタイトルに設定
	var head = "<title>"+this.id+"</title>";
	
	//body部分
	var txt = tag_delete(this.innerHTML);
	html = txt.replace('\n', "<br>");
	
	var body = "<pre>"+html+"</pre>";
	
	//HTMLを作る
	var newhtml = "<html><head>"+head+"</head><body>"+body+"</body></html>";
	
	//新しいWindowで表示
	var win = window.open();
	win.document.open();
	win.document.write(newhtml);
	win.document.close();
}
//=======================

window.onload = function execute(){
//function execute(){ 
	for (i = 0; i < document.all.tags("pre").length; i++) {
		var preTag = document.all.tags("pre")(i);
		

		//alert("class:"+preTag.className);
		if(preTag.className.indexOf("code") !=-1 ){
			//alert("id:"+preTag.id);
			var filename = preTag.id;
			//alert("html:"+preTag.innerHTML);
			var html = preTag.innerHTML;
			
			//行番号を追加
			preTag.innerHTML = addLineNum(html);
			
			//イベントリスナを追加
			preTag.addEventListener("dblclick" , openByNewWindow , true);
		}
	}
}