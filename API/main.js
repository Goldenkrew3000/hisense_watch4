// MQTT <---> API Bridge for Hisense U9G
// 고은별 2023
// im not insane, 약속 ;)

'use strict';

// NPM Imports
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const log = console.log;

// Initialize Express
const app = express();

// 설정
const mqtt_ip = "192.168.5.3";
const mqtt_port = "36669"
const mqtt_user = "hisenseservice";
const mqtt_pass = "multimqttservice";
const mqtt_client_id = "hisense-client";
const mqtt_topic = "#";
const mqtt_key = fs.readFileSync(path.join(__dirname, "./rcm_pem_privkey.pkcs8"));
const mqtt_cert = fs.readFileSync(path.join(__dirname, "./rcm_certchain_pem.cer"));
const express_port = 36668;
const mac_addr = "AA:BB:CC:DD:EE:FF";

// MQTT 연결 설정
const mqtt_options = {
    port: mqtt_port,
    host: mqtt_ip,
    clientId: mqtt_client_id,
    username: mqtt_user,
    password: mqtt_pass,
    protocol: 'mqtts',
    cert: mqtt_cert,
    key: mqtt_key,
    rejectUnauthorized: false
};

// Topics
var topic_getVolume = "/remoteapp/tv/platform_service/" + mac_addr + "/actions/getvolume";
var topic_getState = "/remoteapp/tv/ui_service/" + mac_addr + "/actions/gettvstate";
var topic_getSourceList = "/remoteapp/tv/ui_service/" + mac_addr + "/actions/sourcelist";

var topic_sendKey = "/remoteapp/tv/remote_service/" + mac_addr + "/actions/sendkey";
var topic_sendSleep = "TODO"; // FIX

// 프로그램 시작
log(chalk.magenta("MQTT <---> API Bridge for Hisense U9G"));
log("설정:");
log("Broker: " + mqtt_ip + ":" + mqtt_port);

// TV를 연결해
log("Connecting to MQTT Broker...");
const mqtt_client = mqtt.connect(mqtt_options);

app.get('/get/handler', (req, res) => {
    var param = req.query.param;
    var payload = req.query.payload;
    log(chalk.magenta(`Express: Received Get, Param: ${param}, Payload: ${payload}`));
    handleGet(param, payload);
});

app.get('/send/handler', (req, res) => {
    var param = req.query.param;
    var payload = req.query.payload;
    log(chalk.magenta(`Express: Received Send, Param: ${param}, Payload: ${payload}`));
    handleSend(param, payload);
});






function handleGet(param, payload) {
    var isPayloadEmpty = false;
    if (payload === undefined || payload == "") {
        isPayloadEmpty = true;
    }

    if (param == "volume") {
        mqtt_publish(topic_getVolume);
    } else if (param == "state") {
        mqtt_publish(topic_getState);
    } else if (param == "source") {
        mqtt_publish(topic_getSourceList);
    } else {
        log(chalk.red("HandleGet: Unknown Param"));
    }
}



function handleSend(param, payload) {
    var isPayloadEmpty = false;
    if (payload === undefined || payload == "") {
        isPayloadEmpty = true;
    }

    if (param == "key") {
        mqtt_publish_payload(topic_sendKey, payload);
    } else if (param == "sleep") {
        mqtt_publish(topic_sendSleep);
    } else {
        log(chalk.red("HandleSend: Unknown Param"));
    }
}



mqtt_client.on('message', function(topic, message) {
    var resTopic = topic.toString();
    var resMsg = message.toString();
    var jsonMsg = JSON.parse(resMsg);

    if (resTopic == "/remoteapp/mobile/broadcast/platform_service/actions/volumechange") {
        // TV Changed Volume
    } else if (resTopic == "/remoteapp/mobile/broadcast/ui_service/state") {
        // State Changed
        if (jsonMsg["statetype"] == "livetv") {
            // TV is currently in Live TV mode
            var tv_channel_num = jsonMsg["channel_num"];
            var tv_progname = jsonMsg["progname"];
            var tv_channame = jsonMsg["channel_name"];
            log(chalk.yellow(`Channel: ${tv_channame} / Channel Number: ${tv_channel_num} / Program: ${tv_progname}`));
        } else if (jsonMsg["statetype"] == "app") {
            // TV is currently in an app
            var app_name = jsonMsg["name"];
            var app_url = jsonMsg["url"];
            log(chalk.yellow(`App: ${app_name} / Url: ${app_url}`));
        } else if (jsonMsg["statetype"] == "remote_launcher") {
            // TV is currently in the home app
            log(chalk.yellow("TV is in home app"));
        }
    } else {
        log(chalk.red(`Unknown Topic: ${resTopic} --- ${resMsg}`));
    }
});









function mqtt_publish(mqtt_topic) {
    var mqtt_message = "";
    mqtt_client.publish(mqtt_topic, mqtt_message, (error) => {});
}

function mqtt_publish_payload(mqtt_topic, mqtt_message) {
    mqtt_client.publish(mqtt_topic, mqtt_message, (error) => {});
}

app.get('/', (req, res) => {
    res.send("<html>MQTT <---> API Bridge for Hisense U9G</html>");
});

app.listen(express_port, () => {
    log(chalk.green(`Express: Listening on port ${express_port}`));
});

mqtt_client.on('connect', () => {
    log(chalk.green("MQTT: Connected"));
    mqtt_client.subscribe("#");
});

mqtt_client.on('reconnect', () => {
    log(chalk.yellow("MQTT: Reconnecting"));
})

mqtt_client.on('close', () => {
    log(chalk.red("MQTT: Disconnected"));
});
