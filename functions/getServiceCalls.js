const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const url = 'https://webservices22.autotask.net/ATServicesRest/V1.0/ServiceCalls/query';
const headers = {
    'accept': 'application/json',
    'ApiIntegrationCode': process.env.API_TOKEN,
    'UserName': process.env.USER,
    'Secret': process.env.SECRET,
    'Content-Type': 'application/json'
};

async function getServiceCalls(startPoint) {
    const data = {
        MaxRecords: 500,
        IncludeFields: [],
        Filter: [
            {
                op: 'gt',
                field: 'id',
                value: startPoint,
                udf: false,
                items: []
            }
        ]
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = {
    getServiceCalls
};