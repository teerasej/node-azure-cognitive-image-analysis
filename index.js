// create '.env' with following variables:
require('dotenv').config();
const key = process.env.key;
const endpoint = process.env.endpoint;

const http = require('https');
const fs = require('fs');
var gm = require('gm');

// computer vision client

// Azure Credential

async function getImage(imageURL, fileName) {

    const downloadingFile = fs.createWriteStream(fileName);

    return new Promise((resolve, reject) => {
        http.get(imageURL, response => {
            downloadingFile.on('finish', () => {
                downloadingFile.close();
                resolve();
            })
            response.pipe(downloadingFile);

        }).on('error', (error) => {
            fs.unlink(fileName);
            reject(error);
        })
    })
}

async function drawRect(object, fileName, resultFileName) {
    let readableImageFileStream = fs.createReadStream(fileName);

    return new Promise((resolve, reject) => {
        gm(readableImageFileStream)
        .stroke('green', 3)
        .fill("rgba( 255, 255, 255 , 0 )")
        .drawRectangle(
            object.rectangle.x,
            object.rectangle.y,
            object.rectangle.x + object.rectangle.w,
            object.rectangle.y + object.rectangle.h
        ).write(resultFileName, (error) => {
            if (!error) {
                console.log('    draw rectanble done.');
                resolve();
            } else {
                console.error(error);
                reject(error);
            };
        })
    });
}

// Authenticate client

(async () => {

    // image file
    let imageURL = 'https://cdn.pixabay.com/photo/2018/07/13/10/20/kittens-3535404_1280.jpg';

    const fileName = imageURL.split('/').pop();

    console.log('Analyzing URL image to describe...', fileName);

    // Describe image
    

    console.log('Analyzing objects in image...', fileName);
    // Object Detection
    
    // download image to draw rect if detect any objects on image's file
    


    console.log('-----');
})()