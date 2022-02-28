// create '.env' with following variables:
require('dotenv').config();
const key = process.env.key;
const endpoint = process.env.endpoint;

const fs = require('fs');
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;



const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

(async () => {

    let imageURL = 'https://www.thesprucepets.com/thmb/beAAL4NaD8_zLL0BM13Tv6IbqV0=/1500x1000/filters:fill(auto,1)/kitten-56a09ff83df78cafdaa36304.jpg';

    console.log('Analyzing URL image to describe...', imageURL.split('/').pop());
    const caption = (await computerVisionClient.describeImage(imageURL)).captions[0];
    console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);

    console.log('-----');
})()