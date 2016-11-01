
$(function(){

	//来初始化旋转木马
	carousel.init($(".J_Poster"));

	//先将旋转木马暂停


	//设置右上角的关闭事件,可以让在父窗口中打开的应用在点击关闭的时候关闭

	$(".close").click(function(){

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


				document.onmousemove=function(ev){
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

					dragObj.style.top=t+"px";
					scrollObj.style.top=scrollT+"px";
				}

				document.onmouseup=function(){
					document.onmousemove=null;
					document.onmouseup=null;
				}
				return false;   //取消默认事件(拖拽的时候不去选定周边的文字等元素),在拖拽开始的时候就会阻止
			}
		}
		drag(document.querySelector(".styles"),document.querySelector(".slideBar"),document.querySelector(".signers p"),document.querySelector(".signers"));



	}());












});
