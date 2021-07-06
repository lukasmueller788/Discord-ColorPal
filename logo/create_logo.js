const colorNameList = require('color-name-list');
const {floor, random} = require('mathjs');
const {createCanvas} = require('canvas');
const {writeFileSync} = require('fs');

const colors = [];

//discord avatar size = 128x128px
//150x150 = 22500
for (let i = 0; i < 22500; i++) {
    colors.push(colorNameList[floor(random(0, colorNameList.length))].hex);
}

const w = 150;
const h = 150;
const canvas = createCanvas(w, h);
const context = canvas.getContext('2d');

for (let x = 0; x < 150; x+=5) {
    for (let y = 0; y < 150; y+=5) {
        
        var color_hex = colors[0];

        context.fillStyle = color_hex;
        context.fillRect(x, y, 5, 5);

        colors.shift();
    }   
}

const buffer = canvas.toBuffer('image/png');
writeFileSync('./logo.png', buffer);