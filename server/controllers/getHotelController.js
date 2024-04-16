const axios = require("axios")
const { getJson } = require("serpapi");

exports.getHotelInfo = async (req, res) => {
    try {
        console.log(req.body);
        const {arrAP,depAP,depTM} = req.body
        await getJson({
            engine: "google_flights",
            hl: "en",
            gl: "us",
            type:2,
            departure_id: depAP,
            arrival_id: arrAP,
            outbound_date: depTM,
            currency: "USD",
            api_key: process.env.FLIGHTS_API_KEY
        }, (json) => {
            console.log(json.best_flights);
            res.send(json.best_flights)
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};