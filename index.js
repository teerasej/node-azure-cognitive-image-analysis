// create '.env' with following variables:
require('dotenv').config();
const key = process.env.key;
const endpoint = process.env.endpoint;

const http = require('https');
const fs = require('fs');
var gm = require('gm');
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

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


const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

(async () => {

    let imageURL = 'https://cdn.pixabay.com/photo/2018/07/13/10/20/kittens-3535404_1280.jpg';

    const fileName = imageURL.split('/').pop();

    console.log('Analyzing URL image to describe...', fileName);
    const caption = (await computerVisionClient.describeImage(imageURL)).captions[0];
    console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);

    console.log('Analyzing objects in image...', fileName);
    const objects = (await computerVisionClient.analyzeImage(imageURL, { visualFeatures: ['Objects'] })).objects;

    if(objects.length > 0) {
        console.log(`   Found ${objects.length} objects.`);

        // download image
        await getImage(imageURL, fileName);

        for (let index = 0; index < objects.length; index++) {
            const object = objects[index];
            console.log(`   ${object.object} (${object.confidence.toFixed(2)} confidence)`)

        
            // draw rect 
            if( index == 0 ) {
                await drawRect(object, fileName, 'result.png');
            } else {
                await drawRect(object, 'result.png', 'result.png');
            }
            
        }
       
    } else {
        console.log('No object found.');
    }


    console.log('-----');
})()