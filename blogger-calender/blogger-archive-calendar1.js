/*
元ソース：http://sites.google.com/site/customizeyourblogger/
より改変
*/


/*  ================================================================================
Blogger Archive Calendar
================================================================================  */
var bcLoadingImage = "http://phydeauxredux.googlepages.com/loading-trans.gif";
var bcLoadingMessage = " Loading....";
var bcArchiveNavText = "View Archive";
var bcArchiveNavPrev = '&#9668;';
var bcArchiveNavNext = '&#9658;';
var headDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var headInitial = ["日","月","火","水","木","金","土"];

// Nothing to configure past this point ----------------------------------
var timeOffset;
var bcBlogID;
var calMonth;
var calDay = 1;
var calYear;
var startIndex;
var callmth;
var bcNav = new Array ();
var bcList = new Array ();

//Initialize Fill Array
var fill = ["","31","28","31","30","31","30","31","31","30","31","30","31"];
function openStatus(){
   document.getElementById('calLoadingStatus').style.display = 'block';
   document.getElementById('calendarDisplay').innerHTML = '';
  }
function closeStatus(){
   document.getElementById('calLoadingStatus').style.display = 'none';
  }
function bcLoadStatus(){
   cls = document.getElementById('calLoadingStatus');
   img = document.createElement('img');
   img.src = bcLoadingImage;
   img.style.verticalAlign = 'middle';
   cls.appendChild(img);
   txt = document.createTextNode(bcLoadingMessage);
   cls.appendChild(txt);
  }
function callArchive(mth,yr,nav){
// Check for Leap Years
  if (((yr % 4 == 0) && (yr % 100 != 0)) || (yr % 400 == 0)) {
      fill[2] = '29';
   }
  else {
      fill[2] = '28';
   }
   calMonth = mth;
   calYear = yr;
   if(mth.charAt(0) == 0){
      calMonth = mth.substring(1);
      }
   callmth = mth;
   bcNavAll = document.getElementById('bcFootAll');
   bcNavPrev = document.getElementById('bcFootPrev');
   bcNavNext = document.getElementById('bcFootNext');
   bcSelect = document.getElementById('bcSelection');
   a = document.createElement('a');
   at = document.createTextNode(bcArchiveNavText);
   a.href = bcNav[nav];
   a.appendChild(at);
   bcNavAll.innerHTML = '';
   bcNavAll.appendChild(a);
   bcNavPrev.innerHTML = '';
   bcNavNext.innerHTML = '';
   if(nav <  bcNav.length -1){
      a = document.createElement('a');
      a.innerHTML = bcArchiveNavPrev;
      bcp = parseInt(nav,10) + 1;
      a.href = bcNav[bcp];
      a.title = 'Previous Archive';
      prevSplit = bcList[bcp].split(',');
      a.onclick = function(){bcSelect.options[bcp].selected = true;openStatus();callArchive(prevSplit[0],prevSplit[1],prevSplit[2]);return false;};
      bcNavPrev.appendChild(a);
      }
   if(nav > 0){
      a = document.createElement('a');
      a.innerHTML = bcArchiveNavNext;
      bcn = parseInt(nav,10) - 1;
      a.href = bcNav[bcn];
      a.title = 'Next Archive';
      nextSplit = bcList[bcn].split(',');
      a.onclick = function(){bcSelect.options[bcn].selected = true;openStatus();callArchive(nextSplit[0],nextSplit[1],nextSplit[2]);return false;};
      bcNavNext.appendChild(a);
     }
   script = document.createElement('script');
   script.src = 'http://www.blogger.com/feeds/'+bcBlogId+'/posts/summary?published-max='+calYear+'-'+callmth+'-'+fill[calMonth]+'T23%3A59%3A59'+timeOffset+'&published-min='+calYear+'-'+callmth+'-01T00%3A00%3A00'+timeOffset+'&max-results=100&orderby=published&alt=json-in-script&callback=cReadArchive';
   document.getElementsByTagName('head')[0].appendChild(script);
}

