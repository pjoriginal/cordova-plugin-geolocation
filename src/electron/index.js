let geolocation = null;
let locator = null;
if (/^win/i.test(process.platform)) {
    geolocation = require('@nodert-win10-rs4/windows.devices.geolocation');
    locator = new geolocation.Geolocator();
}

module.exports = {
    getLocation: ([options]) => {
        options = parseParameters(options);
        return new Promise((resolve, reject) => {
            if (locator) {
                locator.DesiredAccuracy = options.enableHighAccuracy ? geolocation.PositionAccuracy.high : geolocation.PositionAccuracy.default;
                locator.getGeopositionAsync((error, geocoord) => {
                    const position = {};
                    if (error) {
                        reject(error);
                        return;
                    }
                    position.accuracy = geocoord.coordinate.accuracy;
                    position.altitudeAccuracy = geocoord.coordinate.altitudeAccuracy;
                    position.heading = geocoord.coordinate.heading;
                    position.altitude = geocoord.coordinate.altitude;
                    position.latitude = geocoord.coordinate.latitude;
                    position.longitude = geocoord.coordinate.longitude;
                    resolve(position);
                });
            } else {
                reject(new Error('Not Supported'));
            }
        });
    }
};

function parseParameters (options) {
    var opt = {
        maximumAge: 0,
        enableHighAccuracy: false,
        timeout: Infinity
    };

    if (options) {
        if (options.maximumAge !== undefined && !isNaN(options.maximumAge) && options.maximumAge > 0) {
            opt.maximumAge = options.maximumAge;
        }
        if (options.enableHighAccuracy !== undefined) {
            opt.enableHighAccuracy = options.enableHighAccuracy;
        }
        if (options.timeout !== undefined && !isNaN(options.timeout)) {
            if (options.timeout < 0) {
                opt.timeout = 0;
            } else {
                opt.timeout = options.timeout;
            }
        }
    }

    return opt;
}
