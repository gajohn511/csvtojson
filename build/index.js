"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./routes/index"));
var app = express_1.default();
var port = 3000;
app.get("/", function (req, res) {
    res.redirect("/convert");
});
app.use("/convert", index_1.default);
// start the Express server
app.listen(port, function () {
    var time = new Date().toLocaleString("en-US");
    console.log("[" + time + "] server started at http://localhost:" + port);
});
//# sourceMappingURL=index.js.map