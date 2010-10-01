// Copyright (c) 2008 CogniTom Academic Design (http://bookreader.cognitom.com/)

var BookReader = {
	Version: '0.4.6',
	Released: '20090418',
	
	FontSize: 'S',//フォントサイズ (S,M,L)
	NowLoading: false,
	CookieManager: null,
	AutoLoading: true,
	original: null,
	dom: null,
	pages: [''],
	anchors: [],
	currentline: 0,
	currentpage: 0,
	ImageStack: [],
	AnchorStack: [],
	loadTheme: function() {
		var s = $A(document.getElementsByTagName("script")).find(function(s){ return (s.src && s.src.match(/bookreader(\.src)?\.js(\?.*)?$/)) });
		var theme = (tmp = s.src.match(/\?.*theme=([a-z0-9]*)/)) ? tmp[1] : 'default';
		var language = (tmp = s.src.match(/\?.*language=([a-z0-9_]*)/)) ? tmp[1] : 'ja';
		var path = s.src.replace(/bookreader(\.src)?\.js(\?.*)?$/,'');
		var themePath = path+'themes/'+theme+'/';
		var os = 'default';
		if (navigator.userAgent.indexOf('Mac OS X') > -1) os = 'mac';
		if (navigator.userAgent.indexOf('Windows NT 6') > -1) os = 'vista';
		document.write('<sc'+'ript type="text/javascript" src="'+path+'languages/'+language+'.js"></script>');
		document.write('<sc'+'ript type="text/javascript" src="'+themePath+os+'.js"></script>');
		document.write('<link rel="stylesheet" type="text/css" href="'+themePath+'style.css" media="screen" />');
		document.write('<link rel="stylesheet" type="text/css" href="'+themePath+os+'.css" media="screen" />');
	},
	autoload: function(){
		if (BookReader.AutoLoading) BookReader.load();
		
		if (anc = location.hash) BookReader.go2anchor(anc);
	},
	load: function(){
		BookReader.original = $$('div#bookreader').first();
		BookReader.dom = new Element('div', {'id': 'br_body'});
		Element.insert(BookReader.original, {after:BookReader.dom});
		
		BookReader.loadCookie();
		
		BookReader.updatePages();
		BookReader.setKeyEvent();
	},
	updatePages: function(){
		if (this.NowLoading)
			return;
		this.NowLoading = true;
		BookReader.makePages();
		BookReader.showPages();
		
		BookReader.go2first();
		this.NowLoading = false;
	},
	makePages: function(){
		BookReader.pages = [''];
		BookReader.anchors = [];
		BookReader.currentline = 0;
		BookReader.currentpage = 0;
		BookReader.original.childElements().each(function(elm){
			var tag = elm.tagName;
			var fontsize = BookReader.FontSize;
			var maxline = BookReader.Theme[fontsize].MaxLine;
			var maxletter = BookReader.Theme[fontsize].MaxLetter;
			var maxletterH2 = BookReader.Theme[fontsize].MaxLetterH2;
			switch (tag){
				case 'DIV':
				case 'P':
					s = elm.innerHTML;
					t = BookReader.Utils.dividelines(s, maxletter);
					t.each(function(line){
						if (BookReader.currentline >= maxline || line == '<HR />'){ BookReader.insertPage(); }
						if (line != '<HR />'){
							if (elm.align == 'right'){
								BookReader.pages[BookReader.pages.length-1] += '<P class="'+fontsize+' right">' + line + '</P>';
							} else if (elm.align == 'center'){
								BookReader.pages[BookReader.pages.length-1] += '<P class="'+fontsize+' center">' + line + '</P>';
							} else {
								BookReader.pages[BookReader.pages.length-1] += '<P class="'+fontsize+'">' + line + '</P>';
							}
							BookReader.currentline++;
						}
					});
					break;
				case 'H1':
					if (BookReader.currentline >= maxline-3){ BookReader.insertPage(); }
					BookReader.pages[BookReader.pages.length-1] += '<H1 class="'+fontsize+'">' + elm.innerHTML + '</H1>';
					BookReader.currentline += 3;
					break;
				case 'H2':
					t = BookReader.Utils.dividelines(elm.innerHTML, maxletterH2);
					if (BookReader.currentline >= maxline-t.length*2){ BookReader.insertPage(); }
					t.each(function(line){
						BookReader.pages[BookReader.pages.length-1] += '<H2 class="'+fontsize+'">' + line + '</H2>';
						BookReader.currentline += 2;
					});
					break;
				case 'H3':
					if (BookReader.currentline >= maxline-2){ BookReader.insertPage(); }
					if (BookReader.currentline > 0){
						BookReader.pages[BookReader.pages.length-1] += '<P>&nbsp;</P>';
						BookReader.currentline += 1;
					}
					BookReader.pages[BookReader.pages.length-1] += '<H3 class="'+fontsize+'">' + elm.innerHTML + '</H3>';
					BookReader.currentline += 1;
					break;
				case 'HR':
					if (BookReader.currentline > 0) BookReader.insertPage();
					break;
				case 'IMG':
					w = elm.readAttribute('width'); if (!w || w > BookReader.Theme.LineWidth) w = BookReader.Theme.LineWidth;
					alt = elm.readAttribute('alt');
					temp = '<IMG src="'+elm.readAttribute('src')+'" width="'+w+'" style="margin-top:10px;" />';
					if (alt) temp += '<P class="caption">'+elm.readAttribute('alt')+'</P>';
					if (BookReader.pages.length == 1 && BookReader.pages[0] == ''){ BookReader.pages[0] += temp; BookReader.insertPage(); }//画像が1ページ目の最初にある場合の処理
					else BookReader.ImageStack.push(temp);//画像スタックに入れる。画像は次の改ページの際に挿入される。
					break;
			}
		});
		BookReader.insertAnchor();
		BookReader.insertImage();//画像スタックが残っている場合の処理
	},
	insertPage: function(){
		BookReader.insertAnchor();
		BookReader.insertImage();
		BookReader.pages.push(''); BookReader.currentline = 0;
	},
	insertAnchor: function(){
		if (BookReader.AnchorStack.length){
			BookReader.AnchorStack.each(function(anc){ BookReader.anchors[anc] = BookReader.pages.length-1; });
			BookReader.AnchorStack = [];
		}
	},
	insertImage: function(){
		if (BookReader.ImageStack.length){
			BookReader.ImageStack.each(function(image){ BookReader.pages.push(image); });
			BookReader.ImageStack = [];
		}
	},
	showPages: function(){
		var html = '';
		var t = 0.40;//ボタンの透明度
		BookReader.pages.each(function(page, index){
			html += '<DIV class="page"><DIV class="box">' + page + '</DIV><SPAN class="folio">'+(index+1)+'</SPAN></DIV>'; 
		});
		html = '<DIV style="width:'+ (BookReader.pages.length*(BookReader.Theme.PageWidth+1)+BookReader.Theme.PageMarginLeft) +'px" id="br_container">' + html + '</DIV>';
		html += '<A class="br_nav_button" id="br_nav_prev2" href="#" title="'+BookReader.Language.ButtonTitleGoToPrev2.replace('#',BookReader.Theme.Columns)+'" onclick="BookReader.go2prev2();return false;" onmouseover="new Effect.Opacity (this,{from:'+t+', to:0.99, duration:0.2})" onmouseout="new Effect.Opacity (this,{from:0.99, to:'+t+', duration:1.0})">&nbsp;</A>';
		html += '<A class="br_nav_button" id="br_nav_prev" href="#" title="'+BookReader.Language.ButtonTitleGoToPrev+'" onclick="BookReader.go2prev();return false;" onmouseover="new Effect.Opacity (this,{from:'+t+', to:0.99, duration:0.2})" onmouseout="new Effect.Opacity (this,{from:0.99, to:'+t+', duration:1.0})">&nbsp;</A>';
		html += '<A class="br_nav_button" id="br_nav_next" href="#" title="'+BookReader.Language.ButtonTitleGoToNext+'" onclick="BookReader.go2next();return false;" onmouseover="new Effect.Opacity (this,{from:'+t+', to:0.99, duration:0.2})" onmouseout="new Effect.Opacity (this,{from:0.99, to:'+t+', duration:1.0})">&nbsp;</A>';
		html += '<A class="br_nav_button" id="br_nav_next2" href="#" title="'+BookReader.Language.ButtonTitleGoToNext2.replace('#',BookReader.Theme.Columns)+'" onclick="BookReader.go2next2();return false;" onmouseover="new Effect.Opacity (this,{from:'+t+', to:0.99, duration:0.2})" onmouseout="new Effect.Opacity (this,{from:0.99, to:'+t+', duration:1.0})">&nbsp;</A>';
		html += '<TABLE id="br_pagenation" cellspacing="0">';
		BookReader.pages.each(function(page, index){
			html += '<TD id="br_pagenation_'+index+'" onclick="BookReader.go2page('+index+');"></TD>'; 
		});
		html += '</TABLE>';
		html = '<DIV id="br_fixedframe">' + html + '</DIV>';
		BookReader.dom.innerHTML = html;
		
		//ナビゲーションボタンに透明度を設定
		setTimeout("new Effect.Opacity ('br_nav_prev2',{ from:0.00, to:"+t+", duration:1.0});", 200);
		setTimeout("new Effect.Opacity ('br_nav_prev',{ from:0.00, to:"+t+", duration:1.0});", 200);
		setTimeout("new Effect.Opacity ('br_nav_next2',{ from:0.00, to:"+t+", duration:1.0});", 200);
		
		//NEXTボタンだけ瞬かせる
		if (BookReader.pages.length <= 1){
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.00, to:"+t+", duration:1.0});", 200);
		} else {
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.00, to:0.99, duration:0.7});", 200);
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.99, to:0.00, duration:0.7});", 1000);
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.00, to:0.99, duration:0.7});", 1800);
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.99, to:0.00, duration:0.7});", 2600);
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.00, to:0.99, duration:0.7});", 3400);
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.99, to:0.00, duration:0.7});", 4200);
			setTimeout("new Effect.Opacity ('br_nav_next',{ from:0.00, to:"+t+", duration:0.7});", 5000);
		}
	},
	go2anchor: function(anc){//ページ内ジャンプ
		if ((anc = anc.replace('#','')) && (BookReader.anchors[anc] || BookReader.anchors[anc] == 0)){
			p = BookReader.anchors[anc];
			if (p <= BookReader.currentpage) p++;
			setTimeout("BookReader.go2page("+p+")",200);
		}
	},
	go2prev2: function(){ BookReader.go2page(BookReader.currentpage-BookReader.Theme.Columns+1); },
	go2prev: function(){ BookReader.go2page(BookReader.currentpage); },
	go2next: function(){ BookReader.go2page(BookReader.currentpage+1); },
	go2next2: function(){ BookReader.go2page(BookReader.currentpage+BookReader.Theme.Columns); },
	go2first: function(){ BookReader.go2page(0); },
	go2last: function(){ BookReader.go2page(BookReader.pages.length-1); },
	go2page: function(p){
		container = $('br_container');
		if (!BookReader.NowLoading && p <= BookReader.currentpage) BookReader.currentpage = p - 1;
			else BookReader.currentpage = p;
		
		if (BookReader.currentpage < 0){
			BookReader.currentpage = 0;
			new Effect.Move (container,{ x: BookReader.Theme.PageMarginLeft-30, y: 0, mode: 'absolute', duration: 0.2});
			setTimeout("new Effect.Move (container,{ x: BookReader.Theme.PageMarginLeft, y: 0, mode: 'absolute', duration: 0.2})", 200);
		} else if (BookReader.currentpage > BookReader.pages.length-1){
			BookReader.currentpage = BookReader.pages.length-1;
			new Effect.Move (container,{ x: -(BookReader.currentpage*(BookReader.Theme.PageWidth+1)-BookReader.Theme.PageMarginLeft+30), y: 0, mode: 'absolute', duration: 0.2});
			setTimeout("new Effect.Move (container,{ x: -(BookReader.currentpage*(BookReader.Theme.PageWidth+1)-BookReader.Theme.PageMarginLeft), y: 0, mode: 'absolute', duration: 0.2})", 200);
		} else {
			new Effect.Move (container,{ x: -(BookReader.currentpage*(BookReader.Theme.PageWidth+1)-BookReader.Theme.PageMarginLeft), y: 0, mode: 'absolute', duration: 0.5});
		}
	
		
		//ページマーカーの移動
		BookReader.pages.each(function(page, p){
			$('br_pagenation_'+p).style.backgroundColor = '';
		});
		if ($('br_pagenation_'+BookReader.currentpage)) $('br_pagenation_'+BookReader.currentpage).style.backgroundColor = '#999999';
		if ($('br_pagenation_'+(BookReader.currentpage+1))) $('br_pagenation_'+(BookReader.currentpage+1)).style.backgroundColor = '#999999';
	},
	setKeyEvent: function(){
		Event.observe(document, 'keydown', function(e) {
			var c = (e.charCode) ? e.charCode : e.keyCode;
			switch (c){
				case 63232: case 63276: case 33: case 66: case Event.KEY_UP: BookReader.go2prev2();return false;//[↑]キー
				case 63233: case 63277: case 32: case 34: case Event.KEY_DOWN: BookReader.go2next2();return false;//[↓]キー
				case 63234: case 80: case Event.KEY_LEFT: BookReader.go2prev();return false;//[→]キー
				case 63235: case 78: case Event.KEY_RIGHT: BookReader.go2next();return false;//[←]キー
				case 63273: case 36: BookReader.go2first();return false;//[home]キー
				case 63275: case 35: BookReader.go2last();return false;//[end]キー
				//default: alert(e.keyCode);
			}
		});
	},
	changeFontSize: function(size){
		size = (size == 'L' || size == 'M') ? size : 'S';
		if (size == BookReader.Theme.FontSize)
			return;
		BookReader.FontSize = size;
		BookReader.updatePages();
		if (BookReader.CookieManager){
			BookReader.CookieManager.setCookie('bookreader.fontsize', size);
		}
	},
	loadCookie: function(){
		if (typeof CookieManager=='undefined')
			return;
		
		BookReader.CookieManager = new CookieManager();
		var size = BookReader.CookieManager.getCookie('bookreader.fontsize');
		if (size == 'L' || size == 'M') BookReader.FontSize = size;
	},
	deactivate: function(){
		BookReader.dom.style.display = 'none';
		BookReader.original.style.display = 'block';
	},
	activate: function(){
		BookReader.dom.style.display = 'block';
		BookReader.original.style.display = 'none';
	}
};

