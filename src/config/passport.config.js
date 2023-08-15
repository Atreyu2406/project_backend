import passport from "passport";
import local from "passport-local"
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const localStategy = local.Strategy

const initializePassport = () => {
    passport.use("register", new localStategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if(user) {
                console.log("User already exists")
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done("error al obtener el user", false)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport