"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const xml2js_1 = __importDefault(require("xml2js"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/getData', (req, res) => {
    fs_1.default.readFile('./Assets/asset.kml', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        xml2js_1.default.parseString(data, (err, result) => {
            if (err) {
                return res.status(500).json({ message: err });
            }
            const names = result.kml.Document[0].Placemark.map((place) => ({
                name: place.name[0],
            }));
            return res.status(200).json(names);
        });
    });
});
app.post('/getAddressOutput', (req, res) => {
    const addressData = {
        'Stumpergasse 51, 1060 Vienna': 'au_vienna_schoenbrunnerstr',
        'Ungargasse 17, Vienna, Austria': 'au_vienna_landstrasserhauptstr',
        'Linzer Straße 7, Vienna, Austria': 'au_vienna_dreyhausenstr',
        'Maurer Hauptplatz 7, 1230 Wien, Austria': 'au_vienna_maurerhauptplatz',
    };
    const inputAddress = req.body.address;
    if (!inputAddress || inputAddress.length === 0)
        return res
            .status(400)
            .json({ code: 400, message: 'Address field is required' });
    const output = addressData[inputAddress];
    if (!output) {
        return res.status(200).json({ success: false, message: 'not found' });
    }
    return res.json({ success: true, address: output });
});
app.use(express_1.default.static(path_1.default.join(__dirname, '../FE_build')));
// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../FE_build/index.html'));
});
app.listen(PORT, () => {
    console.log(`[server]: App is running on http://localhost:${PORT}`);
});
