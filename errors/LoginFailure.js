function LoginFailure(message) {
    var error = new Error(message)
    error.statusCode = 401
    error.isOperational = true
    return error
}

module.exports = LoginFailure