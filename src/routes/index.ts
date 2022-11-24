import express from "express";
import csvtojson from "csvtojson";
import fs from "fs/promises";

const router = express.Router();
const filePath = "users.csv";

// middlewear
const middlewear = () => {
    const parserOptions = {
        colParser: {
            phone: function (
                item: any,
                head: any,
                resultRow: any,
                row: any,
                colIdx: any
            ) {
                let val: string | number;
                if (!!item) {
                    val = parseInt(item);
                } else {
                    val = "missing data";
                }
                return val;
            }
        }
    };

    const csvParser = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        let parsedJSON;
        try {
            parsedJSON = await csvtojson(parserOptions).fromFile(filePath);
            res.locals.json = JSON.stringify(parsedJSON);
            next();
        } catch (error) {
            // console.error(
            //     `error using csvtojson module to parse file ${filePath}\n`,
            //     error.message
            // );
            res.locals.error = error;
            next();
        }
    };

    return csvParser;
};

const saveFactory = (json: string) => {
    const saveToFile = async () => {
        try {
            await fs.writeFile("users.json", json);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return saveToFile;
};

router.get("/", middlewear(), async (req, res, next) => {
    const parsedJSON = res.locals.json,
        error = res.locals.error;

    if (!parsedJSON) {
        res.status(400).send(error || "there was an internal error");
        return;
    }

    const saveToFile = saveFactory(parsedJSON);

    try {
        await saveToFile();
    } catch (err) {
        res.status(400).send((err as Error).message);
        return;
    }

    res.status(200).send("OK");
});

export default router;
