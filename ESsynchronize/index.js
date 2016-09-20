var mysql    = require("mysql");
var jsonfile = require('jsonfile');
var fs       = require('fs');
var path     = require('path');
var username = bufferFile('../config/username.txt');
var password = bufferFile('../config/password.txt');
var database = bufferFile('../config/database.txt');
var host     = bufferFile('../config/host.txt');

function bufferFile(relPath) {
			return fs.readFileSync(path.join(__dirname, relPath), {
				encoding: 'utf8'
		});
}

host              = host.replace(/\r?\n|\r/g, "");
username          = username.replace(/\r?\n|\r/g, "");
password          = password.replace(/\r?\n|\r/g, "");
database          = database.replace(/\r?\n|\r/g, "");

var settings      = {};
settings.host     = host;
settings.user     = username;
settings.password = password;
settings.database = database;

var pool          = mysql.createPool(settings);
var countQuery    = "SELECT count(*) as total FROM retailer_item_instacart";
var chunkSize     = 30000;

function getESIngredientData(recipe_ingredients) {
	var ESrecipe_ingredients = [];
	for (var i = 0; i < recipe_ingredients.length; i++) {
		ESrecipe_ingredients[i] =
		{
			suggest: {
				input: [recipe_ingredients[i].name],
				output: recipe_ingredients[i].name,
				payload :{
					id: recipe_ingredients[i].id
				},
				weight: 34
			}
		};
		ESrecipe_ingredients[i].name = recipe_ingredients[i].name;
	}
	return ESrecipe_ingredients;
}

function getESRetailerData(retailer) {
		var ESretailer = [];
		for (var i = 0; i < retailer.length; i++) {
				ESretailer[i] =
				{
						suggest: {
								input: [retailer[i].name],
								output: retailer[i].name,
								payload :{
										item_id: retailer[i].item_id,
										picture: retailer[i].picture,
										price: retailer[i].price,
										url: retailer[i].url
								},
								weight: 34
						}
				};
				ESretailer[i].name = retailer[i].name;
		}
		return ESretailer;
}

