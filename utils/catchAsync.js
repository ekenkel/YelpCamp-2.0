// Wrapper Function
// Returns a function that executes a function. It then executes a function but it catches any errors and passes it to next
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}