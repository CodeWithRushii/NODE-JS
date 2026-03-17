module.exports.successResponse = (status, error = false, message, result) => {
    return { status, error, message, result };
}

module.exports.errorResponse = (status = 500, error = true, message) => {
    return { status, error, message };
}