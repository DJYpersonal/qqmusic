$(function(){
	var audio = $('audio').get(0);
	
	var original;
	var spanvolumeop = $('#spanvolumeop');
	var progressop = $('#progressop');

	//播放按钮
	$('#btnplay').on('click',function(){
		if(audio.src.length===26){
			audio.src = database[0].filename;
			currentSong = 0;
			$('#music_name').text(database[0].title);
			$('.music_info_main .singer_name').text(database[0].artist);
			$('.play_date').text(database[0].duration);
			$('.music_op').css('display','block');
		}      
		if(audio.paused){
			onsongchange();
		}else{
			audio.pause();
		}
	})	
	$(audio).on('play',function(){
		$('#btnplay').removeClass('play_bt').addClass('pause_bt');
	})
	$(audio).on('pause',function(){
		$('#btnplay').removeClass('pause_bt').addClass('play_bt');
	})

    //点击控制音量
    $('#spanvolume').on('click',function(e){
    	audio.volume = e.offsetX / $(this).width();
    })
    $(audio).on('volumechange',function(){
    	if( audio.volume === 0 ){
    		$('#spanmute').removeClass('volume_icon').addClass('volume_mute');
    	}else{
    		$('#spanmute').removeClass('volume_mute').addClass('volume_icon');
    	}
    	var left = audio.volume.toFixed(2)*100 + '%';
    	$('.volume_op').css('left',left);
    	$('.volume_bar').css('width',left);
    })

    //静音
    $('#spanmute').on('click',function(){
    	if( audio.volume === 0){
    		audio.volume = original;
    	}else{
    		original = audio.volume;
    		audio.volume = 0;
    	}
    })

    //拖动控制音量
    spanvolumeop.on('mousedown',function(e){
    	e.preventDefault();
    	$(document).on('mousemove',function(e){
    		var a = (e.clientX - spanvolume.getBoundingClientRect().left)/spanvolume.offsetWidth;
    		if( a>=0 && a<=1){
    			audio.volume = a;
    		}
    	})
    	$(document).on('mouseup',function(){
    		$(document).off('mousemove');
    		$(document).off('mouseup');
    	})
    })
    spanvolumeop.on('click',function(e){
    	e.stopPropagation();
    })

    //单击控制时间
    $('.player_bar').on('click',function(e){
    	audio.currentTime = audio.duration * (e.offsetX / $(this).width());
    	
    })
    $(audio).on('timeupdate',function(){
    	var percent = (this.currentTime / this.duration).toFixed(2)*100 + '%';
    	$('.progress_op').css('left',percent);
    	$('.current_bar').css('width',percent);
    })

    var format_duration = function(str){
       var num = Number(str);
       var minute = parseInt(num / 60);
       var second = Math.round(num % 60);
       minute = (minute < 10) ? '0' + minute : minute;
       second = (second < 10) ? '0' + second : second;
       return minute + ':' + second;
   }
   var time_show = $('#time_show');
   $('.player_bar').on('mouseenter',function(e){
       time_show.parent().css('display','block');
       audio.currentTime = audio.duration * (e.offsetX / $(this).width());
       time_show.text( format_duration(audio.currentTime) );
       var left = e.clientX - 0.5 * time_show.offsetWidth;
       console.log(left)
       time_show.parent().css('left',left); 

   })


    //拖动控制时间
    progressop.on('mousedown',function(e){
    	e.preventDefault();
    	$(document).on('mousemove',function(e){
    		var b = e.clientX /bgbar.offsetWidth;
    		if( b >= 0 && b<=1 ){ 
    			audio.currentTime = audio.duration * b;
    		}
    	})
    	$(document).on('mouseup',function(){
    		$(document).off('mousemove');
    		$(document).off('mouseup');
    	})
    })
    progressop.on('click',function(e){
    	e.stopPropagation();
    })

    //创建列表
    var database = [];
    $('#spansongnum1 ul').empty();
    var makelist = function(){
    	$.each(database,function(k,v){
    		$('<li class="li" index="0"> <strong class="music_name" title='+ v.title +'>'+ v.title +'</strong> <strong class="singer_name" title='+ v.artist +'>'+ v.artist +'</strong> <strong class="play_time">'+ v.duration +'</strong> <div class="list_cp"> <strong class="btn_like" title="喜欢" name=""> <span>我喜欢</span> </strong> <strong class="btn_share" title="分享"> <span>分享</span> </strong> <strong class="btn_fav" title="收藏到歌单"> <span>收藏</span> </strong> <strong class="btn_del" title="从列表中删除"> <span>删除</span> </strong> </div> </li>')
    		.appendTo($('#divlistmain ul'));
    	})
    	$('#spansongnum1 span').text(database.length);
    }
    $.getJSON('./databas.json').done(function(data){
    	database = data;
    	makelist();
    })

    //点击列表变色，且开始播放音乐
    var onsongchange = function(){
    	audio.play();
    	$('#divsonglist li')
    	.removeClass('play_current')
    	.eq(currentSong)
    	.addClass('play_current');
    }
    var currentSong = 0;
    $('#divsonglist').on('click','li',function(){
    	currentSong = $(this).index();
    	audio.src = database[currentSong].filename;
    	onsongchange();
    	$('#music_name').text(database[currentSong].title);
    	$('.music_info_main .singer_name').text(database[currentSong].artist);
    	$('.play_date').text(database[currentSong].duration);
    	$('.music_op').css('display','block');
    })
    $('#divsonglist').on('mouseenter mouseleave','li',function(){
    	$(this).toggleClass('play_hover');
    })

    //删除
    $('#divsonglist').on('click','.btn_del',function(){
    	var todelete = $('#divsonglist .btn_del').index(this);
    	database = $.grep(database,function(v,k){
    		return k !== todelete;
    	})
    	$(this).closest('li').remove();
    	$('#spansongnum1 span').text(database.length);
    	return false;
    })
    
    //下一首
    $('#nextbt').on('click',function(){
    	currentSong += 1;
    	if( currentSong === database.length ){
    		currentSong = 0;
    	}
    	audio.src = database[currentSong].filename;
    	onsongchange();
    })
    //上一首
    $('#prevbt').on('click',function(){
    	
    	if( currentSong === 0){
    		currentSong = database.length;
    	}
    	currentSong -= 1;
    	audio.src = database[currentSong].filename;
    	onsongchange();
    })

    //清空列表
    $('#clear_list').on('click',function(){
    	$('.play_list_main').css('display','none');
    	$('.play_list_point').css('display','block');
    	$('#spansongnum1 span').text(0);
    })

    //点击设置播放模式
    var
    playbt = 'cycle_bt',
    btnPlayway = $('#btnPlayway'),
    divselect = $('#divselect'),
    child = divselect.find('strong');
    btnPlayway.on('click',function(){
    	divselect.css('display','block');
    })
    for(var i = 0; i<child.length; i++){

        $(child[i]).on('click',function(){
          var classname = $(this).attr('class')
          btnPlayway.attr('class',classname);
          playbt = classname;
          divselect.css('display','none');
      });
    }


//界面处理
    //点击收起
    $('.folded_bt').on('click',function(){
    	divplayframe.css('display','none');
    	if($('.player').hasClass('player_folded')){
    		$(this).parent().removeClass('player_folded');
    		
    	}else{
    		$(this).parent().addClass('player_folded');
    	}
    })

    var divplayframe = $('#divplayframe');
    $('#spansongnum1').on('click',function(){
    	if( divplayframe.css('display') === 'none'){
    		divplayframe.css('display','block').animate({opacity:1},300);
    	}else{
    		divplayframe.css('display','none').animate({opacity:0},300);
    	}
    })

    $('#btnclose').on('click',function(){
    	divplayframe.css('display','none').animate({opacity:0},300);
    })



})