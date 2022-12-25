/*
 TODO :
 video play list settings 
 alarm
*/
/*
Jam Sholat 2 Alpha
Author : susilonurcahyo@gmail.com

Copyright 2021 Susilo Nurcahyo

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Credits :
Adhan -  MIT License
Bootstrap -  MIT License
jQuery -  MIT License
Moment js -  MIT License
Moment-Hijri -  MIT License
The Roboto Light Fonts -  Apache License, Version 2.0. 
CKEditor 4
*/

console.log('app starting...');

var global = localStorage.configuration != null ? JSON.parse(localStorage.configuration) : null;
var firstInstallation = false;

if (global == null) {
    firstInstallation = true
    global = {
        locale : 'id',
        calculation : 0,
        latlngdata : '-6.224655537226517, 106.80679437749554',    
        fajrAngle : 19.5,
        ishaAngle : 17.5,
        madhab : 'syafii',
        minuteadjustment : 2, 
        imsak : 10,
        timeintowarning : 10, // imsak
        prayertimewarning : 1,
        isadhan: false,
        iqomahtime : 5,
        isiqomah: false,
        prayduration : 10, 
        ispraying: false,
        isjumat: false,
        currentpray: '',
        namamasjid: 'Nama Masjid',
        alamatmasjid: 'Alamat Lengkap dan Nomor Telepon.',
        prayer: {
            Subuh: { label: 'Subuh', iqomah: 5, adjustment: 2, duration : 5 },
            Terbit: { label: 'Terbit', iqomah: 5, adjustment: 2, duration : 0 },
            Dzuhur: { label: 'Dzuhur', iqomah: 5, adjustment: 2, duration : 10 },
            Ashar: { label: 'Ashar', iqomah: 5, adjustment: 2, duration : 10 },
            Maghrib: { label: 'Maghrib', iqomah: 5, adjustment: 2, duration : 5 },
            Isya: { label: 'Isya', iqomah: 5, adjustment: 2, duration : 10 }
        },
        infotextinterval: 5, //seconds
        infotextdata: [
            {title:'Hadist Ilmu', content: '<span style="font-size: 39px;">\
            مَنْ سَلَكَ طَرِيْقًايَلْتَمِسُ فِيْهِ عِلْمًا,سَهَّلَ اللهُ لَهُ طَرِيْقًا إِلَى الجَنَّةِ . رَوَاهُ مُسْلِم\
            </span><br>\
            Barang siapa menempuh satu jalan (cara) untuk mendapatkan ilmu, maka Allah pasti mudahkan baginya jalan menuju surga." (HR. Muslim)', enable: true, duration: 10},
            {title:'Iklan Jam Sholat 2', content: '<img src="images/android.png" height="150px"><br><span style="font-size: 39px;">Jam Sholat 2</span><br>Yuk kita bikin petunjuk waktu sholat dengan mudah.<br>jamsholat2.susilon.com', enable: true, duration: 5},
            {title:'Slot kosong', content: '', enable: false, duration: 5},
            {title:'Slot kosong', content: '', enable: false, duration: 5},
            {title:'Slot kosong', content: '', enable: false, duration: 5},
            {title:'Slot kosong', content: '', enable: false, duration: 5},
            {title:'Slot kosong', content: '', enable: false, duration: 5},
            {title:'Info Khusus Saat Khotbah Jumat', content: '<span style="font-size:39px">\
            إذا قلت لصاحبك يوم الجمعة أنصت والإمام يخطب فقد لغوت\
            </span><br>Jika engkau berkata kepada temanmu pada hari jum’at, ‘diam dan perhatikanlah’, sedangkan imam sedang berkhutbah, maka engkau telah berbuat sia-sia.” (HR. Al-Bukhari [934].\
            ', enable: false, duration: 0},            
        ],
        scrollingdata: {
            value: 'Scrolling Text, Klik disini untuk mengganti text, dan juga klik di area yang akan diedit.',
            valueonpray: 'Rapat dan luruskan barisan demi kesempurnaan sholat kita.',
            speed: '5',
            width: '100%'
        },
        beep: {
            beepTimes: 5,
            beepVolume: 0.5,
            beepFrequency: 4000,
            beepType: 'square',
            beepDuration: 150
        },
        videolist: [
            //"bantarkuning.mp4", 
            //"lrtjakarta.mp4",
            //"indonesia73tahun.mp4",
            "tawaf.mp4",
            "everest.mp4",
            "dayandnight.mp4"]
    }
    localStorage.configuration = JSON.stringify(global);    
}

