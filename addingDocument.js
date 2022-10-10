var axios = require('axios');
var crypto = require('crypto');
var FormData = require('form-data');
var fs = require('fs');


var data = new FormData();
var metadata = {
    idDocType: 'ID_CARD',
    idDocSubType: 'FRONT_SIDE',
    country: 'PAK'
};

data.append('metadata', JSON.stringify(metadata));
var filePath1 = "./images_2.jpeg";
var content = fs.readFileSync(filePath1);
data.append('content', content, filePath1);

var config = {
    method: 'post',
    url: 'https://api.sumsub.com/resources/applicants/633fc1f826a6160001968627/info/idDoc',
    headers: {
        ...data.getHeaders()
    },
    data: data
};

function signature() {
    const SUMSUB_APP_TOKEN = "sbx:RFkRv4eFOfefvcnJYsHTIay.wtot7GAhPFbrlrJLXGHwigYmxX2m3iQO" //Your_App_Token_Here;
    const SUMSUB_SECRET_KEY = "mKYRTtUb6svbndfhgjgWTwgLA7CI3HxeCqC" //Your_Secret_Key_Here;
    const applicantID = "633fc1f826a61621503258627";
    let url = `/resources/applicants/${applicantID}/info/idDoc`;

    let ts = Math.floor(Date.now() / 1000);
    console.log("Timestamp", ts);
    const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
    signature.update(ts + config.method.toUpperCase() + url);

    if (config.data instanceof FormData) {
        signature.update(config.data.getBuffer());
    } else if (config.data) {
        signature.update(config.data);
    }

    config.headers['X-App-Token'] = SUMSUB_APP_TOKEN;
    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = signature.digest('hex');
}
signature()

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
