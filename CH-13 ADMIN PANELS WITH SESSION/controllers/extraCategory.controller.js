const Category = require("../model/category.model");
const SubCategory = require("../model/subcategory.model");
const ExtraCategory = require("../model/extracategory.model");
const Product = require("../model/product.model");

module.exports.addExtraCategoryPage = async (req, res) => {
    try {
        const categories = await Category.find();
        const subcategories = await SubCategory.find();

        return res.render('extracategory/addExtraCategoryPage', { categories, subcategories });
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/extracategory/addExtraCategoryPage');
    }
}

module.exports.addExtraCategory = async (req, res) => {
    try {

        const extraCategory = await ExtraCategory.create(req.body);

        if (extraCategory) {
            req.flash('success', "Extra Category added successfully !!");
        }
        else {
            req.flash('error', "Failed to add Extra Category !!");
        }
        return res.redirect('/extracategory/addExtraCategoryPage');

    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/extracategory/addExtraCategoryPage');
    }
}

module.exports.viewExtraCategory = async (req, res) => {
    try {
        const extraCategories = await ExtraCategory.find().populate('category_id').populate('subcategory_id');
        return res.render('extracategory/viewExtraCategoryPage', { extraCategories });
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/extracategory/viewExtraCategory');
    }
}

module.exports.deleteExtraCategory = async (req, res) => {
    try {

        const productDeleted = await Product.deleteMany({ extra_category_id: req.query.Id });

        if (productDeleted) {
            const deleted = await ExtraCategory.findByIdAndDelete(req.query.Id);

            if (deleted) {
                req.flash('success', `${deleted.extra_category_name} Deleted Successfully..`);
            }
            else {
                req.flash('error', "Failed to delete Extra Category !!");
            }
        }
        else {
            req.flash('error', "Failed to delete related products !!");
        }

        return res.redirect('/extracategory/viewExtraCategory');
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/extracategory/viewExtraCategory');
    }
}

module.exports.editExtraCategoryPage = async (req, res) => {
    try {
        const Id = req.params.Id;
        const extraCategoryData = await ExtraCategory.findById(Id);
        const categories = await Category.find();
        const subcategories = await SubCategory.find();
        if (extraCategoryData) {
            return res.render('extracategory/editExtraCategoryPage', { extraCategoryData, categories, subcategories });
        }
        else {
            req.flash('error', "Extra Category not found !!");
            return res.redirect('/extracategory/viewExtraCategory');
        }
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/extracategory/viewExtraCategory');
    }
}
module.exports.editExtraCategory = async (req, res) => {
    try {
        const Id = req.params.Id;
        const extraCategoryData = await ExtraCategory.findByIdAndUpdate(Id, req.body, { new: true });
        if (extraCategoryData) {
            req.flash('success', "Extra Category updated successfully !!");
        }
        else {
            req.flash('error', "Failed to update Extra Category !!");
        }
        return res.redirect('/extracategory/viewExtraCategory');
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/extracategory/viewExtraCategory');
    }
}