var audioCtx;// = new (window.AudioContext || window.webkitAudioContext)();
function beep(v, f, t, d) {		
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = v;
    oscillator.frequency.value = f;
    oscillator.type = 'square';//oscilatorType(t);

    oscillator.start();
  
    setTimeout(
      function(){
        oscillator.stop();
      }, 
      d
    );  
};

function doubleBeep() {
    var settings = global.beep;
	beep(settings.beepVolume, settings.beepFrequency, settings.beepType, 120);
	setTimeout(function() {
		beep(settings.beepVolume, settings.beepFrequency, settings.beepType, 120);
	}, 200);
}

function longBeep() {
    var settings = global.beep;
	beep(settings.beepVolume, settings.beepFrequency, settings.beepType, 1000);		
}

var beepCtr = 0;
var beepHandler;
function multipleBeep() {
    var settings = global.beep;
	beepHandler = setInterval(function(){ 
		beep(settings.beepVolume, settings.beepFrequency, settings.beepType, settings.beepDuration); 
		beepCtr++;			
		if (beepCtr == settings.beepTimes) {
			clearInterval(beepHandler);
			beepCtr = 0;
		}
	}, 1000);
}

function playBeep(type) {
    var settings = global.beep;
	switch (type) {
		case "l" :
			longBeep();
			break;
		case "m" :
			multipleBeep();
			break;
		case "s" :
			beep(settings.beepVolume, settings.beepFrequency, settings.beepType, settings.beepDuration); 
			break;
		case "d" :
			doubleBeep();
			break;
	}
}

moment.locale(global.locale);
/*
if ('serviceWorker' in navigator) {    
    console.log("Will the service worker register?");    
    navigator.serviceWorker.register('sw.js')
  .then(function(reg){        
      console.log("Yes, it did.");
  }).then(() => navigator.serviceWorker.ready
  .then((s) => {
    console.log("sw ready");
    ticker();
  })).catch(function(err) {        
      console.log("No it didn't. This happened:", err)    
  });
}
*/

function setDateTime() {
    tanggal = moment().format('D MMMM YYYY, HH:mm:ss');
	tanggalHijri = moment().format('iD iMMMM iYYYY, HH:mm:ss');	

    //var dt = moment().format('Do MMMM YYYY, HH:mm:ss');
    if (moment().format('s') < 30) {
        $('.datetime').html(tanggal);
    } else {
        $('.datetime').html(tanggalHijri);
    }
}

function ticker() {     
    setTimeout(() => {
        setDateTime();
        setPrayerTimes();

        ticker();        
    }, 1000);
}

function getPrayer(prayname) {
    switch(prayname) {
        case "fajr":
            return global.prayer.Subuh;
            break;
        case "sunrise":
            return global.prayer.Terbit;
            break;
        case "dhuhr":   
            return global.prayer.Dzuhur;
            break;
        case "asr":
            return global.prayer.Ashar;
            break;
        case "maghrib":
            return global.prayer.Maghrib;
            break;
        case "isha":
            return global.prayer.Isya;
            break;  
    }
    return null;
}

function getTimeBox(prayname) {
    var timebox = $(".time-box");
    switch(prayname) {
        case "fajr":
            timebox = $(".subuh").parent();
            break;
        case "sunrise":
            timebox = $(".terbit").parent();
            break;
        case "dhuhr":   
            timebox = $(".dzuhur").parent();
            break;
        case "asr":
            timebox = $(".ashar").parent();
            break;
        case "maghrib":
            timebox = $(".maghrib").parent();
            break;
        case "isha":
            timebox = $(".isya").parent();
            break;  
        case "imsak":
            timebox = $(".imsak").parent();
    }
    return timebox;
}

