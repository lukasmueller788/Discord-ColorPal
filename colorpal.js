const color_list = require('color-name-list');
const namedColors = require('color-name-list');
const nearestColor = require('nearest-color');
const {floor, random, typeOf} = require('mathjs');
const {createCanvas} = require('canvas');
const {writeFileSync} = require('fs');
const {getPalette} = require('colorthief');

//convert rgb to hex
//from https://lokeshdhakar.com/projects/color-thief/
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');

//The exact color is not always possible to get a name for, so we instead get the closest we can
//from https://github.com/meodai/color-names
const colors = namedColors.reduce((o, {name, hex}) => Object.assign(o, {[name]: hex}), {});
const nearest = nearestColor.from(colors);

function genImage(hexes, names) {
    //creating canvas with width and height
    const w = 300;
    const h = 300;
    const canvas = createCanvas(w, h);
    const context = canvas.getContext('2d');

    //background color
    context.fillStyle = '#36393f'; //discord grey
    context.fillRect(0, 0, w, h);

    //get 9 random colors and give them each a 100x100 block on the canvas
    for(let x = 0; x < 300; x+=100) {
        for (let y = 0; y < 300; y+=100) {
            //get a random color
            /*var random_color = color_list[floor(random(0, color_list.length))];
            var color_name = random_color.name;
            var color_hex = random_color.hex;*/

            var color_name = names[0];
            var color_hex = hexes[0];

            //draw the rectangle with the color in the correct position
            context.fillStyle = color_hex;
            context.fillRect(x, y, 100, 100);

            //write the color name over the rectangle
            context.font = 'bold 10pt serif';
            context.textAlign = 'center';
            context.fillStyle = '#000';
            context.fillText(color_name, x+50, y+50);

            names.shift();
            hexes.shift();
    
        }
    }

    //write to file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('./image.png', buffer);
}

function getProminentColors(img, numColors) {

    const results = getPalette(img, numColors, 1)
        .then(palette => {
    
            const hexPal = [];
            const namedPal = [];

            for (let i = 0; i < palette.length; i++) {
                const rgb = palette[i];
                const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
                hexPal.push(hex);
                namedPal.push(nearest(hex).name);
            }

            return [hexPal, namedPal];
        })
        .catch(err => {
            console.log(err);
        }
    );

    return results;
}


const results = getProminentColors('./dharron.png', 9);
results.then(result => {
    console.log(result[0]);
    console.log(result[1]);
    genImage(result[0], result[1]);
});

module.exports = {genImage};