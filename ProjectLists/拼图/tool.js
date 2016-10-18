
//取随机数的函数
function getRandom(){
    return Math.floor(Math.random()*9);
}
//判断随机数是否在数组中存在
function hasSame(item,arr){
    for(var i=0;i<arr.length;i++){
        if(item==arr[i]){
            return true;
        }
    }
    return false;
}
// 兼容性的获取外部样式表
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else if(window.getComputedStyle){
        return getComputedStyle(obj,null)[attr];
    }else{
        return obj.style[attr];
    }
}

// 通过兼容性getElementsByClassName
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

// 绑定事件
function addEvent(target,type,fn){
    if(target.addEventListener){
        target.addEventListener(type,fn,false);
    }else if(target.addEventListener){
        target.attachEvent("on"+type,fn);
    }
}

