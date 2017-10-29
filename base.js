var mysql = require('mysql');

class bd
{
	constructor()
	{
		this.con = mysql.createConnection({
  			host: "localhost",
  			user: "yourusername",
  			password: "yourpassword",
  			database: "mydb"
		});

	}

	createConexion()
	{
		this.con = mysql.createConnection({
		  host: "localhost",
		  user: "yourusername",
		  password: "yourpassword",
		  database: "mydb"
		});
		this.con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
		  con.query(sql, function (err, result) {
		    if (err) throw err;
		    console.log("1 record inserted");
		  });
		});
	}


	buscarUsuariobyname(name)
	{
		//Buscamos usuario por nombre
		//Retorna id
	}

	insertNewUser(x_name,x_lastname,x_id,x_password,x_email,x_money)
	{
		//Guarda un nuevo usario en la base de datos
		this.con.connect(function(err) {
  			if (err) throw err;
  			console.log("Connected to databse!");
  			var sql = "INSERT INTO users (name, lastname,userid,password,email,money) VALUES ('" + x_name"', '" + x_lastname + "', '" + x_id + "', '" + x_password + "', '" + x_email + "', '" + x_money + "')";
  			con.query(sql, function (err, result) {
    			if (err) throw err;
    			console.log("User inserted sucessfull");
  			});
		});
	}

	estaId(id)
	{
		//Verifica si ese id esta en la base de datos
		this.con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT id FROM users WHERE userid == '"+id+"'", function (err, result, fields) {
		    if (err) throw err;
		    console.log(fields);
		    if(Object.keys(fields).length == 0){return false}
		    return true;
		  });
		});
	}

	gerUsers()
	{
		//Retorna todos los usarios
		this.con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT * FROM users", function (err, result, fields) {
		    if (err) throw err;
		    console.log(result);
		  });
		});
	}

	getUser(id)
	{
		//Retorna usuario en un json 
		this.con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT name, lastname, email, money FROM users WHERE userid == '"+id+"'", function (err, result, fields) {
		    if (err) throw err;
		    console.log(fields);
		    return fields;
		  });
		});
		
	}

	getPassword(id)
	{
		//Retorna un hash con la clave
		this.con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT password FROM users WHERE userid == '"+id+"'", function (err, result, fields) {
		    if (err) throw err;
		    console.log(fields);
		    return fields;
		  });
		});
	}

	deleteUser(id)
	{
		//borra usuario de base de datos
	}

	getMoney(id)
	{
		//retorna el dinero por el id
		this.con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT money FROM users WHERE userid == '"+id+"'", function (err, result, fields) {
		    if (err) throw err;
		    console.log(fields);
		    return fields;
		  });
		});
	}

	updateMoney(id)
	{
		//Actualiza dinero (cantidad) dentro de la base de datos
	}

	updateName(id)
	{
		//Actualiza name dentro de la base de datos
	}


	updateLastname(id)
	{
		//Actualiza Lastname dentro de la base de datos
	}

	updateEmail(id)
	{
		//Actualiza email dentro de la base de datos
	}

	updatePassword(id)
	{
		//Actualiza password dentro de la base de datos
	}
}



