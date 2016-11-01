;(function(){		//初始化旋转木马,并给旋转木马添加事件和属性
//先构造一个旋转木马对象

var carousel=function(poster){
	var _self=this;
	this.poster=poster;		//将单个旋转木马对象保存下来

	//每一个幻灯片都包括
	/*
		1.幻灯片的主区域
		2.幻灯片的第一帧和最后一帧
		3.幻灯片的默认配置参数
		4.幻灯片的总帧数
		5.幻灯片的左右按钮
	*/

	//幻灯片的主区域
	this.posterItemsMain=poster.find(".poster-list");

	//所有的幻灯片
	this.posterItems=poster.find("li.poster-item");
	//幻灯片的第一帧
	this.firstPosterItem=this.posterItems.first();
	//幻灯片的最后一帧
	this.lastPosterItem=this.posterItems.last();
	//幻灯片区域的按钮

	this.nextBtn=poster.find(".poster-next-btn");	//右边的按钮
	this.prevBtn=poster.find(".poster-prev-btn");	//左边的按钮

	//设置默认配置参数
	this.setting={
		"height": 200,      //幻灯片区域的高度
		"width": 729,      //幻灯片区域的宽度
		"posterWidth":540,  //第一帧的高度,来设置其他的
		"posterHeight":200,
		"verticalAlign":"middle",   //幻灯片对齐方式
		"scale":0.9,       //不同帧的比例关系系数
		"speed":500,       //动画的速度ms
		"autoPlay":true,
		"delay":2500	   //设置在自动播放的时候间隔的时间
	};
	//由于用户可能自己带了配置参数,这是需要重新配置,用jQuery的扩展方法
	$.extend(this.setting,this.getSetting());

	console.log(this.setting);	//succeed

	//执行默认配置
	this.setSettingValue();

	//对除了第一帧之外的帧进行设置
	this.setPosterPost();

	//是否执行函数
	this.rotateflag=true;

	//给左右按钮添加点击事件
	//进行点击事件的时候必须等上一次点击事件完成才可以进行下一次事件
	this.nextBtn.click(function(){
		if(_self.rotateflag){
			_self.rotateflag=false;
			_self.carouselRotate("right");
		}
		
	});
	this.prevBtn.click(function(){
		if(_self.rotateflag){
			_self.rotateflag=false;
			_self.carouselRotate("left");
		}
	});

	//检测是否开启自动播放并且设置在鼠标移动到木马区域的时候清除定时器
	if(this.setting.autoPlay){
		// _self.autoPlay();
		_self.poster.hover(function(){	//hover函数包含了鼠标移入和鼠标移出两个函数
			//第一个表示鼠标移入事件
			if(_self.timer){
				window.clearInterval(_self.timer);
			}
		},function(){
			//第二个表示鼠标移出事件
			// _self.autoPlay();
		});		
	}



};

carousel.prototype={	//用来给旋转木马添加方法和属性的

	getSetting:function(){
		//用来获取用户设置的用户参数

		var setting=this.poster.attr("data-setting");
		//将取得的字符串转换成json对象并返回
		if(setting&&setting!=null){
			return $.parseJSON(setting);
		}else{
			return {};
		}
	},

	//用配置参数来设置幻灯片的基本参数属性
	setSettingValue:function(){
		//先来幻灯片的值
		this.poster.css({
			width:this.setting.width,
			height:this.setting.height
		});

		//设置幻灯片的主区域的值

		this.posterItemsMain.css({
			width:this.setting.width,
			height:this.setting.height
		});

		//设置幻灯片的左右按钮
		var w=(this.setting.width-this.setting.posterWidth)/2;	//这就是一半的空闲的地方
		this.prevBtn.css({
			width:w,
			height:this.setting.height,
			zIndex:Math.ceil(this.posterItems.size()/2)
		});

		this.nextBtn.css({
			width:w,
			height:this.setting.height,
			//设置了长和宽之后就会和图片的100%适应合在一起
			zIndex:Math.ceil(this.posterItems.size()/2)
		});

		//设置幻灯片第一帧的参数

		this.firstPosterItem.css({
			left:w,
			top:this.setVerticalAlign(this.setting.height),
			zIndex:Math.floor(this.posterItems.size()/2),
			//比按钮的层级低一点,但是比其他的图片的层级高
			width:this.setting.posterWidth,
			height:this.setting.height
		});
	},

	//设置其他剩余的帧的参数值

	setPosterPost:function(){
		var self=this;

		//设置的剩余的是剩余的的所有的,因此先获取除了第一帧之外的所有的帧

		var sliceItems=this.posterItems.slice(1),
		//分别将左右两边的帧分开
		sliceSize=sliceItems.size()/2,
		rightSlice=this.posterItems.slice(0,sliceSize),	//不是slice(1,sliceSize)
		//细节注意index 是基于零的；范围会延伸到（但不包含）指定的 index
		//也就是说要选取1的话要从0开始
		leftSlice=this.posterItems.slice(sliceSize),
		level=Math.floor(this.posterItems.size()/2);
		//用来表示层级

		//因为右边的所有帧是按照第一帧的参数并只能找比例计算而得出来的,先保存第一帧的一些数据作为接下来设置时右边时用来作为参照的值
		
		var rh=this.setting.posterHeight,
			rw=this.setting.posterWidth,
			//保存两边的分开的空隙的宽度
			gap=((this.setting.width-this.setting.posterWidth)/2)/sliceSize;	//49.5 因为只有一个

		//先来设置右边的剩余的部分
		//获取循环之前第一帧的left
		var firstLeft=(self.setting.width-self.setting.posterWidth)/2,
			fixOffsetLeft=firstLeft+rw;	//表示每一次循环时要变化的left值

		rightSlice.each(function(i){

			var j=i;	//因为后面需要用到和i相同的值
			//其中每一个的根据之前的rh和rw来进行设置
			level--;
			rh=rh*self.setting.scale;
			rw=rw*self.setting.scale;

			$(this).css({  //$(this)转换为jQuery对象
				width:rw,
				height:rh,
				zIndex:level,
				left:fixOffsetLeft+gap*(++i)-rw,
				opacity:1/(++j),
				top:self.setVerticalAlign(rh)
			});	
		});	

		//新建左边的帧需要设置时候的参考值
		var lw=rightSlice.last().width(),
			lh=rightSlice.last().height(),
			oloop=Math.floor(this.posterItems.size()/2);	//opacity的循环关系
		leftSlice.each(function(i){

			$(this).css({
				width:lw,
				height:lh,
				zIndex:i,
				left:gap*i,
				opacity:1/oloop,
				top:self.setVerticalAlign(lh)
			});
			//倒过来,先是和之前的一样,在重新取值
			lw=lw/self.setting.scale;
			lh=lh/self.setting.scale;
			oloop--;

		});
	},

	//设置运动的函数
	carouselRotate:function(dir){

		//有两个bug,第一个是连续点击的时候会出现卡顿
		//第二个是突然跳出来,是zindex的问题这个不能进行animate,应该直接设置好,让其他属性进行animate设置

		var zIndexArr=[];	//定义一个存储zIndex的数组
		//用来存储所有的zindex,因为zIndex不是包含在animate中的,zindex应该在一开始就直接设置好,而不是用运动的形式将其慢慢显示出来

		var _top=this;

		if(dir==="right"){
			//若是在左边的话,就是把前一帧的值赋值给当前帧
			this.posterItems.each(function(){
				//先取得前一帧的各类数据值
				var prev=$(this).prev().get(0)?$(this).prev():_top.posterItems.last(),
				//没有前一个就是说当前的就是第一个,则前一个就是最后一个
					prevW=prev.width(),
					prevH=prev.height(),
					prevZindex=prev.css("z-index"),
					prevLeft=prev.css("left"),
					prevTop=prev.css("top"),
					prevOpacity=prev.css("opacity");
					zIndexArr.push(prevZindex);

				//对当前帧进行设置
				$(this).animate({

					width:prevW,
					height:prevH,
					zIndex:prevZindex,
					left:prevLeft,
					top:prevTop,
					opacity:prevOpacity
				},function(){
					_top.rotateflag=true;
				});	
			});

			this.posterItems.each(function(i){
				//对这些的zindex在一开始就直接设置好
				$(this).css({
					zIndex:zIndexArr[i]
				});
			});

		}else if(dir==="left"){

			this.posterItems.each(function(i){
				//先取得前一帧的各类数据值
				var next=$(this).next().get(0)?$(this).next():_top.posterItems.first(),
				//没有后一个就是说当前的就是最后一个,则后一个就是第一个
					nextW=next.width(),
					nextH=next.height(),
					nextZindex=next.css("z-index"),
					nextLeft=next.css("left"),
					nextTop=next.css("top"),
					nextOpacity=next.css("opacity");

				zIndexArr.push(nextZindex);

				//对当前帧进行设置
				$(this).animate({

					width:nextW,
					height:nextH,
					zIndex:nextZindex,
					left:nextLeft,
					top:nextTop,
					opacity:nextOpacity
				},function(){
					_top.rotateflag=true;
				});	
			});

			this.posterItems.each(function(i){
				//对这些的zindex在一开始就直接设置好
				$(this).css({
					zIndex:zIndexArr[i]
				});
			});

		}else{
			return;
		}
	},

	//通过配置参数来设置竖直对齐方式

	setVerticalAlign:function(height){	//用来设置第一帧的对齐方式,其余的会跟着设置
		var top=0;
		if(this.setting.verticalAlign==="top"){
			top=0;
		}else if(this.setting.verticalAlign==="bottom"){
			top=this.setting.height-height;
		}else if(this.setting.verticalAlign==="middle"){
			top=(this.setting.height-height)/2;
		}else{
			top=(this.setting.height-height)/2;
		}
		return top;
	},

	//设置自动播放函数

	autoPlay:function(){
		var __top=this;
		this.timer=window.setInterval(function(){

			__top.nextBtn.click();

		},__top.setting.delay);
	}

};

//在原型链之外添加一个方法,给旋转木马对象
carousel.init=function(posters){
	var _this=this;
	posters.each(function(){
		new _this($(this));
	});
}












//给window注册
window['carousel']=carousel;

}());