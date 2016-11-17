
$(function(){

	//来初始化旋转木马
	carousel.init($(".J_Poster"));

	//初始化运动框架
	var libo=new Libo();




	//设置右上角的关闭事件,可以让在父窗口中打开的应用在点击关闭的时候关闭

	$("#head_nav .close").click(function(){

		if(window.parent.libo){
	    		window.parent.libo.css(window.parent.args.mainWin,"display","none");
	    		window.parent.libo.css(window.parent.args.canCon,"display","block");
	    		window.parent.libo.css(window.parent.args.indexLists,"display","block");
	    		window.parent.libo.css(window.parent.args.canCon,"display","block");
	    		window.parent.args.Tiframe.src="";
	    		//在chrome上的显示有问题
	    		window.parent.args.openFlag=false;
	    }

	    return false;

	});

	//封装一个模块,用来用自定义滚动条来控制内容区域的移动
	(function(){	//相当于一个作用空间

		//取元素的属性值
		function getStyle(obj,attr){
			if(obj.currentStyle){	//IE
				return obj.currentStyle[attr];
			}else if(window.getComputedStyle){
				return window.getComputedStyle(obj,null)[attr];
			}else{
				return obj.style[attr];
			}
		}

		//拖拽函数
		//包含的是有四个对象参数,其中两个表示滚动条和它滚动的对象
		//另外两个表示能随滚动条滚动的区域和滚动区域的父级区域
		function drag(dragParent,dragObj,scrollObj,scrollParent){
			var scale;

			//滚动条移动的最大距离

			var mostSmallTop =0,
				mostBigTop   =parseInt(getStyle(dragParent,'height'))-parseInt(getStyle(dragObj,"height"));

			
			//要移动的块能移动的最大距离

			var mostScrollHeight=parseInt(getStyle(scrollObj,'height'))-parseInt(getStyle(scrollParent,"height"));

			var scrollT=0;	//能移动的块的高度
			//most-large-left
			//most-small-left

			dragObj.onmousedown=function(ev){


				var __this=this;
				var oEvent=ev||window.event;

				//mouse 距离自己的左边距和上边距

				var selfT=oEvent.clientY-__this.offsetTop;	

				// var oldT=Math.abs(scrollObj.offsetTop);


				document.onmousemove=function(ev){
					//因为要动态的改变高度
					mostScrollHeight=parseInt(getStyle(scrollObj,'height'))-parseInt(getStyle(scrollParent,"height"));
					var oE=ev||window.event;

					//需要定位的距离
					var t=oE.clientY-selfT;


					if(t<=mostSmallTop){
						t=mostSmallTop;
					}else if(t>=mostBigTop){
						t=mostBigTop;
					}

					scale=t/mostBigTop;
					scrollT=-mostScrollHeight*scale;

					// if(Math.abs(scrollT)<oldT){
					// 	scrollT=-oldT;
					// }
					dragObj.style.top=t+"px";
					scrollObj.style.top=scrollT+"px";
					// oldT=scrollT;
				}

				document.onmouseup=function(){
					document.onmousemove=null;
					document.onmouseup=null;
				}
				return false;   //取消默认事件(拖拽的时候不去选定周边的文字等元素),在拖拽开始的时候就会阻止
			}
		}
		
		window['drag']=drag;
		//向外注册
	}());

	//执行三个自定义滚动条
	//card1
	drag(document.querySelector(".tab_2"),document.querySelector(".slideBar"),document.querySelector(".signerlists"),document.querySelector(".signers"));


	//card3
	drag(document.querySelector("#right_card4"),document.querySelector(".scrollbar"),document.querySelector(".lovepartContent"),document.querySelector("#right_card4"));
	//card2
	drag(document.querySelector("#right_card2"),document.querySelector(".slidebar"),document.querySelector(".content"),document.querySelector("#right_card2"));
	//第一个选项卡模块
	(function(){

		var tabs=document.querySelectorAll(".tabs");
		var cards=document.querySelectorAll(".cards");

		var len=tabs.length;

		for(var i=0;i<len;i++){
			tabs[i].index=i;
			tabs[i].onclick=function(){
				for(var j=0;j<len;j++){
					if(!$(cards[j]).hasClass("noShow")){
						$(cards[j]).addClass("noShow");
					}
				}
				$(cards[this.index]).removeClass("noShow");
			}
			
		}

	}());

	//right_card4中的选项卡

	(function(){

		var tabs=document.querySelectorAll(".navs li[name='active']");
		var cards=document.querySelectorAll(".SCards");

		var len=tabs.length;

		for(var i=0;i<len;i++){
			tabs[i].index=i;
			tabs[i].onclick=function(){
				for(var j=0;j<len;j++){
					if(!$(cards[j]).hasClass("noShow")){
						$(cards[j]).addClass("noShow");
					}
				}
				$(cards[this.index]).removeClass("noShow");
			}
			
		}

	}());
	



	//设置评论框的关闭/打开事件

	(function(){
		//关闭
		$("#comment_box .close").click(function(){
			$("#matte").hide();
			$("#comment_box").hide();
		});

		$(".commontText input").click(function(){
			$("#matte").show();
			$("#comment_box").show();
		});

	}());

	//设置right_card1的arts的滑出字体设置

	(function(){
		//获取三个li
		var aLis=document.querySelectorAll(".arts ul li");

		aLis.forEach(function(obj,i){

			obj.onmouseover=function(){
				var moveObj=this.getElementsByTagName("p")[0];
				$(this).children("span").hide();
				libo.startMove(moveObj,{top:0},20);
			}

			obj.onmouseout=function(){
				var _this=this;
				var moveObj=this.getElementsByTagName("p")[0];
				libo.startMove(moveObj,{top:-60},20,function(){
					$(_this).children("span").show();
				});
			}
		});

	}());


	//编写评论框的移动事件

	(function(){
		//获取评论框的移动区域

		var objCanMove=document.querySelector("#comment_box .header");

		var move=document.querySelector("#comment_box");

		var parent=document.querySelector("#matte");

		objCanMove.onmousedown=function(e){
			var oE=e||window.event;
			var _this=move;

			var offsetL=oE.clientX-_this.offsetLeft;
			var offsetT=oE.clientY-_this.offsetTop;

			document.onmousemove=function(e){	//offset是相对于父级的
				var oE=e||window.event;
				
				var t=oE.clientY-offsetT;
				var l=oE.clientX-offsetL;

				if(l<=0){
					l=0;
				}else if(l>parent.offsetWidth-_this.offsetWidth){
					l=parent.offsetWidth-_this.offsetWidth;
				}

				if(t<=0){
					t=0;
				}else if(t>parent.offsetHeight-_this.offsetHeight){
					t=parent.offsetHeight-_this.offsetHeight;
				}

				$(_this).css({
					left:l,
					top:t
				});	
			}

			document.onmouseup=function(){
				this.onmouseup=null;
				this.onmousemove=null;
			}

			return false;
		}

	}());


	//test
	(function(){

		//评论输入区域
		var oText=document.querySelector("textarea[name='comment']");

		//取得字数变化的span

		var oNum = document.querySelector(".textarea span");

		$("#comment_box .button").click(function(){

			var oParent=document.querySelector("#right_card2 .content");
			var oUl=document.querySelector("#right_card2 .textLists>ul");

			var aLis=oUl.getElementsByTagName("li");

			var newLi=aLis[0].cloneNode(true);

			oParent.style.height=parseInt(libo.getStyle(oParent,"height"))+80+"px";
			oUl.appendChild(newLi);

			$("#comment_box .close").click();

			oNum.innerHTML = 140;
			oText.value = "";

		});


		//给评论框设置change事件
		oText.onfocus=function(){
			var self = this;
			var number = parseInt(oNum.innerHTML);
			var nNewNum = number;
			document.onkeydown=function(e){
				var oE = e || window.event;

				nNewNum =number - parseInt(self.value.length); 

				if(nNewNum < 0){
					nNewNum = 0;
				}

				oNum.innerHTML = nNewNum;

			}
		}
		
	}());

});
