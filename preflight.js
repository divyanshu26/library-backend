module.exports = (req)=>{
    const isHttpOptions = req.method === 'OPTIONS';
    const hasOriginHeader = req.headers['origin'];
    const hasRequestMethod = req.headers['access-control-request-method'];
    return isHttpOptions && hasOriginHeader && hasRequestMethod;
}