const Category = require("../model/category.model");
const SubCategory = require("../model/subcategory.model");
const ExtraCategory = require("../model/extracategory.model");
const Product = require("../model/product.model");

module.exports.addSubCategoryPage = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.render('subcategory/addSubCategoryPage', { categories });
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/addSubCategoryPage');
    }
}

module.exports.addSubCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.subcategory_image = req.file.path;
        }

        const newSubCategory = await SubCategory.create(req.body);

        if (newSubCategory) {
            req.flash('success', 'SubCategory Inserted Successfully..');
        } else {
            req.flash('error', 'SubCategory Insertion Failed..');
        }
        return res.redirect('/subcategory/addSubCategoryPage');

    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/addSubCategoryPage');
    }
}

module.exports.viewSubCategoryPage = async (req, res) => {
    try {
        const allSubCategory = await SubCategory.find().populate('category_id', "category_name category_image");

        return res.render("subcategory/viewSubCategoryPage", { allSubCategory });

    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/addSubCategoryPage');
    }
}

module.exports.deleteSubCategory = async (req, res) => {
    try {

        const extracategoryDeleted = await ExtraCategory.deleteMany({ subcategory_id: req.query.Id });

        const productDeleted = await Product.deleteMany({ subcategory_id: req.query.Id });

        if (extracategoryDeleted && productDeleted) {

            const deleted = await SubCategory.findByIdAndDelete(req.query.Id);

            if (deleted) {

                req.flash('success', `${deleted.subcategory_name} Deleted Successfully..`);

            }
            else {
                req.flash('error', "Failed to Delete SubCategory..");
            }
        }

        return res.redirect('/subcategory/viewSubCategoryPage');
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/viewSubCategoryPage');
    }
}

module.exports.editSubCategoryPage = async (req, res) => {
    try {
        const subcategory = await SubCategory.findById(req.params.subcategoryId).populate('category_id');
        const categories = await Category.find();
        return res.render('subcategory/editSubCategoryPage', { subcategory, categories });
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/viewSubCategoryPage');
    }
}

module.exports.updateSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndUpdate(req.params.subcategoryId, req.body);
        req.flash('success', `${req.body.subcategory_name} Updated Successfully..`);


        return res.redirect('/subcategory/viewSubCategoryPage');
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/viewSubCategoryPage');
    }
}