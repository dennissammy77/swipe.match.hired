const USER_BASE_MODEL = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const { AUTH_TOKEN_GENERATOR } = require('../middlewares/TOKEN_HANDLER.middleware.js');
const HASH_STRING = require('../middlewares/HASH_STRING.middleware.js');

const SIGN_IN_USER=(async(req,res)=>{
    try{        
		const _QUERY = {email:req.body.email};
        const EXISTING_ACCOUNT = await USER_BASE_MODEL.findOne(_QUERY);
        if (!EXISTING_ACCOUNT){
			console.log('info',`Account, Email(${req.body.email}): not found`);
			return res.status(200).json({
				error:true,
				message:'Wrong credentials, password or email'
			});
		};

		if(bcrypt.compareSync(req.body.password, EXISTING_ACCOUNT?.password)){
			const AUTH_TOKEN = AUTH_TOKEN_GENERATOR({
				_id:			EXISTING_ACCOUNT?._id,
				name:			EXISTING_ACCOUNT?.name,
			});
			
			console.log('info',`${EXISTING_ACCOUNT?.name} signed in`);
			return res.status(200).json({
				error:		false,
				message:	'session.created',
				token:		AUTH_TOKEN
			});
		}else{
			return res.status(200).json({
				error:		true,
				message:	'wrong credentials, password or email'
			});
		}
    }catch(err){
        console.log('error',`System Error[on sign in]`,err);
		return res.status(500).json({
			error:		true,
			message:	'Error occured while signing you in.'	
		});
	}
});

const CREATE_USER=(async(req,res)=>{
    const payload = req.body;
	try{	
		const _QUERY = {email: payload.email};
		// Find existing User
		EXISTING_USER = await USER_BASE_MODEL.findOne(_QUERY)
		if (EXISTING_USER){
			return res.status(200).json({
				error: true,
				message: 'An account with this email already exists. Try signing in'
			});
		}
	
		const HASHED_PASSWORD = HASH_STRING(payload?.password);
		const NEW_USER_BASE_MODEL = await USER_BASE_MODEL.create({
			name:				payload?.name,
			email:				payload?.email,
			password:			HASHED_PASSWORD,
			mobile:				payload?.mobile,
		});
		const auth_token = AUTH_TOKEN_GENERATOR({
			_id:NEW_USER_BASE_MODEL?._id,
			name: payload?.name,
		});
		
		return res.status(200).json({
			error:false,
			message:'sign up successful',
			token: auth_token
		});

		
	}catch(err){
		console.log('error',`System Error: Creating a new user account for ${payload?.name}, Tel:${payload?.mobile}, Email:${payload?.email}.`);
		return res.status(500).json({
			error:	true,
			message:'we could not create your account.'});
	}
})

module.exports = {
    SIGN_IN_USER,
    CREATE_USER
};
