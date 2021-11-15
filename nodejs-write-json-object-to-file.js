const fs = require('fs');
const download = require('image-downloader')
// const imageDownloader = require('node-image-downloader')

const jsonData = fs.readFileSync('output-1.json');
const jsonObj = JSON.parse(jsonData);

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

for (const i in jsonObj) {
	const rowToDelete = ["isbn", "status", "shortDescription", "thumbnailUrl", "longDescription", "pageCount", "publishedDate", "categories" , "authors"]
	const index = i;

	jsonObj[index]["author"] = jsonObj[index]["authors"][0]; // On remplace le nom de l'array authors à author en recuperant la premiere valeur.
	jsonObj[index]["thumbnail"] = jsonObj[index]["thumbnailUrl"] // On remplace le nom de l'objet thumbnailUrl à thumbnail.
	jsonObj[index]["pages"] = jsonObj[index]["pageCount"]; // On remplace le nom de l'objet pageCount à pages.
	jsonObj[index]["description"] = jsonObj[index]["longDescription"]; // On remplace le nom de l'objet pageCount à pages.


	if(!jsonObj[index]["description"]) {
		jsonObj[index]["description"] = "toto";
	}
	if(!jsonObj[index]["pages"]) {
		jsonObj[index]["pages"] = getRndInteger(100,350)
	}
	if(!jsonObj[index]["thumbnail"]) {
		jsonObj[index]["thumbnail"] = "https://via.placeholder.com/150x200.jpg"
	}

	const options = {
		url: jsonObj[index]["thumbnail"],
		dest: './images'
	}

	download.image(options)
		.then(({ filename }) => {
			console.log('Saved to', filename)  // Sauvegarder dans le dossier /images
		})
		.catch(function(err, filename) {
			console.log(err);

		})

	// Fonction pour supprimer les lignes déclarées dans la variable "rowToDelete"
	for (const row in rowToDelete) {
		delete jsonObj[index][rowToDelete[`${row}`]];
	}

}

const data = JSON.stringify(jsonObj, null, 2);

fs.writeFile("output.json", data, 'utf8', function (err) {
	if (err) {
		console.log("An error occured while writing JSON Object to File.");
		return console.log(err);
	}
	console.log("JSON file has been saved.");
});
