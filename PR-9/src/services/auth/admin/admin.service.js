const Admin = require("../../../model/admin.model");

module.exports = class AdminAuthService {
    async registerAdmin(body) {
        try {
            return await Admin.create(body);
        } catch (err) {
            console.log("Admin Register Error: ", err);
        }
    }

    async fetchSingleAdmin(body, isSelect) {
        try {
            if (isSelect) {
                return await Admin.findOne(body).select('_id first_name last_name email phone isActive create_at update_at');
            } else {
                return await Admin.findOne(body);
            }
        } catch (err) {
            console.log("Fetch Sigle Admin Error: ", err);
        }
    }

    async fetchAllAdmin() {
        try {
            return await Admin.find({ isDelete: false }).select('_id first_name last_name email phone isActive create_at update_at');
        } catch (err) {
            console.log("Fetch All Admin Error: ", err);
        }
    }

    async updateAdmin(id, body) {
        try {
            return await Admin.findByIdAndUpdate(id, body, { new: true }).select('_id first_name last_name email phone isActive');
        } catch (err) {
            console.log("Update Admin Error: ", err);
        }
    }
}

