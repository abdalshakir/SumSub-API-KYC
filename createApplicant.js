// import axios from "axios";
const { default: axios } = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');

const SUMSUB_APP_TOKEN = "sbx:RFkRv4eFOfefvcnJYsHTIay.wtot7GAhPFbrlrJLXGHwigYmxX2m3iQO" //Your_App_Token_Here;
const SUMSUB_SECRET_KEY = "mKYRTtUb6svbndfhgjgWTwgLA7CI3HxeCqC" //Your_Secret_Key_Here;
const SUMSUB_BASE_URL = 'https://api.sumsub.com';


let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-App-Token': SUMSUB_APP_TOKEN
}
let levelName = "basic-kyc-level";
let url = "/resources/applicants?levelName=" + levelName;
// -----------------------------------------------------------------------------------------------------
let config = {
    baseURL: SUMSUB_BASE_URL,
    headers: headers,
    method: "post",
    url: url,
};
// -----------------------------------------------------------------------------------------------------
let externalUserId = Math.random().toString(36).substr(2, 9);
console.log("External User ID: " + externalUserId);

let fullURL = SUMSUB_BASE_URL + url;
console.log("Full URL: " + fullURL);

// Creating Signature and Applicant
function createSignatureAndApplicant() {

    let body = {
        externalUserId: externalUserId
    };
    config.data = JSON.stringify(body);

    // -----------------------------------------------------------------------------------------

    let ts = Math.floor(Date.now() / 1000);
    const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
    signature.update(ts + config.method.toUpperCase() + url);

    if (config.data instanceof FormData) {
        signature.update(config.data.getBuffer());
    } else if (config.data) {
        signature.update(config.data);
    }

    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = signature.digest('hex');

    return config;
}

console.log(createSignatureAndApplicant());



let axiosConfig = {
    headers: config.headers
}

axios.post(url, config.data, axiosConfig).then((res) => {
    console.log("Response Received: ", res)
}).catch((error) => {
    console.log("Axios Error: ", error);
})

// -------------------------------------------------------------------------------

// Adding Document