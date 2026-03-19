const User = require("../../../model/user.model");

module.exports = class UserAuthService {
    async registerUser(body) {
        try {
            return await User.create(body);
        } catch (err) {
            console.log("User Register Error: ", err);
        }
    }

    async fetchSingleUser(body, isSelect) {
        try {
            if (isSelect) {
                return await User.findOne(body).select('_id first_name last_name email phone gender address isActive create_at update_at');
            } else {
                return await User.findOne(body);
            }
        } catch (err) {
            console.log("Fetch Sigle User Error: ", err);
        }
    }

    async fetchAllUser() {
        try {
            return await User.find({ isDelete: false }).select('_id first_name last_name email phone gender address isActive create_at update_at');
        } catch (err) {
            console.log("Fetch All User Error: ", err);
        }
    }

    async updateUser(id, body) {
        try {
            return await User.findByIdAndUpdate(id, body, { new: true }).select('_id first_name last_name email phone gender address isActive create_at update_at');
        } catch (err) {
            console.log("Update User Error: ", err);
        }
    }
}