function setPrayerTimes() {
    now = new Date();
//now = moment(now).add(66, 'm').toDate();
//console.log(now);
    hari = moment(now).format('dddd');
    global.isjumat = false;
    if (hari == "Jumat") {
        global.isjumat = true;
    }

	var latlng = global.latlngdata.split(",");
	var coordinates = new adhan.Coordinates(latlng[0].trim(), latlng[1].trim());		
	var params = adhan.CalculationMethod.Egyptian();

    timedifference = now.getTimezoneOffset();
	diffsign = timedifference < 0 ? '+' : '-';

	switch(global.calculation) {
		case 0:
			params = adhan.CalculationMethod.Egyptian();
			break;
		case 1:
			params = adhan.CalculationMethod.MuslimWorldLeague();
			break;
		case 2:
			params = adhan.CalculationMethod.Karachi();
			break;
		case 3:
			params = adhan.CalculationMethod.UmmAlQura();
			break;
		case 4:
			params = adhan.CalculationMethod.Singapore();
			break;
		case 5:
			params = adhan.CalculationMethod.NorthAmerica();
			break;
		case 6:
			params = adhan.CalculationMethod.Dubai();
			break;
		case 7:
			params = adhan.CalculationMethod.Qatar();
			break;
		case 8:
			params = adhan.CalculationMethod.Kuwait();
			break;
		case 9:
			params = adhan.CalculationMethod.MoonsightingCommittee();
			break;
	}

	params.fajrAngle = global.fajrAngle;
	params.ishaAngle = global.ishaAngle;
	params.madhab = global.madhab=="hanafi"?adhan.Madhab.Hanafi:adhan.Madhab.Shafi;
    
	params.adjustments.fajr =  global.prayer.Subuh.adjustment;
	params.adjustments.sunrise =  global.prayer.Terbit.adjustment;
	params.adjustments.dhuhr =  global.prayer.Dzuhur.adjustment;
	params.adjustments.asr =  global.prayer.Ashar.adjustment;
	params.adjustments.maghrib =  global.prayer.Maghrib.adjustment;
	params.adjustments.isha =  global.prayer.Isya.adjustment;

	prayerTimes = new adhan.PrayerTimes(coordinates, now, params);
	
    imsakTime = moment(prayerTimes.fajr).add(-(global.imsak), 'minutes').format('HH:mm');
    fajrTime = moment(prayerTimes.fajr).format('HH:mm');
	sunriseTime = moment(prayerTimes.sunrise).format('HH:mm');
	dhuhrTime = moment(prayerTimes.dhuhr).format('HH:mm');
	asrTime = moment(prayerTimes.asr).format('HH:mm');
	maghribTime = moment(prayerTimes.maghrib).format('HH:mm');
	ishaTime = moment(prayerTimes.isha).format('HH:mm');	

    var current = prayerTimes.currentPrayer(now);
    global.currentpray = current;
    var next = prayerTimes.nextPrayer(now);
    if (current == 'none') {
        current = 'isha';
    }
    if (next == 'none'){
        next = 'fajr';
    } 

    var timepassed = now.getTime()- prayerTimes[current].getTime();
    var timeinto = prayerTimes[next].getTime() - now.getTime();

    if (prayerTimes.currentPrayer() == 'none'){
        timepassed = now - moment(prayerTimes.isha).add(-(1), 'days')._d;
    }
    if (prayerTimes.nextPrayer() == 'none'){
        timeinto = moment(prayerTimes.fajr).add(1, 'days')._d + now;
    }

//TODO:IMSAK

    var currentTimeBox = getTimeBox(current);
    var nextTimeBox = getTimeBox(next);
    var allTimeBox = $('.time-box');

    // reset
    allTimeBox.find('.time-data').css('background-color', 'rgba(0,0,0,0.5)');
    allTimeBox.removeClass("pray-active");
    allTimeBox.removeClass("blink-red");
    allTimeBox.removeClass("blink-green");
    // set
    currentTimeBox.addClass("pray-active");    

    // before n minutes from praying time
    if (Math.floor(timeinto/1000/60) <= global.timeintowarning) {
        console.log(Math.floor(timeinto/1000/60) + ' menit lagi ' + next);
        nextTimeBox.addClass("blink-green");
        nextTimeBox.find('.time-data').css('background-color', 'rgba(0,0,0,0)');

        if (next == 'fajr') {
            var imsakBox = getTimeBox('imsak');
            imsakBox.addClass("blink-red");   
            imsakBox.find('.time-data').css('background-color', 'rgba(0,0,0,0)');
        }
    }  

    // adhan alarm
    if (Math.floor(timepassed/1000/60) == 0) {        
        if (current != 'sunrise') {
            if (!global.isadhan) {
                global.isadhan = true;
                playBeep('l');
            } else {
                console.log('waktunya ' + current);
            }        
        }
    }
    
    // after n minutes from praying time
    if (Math.floor(timepassed/1000/60) <= global.prayertimewarning) {
        console.log(Math.floor(timepassed/1000/60) + ' menit yang lalu'); 
        currentTimeBox.addClass("blink-red");   
        currentTimeBox.find('.time-data').css('background-color', 'rgba(0,0,0,0)');
    }        

    var currentIqomahTime = getPrayer(current).iqomah;
    if (Math.floor(timepassed/1000/60) == currentIqomahTime) {
        // iqomah alarm, if !terbit
        if (current != 'sunrise') {
            if (!global.isiqomah) {
                global.isiqomah = true;
                playBeep('m');
                setScrollingText(global.scrollingdata);
            } else {
                global.isadhan = false;
                console.log('waktunya iqomah ' + current);
            }
        }
    }

    // after iqomah, in prayer session
    var currentPrayDuration = currentIqomahTime + getPrayer(current).duration;
    if ((Math.floor(timepassed/1000/60) > currentIqomahTime) && Math.floor(timepassed/1000/60) <= currentPrayDuration) {
        console.log('waktunya sholat ' + current);
        if (current != 'sunrise') {
            if (global.isiqomah || !global.ispraying) {
                global.isiqomah = false;
                global.ispraying = true;
                $('.hide-onpray').css('display','none');
                setScrollingText(global.scrollingdata);
            }            
        }
    }

    // after praying session
    if (Math.floor(timepassed/1000/60) > currentPrayDuration) {
        if (global.ispraying == true){            
            $('.hide-onpray').css('display','');
            global.ispraying = false;
            setScrollingText(global.scrollingdata);
        }        
    }  

	$(".timezone-gmt").text('GMT' + diffsign + (Math.abs(timedifference)/60));
	$(".imsak").text(imsakTime);
    $(".subuh").text(fajrTime);
	$(".terbit").text(sunriseTime);
	$(".dzuhur").text(dhuhrTime);
	$(".ashar").text(asrTime);
	$(".maghrib").text(maghribTime);
	$(".isya").text(ishaTime);
}

