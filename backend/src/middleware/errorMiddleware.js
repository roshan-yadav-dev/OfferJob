const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = res.statusCode || 500;

    let message = err.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
