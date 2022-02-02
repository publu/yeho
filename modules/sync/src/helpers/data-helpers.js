const formatReturnData = async (error, data) => {
    if (error) {
        return { data: null, error: true, message: error.message }
    }

    return { data: data, error: false, message: null };
}

module.exports = {
    formatReturnData
};