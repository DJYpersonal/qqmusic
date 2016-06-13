var fs = require('fs');
var minglinghang = require('child_process');
var files = fs.readdirSync('./music/');

var format_duration = function(str){
	var num = Number(str);
	var minute = parseInt(num / 60);
	var second = Math.round(num % 60);
	minute = (minute < 10) ? '0' + minute : minute;
	second = (second < 10) ? '0' + second : second;
	return minute + ':' + second;
}

var result = [];
files.forEach(function(v){
	var _data = JSON.parse( minglinghang.execSync('ffprobe -v quiet -print_format json -show_format "./music/'+ v + '"') );
	var duration = format_duration( _data.format.duration );
    var data = {
    	filename : _data.format.filename,
    	duration : duration,
    	title : _data.format.tags.title,
    	album : _data.format.tags.album,
    	artist : _data.format.tags.artist
    };
	result.push( data );

})
fs.writeFile('./databas.json',JSON.stringify(result, null, 2));
