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
    console.log('-----');
})()