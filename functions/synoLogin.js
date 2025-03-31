const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.SYNLINK;
const params = {
    api: 'SYNO.API.Auth',
    version: 3,
    method: 'login',
    account: process.env.SYNUSER,
    passwd: process.env.SYNPASS,
    session: 'Calendar',
    enable_syno_token: 'yes',
    format: 'cookie',
};

async function login() {
    try {
        const response = await axios.get(url, { params });
        let login = {
            token: response.data["data"]["synotoken"],
            sid: response.data["data"]["sid"],
            did: response.data["data"]["did"]
        }
        return login;
    } catch (error) {
        console.error('Login failed:', error);
        return error;
    }
}

module.exports = {
    login
}