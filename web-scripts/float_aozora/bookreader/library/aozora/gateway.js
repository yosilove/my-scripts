var Gateway = {
	load: function(){
		Gateway.params = {};
		query = window.location.search.substring(1);
		query.split('&').each(function(p){ tmp = p.split('=');
		Gateway.params[tmp[0]] = tmp[1]; });

		//if (Gateway.params.card && Gateway.params.file){
			//Gateway.start('http://bookreader.cognitom.com/cards/'+Gateway.params.card+'/files/'+Gateway.params.file+'.html');
		if (Gateway.params.url){
			Gateway.start(Gateway.params.url);
		}
	},
	start: function(url){
		new Ajax.Request(url, { method: 'get',
			onSuccess: function(transport){
				source = (tmp = transport.responseText.replace(/[\n\r]/ig, '').match(/body>(.+)<\/body/i)) ? tmp[1] : '';

				//source = source.replace(/\.\.\/\.\.\/\.\.\/gaiji/ig, 'http://www.aozora.gr.jp/gaiji');
				//source = source.replace(/src=\"fig/ig, 'src=\"http://www.aozora.gr.jp/cards/'+Gateway.params.card+'/files/fig');
				//source = source.replace(/<img[^>]+class=\"illustration\"[^>]+>/ig, '</div>$0<div>');
				//source = source.replace(/<!--.*-->/ig, '');
				//source = source.replace(/［＃改ページ］/ig, '<hr />');

				BookReader.original.innerHTML = source;
				BookReader.updatePages();
			}
		});
	}
}
Event.observe(window, 'load', function(){ Gateway.load(); });
