const User = require("../model/user.model");

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
                return await User.findOne(body).select('_id name email phone isActive create_at update_at');
            } else {
                return await User.findOne(body);
            }
        } catch (err) {
            console.log("Fetch Sigle User Error: ", err);
        }
    }
}

