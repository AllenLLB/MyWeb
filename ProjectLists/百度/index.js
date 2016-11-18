window.onload=function(){


	var oText=document.querySelector(".search input[type='text']");

	oText.onfocus=function(){
		this.style.borderColor = "#3388FF";
	}
	oText.onblur=function(){
		this.style.borderColor = "#ccc";
	}

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
}