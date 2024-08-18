import { Router } from "express";
import { gettemplates, getSingletemplate, getSearchData, getImg, addtemplateImgs,addtemplateData } from '../../controllers/template/index.js';




var templates = Router();
templates.get('/templates', gettemplates)
templates.get('/template/:id', getSingletemplate)
templates.get('/search/:searchKey', getSearchData)
templates.get('/img/:templateId/:imgName', getImg)
templates.post('/addtemplateImgs', addtemplateImgs)
templates.post('/addtemplateData', addtemplateData)


export default templates;