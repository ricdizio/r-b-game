a = "Aveo"

function myFunction() {
    a = "Volvo";
    console.log("Function inside: "+a)
}


var playGame = {
    a: {b: 3, c: 5},
    create: function(){
        myFunction();
        console.log("Marca "+this.a.c)
    }
}
playGame.create()
console.log("Function outside: "+a)