function cReadArchive(root){
// Check for Leap Years
  if (((calYear % 4 == 0) && (calYear % 100 != 0)) || (calYear % 400 == 0)) {
      fill[2] = '29';
   }
  else {
      fill[2] = '28';
   }
    closeStatus();
    document.getElementById('lastRow').style.display = 'none';
    calDis = document.getElementById('calendarDisplay');
    var feed = root.feed;
    var total = feed.openSearch$totalResults.$t;
    var entries = feed.entry || [];
    var fillDate = new Array();
    var fillTitles = new Array();
    fillTitles.length = 32;
    var ul = document.createElement('ul');
    ul.id = 'calendarUl';
    for (var i = 0; i < feed.entry.length; ++i) {
      var entry = feed.entry[i];
      for (var j = 0; j < entry.link.length; ++j) {
       if (entry.link[j].rel == "alternate") {
       var link = entry.link[j].href;
       }
      }
      var title = entry.title.$t;
      var author = entry.author[0].name.$t;
      var date = entry.published.$t;
      var summary = entry.summary.$t;
      isPublished = date.split('T')[0].split('-')[2];
      if(isPublished.charAt(0) == '0'){
         isPublished = isPublished.substring(1);
         }
      fillDate.push(isPublished);
      if (fillTitles[isPublished]){
          fillTitles[isPublished] = fillTitles[isPublished] + ' | ' + title;
          }
      else {
          fillTitles[isPublished] = title;
          }
      li = document.createElement('li');
      li.style.listType = 'none';
      li.innerHTML = '<a href="'+link+'">'+title+'</a>';
      ul.appendChild(li);

      }
   calDis.appendChild(ul);
   var val1 = parseInt(calDay, 10)
   var valxx = parseInt(calMonth, 10);
   var val2 = valxx - 1;
   var val3 = parseInt(calYear, 10);
   var firstCalDay = new Date(val3,val2,1);
   var val0 = firstCalDay.getDay();
   startIndex = val0 + 1;
  var dayCount = 1;
  for (x =1; x < 38; x++){
      var cell = document.getElementById('cell'+x);
      if( x < startIndex){
          cell.innerHTML = ' ';
          cell.className = 'firstCell';
         }
      if( x >= startIndex){
          cell.innerHTML = dayCount;
          cell.className = 'filledCell';
          for(p = 0; p < fillDate.length; p++){
              if(dayCount == fillDate[p]){
                  if(fillDate[p].length == 1){
                     fillURL = '0'+fillDate[p];
                     }
                  else {
                     fillURL = fillDate[p];
                     }
                  cell.className = 'highlightCell';
                  cell.innerHTML = '<a href="/search?updated-max='+calYear+'-'+callmth+'-'+fillURL+'T23%3A59%3A59'+timeOffset+'&updated-min='+calYear+'-'+callmth+'-'+fillURL+'T00%3A00%3A00'+timeOffset+'" title="'+fillTitles[fillDate[p]].replace(/"/g,'\'')+'">'+dayCount+'</a>';
                 }
              }
          if( dayCount > fill[valxx]){
             cell.innerHTML = ' ';
             cell.className = 'emptyCell'; 
             }
          dayCount++; 
         }
      }
    visTotal = parseInt(startIndex) + parseInt(fill[valxx]) -1;
    if(visTotal >35){
        document.getElementById('lastRow').style.display = '';
       }
  }

function initCal(){
   document.getElementById('blogger_calendar').style.display = 'block';
   var bcInit = document.getElementById('bloggerCalendarList').getElementsByTagName('a');
   var bcCount = document.getElementById('bloggerCalendarList').getElementsByTagName('li');
   document.getElementById('bloggerCalendarList').style.display = 'none';
   calHead = document.getElementById('bcHead');
   tr = document.createElement('tr');
   for(t = 0; t < 7; t++){
       th = document.createElement('th');
       th.abbr = headDays[t];
       scope = 'col';
       th.title = headDays[t];
       th.innerHTML = headInitial[t];
       tr.appendChild(th);
      }
   calHead.appendChild(tr);
  for (x = 0; x <bcInit.length;x++){
     var stripYear= bcInit[x].href.split('_')[0].split('/')[3];
     var stripMonth = bcInit[x].href.split('_')[1];
     bcList.push(stripMonth + ','+ stripYear + ',' + x);
     bcNav.push(bcInit[x].href);
     }
  var sel = document.createElement('select');
  sel.id = 'bcSelection';
  sel.onchange = function(){var cSend = this.options[this.selectedIndex].value.split(',');openStatus();callArchive(cSend[0],cSend[1],cSend[2]);};
  q = 0;
  for (r = 0; r <bcList.length; r++){
       var selText = bcInit[r].innerHTML;
       var selCount = bcCount[r].innerHTML.split('> (')[1];
       var selValue = bcList[r];
       sel.options[q] = new Option(selText + ' ('+selCount,selValue);
       q++
       }                   
   document.getElementById('bcaption').appendChild(sel);
   var m = bcList[0].split(',')[0];
   var y = bcList[0].split(',')[1];
   callArchive(m,y,'0');
 }

function timezoneSet(root){
   var feed = root.feed;
   var updated = feed.updated.$t;
   var id = feed.id.$t;
   bcBlogId = id.split('blog-')[1];
   upLength = updated.length;
   if(updated.charAt(upLength-1) == "Z"){timeOffset = "+00:00";}
   else {timeOffset = updated.substring(upLength-6,upLength);}
   timeOffset = encodeURIComponent(timeOffset);
}


function togglecomments (postid) {
var whichpost = document.getElementById(postid);
if (whichpost.className=="listshown") { whichpost.className="listhidden"; } else { whichpost.className="listshown"; }
}
