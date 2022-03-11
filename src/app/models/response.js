module.exports = {
    requestResponse: (data, success, message, error, details) => {
        var response = {};

        data ? response.data = data : null;
        success ? response.success = success : response.success=false;
        message ? response.message = message : null;
        error ? response.error = error : null;
        details ? response.details = details : null;

        return response;
    },


}