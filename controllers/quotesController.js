const axios = require('axios');

async function fetchInspirationalQuotes(req, res, next) {
    try {
        const quote = await axios.get('https://zenquotes.io/api/quotes');

        if (quote) {
            return res.status(200).json({ data: quote.data });
        } else {
            return res.status(500).json({ error: "Something went wrong, Please try again later!" });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { fetchInspirationalQuotes };