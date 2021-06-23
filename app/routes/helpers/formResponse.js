function formResponse(res, data, status = 200){
    return res.type("text/json").status(status).send({
        type: "SUCCESS",
        data
    })
}

export default formResponse