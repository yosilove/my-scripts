//-- 関数定義 --//
//bookinfoに本の情報を表示
function info(id) {
	document.getElementById('bookinfo').innerHTML = document.getElementById(id+'info').innerHTML;
}

//bookinfoに本棚のタイトルを表示
function link() {
	document.getElementById('bookinfo').innerHTML = document.getElementById('booklog_info').innerHTML;
}

function my_booklog(obj) {
//objにはBookLogからのデータが入ってる（たぶん）

	function dispBook(book,top,left,width,height){
/*本のデータの例
//{"id":"25161189","asin":"4757509499","url":"http:\/\/booklog.jp\/users\/yosilove\/archives\/4757509499","title":"ZOMBIE-LOAN 1 (\u30ac\u30f3\u30ac\u30f3\u30d5\u30a1\u30f3\u30bf\u30b8\u30fc\u30b3\u30df\u30c3\u30af\u30b9)","author":"PEACH-PIT","image":"http:\/\/ecx.images-amazon.com\/images\/I\/51pfjYeYjxL._SL75_.jpg","width":"53","height":"75","catalog":"Books"}
*/
		var contents = '<span class="book" ';
		contents += 'style="position:relative;margin:10px;" onmouseover="info(\''+book.asin+'\')" onmouseout="link()" ';
		contents += 'top:' + top + 'px;left:' + left + 'px;">';
		contents += '<a href="' + book.url + '" target="_blank" title="' + book.title + '">';
		contents += '<img src="' + book.image + '" border="0" width="' + width + '" height="' 
		+ height + '" style="border-width:0;margin:0;padding:0;vertical-align:bottom;display:inline;"/>';
		contents += '</a>';
		contents += '</span>';
		
		contents += '<span id="'+book.asin+'info" style="display:none">';
		
		contents += "["+book.author+"] "+book.title;
		
		contents += '</span>';
		
		return contents;
	}
	
	/* 棚一段分を表示 */
	function dispShelf(books,shelf_no,book_num){
		//画像データのURLを取得
		var no_image = 'http://widget.booklog.jp/blogparts/images/common/noimage.gif';
		
		var top = 10;
		var left = 10;
		var width = 60;
		var height = 86;
		
		var contents='';
		contents+='<div class="shelf" id="self'+shelf_no+'">';
		
		//取得した本のデータを処理する
		for (var i = shelf_no*book_num; i < shelf_no*book_num+book_num; i++) {
	
			if(!books[i]){ break ; }
			if (books[i].catalog == 'Music') {
				top = 20;
				height = 60;
			}
 
			if (!books[i].image) { books[i].image = no_image;}

			//本一冊ずつの処理
			if (books[i].url) {
				contents += dispBook(books[i],top,left,width,height);
			}
		}
		contents+='</div>';
		return contents;
	}
		
	/**
		ここからスクリプト
	*/
		
	//id=booklog_minishelfなところにアクセス
	if (document.getElementById('my_booklog') != null) {
		var src      = document.getElementById('my_booklog').src;
		var query    = src.split("?");
		var template = query[1];
		
		var book_num = parseInt(query[2]);//一段あたりの冊数
		var shelf_num = parseInt(query[3]);//棚の段数
		
		//alert('book'+book_num+' shelf'+shelf_num);
    }
	
	
    var tana     = obj.tana;
    var category = obj.category;
    var books    = obj.books;
    
	var html = '';
	
	// - ここから本棚表示
	html+='<div class="bookshelf">';
	
	// -- ここからタイトルの表示
	var booklog_title = '<a href="http://booklog.jp/users/'+tana.account+'" style="text-decoration:none;">'
	+'<font color="black">'+tana.name+'</a></a>';
	html += '<span id="booklog_info" style="display:none" >'+booklog_title+'</span>';
	html+='<div id="bookinfo">';
	html+=booklog_title;
	html+='</div>';
	// -- ここまでタイトルの表示
	
	// -- ここから棚の表示
	var max_shelf = Math.floor(books.length/book_num);
	//棚の表示順は時間ごとにかわる
	var today = new Date();	
	var shelf_no = Math.floor(today.getMinutes()%(max_shelf+1));
	
	for(var shelf_count=0;shelf_count < shelf_num;shelf_count++){
		html+= dispShelf(books,shelf_no,book_num);
		shelf_no++;
		if(shelf_no == max_shelf){shelf_no=0;}
	}
	// -- ここまで棚の表示
	
	html+='</div>';
	// - ここまで本棚表示
	

    document.write(html);

}
