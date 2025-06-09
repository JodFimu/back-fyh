import { hash } from "argon2"
import User from "../src/user/user.model.js"

const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'ADMIN_ROLE' })
 
        if (!existingAdmin) {
            const aEmail = 'admin@gmail.com'
            const aPassword = 'Admin123@'
 
            const encryptedPassword = await hash(aPassword)
 
            const aUser = new User({
                name: 'Admin',
                username: 'admin1',
                email: aEmail,
                password: encryptedPassword,
                role: 'ADMIN_ROLE',
                profilePicture: "https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png"
            })
 
            await aUser.save()
            console.log('The default admin has been created successfully')
        } else {
            console.log('There is already an admin in the system, another one will not be created')
        }
    } catch (err) {
        console.error('Error creating default admin:', err)
    }
}

export default createDefaultAdmin