const fs = require('fs');
const download = require('image-downloader')

const jsonData = fs.readFileSync('input.json');
const jsonObj = JSON.parse(jsonData);


function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function init() {
	for (const i in jsonObj) {
		const index = i;

		const options = {
			url: jsonObj[index]["thumbnailUrl"],
			dest: './images'
		}

		download.image(options)
			.then(({ filename }) => {
				console.log('Saved to', filename)  // Sauvegarder dans le dossier /images
			})
			.catch(function(err, filename) {
				console.log(err);
				console.log(jsonObj[index]["thumbnailUrl"], "LINK NOT WORKING")
				jsonObj[index]["thumbnailUrl"] = "https://via.placeholder.com/150x200.jpg"
				console.log(jsonObj[index]["thumbnailUrl"], "NEW LINK PLACEHOLDER")
			})

	}
	await sleep(3000);
	const data = JSON.stringify(jsonObj, null, 2);
	fs.writeFile("output-1.json", data, 'utf8', function (err) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("JSON file has been saved.");
	});

}

async function Run() {
	await sleep(500);
	await init()
}
Run();
