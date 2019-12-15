var sex = 0;
var grade = 0;
function SexJudge(a){
	
}
function change(a){
	$(a).click(function(){
		$(a).addClass("btn-primary");
		$(a).removeClass("btn-secondary");
		$(a).siblings().removeClass("btn-primary")
		$(a).siblings().addClass("btn-secondary")
	});
}
$(document).ready(function(){
	change("#woman");
	change("#man");
	change("#u1");
	change("#u2");
	change("#u3");
	change("#u4");
});