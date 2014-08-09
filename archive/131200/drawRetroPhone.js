//callLink.href="tel:" + toDial;

var canvas;  
var ctx;

var dragging=false;
var valid=true;
var fullCircle=0;
var digit=-1;

var fontString; // font of the string

var toDial=new String("");

var mausX,mausY,mausYPrev=0; // mouse coordinates
var mausDragX,mausDragY; // mouse coordinates

var W; // width
var H; // height
var minWH; // minimum of width/height

// !geometric parameters
var alpha=0,alphaPrev=0; // phone angle
var oBeta=Math.PI*4/9, dBeta=Math.PI/7, rBeta=Math.PI/24;
var r0=0.35,r2=0.23,r1=(r0+r2)/2,r3=(r0-r2)/3;
var xc=0.5,yc=0.55,xText=0.5,yText=0.1; //centroid of shape

var callLink=document.getElementById("callLink");
var callButton=document.getElementById("callButton");

function getMaus(e)
{
  var rect = canvas.getBoundingClientRect();
  mausX=e.clientX-rect.left;
  mausY=e.clientY-rect.top;	  
}


// !drawing

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, W, H);
}

// !geometry calc

function getDistance(x1,y1,x2,y2)
{
	var d=Math.pow(Math.pow(x1-x2,2)+Math.pow(y1-y2,2),0.5);
	return d;
}

function getAngle(x1,y1,x2,y2)
{
	if (Math.abs(x1-x2)<W/100 && y2>y1) return Math.PI/2;
	if (Math.abs(x1-x2)<W/100 && y2<y1) return 3*Math.PI/2;
	
	var angle1=Math.atan((y2-y1)/(x2-x1));	
	if (x1<x2) 
	{
	  if(angle1<0) return angle1+2*Math.PI;
	  return angle1;
	  
	}
	return angle1+Math.PI;
}

// !mouse event functions

var mausUp=function(e)
{
  getMaus(e);   
  dragging=false;
}

var mausDown=function(e)
{
  getMaus(e);  
  if(alpha<0.03 && digit!=-1) 
  {
  	dragging=true;	
  }
  mausDragX=mausX;
  mausDragY=mausY;
  
  
  // check if call link is clicked
  if (mausY/minWH < yText+0.02 && mausY/minWH > yText-0.02)
  {
	  window.location = "tel:"+toDial;
  }
}

var mausMove=function(e)
{
  getMaus(e);  
  if(dragging)
  {  	 	
  	 alpha=getAngle(W*xc,H*yc,mausX,mausY)-getAngle(W*xc,H*yc,mausDragX,mausDragY);

	 if(alpha<0) 
	 {
		 alpha=0;	 
	 }
	 
	 if(alpha>((10-digit)*dBeta+rBeta)) 
	 {
		 dragging=false; 
		 if (toDial.length<12) toDial+=digit;
		 if(toDial.length===3 || toDial.length===7) toDial+='-';
		 

		 digit=-1;
	 }	 
  }
  if(alpha<0.03)
  {
 	 var digitTemp=-1;
     for(var i=0;i<10;i++)
	 {
		 angle=oBeta+dBeta*i+alpha;
		 var xt=W*xc+minWH*r1*Math.cos(angle);
		 var yt=H*yc+minWH*r1*Math.sin(angle);
		 if (getDistance(mausX,mausY,xt,yt)<minWH*r3)
		 {
			 digitTemp=i;
		 }
  	 }
  	 digit=digitTemp;		 
  }   
  
  
  if (mausY/minWH < yText+0.02 && mausY/minWH > yText-0.02)
  {
	  fontString="bold " + minWH/30 + "px Courier";
  }
  else
  {
	  fontString=minWH/30 + "px Courier";
  }
}

var mouseUp=function(e)
{
	getMaus(e);   
  	dragging=false;
}

// !main

function draw() 
{
  clear();
  ctx.fillStyle = "#444444";
  circle(W*xc,H*yc,minWH*r0);
  ctx.fillStyle = "rgb(240,245,240)";
  circle(W*xc,H*yc,minWH*r2);
  
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  
  ctx.strokeStyle = "rgb(240,245,240)";
  
  
  angle=oBeta+(10)*dBeta+rBeta;
  
  ctx.beginPath();
  ctx.moveTo(W*xc+r0*minWH*Math.cos(angle),H*yc+r0*minWH*Math.sin(angle));
  ctx.lineTo(W*xc+r1*minWH*Math.cos(angle),H*yc+r1*minWH*Math.sin(angle));
  ctx.lineWidth=minWH/150;
  ctx.stroke();
  
  ctx.lineWidth=0;
  
  var angle;
  
  if(alpha>0 && !dragging) alpha-=0.02; 
    
  var xt,yt,xc1,yc1;
  
  ctx.font=fontString;
  ctx.fillStyle = "#444444";
  
  ctx.fillText(toDial,W*xText,H*yText);
  
  ctx.font=minWH/18+ "px Courier";
  
  for(var i=0;i<10;i++)
  {
      if (digit===i) ctx.fillStyle = "rgb(180,205,200)";
      else ctx.fillStyle = "rgb(240,245,240)";
      
  	  angle=oBeta+dBeta*i+alpha;
  	  xc1=W*xc+minWH*r1*Math.cos(angle);
  	  yc1=H*yc+minWH*r1*Math.sin(angle);
	  circle(xc1,yc1,minWH*r3);
	  
	  ctx.fillStyle = "#444444";
	  angle=oBeta+dBeta*i;
	  
	  xt=W*xc+minWH*r1*Math.cos(angle);
	  yt=H*yc+minWH*r1*Math.sin(angle);
	  ctx.fillText(i,xt,yt);
  }
  
  canvas.addEventListener('mousedown',mausDown);
  canvas.addEventListener('mousemove',mausMove);
  canvas.addEventListener('mouseup',mausUp);
}

function touchHandler(event) 
{
    var touch = event.changedTouches[0];
    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() 
{

  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
  
  canvas = document.getElementById("canvas_1");
  ctx = canvas.getContext("2d");
  W=canvas.width;
  H=canvas.height;
  minWH=Math.min(W,H);
  //return setInterval(draw, 10);
}

init();

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() 
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  W=canvas.width;
  H=canvas.height;
  minWH=Math.min(W,H);
  return setInterval(draw, 10);
}

resizeCanvas();