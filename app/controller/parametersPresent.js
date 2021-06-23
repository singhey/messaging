function parametersPresent(obj, req) {

    for(let i = 0; i < req.length; i++) {
        if(!obj[req[i]]) {
            throw new Error(`${req[i]} is not present in request`)
        }
    }
}

export default parametersPresent