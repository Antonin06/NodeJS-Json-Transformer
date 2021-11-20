const fs = require('fs');
const download = require('image-downloader')
// const imageDownloader = require('node-image-downloader')

const jsonData = fs.readFileSync('csvjson.json');
const jsonObj = JSON.parse(jsonData);

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function FakeApiTransform() {

	var request = require('request');

	var body = {
		token: '8IDdLuaEfdN9rAETN0G9Sg',
		data: {
			consistent: false,
			"description": 'stringLong',
			"shortDescription": 'stringShort',
			"aboutAuthor": 'stringShort'
		}
	};

	request.post(
		'https://app.fakejson.com/q',
		{json: body},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				setTimeout(TransformerJson, 3000);
				function TransformerJson() {
					for (const i in jsonObj) {
						const rowToDelete = ["book_id", "goodreads_book_id", "best_book_id", "work_id", "original_publication_year", "average_rating", "original_title", "ratings_count", "isbn","language_code", "isbn13", "books_count", "work_text_reviews_count", "ratings_1", "ratings_2", "ratings_3", "ratings_4", "ratings_5", "small_image_url", "image_url", "work_ratings_count", "status", "thumbnailUrl", "longDescription", "pageCount", "publishedDate", "authors"]
						const index = i;

						jsonObj[index]["author"] = jsonObj[index]["authors"]; // On remplace le nom de l'array authors à author en recuperant la premiere valeur.
						jsonObj[index]["thumbnail"] = jsonObj[index]["image_url"] // On remplace le nom de l'objet thumbnailUrl à thumbnail.
						jsonObj[index]["pages"] = jsonObj[index]["books_count"]; // On remplace le nom de l'objet pageCount à pages.
						jsonObj[index]["langue"] = jsonObj[index]["language_code"];



						if (!jsonObj[index]["description"]) {
							jsonObj[index]["description"] = body.description;
						}
						if (!jsonObj[index]["shortDescription"]) {
							jsonObj[index]["shortDescription"] = body.shortDescription;
						}
						if (!jsonObj[index]["aboutAuthor"]) {
							jsonObj[index]["aboutAuthor"] = body.aboutAuthor;
						}
						if (!jsonObj[index]["pages"]) {
							jsonObj[index]["pages"] = getRndInteger(100, 350)
						}
						if (!jsonObj[index]["categories"]) {
							jsonObj[index]["categories"] = [{"id": getRndInteger(1,4)}];
						}
						if(!jsonObj[index]["thumbnail"]) {
							jsonObj[index]["thumbnail"] = "https://via.placeholder.com/300x300.jpg"
						}

						// Condition si une key thumbnail contiens une partie precise. Dans ce cas, une partie d'url.
						let example = jsonObj[index]["thumbnail"];
						let ourSubstring = "s.gr-assets.com/assets";

						if (example.includes(ourSubstring)) {
							delete jsonObj[index]["title"];
							delete jsonObj[index]["language_code"];
							delete jsonObj[index]["author"];
							delete jsonObj[index]["pages"];
							delete jsonObj[index]["thumbnail"];
							delete jsonObj[index]["description"];
							delete jsonObj[index]["shortDescription"];
							delete jsonObj[index]["langue"];
							delete jsonObj[index]["categories"];
							delete jsonObj[index]["aboutAuthor"];
						}

						// Dependence pour telecharger les images en local. Pour verifier la bon fonctionnement des images.
						// const options = {
						// 	url: jsonObj[index]["thumbnail"],
						// 	dest: './downloads'
						// }

						// download.image(options)
						// 	.then(({ filename }) => {
						// 		console.log('Saved to', filename)  // Sauvegarder dans le dossier /images
						// 	})
						// 	.catch(function(err, filename) {
						// 		console.log(err);
						//
						// 	})

						// Regex pour remplacer le parametres des tailles d'images dans le fichier json de base.
						const reg = /(?<=[0-9])(m)(?=\/[0-9])/g;
						const str = jsonObj[index]["thumbnail"];
						if (jsonObj[index]["thumbnail"]) {
							const newStr = str.replace(reg, "l");
							jsonObj[index]["thumbnail"] = newStr;
						}


						// Fonction pour supprimer les lignes déclarées dans la variable "rowToDelete"
						for (const row in rowToDelete) {
							delete jsonObj[index][rowToDelete[`${row}`]];
						}

						// Compte le nombre de key dans chaque objects. J'en attends 9!
						const count = Object.keys(jsonObj[index]).length;
						if(Object.keys(jsonObj[index]).length < 9) {
							console.log("Pas assez d'infos! Verifiez si info manquante ou si delete manquant")
						} else {
							console.log("C'est ok BG");
						}
					}
				}
			}
			if (error && response.statusCode != 200) {
				console.log(error)
			}
		}
	)
}

function WriteJson(){
	const data1 = JSON.stringify(jsonObj.filter(function(el) {
		// keep element if it's not an object, or if it's a non-empty object
		return typeof el != "object" || Array.isArray(el) || Object.keys(el).length > 0;
	}), null, 2);

	fs.writeFile("output-csvjson.json", data1, 'utf8', function (err) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("JSON file has been saved.");
	});
}

FakeApiTransform();
setTimeout(WriteJson, 6000);
// WriteJson();
