
function getByClass(classname){
	var elements=document.getElementsByTagName("*");
	var result=[];
	for(var i=0;i<elements.length;i++){
		if(elements[i].className==classname){
			result.push(elements[i]);
		}
	}
	return result;
}

function addEvent(obj,type,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+type,fn);	//ie+
	}else if(obj.addEventListener){
		obj.addEventListener(type,fn,false);
	}
}


function libCreate(id,json,txt){
	var oEle=document.getElementById(id);
	function over(e){
		var Event=e||window.event;
		//阻止事件冒泡
		if(Event.stopPropagation){
			Event.stopPropagation();
		}else{
			Event.cancelBubble=true;
		}
		var oParent=oEle.parentNode;
		//设置一个标识属性
		oEle.setAttribute('view','view');
		if(!oParent.getAttribute('position')){
			oParent.setAttribute('position','relative');
		}
		var oNewDiv=document.createElement('div');
		oNewDiv.style.position="absolute";
		for(var attr in json){
			if(!(attr=='position'||attr=='class'||attr=='id')){
				oNewDiv.style[attr]=json[attr];
			}
		}
		oNewDiv.className='create';
		oNewDiv.innerHTML=txt;
		oParent.appendChild(oNewDiv);
	}

	addEvent(oEle,'mouseover',over);
	addEvent(oEle,'mouseout',function(e){
		var Event=e||window.event;
		//防止事件冒泡
		if(Event.stopPropagation){
			Event.stopPropagation();
		}else{
			Event.cancelBubble=true;
		}
		if(this.getAttribute('view')){
			var oNew=getByClass('create')[0];
			var oParentThis=oNew.parentNode;
			oParentThis.removeChild(oNew);
		}
	});
}

