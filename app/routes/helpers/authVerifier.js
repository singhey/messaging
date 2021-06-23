import checkRole from "./checkRole"

function authVerifier(req, res, next) {
    try {
        checkRole(req, ["USER"])
        next()
    }catch(err) {
        next({message: err.message, status: 401})
    }
}

export default authVerifier