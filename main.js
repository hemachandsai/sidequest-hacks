const request = require('request');
const fs = require('fs');
const path = require('path');
const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');

const sideQuestApiURL = 'https://api.sidequestvr.com';
const logFileName = `${new Date().toISOString().split('.')[0].replace(/:/g,"-")}-runtime.log`;
const outputFileName = `${new Date().toISOString().split('.')[0].replace(/:/g,"-")}-output.json`;
const padSpace = "     ";
const appsIds = [];
const responseData = [];
let argParseOutput;

async function main(){
    parseArgs();
    processArgs();

    if(appsIds.length === 0){
        logMessage(`Zero appIDS found from input data. Exiting..`);
        process.exit(1);
    }

    logMessage(`Total Number of apps recieved as input: ${appsIds.length}`);
    
    try{
        for(let i=0; i < appsIds.length; i++){
            logMessage(`Starting for appID: ${appsIds[i]}`);

            let token = await getToken(appsIds[i]);
            response = await grabGameURL(token);
            responseData.push(response);
            
            logMessage(`Ended for appID: ${appsIds[i]}`);
        }
    } catch(e){
        logMessage(e);
    }

    fs.writeFileSync(path.join(__dirname, outputFileName), JSON.stringify(responseData));
    logMessage(`Completed getting urls for apps.\nProgram Stats:\n${padSpace}Input apps count ${appsIds.length}\n${padSpace}URLS Found: ${responseData.length}`);
}

function parseArgs(){
    const parser = new ArgumentParser({
        description: 'SideQuest Hacks usage'
      });
      parser.add_argument('-k', '--key', { help: 'Enter a single app id' });
      parser.add_argument('-ks', '--keys', { help: "Enter multiple app id's(comma separated). Eg:- node main.js --keys 1,2,3,4" });
      parser.add_argument('-u', '--url', { help: 'Enter a single app url. Eg:- node main.js https://sidequestvr.com/app/1/abc' });
      parser.add_argument('-us', '--urls', { help: "Enter multiple app urls's(comma separated). Eg:- node main.js --keys https://sidequestvr.com/app/1/abc,https://sidequestvr.com/app/2/def" });
      argParseOutput = parser.parse_args();     
}


function processArgs(){
    try{
        if(!argParseOutput.key && !argParseOutput.keys && !argParseOutput.url && !argParseOutput.urls){
            logMessage("Atleast one input key is required! Zero recieved. Exiting!!!");
            process.exit(1);
        }
        if(argParseOutput.key && argParseOutput.key.match(/\d+/)){
            appsIds.push(argParseOutput.key);
        }
        if(argParseOutput.keys && argParseOutput.keys.match(/\d+,/)){
            appsIds.push(...argParseOutput.keys.split(","));
        }
        
        if(argParseOutput.url){
            appsIds.push(argParseOutput.url.replace("https://sidequestvr.com/app/", "").split("/")[0]);
        }
        if(argParseOutput.urls){
            argParseOutput.urls.split(",").map((inputString) => {
                appsIds.push(inputString.replace("https://sidequestvr.com/app/", "").split("/")[0]);
            })
        }
    } catch(e){
        logMessage("Something went wrong while processing input args. Please pass in correct values...");
        process.exit(1);
    }
}

function grabGameURL(token){
    return new Promise((resolve, reject) => {
        var options = {
            url: `${sideQuestApiURL}/install-from-key`,
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Origin: 'https://sidequestvr.com',
            },
            rejectUnauthorized: false,
            json: { token: token },
        };
        request(options, function (error, response, body) {
            if (!error && body.data && body.data.apps && body.data.apps.length) {
                if(body.data.apps[0].urls && body.data.apps[0].urls.length > 0){
                    let responseData = {
                        "name": body.data.apps[0].name
                    };
                    body.data.apps[0].urls.map((urlObj) => {
                        switch(urlObj.extn){
                            case 'apk':
                                responseData['apkURL'] = urlObj.link_url;
                                break;
                            case 'obb':
                                responseData['obbURL'] = urlObj.link_url;
                                break;
                            case 'mod':
                                responseData['modURL'] = urlObj.link_url;
                                break;
                        }
                        if(urlObj.provider === "Itch" && !responseData["apkURL"]){
                            responseData['itchURL'] = urlObj.link_url;
                        }
                    })
                    if(responseData.apkURL || responseData.itchURL){
                        logMessage(JSON.stringify(responseData))
                    }
                    resolve(responseData);
                } else {
                    logMessage('No app urls found. App might be a paid one!!');
                    resolve();
                }
            } else {
                logMessage('Error while getting data from sidequest store', error);
                reject(error);
            }
        })
    })
}

function getToken(appId){
    return new Promise((resolve, reject) => {
        var options = {
            url: `${sideQuestApiURL}/generate-install`,
            method: 'POST',
            gzip: true,
            headers: {
                Accept: 'application/json',
                Host: 'api.sidequestvr.com',
                Connection: 'close',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                Origin: 'https://sidequestvr.com',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://sidequestvr.com/',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            json: { "msg": {"apps_id":appId}},
        };
        request(options, function (error, response, body) {
            if (!error && body.data && body.data.key) {
                    resolve(body.data.key);
            } else {
                logMessage('Someting went wrong while trying to get key from Side Quest. Might be sidequest team changed the mechanism :)', error);
                reject(err);
            }
        })
    })
}

function logMessage(msg){
    console.log(msg);
    fs.appendFileSync(path.join(__dirname, logFileName), msg);
}

main();
