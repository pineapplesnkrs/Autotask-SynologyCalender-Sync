const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function getCompany(id) {
    const url = `https://webservices22.autotask.net/ATServicesRest/V1.0/Companies/${id}`;
    const headers = {
        'accept': 'application/json',
        'ApiIntegrationCode': process.env.API_TOKEN,
        'UserName': process.env.USER,
        'Secret': process.env.SECRET,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = {
    getCompany
}