var menu1 = document.getElementById("menu1");
var menu2 = document.getElementById("menu2");
var menu3 = document.getElementById("menu3");
var menu4 = document.getElementById("menu4");

menu1.addEventListener("click",actionClick1);
menu2.addEventListener("click",actionClick2);
menu3.addEventListener("click",actionClick3);
menu4.addEventListener("click",actionClick4);

/* optional 

menu1.addEventListener("over",action1);
menu2.addEventListener("over",action2);
menu3.addEventListener("over",action3);
menu4.addEventListener("over",action4);

*/

var caja1 = document.getElementById("caja1");
var caja2 = document.getElementById("caja2");
var caja3 = document.getElementById("caja3");
var caja4 = document.getElementById("caja4");


function actionClick1()
{
	caja1.style.borderLeft = "3px solid #d0021b";
	caja2.style.borderLeft = "none";
	caja3.style.borderLeft = "none";
	caja4.style.borderLeft = "none";
}

function actionClick2()
{
	caja1.style.borderLeft = "none";
	caja2.style.borderLeft = "3px solid #d0021b";
	caja3.style.borderLeft = "none";
	caja4.style.borderLeft = "none";
}

function actionClick3()
{
	caja1.style.borderLeft = "none"
	caja2.style.borderLeft = "none"
	caja3.style.borderLeft = "3px solid #d0021b";
	caja4.style.borderLeft = "none";
}

function actionClick4()
{
	caja1.style.borderLeft = "none"
	caja2.style.borderLeft = "none"
	caja3.style.borderLeft = "none";
	caja4.style.borderLeft = "3px solid #d0021b";
}
