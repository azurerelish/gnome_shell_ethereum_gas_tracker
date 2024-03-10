const Mainloop = imports.mainloop;
const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;

let _httpSession;
let _indicator;

function init() {
    _httpSession = new Soup.Session();
    _indicator = new St.Label({ text: 'Loading...',style: 'font-size: 13px; margin: 4px;' });
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(_indicator, 0);
    getGasPrices();
    Mainloop.timeout_add_seconds(6, function () {
        getGasPrices();
        return true; // Ensures the timeout is called again
    });
}

function disable() {
    Main.panel._rightBox.remove_child(_indicator);
}

function getGasPrices() {
    let message = Soup.Message.new('GET', 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken');
    _httpSession.queue_message(message, function (_httpSession, message) {
        if (message.status_code !== 200)
            return;
        let json = JSON.parse(message.response_body.data);
        let safeGasPrice = json.result.SafeGasPrice;
        let fastGasPrice = json.result.FastGasPrice;
        _indicator.set_text(`Safe: ${safeGasPrice}, Fast: ${fastGasPrice}`);
    });
}
