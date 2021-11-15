const fs = require('fs');
const download = require('image-downloader')
// const imageDownloader = require('node-image-downloader')

const jsonData = fs.readFileSync('csvjson.json');
const jsonObj = JSON.parse(jsonData);

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

for (const i in jsonObj) {
	const rowToDelete = ["book_id","goodreads_book_id","best_book_id","work_id","original_publication_year" ,"average_rating","original_title","ratings_count","isbn","isbn13", "books_count","work_text_reviews_count","ratings_1","ratings_2","ratings_3","ratings_4","ratings_5","small_image_url","image_url", "work_ratings_count", "status", "shortDescription", "thumbnailUrl", "longDescription", "pageCount", "publishedDate", "categories" , "authors"]
	const index = i;

	jsonObj[index]["author"] = jsonObj[index]["authors"]; // On remplace le nom de l'array authors à author en recuperant la premiere valeur.
	jsonObj[index]["thumbnail"] = jsonObj[index]["image_url"] // On remplace le nom de l'objet thumbnailUrl à thumbnail.
	jsonObj[index]["pages"] = jsonObj[index]["books_count"]; // On remplace le nom de l'objet pageCount à pages.
	// jsonObj[index]["description"] = jsonObj[index]["longDescription"]; // On remplace le nom de l'objet pageCount à pages.


	if(!jsonObj[index]["description"]) {
		jsonObj[index]["description"] = "toto";
	}
	if(!jsonObj[index]["pages"]) {
		jsonObj[index]["pages"] = getRndInteger(100,350)
	}
	// if(!jsonObj[index]["thumbnail"]) {
	// 	jsonObj[index]["thumbnail"] = "https://via.placeholder.com/150x200.jpg"
	// }

	const options = {
		url: jsonObj[index]["thumbnail"],
		dest: './downloads'
	}

	// download.image(options)
	// 	.then(({ filename }) => {
	// 		console.log('Saved to', filename)  // Sauvegarder dans le dossier /images
	// 	})
	// 	.catch(function(err, filename) {
	// 		console.log(err);
	//
	// 	})

	// const reg = /(?<=[0-9])m(?=\/)/g;
	const reg = /(?<=[0-9])(m)(?=\/[0-9])/g;
	const str = jsonObj[index]["thumbnail"];
	const newStr = str.replace(reg, "l");

	console.log(newStr)

	jsonObj[index]["thumbnail"] = newStr;

	// Fonction pour supprimer les lignes déclarées dans la variable "rowToDelete"
	for (const row in rowToDelete) {
		delete jsonObj[index][rowToDelete[`${row}`]];
	}

}

const data = JSON.stringify(jsonObj, null, 2);

fs.writeFile("output-csvjson.json", data, 'utf8', function (err) {
	if (err) {
		console.log("An error occured while writing JSON Object to File.");
		return console.log(err);
	}
	console.log("JSON file has been saved.");
});
