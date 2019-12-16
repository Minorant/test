var sex = 0;
var grade = 0;
function change(a){
	$(a).click(function(){
		$(a).addClass("btn-primary");
		$(a).removeClass("btn-secondary");
		$(a).siblings().removeClass("btn-primary")
		$(a).siblings().addClass("btn-secondary")
		if(a=="#u1"||a=="#u2"){
			grade=1;
		}
		else if(a=="#u3"||a=="#u4"){
			grade=2;
		}
		else if(a=="#man"){
			sex = 1;
			$("#td-exa").text("引体向上");
			$("#td-long").text("1000米");
			$("#F-Exa").text("引体向上");
			$("#F-Long").text("1000米");
		}
		else if(a=="#woman"){
			sex = 2;
			$("#td-exa").text("仰卧起坐");
			$("#td-long").text("800米");
			$("#F-Exa").text("仰卧起坐");
			$("#F-Long").text("800米");
			
		}
	});
}
function readJson(file,callback){
	let ajax = new XMLHttpRequest();
	ajax.overrideMimeType("application/json");
	ajax.open("GET",file,true);
	ajax.onreadystatechange = function(){
		if (ajax.readyState === 4 && ajax.status =="200"){
			callback(ajax.responseText);
		}
	}
	ajax.send(null);
}
function GetLevel(b){
	if(b >= 90) return 0;
	else if(b >= 80)return 1;
	else if(b >= 60)return 2;
	else return 3;
}
function GetAdd(o,k,j){
	// o=原始成绩 k=代号4为long 5为 exa j=最优成绩
	//例： 男1 引体向上22 最优成绩为19 应加分3
	//例： 女1 长跑22 最优成绩为30 应加分?
	var i = 1;
	var r = Math.abs(o-j);// 3
	console.log(r);
	console.log(parseFloat(addData[i][sex+(k-4)*2]));
	while(r < parseFloat(addData[i][sex+(k-4)*2])){
		i++;
		if(i>10) return 0;
	}
	return parseFloat(addData[i][0]);
	
}
function ttt(){
	$("#btn-summit").click(function(){
		var i = -1;
		if(sex==0||grade==0){
			alert("请选择性别和年级");
			return;
		}
		else if(sex == 1 && grade==1){
			i=1;
		}
		else if(sex==1&&grade==2){
			i=2;
		}
		else if(sex == 2&&grade==1){
			i=3;
		}
		else if(sex==2&&grade==2){
			i=4;
		}
		var idArr = new Array("#Lung","#Fifty","#Flexibility","#Jump","#Long","#Exa");// 所对应的id
		var Level = new Array("优秀","良好","及格","不及格");
		var weightArr = new Array(0.15,0.2,0.1,0.1,0.2,0.1,0.15);// 加权百分数
		var weightScore = new Array; // weightScore当前记录了0~5的加权后总分*
		var orginalScore = new Array;// 原始分*
		var Score = new Array;// 成绩*
		var LevelScore = new Array;// 成绩评价*
		var addScore = new Array("-","-","-","-",0,0,"-");// 附加分*
		
		//非bmi判断
		for(var j = i,k = 0;j <=24;j+=4,k++){
			orginalScore[k] = $(idArr[k]).val();
			var b = Search(orginalScore[k],j,idArr[k]); //单项总分
			if(b == 100 && k>=4){
				addScore[k] = GetAdd(orginalScore[k],k,data[1][j]);
				console.log(addScore[k]);
			}
			Score[k] = b;
			LevelScore[k] = Level[GetLevel(b)];
			weightScore[k] = Math.round(b*weightArr[k]*10)/10;// weightScore当前记录了0~5的加权总分
		}
		//bmi判断
		var bmi = Math.round(parseFloat($("#weigh").val())/Math.pow(parseFloat($("#tall").val())/100,2)*10)/10;
		orginalScore[6] = bmi;
		var w = 17.8;
		if(sex == 2) w = 17.1;
		if(bmi >= 28){
			Score[6] = 60;
			LevelScore[6] = "肥胖";
		}
		else if(bmi>=24){
			Score[6] = 80;
			LevelScore[6] = "超重";
		}
		else if(bmi <= w){
			Score[6] = 80;
			LevelScore[6] = "低体重";
		}
		else{
			Score[6] = 100;
			LevelScore[6] = "正常";
		}
		weightScore[6] = Math.round(Score[6]*weightArr[6]*10)/10;
		//bmi结束
		var idFArr = new Array("#F-Lung","#F-Fifty","#F-Flexibility","#F-Jump","#F-Long","#F-Exa","#F-BMI");
		var toltolArr = new Array(orginalScore,Score,weightScore,addScore,LevelScore);
		for(var j = 0;j <=6;j++){
			var b = $(idFArr[j]).next();
			for(var k = 0;k < 5;k++){
				b.text(toltolArr[k][j]);
				b = b.next();
			}
		}
		$("#toltalScore").text(function(){
			var to = 0;
			for(var j = 0;j<=6;j++){
				to += weightScore[j];
			}
			$("#toltalLevel").text(Level[GetLevel(to)]);
			$("#addS").text(addScore[4]+addScore[5]);
			return Math.round(to*100)/100;
		})
		$(".result").css("visibility","visible");
		
	});
}
function Search(score,arrIndex,type){
	if(score=="")return 0;
	score = parseFloat(score);//data[1][arrindex]
	
	var i = 1;
	if(type=="#Long"||type=="#Fifty"){
		while(score>data[i][arrIndex]){
			i++;
			 if(i>20){
				 return 0;
			 }
		}
	}
	else{
		while(score<data[i][arrIndex]){
			i++;
			 if(i>20){
				 return 0;
			 }
		}
	}
	return data[i][0];
}
function resetClick(){
	$("#btn-reset").click(function(){
		var b = $("#F-Jump").next();
		b = b.next()
	});
		
}
$(document).ready(function(){
	let file = "./data.json";
	readJson(file,function(res){
		data = JSON.parse(res);
	});
	readJson("./addData.json",function(res){
		addData = JSON.parse(res);
	});
	change("#woman");
	change("#man");
	change("#u1");
	change("#u2");
	change("#u3");
	change("#u4");
	ttt();
	resetClick();
	
});