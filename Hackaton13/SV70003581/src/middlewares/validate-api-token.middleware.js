const validateApiToken = (req=request, res=response, next) => {
    try{
        const apiToken = req.header("api-token");
        const apitkn = process.env.API_TOKEN;       
        if(apiToken==apitkn){
            next();
        }else{
            res.status(401).json({
                message: "Invalid api-token"                
            });
        }        
    }catch(err){
        res.status(500).json({
            message: "Error in validate token middleware",
            error: err.message,
        });
    }
}

export { validateApiToken };