
<center>

# SIDEQUEST HACKS
<img style="width: 150px" src="logo/logo.jpg">
<p style="color: rgb(36, 41, 46, 0.8); font-size: 13.5px; text-align:center;margin: 0 30%;">Written with love for Virtual Reality&#129505;&#129505; Coded in Javascript&#128521;&#128536;&#128521
</p></br>

[Submit an issue](https://github.com/hemachandsai/sidequest-hacks/issues/new)

</center>
<hr/>

## What is this project for?
 - The main purpose of the project is to retrieve app's source urls published by developers, which are listed on the **SideQuest** Store. 

## Prerequisites
- Install [NodeJS](https://nodejs.org/en/download/) along with [NPM](https://www.npmjs.com/)

## How to use
- Once Nodejs and NPM are installed you can run the main.js using node.
```
usage: node main.js [-h] [-k KEY] [-ks KEYS] [-u URL] [-us URLS]

arguments:
-h, --help            show this help message and exit
-k KEY, --key KEY     Enter a single app id
-ks KEYS, --keys KEYS
                        Enter multiple app id's(comma separated). Eg:- node main.js --keys 1,2,3,4
-u URL, --url URL     Enter a single app url. Eg:- node main.js https://sidequestvr.com/app/1/abc
-us URLS, --urls URLS
                        Enter multiple app urls's(comma separated). Eg:- node main.js --keys https://sidequestvr.com/app/1/abc,https://sidequestvr.com/app/2/def
```

## Examples
```
node main.js --key 567 [OR]
node main.js --keys 567,1042 [OR]
node main.js --url https://sidequestvr.com/app/567/cosmic-flow-a-relaxing-vr-experience [OR]
node main.js --url https://sidequestvr.com/app/567/cosmic-flow-a-relaxing-vr-experience,https://sidequestvr.com/app/1042/liminal
```
#### How to Get APPID's
If https://sidequestvr.com/app/1042/liminal is the url then **1042** is the **appID**