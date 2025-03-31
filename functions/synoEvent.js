const axios = require('axios');
var { login } = require('./synoLogin.js')

async function create(summary, start, end, color, description) {
    let obj = await login()
    let token = obj['token']
    let sid = obj['sid']
    let did = obj['did']

    let options = {
        method: 'POST',
        url: process.env.SYNLINK,
        headers: {
            cookie: 'id=' + sid + "; did=" + did,
            'X-SYNO-TOKEN': token,
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        data: {
            api: 'SYNO.Cal.Event',
            method: 'create',
            version: '5',
            cal_id: '"/Telecorp/hrbnf/"',
            original_cal_id: '"/Telecorp/hrbnf/"',
            summary: summary,
            is_all_day: 'false',
            tz_id: '"America/New_York"',
            dtstart: start,
            dtend: end,
            is_repeat_evt: 'false',
            color: color,
            description: description,
            participant: '[]',
            notify_setting: '[]'
        }
    }

    axios.request(options).then(function (response) {
        console.log(JSON.stringify(response.data));
    }).catch(function (error) {
        console.error(error);
    });
}

module.exports = {
    create
}