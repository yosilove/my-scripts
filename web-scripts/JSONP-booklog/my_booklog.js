//-- $B4X?tDj5A(B --//
//bookinfo$B$KK\$N>pJs$rI=<((B
function info(id) {
	document.getElementById('bookinfo').innerHTML = document.getElementById(id+'info').innerHTML;
}

//bookinfo$B$KK\C*$N%?%$%H%k$rI=<((B
function link() {
	document.getElementById('bookinfo').innerHTML = document.getElementById('booklog_info').innerHTML;
}

function my_booklog(obj) {
//obj$B$K$O(BBookLog$B$+$i$N%G!<%?$,F~$C$F$k!J$?$V$s!K(B

	function dispBook(book,top,left,width,height){
/*$BK\$N%G!<%?$NNc(B
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
	
	/* $BC*0lCJJ,$rI=<((B */
	function dispShelf(books,shelf_no,book_num){
		//$B2hA|%G!<%?$N(BURL$B$r<hF@(B
		var no_image = 'http://widget.booklog.jp/blogparts/images/common/noimage.gif';
		
		var top = 10;
		var left = 10;
		var width = 60;
		var height = 86;
		
		var contents='';
		contents+='<div class="shelf" id="self'+shelf_no+'">';
		
		//$B<hF@$7$?K\$N%G!<%?$r=hM}$9$k(B
		for (var i = shelf_no*book_num; i < shelf_no*book_num+book_num; i++) {
	
			if(!books[i]){ break ; }
			if (books[i].catalog == 'Music') {
				top = 20;
				height = 60;
			}
 
			if (!books[i].image) { books[i].image = no_image;}

			//$BK\0l:}$:$D$N=hM}(B
			if (books[i].url) {
				contents += dispBook(books[i],top,left,width,height);
			}
		}
		contents+='</div>';
		return contents;
	}
		
	/**
		$B$3$3$+$i%9%/%j%W%H(B
	*/
		
	//id=booklog_minishelf$B$J$H$3$m$K%"%/%;%9(B
	if (document.getElementById('my_booklog') != null) {
		var src      = document.getElementById('my_booklog').src;
		var query    = src.split("?");
		var template = query[1];
		
		var book_num = parseInt(query[2]);//$B0lCJ$"$?$j$N:}?t(B
		var shelf_num = parseInt(query[3]);//$BC*$NCJ?t(B
		
		//alert('book'+book_num+' shelf'+shelf_num);
    }
	
	
    var tana     = obj.tana;
    var category = obj.category;
    var books    = obj.books;
    
	var html = '';
	
	// - $B$3$3$+$iK\C*I=<((B
	html+='<div class="bookshelf">';
	
	// -- $B$3$3$+$i%?%$%H%k$NI=<((B
	var booklog_title = '<a href="http://booklog.jp/users/'+tana.account+'" style="text-decoration:none;">'
	+'<font color="black">'+tana.name+'</a></a>';
	html += '<span id="booklog_info" style="display:none" >'+booklog_title+'</span>';
	html+='<div id="bookinfo">';
	html+=booklog_title;
	html+='</div>';
	// -- $B$3$3$^$G%?%$%H%k$NI=<((B
	
	// -- $B$3$3$+$iC*$NI=<((B
	var max_shelf = Math.floor(books.length/book_num);
	//$BC*$NI=<(=g$O;~4V$4$H$K$+$o$k(B
	var today = new Date();	
	var shelf_no = Math.floor(today.getMinutes()%(max_shelf+1));
	
	for(var shelf_count=0;shelf_count < shelf_num;shelf_count++){
		html+= dispShelf(books,shelf_no,book_num);
		shelf_no++;
		if(shelf_no == max_shelf){shelf_no=0;}
	}
	// -- $B$3$3$^$GC*$NI=<((B
	
	html+='</div>';
	// - $B$3$3$^$GK\C*I=<((B
	

    document.write(html);

}
