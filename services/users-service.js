const User = require('./../db/models/user')
const mongoDriver = require('../db/mongoDriver')



async function createUser(name, email, password) {
    const user = new User({ name, password, email })
    const savedUser = await user.save()
    return user
}

async function generateUserToken(user) {
    return await user.generateAuthToken()
}

async function getUser(email, password) {
    const user = await User.findByCredentials(email, password)
    if (!user) throw Error('User login failed!')
    return user
}

async function removeUserToken(id) {
    return await User.removeUserToken(id)
}

async function deleteUser(id) {
    return await User.deleteUser(id)
}

module.exports = {
    createUser,
    generateUserToken,
    getUser,
    removeUserToken,
    deleteUser,
}