pool.getConnection(function(err, con) {
		if (err) {
				con.release();
				console.log("Error on getConnection:", err);
				return;
		}

		con.query(countQuery, {}, function(err, result) {
				if (err) {
						con.release();
						console.log("Error on getConnection:", err);
						return;
				}

				/*
				if (result && result[0]) {
						var totalRows = result[0]['total'];
						var periods = Math.ceil(totalRows/chunkSize);

						var selectQuery = "SELECT * FROM retailer_item_instacart ORDER BY id DESC LIMIT ";
						console.log('////////////PARSE INSTACART///////////////////////////');
						var j = 0;
						for (var i = 0; i < periods; i++) {
								var offset = i * chunkSize;
								var runQuery = selectQuery + offset + "," + chunkSize;
								con.query(runQuery, {}, function (err, results) {
										if (err) {
												console.log("Error on runQuery:", err);
												return;
										}
										var ingredients = JSON.stringify(results);
										console.log('////////////PARSE INSTACART ITEMS///////////////////////////');
										ingredients     = JSON.parse(ingredients);
										var ESingredients = getESRetailerData(ingredients);
										jsonfile.spaces = 4;
										jsonfile.writeFile("instacart" + j + ".json", ESingredients, function(err) {
												if (err) {
														console.log(err);
												}
										});
										j++;
								});
						}
				}
				*/
				con.query('SELECT * FROM ingredient', function(err, rows) {
						if (err) throw err;
						var ingredients = JSON.stringify(rows);


						console.log('////////////PARSE INGREDIENTS///////////////////////////');
						ingredients     = JSON.parse(ingredients);

						jsonfile.spaces = 4;

						jsonfile.writeFile("ingredients.json", ingredients, function(err) {


								con.query('SELECT * FROM recipe_ingredient', function(err, rows) {
										if (err) throw err;
										var recipe_ingredients = JSON.stringify(rows);


										console.log('////////////PARSE RECIPE INGREDIENTS///////////////////////////');
										recipe_ingredients     = JSON.parse(recipe_ingredients);

										var ESrecipe_ingredients = getESIngredientData(recipe_ingredients);

										jsonfile.spaces = 4;
										jsonfile.writeFile("recipe_ingredients.json", ESrecipe_ingredients, function(err) {
												con.query("SELECT * FROM retailer_item_safeway WHERE item_id NOT IN (     SELECT i.id FROM item i INNER JOIN item_flag iflag ON i.id = iflag.item_id WHERE iflag.flag_id = 1 );", function(err, rows) {
														if (err) throw err;
														var safeway = JSON.stringify(rows);
														safeway     = JSON.parse(safeway);

														jsonfile.spaces = 4;

														var ESsafeway = getESRetailerData(safeway);




														jsonfile.writeFile("safeway.json", ESsafeway, function(err) {
																con.query("SELECT * FROM retailer_item_fresh_direct WHERE item_id NOT IN (     SELECT i.id FROM item i INNER JOIN item_flag iflag ON i.id = iflag.item_id WHERE iflag.flag_id = 1 );", function(err, rows) {
																		if (err) throw err;
																		var freshdirect = JSON.stringify(rows);
																		freshdirect     = JSON.parse(freshdirect);

																		var ESfreshdirect = getESRetailerData(freshdirect);

																		jsonfile.spaces = 4;
																		console.log('////////////PARSE FRESH DIRECT///////////////////////////');
																		jsonfile.writeFile("freshdirect.json", ESfreshdirect, function(err) {
																				con.query("SELECT * FROM retailer_item_peapod WHERE item_id NOT IN (     SELECT i.id FROM item i INNER JOIN item_flag iflag ON i.id = iflag.item_id WHERE iflag.flag_id = 1 );", function(err, rows) {
																						if (err) throw err;
																						var peapod      = JSON.stringify(rows);
																						peapod          = JSON.parse(peapod);

																						var ESpeapod    = getESRetailerData(peapod);

																						jsonfile.spaces = 4;

																						console.log('////////////PARSE PEAPOD///////////////////////////');
																						jsonfile.writeFile("peapod.json", ESpeapod, function(err) {
																								con.query("SELECT * FROM retailer_item_shipt WHERE item_id NOT IN (     SELECT i.id FROM item i INNER JOIN item_flag iflag ON i.id = iflag.item_id WHERE iflag.flag_id = 1 );", function(err, rows) {
																										if (err) throw err;
																										var shipt       = JSON.stringify(rows);
																										shipt           = JSON.parse(shipt);

																										var ESshipt    = getESRetailerData(shipt);

																										jsonfile.spaces = 4;

																										console.log('////////////PARSE SHIPT///////////////////////////');
																										jsonfile.writeFile("shipt.json", ESshipt, function(err) {
																												con.query("SELECT * FROM retailer_item_walmart WHERE item_id NOT IN (     SELECT i.id FROM item i INNER JOIN item_flag iflag ON i.id = iflag.item_id WHERE iflag.flag_id = 1 );", function(err, rows) {
																														if (err) throw err;
																														var walmart     = JSON.stringify(rows);
																														walmart         = JSON.parse(walmart);

																														var ESwalmart   = getESRetailerData(walmart);

																														jsonfile.spaces = 4;

																														console.log('////////////PARSE WALMART///////////////////////////');
																														jsonfile.writeFile("walmart.json", ESwalmart, function(err) {
																																con.release(function(err) {
																																		// The connection is terminated gracefully
																																		// Ensures all previously enqueued queries are still
																																		// before sending a COM_QUIT packet to the MySQL server.

																																});

																																// exit node script
																																process.exit();
																														});
																												});
																										});
																								});

																						});
																				});


																		});
																});

});
});

});
});

});
});

});
});
