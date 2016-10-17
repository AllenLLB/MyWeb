(function(){

	var Libo=function(){

	};

	Libo.prototype={


		//封装兼容通过className获取元素的方法
		getByClass:function(classname){

			var elements=document.getElementsByTagName("*");
			var result=[];
			for(var i=0;i<elements.length;i++){
				if(elements[i].className.indexOf(classname)!=-1){
					result.push(elements[i]);
				}
			}
			return result;		
		},

		//获取兼容的获取计算后的样式的函数

		getStyle:function(obj,attr){

			if(obj.currentStyle){	//IE
				return obj.currentStyle[attr];
			}else if(window.getComputedStyle){
				return window.getComputedStyle(obj,null)[attr];
			}else{
				return obj.style[attr];
			}
		},

		//getStyle()函数使用来获取style中的样式的
		//return标志着函数的结束(具有提前结束函数的作用)

		//完美缓冲运动框架

		startMove:function(obj,json,time,fn){       //json包括属性和对应的目标值
		    	
		    var _this=this;	

		    clearInterval(obj.timer);
		    //每个定时器中多个值同时变化
		    obj.timer=setInterval(function(){
		        var bStop=true;         //这一次运动都结束了，所有的值都到了指定位置
		        for(var attr in json){      //每次for循环都是对一种属性的设置
		            //取当前位置
		            var iCur;
		            if(attr=="opacity"){
		                iCur=parseInt(parseFloat(_this.getStyle(obj,attr))*100);
		            }else{
		                iCur=parseInt(_this.getStyle(obj,attr));
		            }
		            //设置速度
		            var iSpeed=(json[attr]-iCur)/8;
		            iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

		            //判断停止的条件(由于几个属性的值不同,设置时不同于前面的设置)
		            if(iCur!=json[attr]){
		                bStop=false;
		            }
		            if(attr=="opacity"){
		                obj.style.opacity=(iCur+iSpeed)/100;
		                obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
		            }else{
		                obj.style[attr]=iCur+iSpeed+"px";
		            }
		        }
		        if(bStop){
		            clearInterval(obj.timer);
		            if(fn){
		             	fn();
		            }
		        }
		    },time);
		},



		//停止运动方法

		stopMove:function(obj){
			if(obj.timer){
				clearInterval(obj.timer);
			}
		},

		//添加一个弹性运动形式

		TRomve:function(obj,left,oTarget,fn){
			clearInterval(obj.timer);

			//计算速度

			var iSpeed=0;

			obj.timer=setInterval(function(){
				//取得当前值
				var iCur=parseInt(getStyle(obj,left));

				//计算速度(弹性运动距离短速度大)
				iSpeed+=(oTarget-iCur)/5;

				//加点摩擦力

				iSpeed*=.65;


				//判断是否应该运动停止
				if(Math.abs(oTarget-iCur)<5&&Math.abs(iSpeed)<1){
					clearInterval(obj.timer);
					obj.style.left=oTarget+"px";
					if(fn){
						fn();
					}
				}else{
					obj.style.left=obj.offsetLeft+iSpeed+"px";
				}

			},30);

		},


		//封装一个css函数自动赋值取值

		css:function(obj,attr,value){  //获取或者设置css属性

            /*
             Document.defaultView
             概要:
             在浏览器中返回关联document的window对象，如果没有则返回null
             用法:
             var win = document.defaultView;
             这是一个只读属性。
             */

            if(arguments.length==2)
                return parseFloat(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]);
            else if(arguments.length==3){
                switch(attr)
                {
                    case 'width':
                    case 'height':
                    case 'paddingLeft':
                    case 'paddingTop':
                    case 'paddingRight':
                    case 'paddingBottom':
                        value=Math.max(value,0);
                    case 'left':
                    case 'top':
                    case 'marginLeft':
                    case 'marginTop':
                    case 'marginRight':
                    case 'marginBottom':
                        obj.style[attr]=value+'px';
                        break;
                    case 'opacity':
                        obj.style.filter="alpha(opacity:"+value*100+")";
                        obj.style.opacity=value;
                        break;
                    default:
                        obj.style[attr]=value;
                }
            }


            //return function (attr_in, value_in){css(obj, attr_in, value_in)};
            //这个方法是将自己包含参数并且返回
		},

		//封装一个可以拖动的

		drag:function(parent,dragLis){

			var zIndex=2;

			var self=this;

			//设置可以拖拽的范围

			//most-big-top
			//most-small-top
			var mostSmallTop =0,
				mostBigTop   =parseInt(self.getStyle(parent,'height'))-parseInt(self.getStyle(dragLis[0],"height"));

			//most-large-left
			//most-small-left

			var mostSmallLeft =0,
				mostBigLeft   =parseInt(self.getStyle(parent,'width'))-parseInt(self.getStyle(dragLis[0],"width"));

			for(var i=0;i<dragLis.length;i++){
				dragLis.index=i;
				dragLis[i].onmousedown=function(ev){



					var __this=this;
					var oEvent=ev||window.event;

					//先设置zIndex,最上面交换
					zIndex++;

					__this.style.zIndex=zIndex;
					//需要检测碰撞的对象集合,后期改变
					var needCk=[];

					//mouse 距离自己的左边距和上边距
	
					var selfL=oEvent.clientX-__this.offsetLeft;
					var selfT=oEvent.clientY-__this.offsetTop;

					//不能用dragLis[i],用this


					//这里移动写的是用虚框移动的方式(新建虚框,然后弄样式)

					//创建虚框
					var createDiv=document.createElement("div");
					with(createDiv){	//改用with
						style.width=__this.offsetWidth+"px";
						style.height=__this.offsetHeight+"px";
						style.position="absolute";
						style.left=__this.offsetLeft+"px";
						style.top=__this.offsetTop+"px";
						
						style.background="transparent";
						style.boxSizing="border-box";
						style.border="1px dashed #fff";
					}
					// createDiv.style.width=__this.offsetWidth+"px";
					// createDiv.style.height=__this.offsetHeight+"px";
					// createDiv.style.position="absolute";
					// createDiv.style.left=__this.offsetLeft+"px";
					// createDiv.style.top=__this.offsetTop+"px";
					
					// createDiv.style.background="transparent";
					// createDiv.style.boxSizing="border-box";
					// createDiv.style.border="1px dashed #fff";

					parent.appendChild(createDiv);

					//在创建虚框的同时给添加一个标识的毛玻璃
					__this.style.opacity=.5;


					document.onmousemove=function(ev){
						var oE=ev||window.event;




						//需要定位的距离
						var l=oE.clientX-selfL;
						var t=oE.clientY-selfT;


						//限制区域

						if(l<=mostSmallLeft){
							l=mostSmallLeft;
						}else if(l>=mostBigLeft){
							l=mostBigLeft;
						}

						if(t<=mostSmallTop){
							t=mostSmallTop;
						}else if(t>=mostBigTop){
							t=mostBigTop;
						}


						// document.title=l+" "+t;

						createDiv.style.left=l+"px";
						createDiv.style.top=t+"px";

						//碰撞检测
						//处理优化需要检测的对象
						
						for(var j=0;j<dragLis.length;j++){
							if(dragLis[j]!=__this){
								needCk.push(dragLis[j]);
							}
						}

						//先将所有的name清空
						for(var k=0;k<dragLis.length;k++){
							if(dragLis[k].getAttribute("name")){
								dragLis[k].removeAttribute("name");
							}
						}

						var oNear=self.getSmall(createDiv,needCk);

						if(oNear){
							oNear.setAttribute("name","active");
						}
					}

					document.onmouseup=function(){
						document.onmousemove=null;
						document.onmouseup=null;

						var oNear=self.getSmall(createDiv,needCk);

						if(oNear){
							//先将需要交换的位置参数临时保存下来,否则会在运动中产生bug

							var oNearStyle={
								"left":oNear.offsetLeft,
								"top":oNear.offsetTop
							},
							nowStyle={
								"left":__this.offsetLeft,
								"top":__this.offsetTop
							};

							self.startMove(__this,{left:oNearStyle["left"],top:oNearStyle["top"],opacity:100},15);
							self.startMove(oNear,{left:nowStyle["left"],top:nowStyle["top"]},15);
					
							oNear.removeAttribute("name");

							//除了交换界面位置上的关系,还得交换真正数组上的关系


							parent.removeChild(createDiv);

						}else{

							//检测之前碰上过
							for(var j=0;j<dragLis.length;j++){
								if(dragLis[j].getAttribute("name")){
									dragLis[j].removeAttribute("name");
								}
							}


							self.startMove(__this,{left:createDiv.offsetLeft,top:createDiv.offsetTop,opacity:100},15);
							parent.removeChild(createDiv);	
						}

					}

					return false;   //取消默认事件(拖拽的时候不去选定周边的文字等元素),在拖拽开始的时候就会阻止
				}

			}	

		},


		//设置检测碰撞及交换位置的一套
		//先检测两个对象是不是碰撞(采用九宫格的检测方式)
		//在上右下左的时候表示没有碰上
		cdTest:function(obj1,obj2){
			var t1=obj1.offsetTop;		//obj1 top dis
			var b1=obj1.offsetTop+obj1.offsetHeight;	//obj1 bottom dis
			var l1=obj1.offsetLeft;		//obj1 left dis
			var r1=obj1.offsetLeft+obj1.offsetWidth;	//obj1 right dis

			var t2=obj2.offsetTop;	//obj2 top dis
			var b2=obj2.offsetTop+obj2.offsetHeight;	//obj2 bottom dis
			var l2=obj2.offsetLeft;	//obj2 left dis
			var r2=obj2.offsetLeft+obj2.offsetWidth;	//obj2 right dis

			if(t1>b2||r1<l2||b1<t2||r2<l1){
				return false;
			}else{
				return true;
			}
		},

		//计算两个对象中心点之间的值
		getDis:function(obj1,obj2){
			var _self=this;
			var midT1=obj1.offsetTop+obj1.offsetHeight/2,
				midL1=obj1.offsetLeft+obj1.offsetWidth/2,
				midT2=obj2.offsetTop+obj2.offsetHeight/2,
				midL2=obj2.offsetLeft+obj2.offsetWidth/2;
			return Math.sqrt((midT1-midT2)*(midT1-midT2)+(midL1-midL2)*(midL1-midL2));	
		},

		//检测并得到和所需比较的对象群之间的最小的距离,得到距离最小的那个对象
		getSmall:function(obj,lists){
			var _top=this;
			//先预设一个最小值
			var iMinDis	=99999;

			var iMinId=-1;

			for(var i=0;i<lists.length;i++){
				//排除自己先
				if(obj==lists[i]) continue;
				if(_top.cdTest(obj,lists[i])){
					var dis=_top.getDis(obj,lists[i]);
					if(dis<iMinDis){
						iMinDis=dis;
						iMinId=i;
					}
				}
			}

			if(iMinId==-1){
				return null;
			}else{
				return lists[iMinId];
			}
		}


	};

	window['Libo']=Libo;

}());




	