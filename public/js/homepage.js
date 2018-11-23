
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#a3e6d7';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#a3e6d7';

  function degToRad(degree) {
    var factor = Math.PI/180;
    return degree*factor;
  }

  function renderTime() {
  
    var now = new Date();
    var today = now.toDateString();
    var time = now.toLocaleTimeString();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var milliseconds = now.getMilliseconds();
    var newSeconds = seconds+ (milliseconds/1000);
  
    // Background
    gradient = ctx.createRadialGradient(200,200,5,200,200,200);
    gradient.addColorStop(0,'#09303a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,400,400);
  
    // Hours
    ctx.beginPath();
    ctx.arc(100, 100, 85, degToRad(270), degToRad((hours*30)-90));
    ctx.stroke();
  
    // Minutes
    //ctx.beginPath();
    //ctx.arc(100, 100, 70, degToRad(270), degToRad((minutes*6)-90));
    //ctx.stroke();

    // Seconds
    ctx.beginPath();
    ctx.arc(100, 100, 70, degToRad(270), degToRad((newSeconds*6)-90));
    ctx.stroke();

    // Date 
    ctx.font = "15px Helvetica";
    ctx.fillStyle = '#a3e6d7';
    ctx.fillText(today, 40, 90);
  
    // Time
    ctx.font = "15px Helvetica";
    ctx.fillStyle = '#a3e6d7';
    ctx.fillText(time, 70, 115);
  }

  setInterval(renderTime, 40);