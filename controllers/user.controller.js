const USER_BASE_MODEL = require("../models/user.model.js");

const FETCH_USER_DATA=(async(req,res)=>{
    console.log('info',`Fetching user details, id:${req.params.userid}`)
    const USER_ID = req.params.userid;
    try{
        const EXISTING_ACCOUNT = await USER_BASE_MODEL.findById(USER_ID);
        if (!EXISTING_ACCOUNT){
            return res.status(200).send({error:true,message:'This User does not have an existing account'});
        };
        return res.status(200).send({
            error:false,
            data:EXISTING_ACCOUNT
        });
    }catch(error){
		console.error(error)
        console.log('error',`System Error-[Fetching user details, id:${USER_ID}]`)
        return res.sendStatus(500);
    }
});

// UPDATE_USER_DATA
const UPDATE_USER_DATA=(async(req,res)=>{
    console.log('info',`Updating user details, id:${req.params.userid}`)
    const USER_ID = req.params.userid;
    try{
        const EXISTING_ACCOUNT = await USER_BASE_MODEL.findByIdAndUpdate(USER_ID, req.body, {new: true});
        if (!EXISTING_ACCOUNT){
            return res.status(200).send({error:true,message:'This User does not have an existing account'});
        };
        return res.status(200).send({
            error:false,
            data:EXISTING_ACCOUNT
        });
    }catch(error){
        console.error(error)
        console.log('error',`System Error-[Updating user details, id:${USER_ID}]`)
        return res.sendStatus(500);
    };
})

module.exports = {
    FETCH_USER_DATA,
    UPDATE_USER_DATA
};