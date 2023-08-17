import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
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

    passport.use("login", new localStategy({
        usernameField: "email"
    }, async(username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if(!user) return done(null, false)
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {

        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.d466e224adc3bcf8",
        clientSecret: "71e293a7a68f2f69343cc6dfbd95cd21f5658bea",
        callbackURL: "http://localhost:8080/api/session/github"
    }, async(accesToken, refreshToken, profile, done) => {
        console.log(profile)
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