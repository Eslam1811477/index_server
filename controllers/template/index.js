import mongoose from "mongoose";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import templatesModel from "../../models/template.js";
import multer from 'multer'
import { cacheDirHandler } from "../handlers.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





const addtemplateImgs = async (req, res) => {

    var imgsNameList = []
    const templatesId = mongoose.Types.ObjectId();
    const cacheDirPath = cacheDirHandler()


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const destinationFolder = `${cacheDirPath}/${templatesId}`;

            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder);
            }
            cb(null, destinationFolder);
        },
        filename: function (req, file, cb) {
            const fname = file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname;
            imgsNameList.push(fname)
            cb(null, fname);
        }
    });

    const upload = multer({ storage: storage }).array('file');

    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error has been detected' });
        } else {
            console.log('New data has been detected in the cache ❗❗❗❗');
            const response = {
                actionDone: true,
                result: {
                    templatesId,
                    imgsNameList
                },
            }
            res.status(202).json(response)
        }
    });
}




const addtemplateData = (req, res) => {
    const newtemplates = new templatesModel({
        _id: mongoose.Types.ObjectId(req.body.templatesId),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        count: req.body.quantity,
        available: req.body.availability,
        imgs: req.body.imgsNameList
    });

    if (newtemplates.save()) {
        const cacheDirPath = cacheDirHandler()
        const cacheFilePath = path.join(
            `${cacheDirPath}/${req.body.templatesId}`
        )
        const savingFilePath = path.join(
            `./store/templatessImg/${req.body.templatesId}`
        )


        if (fs.existsSync(cacheFilePath)) {
            fs.move(cacheFilePath, savingFilePath, (error) => {
                if (error) {
                    console.error('An error occurred while moving the directory:', error);
                    const response = {
                        actionDone: false,
                        msg:`An error occurred while moving the directory: ${error}`,
                    }
                    res.status(500).json(response)
                } else {
                    console.log('Directory moved successfully!');
                    const response = {
                        actionDone: true,
                        msg:'The templates has been added successfully',
                    }
                    res.status(201).json(response)
                }
            })
        }

    }
}









var gettemplates = async (req, res) => {
    const result = await templatesModel.find();

    const modifiedResult = result.map((templates) => {
        templates.imgs = [`collection/img/${templates._id}/${templates.imgs[0]}`];
        return templates;
    });
    res.json(modifiedResult);
};
const getSearchData = async (req, res) => {
    try {
        const { searchKey } = req.params;
        const result = await templatesModel.find({
            name: { $regex: searchKey, $options: "i" }
        });
        const modifiedResult = result.map((templates) => {
            templates.imgs = [`collection/img/${templates._id}/${templates.imgs[0]}`];
            return templates;
        });
        res.json(modifiedResult);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while searching data" });
    }
};
const getSingletemplate = async (req, res) => {
    var result = await templatesModel.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
    });
    let imgUrls = [];
    const templatesId = result._id;
    const templatesImgs = result.imgs;
    for (let i = 0; i < templatesImgs.length; i++) {
        const imageUrl = `collection/img/${templatesId}/${templatesImgs[i]}`;
        imgUrls.push(imageUrl);
    }

    result.imgs = imgUrls;
    res.json(result);
};


const getImg = async (req, res) => {

    const { templatesId } = req.params;
    const { imgName } = req.params;
    const imageFolder = path.join(
        __dirname + `/../../store/templatessImg/${templatesId}/${imgName}`
    );
    if (fs.existsSync(imageFolder)) {
        res.sendFile(imageFolder);
    } else {
        res.status(404).send("Image not found");
    }
};

export {
    addtemplateImgs,
    addtemplateData,
    gettemplates,
    getSingletemplate,
    getSearchData,
    getImg,
};