function setScrollingText(data) {
    var me = $('.marquee-container');
    var target = $('.marquee-container').find('.marquee').find('span');
    var target2 = $('.marquee-container').find('.marquee2').find('span');

    $(me).attr('data-value', data.value);
    $(me).attr('data-value-onpray', data.valueonpray);
    $(me).attr('data-speed', data.speed);
    $(me).attr('data-width', data.width);

    var text = '<small>jamsholat.id</small>- ' + data.value.split('\n').join(' -<small>jamsholat.id</small>- ') + ' -';    
    if (global.ispraying || global.isiqomah) {
        text = '- ' + data.valueOnPray.split('\n').join(' -<small>jamsholat.id</small>- ') + ' -';
    }    
    var speed = ((10-data.speed)/10) * text.length/2;

    $(target).html(text);
    if (data.speed <= 0) data.speed = 1;
    if (data.speed >= 10) data.speed = 9;    
    $(target).css('animation','marquee ' + speed + 's linear infinite');
    $(target2).css('animation-delay',speed/2 +'s');    
}

infoCtr = 0;
function tickerInfo() {      
    if (global.isjumat && global.currentpray == 'dhuhr') {        
        var infoJumat = global.infotextdata[7].content;
        $('.content').find('.info').html(infoJumat);
        setTimeout(function() {
            infoCtr++;
            if (infoCtr >= global.infotextdata.length) {
                infoCtr = 0;
            }
            tickerInfo();
        }, 60000);
    } else {
        var duration = global.infotextdata[infoCtr].enable?global.infotextdata[infoCtr].duration:0;
        $('.content').find('.info').html(global.infotextdata[infoCtr].content);
        setTimeout(function() {
            infoCtr++;
            if (infoCtr >= global.infotextdata.length) {
                infoCtr = 0;
            }
            tickerInfo();
        }, duration*1000);
    }    
}

// set label
$('.nama').text(global.namamasjid);
$('.nama').attr('data-value', global.namamasjid);
$('.alamat').text(global.alamatmasjid);
$('.alamat').attr('data-value', global.alamatmasjid);
$.each(global.prayer, function( index, value ) {
    $('.time-box').each(function() {
        if ($(this).find('.time-label').attr('data-label') == index) {
            $(this).find('.time-label').text(value.label);
        }
    });
});

// start video background
var videoList = global.videolist;
var videoPlayer = document.getElementById('bg-video');
var ctr = 1;
console.log(videoList);
videoPlayer.onended = function(){    
    videoPlayer.src = 'videos/'+videoList[ctr];
    ctr++;
    if (ctr >= videoList.length) {
        ctr = 0;
    }
}

// start scrolling text
setScrollingText(global.scrollingdata);
// start info 
tickerInfo();
// start clock
ticker();

$( document ).ready(function() {
    console.log('ready');
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    global.isadhan = false;
    global.isiqomah = false;
    global.ispraying = false;
    playBeep('l');
});
