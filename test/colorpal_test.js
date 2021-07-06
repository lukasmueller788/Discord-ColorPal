const colorPal = require('../colorpal');
const path = require('path');
const fs = require('fs');

//create output directory
const outPath = path.join(__dirname, 'output');
try {
    if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath);
    }
}
catch (err) {
    console.log(err);
}

//path to source images folder
const dirPath = path.join(__dirname, 'images');

fs.readdir(dirPath, function(err, files) {

    if (err) {
        console.log(err);
    }
    else {
        files.forEach(function (file) {

            colorPal.createPal(path.join(__dirname, 'images', file,), outPath);

        });
    }

});