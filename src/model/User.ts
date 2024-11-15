import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document{
    content : string;
    createdAt: Date;
}

const MessageSchema : Schema<Message>=new Schema({
    content :{
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
    
})

export interface User extends Document{
    username : string;
    email : string;
    verifycode : string;
    verifyCodeExpiry : Date;
    isAcceptingMessage : boolean;
    isVerified : boolean;
    messages : Message[]
}

const UserSchema : Schema<User>=new Schema({
    username :{
        type : String,
        required : [true, "Username is required"],
        trim : true,
        minlength : [3, "Username must be at least 3 characters long"],
        unique : true

    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        match: [
            /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please use a valid email address',
        ],
        password : {
            type : String,
            required : [true, "Password is required"]
        },
        verifyCode: {
            type : String,
            required : [ true, "Verify code is required"]
            
        },
        verifyCodeExpiry: {
            type : Date,
            required : [ true, "Verify  expiry code is required"]
            
        },
        isVerified: {
            type : Boolean,
            default : false            
        },
        isAcceptingMessage: {
            type : Boolean,
            default : false            
        },
        messages: [MessageSchema]
        
    }
})
    
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;