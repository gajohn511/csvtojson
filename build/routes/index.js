"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var csvtojson_1 = __importDefault(require("csvtojson"));
var promises_1 = __importDefault(require("fs/promises"));
var router = express_1.default.Router();
var filePath = "users.csv";
// middlewear
var middlewear = function () {
    var parserOptions = {
        colParser: {
            phone: function (item, head, resultRow, row, colIdx) {
                var val;
                if (!!item) {
                    val = parseInt(item);
                }
                else {
                    val = "missing data";
                }
                return val;
            }
        }
    };
    var csvParser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var parsedJSON, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, csvtojson_1.default(parserOptions).fromFile(filePath)];
                case 1:
                    parsedJSON = _a.sent();
                    res.locals.json = JSON.stringify(parsedJSON);
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    // console.error(
                    //     `error using csvtojson module to parse file ${filePath}\n`,
                    //     error.message
                    // );
                    res.locals.error = error_1;
                    next();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return csvParser;
};
var saveFactory = function (json) {
    var safePromise = function (promise) {
        return promise.then(function (data) { return [data]; }).catch(function (error) { return [null, error]; });
    };
    var saveToFile = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, item, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, safePromise(promises_1.default.writeFile("users.json", json))];
                case 1:
                    _a = _b.sent(), item = _a[0], error = _a[1];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.writeFile("users.json", json)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    console.error(error_2);
                    throw error_2;
                case 5: throw new Error("error hello world");
            }
        });
    }); };
    return saveToFile;
};
router.get("/", middlewear(), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedJSON, error, saveToFile, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parsedJSON = res.locals.json, error = res.locals.error;
                if (!parsedJSON) {
                    res.status(400).send(error || "there was an internal error");
                    return [2 /*return*/];
                }
                saveToFile = saveFactory(parsedJSON);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, saveToFile()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(400).send(err_1.message);
                return [2 /*return*/];
            case 4:
                res.status(200).send("OK");
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=index.js.map