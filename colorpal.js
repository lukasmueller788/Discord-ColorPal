const color_list = require('color-name-list');
const namedColors = require('color-name-list');
const nearestColor = require('nearest-color');
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

//generates an image with a color palette, given an array of color hexes and names
function genImage(hexes, names) {
    //creating canvas with width and height
    const w = 1700;
    const h = 2150;
    const canvas = createCanvas(w, h);
    const context = canvas.getContext('2d');

    //background color
    context.fillStyle = '#36393f'; //discord grey
    context.fillRect(0, 0, w, h);

    //draw the rectangles and text for the image
    //500(color square) + 50 (border)
    for(let x = 50; x < 1650; x+=550) {
        //500(color square) + 150(name rectangle) + 50(border)
        for (let y = 50; y < 1650; y+=700) {

            var color_name = names[0];
            var color_hex = hexes[0];

            //draw the rectangle with the color in the correct position
            context.fillStyle = color_hex;
            context.fillRect(x, y, 500, 500);

            //draw the white rectangle that will display the hex and color names
            context.fillStyle = '#ffffff';
            context.fillRect(x, y+500, 500, 150);

            //write the color hex over the white rectangle
            context.font = 'bold 45pt arial';
            context.textAlign = 'start';
            context.fillStyle = '#000000';
            context.fillText(color_hex, x+10, y+570);

            //write the color name over the white rectangle, below the hex
            context.font = '30pt arial';
            context.textAlign = 'start';
            context.fillStyle = '#000000';
            context.fillText(color_name, x+10, y+620);

            //remove the current name and hex from their arrays
            names.shift();
            hexes.shift();
    
        }
    }

    //write to file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('./image.png', buffer);
}

//gets the prominent colors from an image, given a path to an image and a number of desired colors
//returns a promise with arrays containing their names and hexes
function getProminentColors(img, numColors) {

    const results = getPalette(img, numColors, 1)
        .then(palette => {
    
            const hexPal = [];
            const namedPal = [];

            //put the color names and hexes in their own arrays
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

try {
    const results = getProminentColors('./test_img.jpg', 9);
    results.then(result => {
        console.log(result[0]);
        console.log(result[1]);
        genImage(result[0], result[1]);
    });
} 
catch (error) {
    console.log(err);
}

module.exports = {genImage};