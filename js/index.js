
var header = document.getElementsByClassName('header')[0];
var footer = document.getElementsByClassName('footer')[0];
var main = document.getElementsByClassName('main')[0];
// 先通过js来求出Main的高度
;(function (){
    var winH = document.documentElement.clientHeight || document.body.clientHeight;
    var val = winH - header.offsetHeight - footer.offsetHeight - (0.4*2)*htmlFontSize;
    main.style.height = val + 'px'; //把计算出的值赋值给main的height样式
})();

//
var music = (function (){
    var data = null;
    var lyric = document.getElementsByClassName('lyric')[0]; // 获取歌词盒子
    var audio = document.getElementsByClassName('audio')[0]; // 音频
    var play = document.getElementsByClassName('play')[0]; // 播放按钮
    var pause = document.getElementsByClassName('pause')[0]; // 暂停按钮
    var totalTime = document.getElementsByClassName('totalTime')[0]; // 总时长
    var currentTime = document.getElementsByClassName('currentTime')[0]; // 当前播放时间
    var progressBarSpan = document.getElementsByClassName('progressBar')[0].getElementsByTagName('span')[0]; // 绿色进度条
    var lyricPs = lyric.getElementsByTagName('p'); //获取歌词下所有行，每一行歌词都是p



    function getData(){
        var xhr = new XMLHttpRequest();
        xhr.open('get','lyric1.json?_='+Math.random(),false);
        xhr.onreadystatechange = function (){
            if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
                data = JSON.parse(xhr.responseText);
            }
        }
        xhr.send(null);
    }
    function bindData(){
        if(data && data.lyric){
            // [{id: 1, content: '歌词', minute: '04', second : '58'}...]
            data = data.lyric; // 从这行开始data开始代表那个数组
            var str = '';
            for(var i = 0; i < data.length; i++){
                var curData = data[i]; //每一条
                str += '<p  data.txt-sec="'+ curData.second +'"  data.txt-min="'+ curData.minute +'"   id="'+ curData.id +'" >'+ curData.content +'</p>';
            }
            lyric.innerHTML = str;
        }
    }
    function autoPlay(){
        audio.play(); // audio这种媒体标签独有的方法 => 播放
        audio.oncanplay = function (){
            // 这个事件只要audio可以播放就能触发
            //console.log(audio.duration); //306.317642
            // audio.duration属性就是当前这个audio的时长
            // 把这个时间还需要转化成分钟和秒，赋值总时长
            totalTime.innerHTML = formatTime(audio.duration);
            play.style.display = 'none'; // 播放按钮隐藏
            pause.style.display = 'block'; //暂停按钮显示
        }
    }
    function btnEvent(){
        /*这个事件还需要晚上,tap*/
        play.onclick = pause.onclick = function (){
            // audio.paused返回一个布尔值
            if(audio.paused){ // 如果是暂停
                audio.play();
                pause.style.display = 'block';
                play.style.display = 'none';
            }else{ // 播放
                audio.pause();
                pause.style.display = 'none';
                play.style.display = 'block';
            }
        }
    }
    function formatTime(s){
        //306.317642 => 05:06
        var min = Math.floor(s/60); // 向下取整
        var sec = Math.floor(s - min*60); // 秒
        min < 10 ? min = '0' + min : void 0;
        sec < 10 ? sec = '0' + sec : void 0;
        return min + ':' + sec;
    }
    function playStatus(){
        // 当前播放时间要跟新，进度条，歌词
        // audio.currentTime这个属性就是当前audio的播放时长
        var timer = window.setInterval(function (){
            if(audio.currentTime >= audio.duration){
                window.clearInterval(timer); // 当播放时间大于总时间清空定时器
                return;
            }
            currentTime.innerHTML = formatTime(audio.currentTime); // 每1s更换当前播放时间
            progressBarSpan.style.width = audio.currentTime/audio.duration*100 + '%';
            // 把对应的歌词添加选中样式
            // '00:55'.split(':') => ['00','55']
            var min = formatTime(audio.currentTime).split(":")[0]; // 当前播放的分
            var sec = formatTime(audio.currentTime).split(":")[1]; // 当前播放的秒
            // 在所有的歌词行p中挑出和min还有sec对应上的那个,添加一个绿色样式
            for(var i = 0; i < lyricPs.length; i++){
                //<p data.txt.txt.txt-sec="02" data.txt.txt.txt-min="00" id="1">模特 </p>
                var curP = lyricPs[i]; // 每一个p
                if(curP.getAttribute('data.txt-min') == min && curP.getAttribute('data.txt-sec') == sec){
                    // 如果这个条件成立说就是要找对应分和秒的那个p
                    for(var j=0; j<lyricPs.length; j++){
                        // 把以前已经存在bg的样式清空
                        lyricPs[j].className = '';
                        //lyricPs[j].className = i == j ? 'bg' : '';
                    }
                     curP.className = 'bg'; // 添加选中样式
                    if(curP.id >= 4){ // 当这个选中的p的id>=4的时候我们开始让lyric的top值变化
                        lyric.style.top = - (curP.id - 3)*0.84*htmlFontSize + 'px';
                    }
                    break; // 找到了之后就不用继续循环了
                }

            }




        },1000);




    }


    return {
        init : function (){
            // 刷新浏览器之后立刻要执行的函数
            // 获取歌词数据
            getData();
            // 绑定数据
            bindData(); // 页面中已经存在歌词
            // 自动播放
            autoPlay();
            // 给按钮绑定事件
            btnEvent();
            // 播放状态
            playStatus();
        }
    }
})();

music.init(); //刷新浏览器会默认执行music.init方法


