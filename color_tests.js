const color_list = require('color-name-list');
const {floor, random} = require('mathjs');
const {createCanvas} = require('canvas');
const {writeFileSync} = require('fs');

function genImage() {
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
            var random_color = color_list[floor(random(0, color_list.length))];
            var color_name = random_color.name;
            var color_hex = random_color.hex;

            //draw the rectangle with the color in the correct position
            context.fillStyle = color_hex;
            context.fillRect(x, y, 100, 100);

            //write the color name over the rectangle
            context.font = 'bold 10pt serif';
            context.textAlign = 'center';
            context.fillStyle = '#000';
            context.fillText(color_name, x+50, y+50);
    
        }
    }

    //write to file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('./image.png', buffer);
}

module.exports = {genImage};