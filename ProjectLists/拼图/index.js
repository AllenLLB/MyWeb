    //一个资源数组,来存放src属性的取值
    var  resources=new Array("imgs/rw1.gif","imgs/rw2.gif","imgs/rw3.gif","imgs/rw4.gif",
                       "imgs/rw5.gif","imgs/rw6.gif","imgs/rw7.gif","imgs/rw8.gif","imgs/RW91.gif");
    var testArr=new Array("rw1.gif","rw2.gif","rw3.gif","rw4.gif",
                       "rw5.gif","rw6.gif","rw7.gif","rw8.gif","RW91.gif");
    // 为了随机生成一个数组变量作为上面数组的索引下标(0-8)
    var ranNums=new Array(0);


    // 取得存放图片的标记
    var imgs=document.getElementsByName("img");

    // 成功之后的恭喜词

    var gx=getByClass('success')[0];

    
    // 产生一个函数来生成数组
    function createArr(){
        var rannum;
        while(ranNums.length<9){
            rannum=getRandom();
            if(!hasSame(rannum,ranNums)){
                ranNums.push(rannum);
            }
        }
    }
    createArr();
    (function(){
        for(var i=0;i<imgs.length;i++){
            imgs[i].src=resources[ranNums[i]];
        }
    }());
    ranNums.length=0;    //清除数组,防止浏览器奔溃


// 先取所有的img
    var aImgs=document.getElementsByName("img");
    // 取得每次随机位置的li
    var srcs=[];
    (function(){
        for(var i=0;i<aImgs.length;i++){
            srcs.push(aImgs[i].src);
        }
    }());
// 取得空白的src
    function getEmpty(){
        for(var i=0;i<srcs.length;i++){
            if(/91/.test(srcs[i])){
                return i;
            }
        }
    }

 //取得目标值
    function getAim(obj,index){
        switch(obj.name){
            case 'up': 
                if(index>=3){
                    return index-3;
                }
                break;
            case 'down':
                if(index<6){
                    return index+3;
                }
                break;
            case 'left':
                if(!hasSame(index,[0,3,6])){
                    return index-1;
                };
                break;
            case 'right':
                if(!hasSame(index,[2,5,8])){
                    return index+1;
                };
                break;               
        }
    }

    //交换位置

    function exchange(index1,index2){
        if(index2!=null){
            var temp="";
            temp=srcs[index1];
            srcs[index1]=srcs[index2];
            srcs[index2]=temp;
        }
    } 

    // 判断成功的函数
    function success(arr1,arr2){
        if(arr1.length==arr2.length){
            var len=testArr.length;
            for(var i=0;i<len;i++){
                var pattern=testArr[i];
                if(arr1[i].search(pattern)==-1||arr2[i].search(pattern)==-1){
                    return false;
                }
            }
            return true;
        }
    }
// 交换完数组之后重新渲染图片(并且检查是不是成功)
    function render(){
        for(var i=0;i<imgs.length;i++){
            imgs[i].src=srcs[i];
            // imgs[i].src=resources[i];
            srcs[i]=imgs[i].src;
        }
    }
    // 按钮的四个事件
    function move(obj){//up
        var eIndex=getEmpty();
        var aIndex=getAim(obj,eIndex);
        exchange(eIndex,aIndex);
        render();
        if(success(resources,srcs)){
            getEmpty=getAim=exchange=render=null;
            imgs[8].src="imgs/rw9.gif";
            gx.style.display="block";
        }
        // if(isSuccess){
        //     getEmpty=getAim=exchange=render=null;
        //     imgs[8].src="imgs/wy9.gif";
        //     alert("恭喜你！");
        // }
    }
    // 绑定事件函数
    function bind(){
        var oBtn1,oBtn2,oBtn3,oBtn4;
        oBtn1=getByClass("bt1")[0]; //up
        oBtn2=getByClass("bt2")[0]; //down
        oBtn3=getByClass("bt3")[0]; //left
        oBtn4=getByClass("bt4")[0]; //right
        document.onkeydown=function(e){
            var oEvent=e||window.event;
            switch(oEvent.keyCode){
                case 40: move(oBtn1);
                    break;
                case 38: move(oBtn2);
                    break;
                case 39: move(oBtn3);
                    break;
                case 37: move(oBtn4);
                    break;            
            }   
            // up 38
            // left 37
            // right 39
            // down 40
        }
        oBtn1.onclick=function(){
            move(this);
        }
        oBtn2.onclick=function(){
            move(this);
        }
        oBtn3.onclick=function(){
            move(this);
        }
        oBtn4.onclick=function(){
            move(this);
        }

    }
    bind();

    document.oncontextmenu=function(){
        return false;
    }

