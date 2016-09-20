module.exports = {
    consoleLog: consoleLog,
};

function consoleLog(data) {
    if (true === process.env.DEBUG_MODE) {
        console.log(data);
    }
    return false;
}