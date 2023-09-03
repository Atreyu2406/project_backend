import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
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
            const cartForNewUser = await cartModel.create()
            const newUser = {
                first_name, last_name, email, age, password: createHash(password), cart: cartForNewUser._id, role: (email === "adminCoder@coder.com" ? "admin" : "user")
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
        callbackURL: "http://localhost:8080/session/githubcb"
    }, async(accesToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if(user) return done(null, user)
            const newUser = await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
                password: " "
            })
            return done(null, newUser)
        } catch(err) {
            return done(`${ err.message }`)
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