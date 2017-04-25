
var $musicBox = $('.musicBox');
var $header = $musicBox.find('.header');
var header = document.getElementsByClassName('header')[0];
var $footer = $musicBox.find('.footer');
var $main = $musicBox.find('.main');
var $lyric = $main.find('.lyric');
var audio = $musicBox.find('audio')[0] ; //dom 原生对象
var $totalTime = $footer.find('.tatalTime');
var $play = $header.find('.play');
var $paused = $header.find('.paused');
var $currentTime = $footer.find('.currentTime');
var $span = $footer.find('.progressBar span');


// 重新计算main的高度
var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
var mainHeight = winHeight - $header.get(0)/*dom*/.offsetHeight - $footer[0].offsetHeight - 0.8*htmlFontSize;
$main.css('height',mainHeight);

//获取歌词然后添加到页面中
function getData(){
    $.ajax({
        type : 'get',
        url : 'lyric1.json?_='+Math.random(),
        async : false,
        dataType : 'json',
        success : function (res) { // res就是获取回来的数据
            if(res.code == 0 ){
                window.data = res.lyric; // 把获取到的数据添加到全局变量中
            }
        }
    });
}
getData();
console.log(window.data);
// 把data添加到页面的歌词部分
function bindData(){
    if(window.data && data.length){
        // {content:'歌词内容', id:1 , minute: '分钟', second : '秒'}
        var str = '';
        $.each(data,function (index,item){
            str += '<p id="'+ item.id +'"  minute="'+ item.minute +'" second="'+ item.second +'">'+ item.content +'</p>';
        });
        $lyric.html(str);
    }
}
bindData();

//自动播放

function autoPlay() {
    audio.play();
    audio.oncanplay = function () { //当可以播放的时刻触发事件
        //可以播放之后就可以获取当前媒体文件的总时长
        //audio.duration  当前媒体文件的时长
        $totalTime.html(formatTime(audio.duration));
        //只要能播放了，就让暂停按钮显示，播放消失
        $play.css('display','none');
        $paused.css('display','none');
    }
}
audio.play();


function formatTime(s) {
    var min = Math.floor(s/60);
    var sec = Math.floor(s - min*60);
    min = min <10 ? '0'+min:min;
    sec = sec <10 ? '0'+sec:sec;
    return min + ':'+sec;

}
var timer = window.setInterval(updataProgress,1000);
var $lyricP = $lyric.find('p');
function updataProgress() {
    var currentTime = audio.currentTime;
    $currentTime.html(formatTime(currentTime)); //
    $span.css('width',currentTime/audio.duration*100 + '%');
    var min = formatTime(currentTime).split(':')[0];
    var sec = formatTime(currentTime).split(':')[1];
    $lyricP.filter('[minute = "'+min+'"][second="'+sec+'"]').addClass('cur').siblings().removeClass('cur');  //filter 自带的过滤的方法  其中【】 是属性过滤
}