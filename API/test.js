console.log("test")
var orig = '[{"sourceid":"TV","sourcename":"TV","displayname":"TV","httpIcon":"","is_signal":"1","has_signal":"1","is_lock":"0","hotel_mode":"0"},{"sourceid":"HDMI1","sourcename":"HDMI1","displayname":"HDMI1","httpIcon":"","is_signal":"0","has_signal":"0","is_lock":"0","hotel_mode":"0"},{"sourceid":"HDMI2","sourcename":"HDMI2","displayname":"HDMI2","httpIcon":"","is_signal":"0","has_signal":"0","is_lock":"0","hotel_mode":"0"},{"sourceid":"HDMI3","sourcename":"HDMI3","displayname":"HDMI3","httpIcon":"","is_signal":"0","has_signal":"1","is_lock":"0","hotel_mode":"0"},{"sourceid":"HDMI4","sourcename":"HDMI4","displayname":"HDMI4","httpIcon":"","is_signal":"0","has_signal":"0","is_lock":"0","hotel_mode":"0"},{"sourceid":"AVS","sourcename":"AV","displayname":"AV","httpIcon":"","is_signal":"0","has_signal":"0","is_lock":"0","hotel_mode":"0"}]';
var resmsg = JSON.parse(orig);
console.log(resmsg);