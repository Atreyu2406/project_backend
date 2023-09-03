import { fileURLToPath } from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

//Json web token
export const generateToken = user => {
    const token = jwt.sign({ user }, "secret", { expiredIn: "24h" })
    return token
}

export const authToken = (req, res, next) => {
    const token = req.headres.authToken
    if(!token) return res.status(401).json({ error: "No Auth"})
    jwt.verify
}

