const Category = require('../../model/category.model');

module.exports = class CategoryService {
    async insertNewCategory(body) {
        try {
            return await Category.create(body);
        } catch (err) {
            console.log("Add New Category Error: ", err);
        }
    }
} 