var can;
var canBack;
var canTxt;
var w;
var h;


//初始化函数
function init(){
	can = document.querySelector("#can");
	canBack = document.querySelector("#canBack");
	canBackTxt =canBack.getContext("2d");
	canTxt = can.getContext("2d");
	//因为两个画布的长和宽是相同的,取一对值
	w = can.width;
	h = can.height;
	
	//先初始化配置设置参数
	setting();
	can.onmousedown = down;
}


//设置绘画背景函数

function  setting(){
	//默认画布是白色的
	drawPainting("transparent");
	drawBackground("#fff");
	// //默认画笔是红色的
	canTxt.strokeStyle = "red";
	//默认画笔是5个像素的
	canTxt.lineWidth = 8;
}

function drawBackground(color){
	canBackTxt.fillStyle = color;
	canBackTxt.fillRect(0,0,w,h);
}
function drawPainting(color){
	canTxt.fillStyle = color;
	canTxt.fillRect(0,0,w,h);
}
function setPenColor(color){
	canTxt.strokeStyle = color;
}
//设置画笔的样式
function setPenStyle(linewidth){
    canTxt.lineWidth = linewidth;
}
function down(e){
	var oE = e||window.event;
	var startX,startY;

	//注意:获取鼠标焦点在画布上的坐标使用的是layerX,layerY或者offsetX,offsetY
	if(oE.offsetX||oE.layerX){
		startX=oE.offsetX==undefined?oE.layerX:oE.offsetX;
		startY=oE.offsetY==undefined?oE.layerY:oE.offsetY;
	}
	canTxt.beginPath();
	canTxt.moveTo(startX,startY);
	can.onmousemove = move;
	can.onmouseup	= up;

	return false;  //取消默认事件,防止选取不必要的文字
}	

function  move(e){
  var oE = e || window.event;
  var toX,toY;
  if(oE.offsetX||oE.layerX){
  	toX=oE.offsetX==undefined?oE.layerX:oE.offsetX;
  	toY=oE.offsetY==undefined?oE.layerY:oE.offsetY;
  }
  canTxt.lineTo(toX,toY);
  //不需要闭合,重新设置路径就好
  canTxt.stroke();
}

function  up(){
	if(this.onmousemove || this.onmouseup){
		this.onmousemove = null;
		this.onmouseup = null;
	}
}


//设置画布自执行函数入口
(function(){
	init();
}());


//设置关闭按钮关闭

$("#nav .close").click(function(){

		if(window.parent.libo){
	    		window.parent.libo.css(window.parent.args.mainWin,"display","none");
	    		window.parent.libo.css(window.parent.args.canCon,"display","block");
	    		window.parent.libo.css(window.parent.args.indexLists,"display","block");
	    		window.parent.libo.css(window.parent.args.canCon,"display","block");
	    		window.parent.args.Tiframe.src="";
	    		//在chrome上的显示有问题
	    		window.parent.args.openFlag=false;
	    }

	    return false;     //取消点击事件的默认效果

	});


//添加设置画布背景的块
(function(){

  $(".boxBgLists li").click(function(){

  	//类似于旋转木马幻灯片,标签自己传值
  	var color = $.parseJSON($(this).attr("color-data")).color;

  	drawBackground(color);
  	
  });
}());

  //添加设置画笔颜色的颜色板
  (function(){

  	var colorList=[];
  	$(".colorLists li").each(function(){
  		var color = $.parseJSON($(this).attr("color-data")).color;
  		colorList.push(color);
  	});

  	$(".colorLists li").each(function(i){
  		$(this).css("background",colorList[i]);
  	});

  	//给每一个颜色块添加点击事件
  	$(".colorLists li").click(function(){	//click不是each不能传递i
  		var color = $.parseJSON($(this).attr("color-data")).color;
  		setPenColor(color);
  	});

}());

  //添加设置画笔样式的样式列表
  (function(){
  	var styleList=[];
  	$(".styleLists li").each(function(){
  		var style = $.parseJSON($(this).attr("line-data")).lineWidth;
  		styleList.push(style);
  	});
  	
  	//设置点击重新设置画笔的样式

  	$(".styleLists li").click(function(){
  		var line = $.parseJSON($(this).attr("line-data")).lineWidth;
  		setPenStyle(line);
  		$("#canvas #can").css("cursor","auto");
  	});

  }());


//设置简单的选项卡来进行设置画布样式和画笔样式

(function(){
	$(".boolNav li").each(function(i){
		$(this).click(function(){
			$(".contain ul").css("display",'none');
			$(".contain ul").eq(i).css("display",'block');
		});
	});


})();

//设置关闭或者点开控制面板

(function(){
	$(".closePanel").click(function(){
		$(".penSet").css("display","none");
	});

	$("#nav .setting").click(function(){
		$(".penSet").css("display","block");
	});
})();

//设置橡皮擦的地方

(function(){
	$("#nav .eraser").click(function(){
		$("#canvas #can").css("cursor","crosshair");
		//设置橡皮擦的样式和颜色
		//橡皮擦的颜色和背景的颜色相同,橡皮擦的大小就是最粗的笔的样式
		setPenStyle(30);
		var eraserColor = document.querySelector("#canBack").getContext("2d").fillStyle;
		setPenColor(eraserColor);
	});
}());
