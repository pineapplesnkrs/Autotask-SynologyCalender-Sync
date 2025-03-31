var { getApt } = require("./functions/getAppointments.js")
var { getServiceCalls, getServiceCalls } = require("./functions/getServiceCalls.js")
var { create } = require("./functions/synoEvent.js")
var { getCompany } = require("./functions/getCompany.js")

let aptCount = 0;
let serviceCount = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
    let run = true;
    await getCounts();
    try {
        while (run) {
            console.log("checking")
            await monitorEvents()
            console.log("waiting")
            await sleep(20000)
        }
    } catch (e){
        console.log(e)
        console.log("run loop crashed, attempting restart")
        start();
    }
}

async function getCounts() {
    let aptStartPoint = 0;
    let serviceStartPoint = 0;

    let appointments = await getApt(aptStartPoint)
    let serviceCalls = await getServiceCalls(serviceStartPoint)

    aptCount = appointments['pageDetails']['count']
    serviceCount = serviceCalls['pageDetails']['count']
}

async function monitorEvents() {
    let oldApt = aptCount
    let oldService = serviceCount
    await getCounts()

    if (aptCount > oldApt) {
        let appointments = await getApt(0)
        let highestAptID = appointments['items'][oldApt - 1]['id']
        let aptShortList = await getApt(highestAptID)

        console.log(aptCount - oldApt + " new appointments")
        await createEvent(aptShortList, 'a')
    }

    if (serviceCount > oldService) {
        let serviceCalls = await getServiceCalls(0)
        let highestServiceID = serviceCalls['items'][oldService - 1]['id']
        let serviceShortList = await getServiceCalls(highestServiceID)

        console.log(serviceCount - oldService + " new service calls")
        await createEvent(serviceShortList, 's')
    }
}

async function createEvent(events, type) {
    let title = "";
    let color = "";
    for (const event of events['items']) {
        if (type == "a") {
            color = "#d30000"
            if (event['title'] == "(New Appointment)") {
                title = event['description']
            } else if (event['title'].startsWith("(New Appointment)")) {
                title = event['title'].substring(17)
            } else {
                title = event['title']
            }
            console.log(title)
        } else if (type == "s") {
            color = "#00a9b2"
            let company = await getCompany(event['companyID'])
            title = company['item']['companyName']
            console.log(title)
        }

        let start = new Date(event['startDateTime']).valueOf();
        start = start.toString().slice(0, 10)
        let end = new Date(event['endDateTime']).valueOf();
        end = end.toString().slice(0, 10)

        console.log("attempt event create")
        await create(title, start, end, "\"" + color + "\"", "\"" + event['description'] + "\"");
    }
}

start()