module.exports.config = {
    name: "sortword",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "ProCoderMew",
    description: "Sắp xếp lại 1 từ tiếng anh bị xáo trộn",
    commandCategory: "game-sp",
    usages: "sortword",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.event = function({ api, event }) {
    if (!global.hasOwnProperty('procodermew')) return;
    if (!global.procodermew.hasOwnProperty('sortword')) global.procodermew.sortword = [];
    const { threadID, body, senderID } = event;
    if (global.procodermew.sortword.some(e => e.user == senderID)) {
        var data = global.procodermew.sortword.find(e => e.user == senderID);
        var index = global.procodermew.sortword.findIndex(e => e.user == senderID);
        if (data.user == senderID && data.thread == threadID && body.toLowerCase() == data.correct.toLowerCase()) {
            return api.sendMessage("Bạn đã sắp xếp chính xác.", threadID, () => {
                global.procodermew.sortword.splice(index, 1);
            }, messageID)
        } else if (data.user == senderID && data.thread == threadID && body.toLowerCase() != data.correct.toLowerCase()) {
            return api.sendMessage("Bạn sắp xếp sai rồi!\nĐáp án đúng là: " + data.correct, threadID, () => {
                global.procodermew.sortword.splice(index, 1);
            }, messageID);
        }
    }
};

module.exports.run = async function({ api, event, args }) {
    if (!global.hasOwnProperty('procodermew')) global.procodermew = {};
    if (!global.procodermew.hasOwnProperty('sortword')) global.procodermew.sortword = [];
    const axios = global.nodemodule["axios"];
    var level, time;
    switch (args[0]) {
        case "easy":
            level = "easy", time = 10;
            break;
        case "medium":
            level = "medium", time = 15;
            break;
        case "hard":
            level = "hard", time = 20;
            break;
        case "extreme":
            level = "extreme", time = 25;
            break;
        default:
            level = "random", time = 10;
            break;
    }
    var { data } = await axios.get("https://simsimi.miraiproject.tk/api/rw?level=" + level);
    api.sendMessage(`Bạn đã chọn level ${level} với thời gian ${time}s.`, threadID, async () => {
        api.sendMessage("Chuẩn bị.", threadID);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api.sendMessage(data.random.join(", "), threadID, async () => {
            global.procodermew.sortword.push({
                user: senderID,
                thread: threadID,
                correct: data.correct
            });
            await new Promise(resolve => setTimeout(resolve, time * 1000));
            if (global.procodermew.sortword.some(e => e.user == senderID)) {
                var index = global.procodermew.sortword.findIndex(e => e.user == senderID);
                api.sendMessage("Đã hết thời gian quy định!", threadID, () => global.procodermew.sortword.splice(index, 1), messageID);
            }
        });
    }, messageID);
}
