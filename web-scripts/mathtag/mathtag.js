/*
mathタグのeq属性にtex形式で指定した数式を表示
 - 少しぐらいなら数式を間違えててもOK
 - 時間があったらMathMLにも対応したい。。。
 
 作者:yosilove
 作成:2010/11/07
*/
window.addEventListener("load", mathtag_exec, false);

var google_chart_url = 'http://chart.apis.google.com/chart'
//=======================
//　補助用の関数
//=======================
/*
	google chartを使ってtexを画像に変換する
*/
function tex2google_chart(tex){
	var encoded = encodeURIComponent(tex);
	return ( '<img src="'+google_chart_url+'?cht=tx&chl='+encoded+'" />');
}

/*
	間違えやすいtexの書式をを変換してあげる
*/
function texsupport(tex){

	//数学記号
	leq = new RegExp(/<=/g); tex = tex.replace(leq, "\\leq");
	geq = new RegExp(/=>/g); tex = tex.replace(geq, "\\geq");
	vee = new RegExp(/\\or/g); tex = tex.replace(vee, "\\vee");
	wed = new RegExp(/\\and/g); tex = tex.replace(wed, "\\wedge");

	pm = new RegExp(/\+-/g); tex = tex.replace(pm, "\\pm");
	mp = new RegExp(/-\+/g); tex = tex.replace(mp, "\\mp");
	neg = new RegExp(/\\not/g); tex = tex.replace(neg,"\\neg");

	//記号
	lr = new RegExp(/<->/g); tex = tex.replace(lr, "\\leftrightarrow");
	right = new RegExp(/->/g); tex = tex.replace(right, "\\rightarrow");
	left = new RegExp(/<-/g); tex = tex.replace(left, "\\leftarrow");

	return tex;
}


//=======================
//  Mainの関数
//=======================

function mathtag_exec(){
  //preタグを検索 
  for (i = 0; i < document.all.tags("math").length; i++) {
    var mathTag = document.all.tags("math")(i);
		var mode = 'google';
		var tex = mathTag.getAttribute("eq");

		//eq属性が指定されてなかったら無視
		if(tex == null){
			continue;
		}


		//少しだけ書式修正
		tex = texsupport(tex);

		//modeに従って出力するものを変更
		var html='';
		switch(mode){
			case 'google':
			default:
				html=tex2google_chart(tex);
		}

		mathTag.innerHTML = html;
  }
}
