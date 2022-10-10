var axios = require('axios');
var crypto = require('crypto');
var FormData = require('form-data');
const SUMSUB_APP_TOKEN = "sbx:RFkRv4eFOfefvcnJYsHTIay.wtot7GAhPFbrlrJLXGHwigYmxX2m3iQO" //Your_App_Token_Here;
const SUMSUB_SECRET_KEY = "mKYRTtUb6svbndfhgjgWTwgLA7CI3HxeCqC" //Your_Secret_Key_Here;
const applicantID = "633fc1f826a61621503258627";
var config = {
    method: 'post',
    url: `https://api.sumsub.com/resources/applicants/${applicantID}/status/pending`,
    headers: {
        'Accept': 'application/json',
        'X-App-Token': SUMSUB_APP_TOKEN
    }
};

// Make Signature
function signature() {
    let url = `/resources/applicants/${applicantID}/status/pending`;

    let ts = Math.floor(Date.now() / 1000);
    console.log("Timestamp", ts);
    const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
    signature.update(ts + config.method.toUpperCase() + url);

    if (config.data instanceof FormData) {
        signature.update(config.data.getBuffer());
    } else if (config.data) {
        signature.update(config.data);
    }

    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = signature.digest('hex');
}
signature();



axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });