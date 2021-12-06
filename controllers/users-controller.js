const { body, validationResult } = require('express-validator')
const InvalidParamError = require('./../errors/InvalidParamError')
const InternalError = require('../errors/InvalidParamError')
const UsersService = require('./../services/users-service')
const LoginFailure = require('../errors/LoginFailure')




async function createUser(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(InvalidParamError(errors.array()[0].msg));
    }

    const { name, email, password } = req.body
    try {
        const user = await UsersService.createUser(name, email, password)
        console.log("user", user)
        const token = await UsersService.generateUserToken(user)
        res.status(201).send({ user, token })
    } catch (e) {
        next(e)
    }
}

async function loginUser(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(InvalidParamError(errors.array()[0].msg));
    }

    const { email, password } = req.body
    try {
        //TODO 1. generate user's token (via UsersService)
        const user = await UsersService.getUser(email, password)
        console.log("user", user)
        //TODO 2. return user and token (via UsersService)
        const token = await UsersService.generateUserToken(user)
        res.status(201).send({ user, token })
    } catch (e) {
        throw LoginFailure('User login failed!')
    }
}

async function logoutUser(req, res, next) {
    try {
        //TODO 1. take user from req and 
        const { user } = req.body
        // Clean user (on MongoDB) token (via UsersService)
        const id = user.id
        const userWithoutToken = await UsersService.removeUserToken(id)
        //TODO 2. save user (via UsersService)
        //TODO 3. return user without token
        res.status(201).send({ userWithoutToken })
    } catch (e) {
        //TODO 4. throw proper error
        throw InternalError("Failed to logout: " + e)
    }
}

async function deleteUser(req, res, next) {
    const userId = req.params.id
    try {
        //TODO 1. delete user (via UserService)
        // const user = await User.findOne({ _id: userId })
        const deletedUser = await UsersService.deleteUser(userId)
        //TODO 2. send deleted user
        return res.status(200).json(deletedUser)
    } catch (e) {
        //TODO 3. throw proper error
        return res.status(404).json({ error: `No user with id ${userId}` })
    }
}

function validate(method) {
    switch (method) {
      case 'createUser': {
        return [
          body('email', 'email dosnt exists or invalid').exists().isEmail(),
          body('name', 'name dosnt not exists or invalid').exists().isString().escape(),
          body('password', 'password doesn\'t exists').exists().isString(),
        ]
      }
    case 'loginUser': {
            return [
                body('email', 'email dosnt exists or invalid').exists().isEmail(),
                body('password', 'password doesn\'t exists').exists().isString(),
            ]
        }
    }
  }


module.exports = { createUser, loginUser, logoutUser, deleteUser, validate }