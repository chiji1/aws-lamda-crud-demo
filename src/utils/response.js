const success = (res,
                        status = 201,
                        entity,
                        msg = 'Success') => res
    .status(status || 200)
    .json({
        statusCode: status || 200,
        success: true,
        body: entity || [],
        payload: entity || [],
        message: msg || "Operation Successful(s)",
    });

const fail = (res, status = 404, msg = 'No result found') => res.status(status || 500)
    .json({
        statusCode: status,
        success: false,
        body: [],
        payload: [],
        message: msg || "Operation failed!",
    });

module.exports = {
    success,
    fail
}