BookReader.Utils = {
	/**
	 * 指定文字数ごとに(禁則処理あり)、文字列を分割する
	 */
	dividelines: function(str, maxletter) {
		var kinsokuOkuri = '「『（〈([{';//禁則処理で次行に送る文字
		var kinsokuModoshi = '。、」』）〉.,!)]}';//禁則処理で前行へ戻す文字
		str = escape(str);//文字種判別のためにエスケープ
		lines = [];
		pos = 0, n = 0, len = 0, dif = 1, w = 1, tag = false, tagstr = '', tagpos = -1, entity = false, entstr = '', nobr = false;
		while (pos < str.length) {
			/*Unicode文字 (例:%u0000): 6桁-全角*/ if (str.charAt(pos) == "%" && str.charAt(pos+1) == "u") { dif = 6, w = 2; }
			/*英数字以外   (例:%00)   : 3桁-半角*/ else if (str.charAt(pos) == "%") { dif = 3, w = 1; }
			/*英数字      (例:A)     : 1桁-半角*/ else { dif = 1, w = 1.1; }
			c = unescape(str.substr(pos, dif)); //調査する文字
			if (c == '<'){ tag = true; tagpos = pos; }//タグ開始
			if (!tag && c == '&'){ entity = true; }//実体参照開始
			if (tag){ tagstr += c; pos += dif; len += 0; }//タグの内部
			else if (entity){ entstr += c; pos += dif; len += 0; }//実体参照の内部
			else {
				if (len == 0 && pos > 0　&& kinsokuModoshi.indexOf(c) > -1){//2行目以降の行頭で、禁則処理(前行への戻し)
					lines[lines.length-1] += c; pos += dif; len = 0; n = pos;
				} else {
					if (len == 0){ lines.push(c); }　else { lines[lines.length-1] += c;　}
					pos += dif; len += w; nobr = false;
				}
			}
			if (c == '>' && tagstr != ''){//タグの処理
				tagname = tagstr.match(/\w+/i).toString().toUpperCase();//タグの名称 (大文字で)
				closing = (null != tagstr.match(/\/\w+/i));//閉じタグかどうか
				o = '';
				getAtt = function(str, attlist){//属性値の取得関数
					temp = {};
					attlist.split(',').each(function(attname){
						r = new RegExp(attname + '=\"([^\"]*)\"', 'i');
						r2 = new RegExp(attname + '=([^\"\s>]+)', 'i');
						if (t = str.match(r)){
							temp[attname] = t[1];
						} else if (t = str.match(r2)){
							temp[attname] = t[1];
						} else {
							temp[attname] = '';
						}
					});
					return temp;
				};
				switch (tagname){
					case 'SPAN':
					case 'STRONG':
					case 'STRIKE':
					case 'EM':
					case 'I':
					case 'B':
					case 'DEL':
						o = tagstr; break;
					case 'A':
						if (closing){
							o = tagstr;
						} else {
							att = getAtt(tagstr, 'name,href,target');
							if (att.name) BookReader.AnchorStack.push(att.name);
							o = '<a';
							if (att.href){
								o += ' href="'+att.href+'"';
								if (att.target) o += ' target="'+att.target+'"';
								if ((!att.target || att.target == '_self') && (null != att.href.match(/^#/i)))
									o += ' onclick="BookReader.go2anchor(\''+att.href+'\');"';
							}
							o += '>';
						}
						break;
					case 'BR':
						if (nobr){nobr = false} else {o = tagstr}; break;
					case 'HR':
						lines.push('<HR />'); len = 0; break;
					case 'IMG':
						letterwidth = BookReader.Theme.LineWidth / BookReader.Theme[BookReader.FontSize].MaxLetter;
						att = getAtt(tagstr, 'src,width,alt,class');
						if (!att.width) att.width = letterwidth*2.0;
						if (att['class'] != 'illustration'){
							o = '<img src="'+att.src+'" style="" width="'+att.width+'" alt="'+att.alt+'">';
							len += att.width/letterwidth;
						}
						break;
				}
				if (o){ if (len == 0){ lines.push(o); } else { lines[lines.length-1] += o;　} len += 0.1; }//TODO: +0.1はアドホックなので直すこと
				if (tagname == 'BR'){ len = 0; n = pos; }
				tag = false; tagstr = ''; tagpos = -1;
			}
			if (entity && c == ';'){//実体参照の処理
				if (len == 0){ lines.push(entstr); } else { lines[lines.length-1] += entstr;　}
				len += 1; entity = false; entstr = '';
			}
			if (len >= maxletter || pos == str.length){//行末に達したら...
				if (kinsokuOkuri.indexOf(c) > -1){//禁則処理(後行への送り)
					lines[lines.length-1] = lines[lines.length-1].substr(0,lines[lines.length-1].length-1);
					n = pos-dif; len = w; lines.push(c);
				}
				else { n = pos; len = 0; }
				nobr = true;
			}
		}
		return lines;
	}
};

BookReader.loadTheme();
Event.observe(window, 'load', function() {
	BookReader.autoload();
});