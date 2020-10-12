const request = require('request');
const fs = require('fs');

function grabGameURL(token){
    return new Promise((resolve, reject) => {
        var options = {
            url: 'https://api.sidequestvr.com/install-from-key',
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
                        console.log(urlObj);
                    })
                    body.data.apps[0].urls.map((urlObj) => {
                        console.log(urlObj);
                        switch(urlObj.extn){
                            case 'apk':
                                console.log('APK URL FOUND');
                                responseData['apkURL'] = urlObj.link_url;
                                break;
                            case 'obb':
                                console.log('OBB URL FOUND');
                                responseData['obbURL'] = urlObj.link_url;
                                break;
                            case 'mod':
                                console.log('MOD URL FOUND');
                                responseData['modURL'] = urlObj.link_url;
                                break;
                        }
                        if(urlObj.provider === "Itch" && !responseData["apkURL"]){
                            console.log('ITCH URL FOUND');
                            responseData['itchURL'] = urlObj.link_url;
                        }
                    })
                    resolve(responseData);
                } else {
                    console.log('Error no app urls found')
                    resolve();
                }
                    // apps.urls[].link_url, extn apk, obb, 'Github Release', 'APK', 'OBB', 'Mod'
            } else {
                console.log('Error while getting link data from oculus', error);
                reject(error);
            }
        })
    })
}

function getToken(appId){
    return new Promise((resolve, reject) => {
        var options = {
            url: 'https://api.sidequestvr.com/generate-install',
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
                console.log('Error while getting key from oculus lol', error);
                reject(err);
            }
        })
    })
}

async function main(){
    let appsIds = [1560]
    try{
        for(let i=0; i < appsIds.length; i++){
            console.log(`Starting for appID: ${appsIds[i]}`);
            let token = await getToken(appsIds[i]);
            let response = await grabGameURL(token);
            console.log(response);
            fs.appendFileSync("./out.txt", JSON.stringify(response) + "\n")
            console.log(`Ended for appID: ${appsIds[i]}`);
        }
    } catch(e){
        console.log(e);
    }
}

main();
