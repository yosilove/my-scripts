#Evernoteのバックアップファイル（.enex）をHashに格納するスクリプト
#試しに作り中
# gitに登録されるのか？

require 'kconv'
require "rexml/document"

doc = nil 
File.open("mynote.enex") {|fp| 
  doc = REXML::Document.new fp 
} 

book = Array.new

#ノートごとに処理
#エレメントを読み込む
doc.elements.each("en-export/note") { |note|
	page = Hash.new

	#タイトル
	title = note.elements["title"].text
	page['title'] = title

	#タグ
	tags = Array.new
	note.elements.each("tag") { |tag| tags << tag.text}
	page['tags'] = tags

	#筆者
	author_temp = note.elements["note-attributes"].elements["author"]
	author = author_temp.text if author_temp!=nil
	page['author'] = author


	#関連URL
	sourceUrl = note.elements["note-attributes"].elements["source-url"]
	url = sourceUrl.text if sourceUrl != nil
	page['url'] = url
	
	#作成日と更新日
	created_unix = note.elements["created"].text
	created = Time.at(created_unix.to_i)
	updated_unix = note.elements["updated"].text
	updated = Time.at(updated_unix.to_i)
	
	page['create'] = created.to_s
	page['update'] = updated.to_s

	#内容をplain text形式で
	content = note.elements["content"].text.toutf8
	content.gsub!(/\n/,"");
	content.gsub!(/<br\/>/,"\n");
	content.gsub!(/<\/?[^>]*>/,"");

	page['content'] = content

	book << page
}

p book
