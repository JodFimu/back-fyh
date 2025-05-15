import User from "../user/user.model.js";

export const emailExists = async (email = "") => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    console.log(existe)
    if(!existe){
        throw new Error("The user does not exist")
    }
}

export const isClient = async (uid = " ") =>{
    const existe = await User.findById(uid)
    console.log(existe)
    if(!existe){
        throw new Error("The client does not exist")
    }

    if(existe.role !== "CLIENT_ROLE" && existe.role !== "HOST_ROLE"){
        throw new Error("Is not a client")
    }
}

export const isAdmin = async (uid = " ") =>{
    const existe = await User.findById(uid)
    console.log(existe)
    if(!existe){
        throw new Error("The admin does not exist")
    }

    if(existe.role !== "ADMIN_ROLE" ){
        throw new Error("Is not a admin")
    }
}
