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
    const safePromise = (promise: Promise<void>) => {
        return promise.then((data) => [data]).catch((error) => [null, error]);
    };

    const saveToFile = async () => {
        const [item, error] = await safePromise(
            fs.writeFile("users.json", json)
        );

        if (error) {
            throw new Error(error);
        }
    };

    return {
        saveToFile
    };
};

router.get("/", middlewear(), async (req, res, next) => {
    if (!res.locals.json) {
        return res.status(400).send(res.locals.error);
    }

    const factory = saveFactory(res.locals.json);
    await factory
        .saveToFile()
        .catch((error) => res.status(400).send(error.message));
    res.status(200).send("OK");
});

export default router;
