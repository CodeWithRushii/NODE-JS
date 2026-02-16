const express = require('express');
const { addExtraCategoryPage, addExtraCategory, viewExtraCategory, deleteExtraCategory, editExtraCategoryPage, editExtraCategory } = require('../controllers/extraCategory.controller');
const e = require('connect-flash');

const extracategoryroute = express.Router();

extracategoryroute.get("/addExtraCategoryPage",addExtraCategoryPage);
extracategoryroute.post("/addExtraCategory",addExtraCategory);

extracategoryroute.get("/viewExtraCategory", viewExtraCategory);

extracategoryroute.get("/deleteExtraCategory", deleteExtraCategory);

extracategoryroute.get("/editExtraCategory/:Id", editExtraCategoryPage);
extracategoryroute.post("/updateExtraCategory/:Id", editExtraCategory);
module.exports = extracategoryroute;