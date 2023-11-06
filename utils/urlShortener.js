const crypto = require('crypto');

class UrlShortener {
    static generateShortUrl() {
        return crypto.randomBytes(3).toString('hex');
    }
}

module.exports = UrlShortener;