# parse-OTL
### Guid to start project
- Download Cisco VPN
- [download mongoDB](https://www.mongodb.com/download-center/community)
- [download nodeJS](https://nodejs.org/)
- clone that repository 
- create a `.env` file, with parameters this repository owner shared with you, in the __root directory__ 
- create a file with name `pass.txt`
- in `pass.txt` write your VPN credentials at following the format
```
VPN_USERNAME
VPN_PASSWORD
```
- specify the __absolute path__ to `pass.txt` in the `.env` file 
- move to the root directory of the project and type: `npm install && npm run start`
- wait for all dependencies are installing 
Afterwards, you should see next: 
```
> parse-otl@1.0.0 start path\to\parse-OTL
> node index.js

{"message":"MongoDB Connected","level":"info","service":"OTL-parser","timestamp":"time-when-script has:been:started"}
Script has started
```