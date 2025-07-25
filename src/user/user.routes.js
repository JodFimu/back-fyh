import { Router } from "express";
import { getUserById, getUsers, deleteUserAdmin, updatePassword, updateUserUser, updateUserAdmin, updateRole, 
    deleteUserClient, updateProfilePicture, getUserReservations, getUserLogged} from "./user.controller.js";
import { getUserByIdValidator, updatePasswordValidator, deleteUserValidatorClient, deleteUserValidatorAdmin, 
    createUserValidation, updateRoleValidator, getUserValidation, updateProfilePictureValidator, getUserReservationsValidator, getRoleValidator } from "../middlewares/user-validator.js";
import { register } from "../auth/auth.controller.js";
import { cloudinaryUploadMiddleware } from "../middlewares/img-uploads.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */


/**
 * @swagger
 * /users/findUser/{uid}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/findUser/:uid", getUserByIdValidator, getUserById);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", getUserValidation, getUsers);

/**
 * @swagger
 * /users/deleteUserAdmin/{uid}:
 *   delete:
 *     summary: Delete a user by admin
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/deleteUserAdmin/:uid", deleteUserValidatorAdmin, deleteUserAdmin);

/**
 * @swagger
 * /users/deleteUserClient:
 *   delete:
 *     summary: Delete a user by client
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/deleteUserClient", deleteUserValidatorClient, deleteUserClient);

/**
 * @swagger
 * /users/updatePassword:
 *   patch:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Validation error
 */
router.patch("/updatePassword", updatePasswordValidator, updatePassword);


/**
 * @swagger
 * /users/updateUser:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 */
router.put("/updateUser", deleteUserValidatorClient, updateUserUser);

/**
 * @swagger
 * /users/updateUserAdmin/{uid}:
 *   put:
 *     summary: Update user information by admin
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 */
router.put("/updateUserAdmin/:uid", deleteUserValidatorAdmin, updateUserAdmin);

/**
 * @swagger
 * /users/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post("/createUser", cloudinaryUploadMiddleware("profile-img"), createUserValidation, register);

/**
 * @swagger
 * /users/updateRole/{uid}:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Validation error
 */
router.patch("/updateRole/:uid", updateRoleValidator, updateRole);


/**
 * @swagger
 * /users/updateProfilePicture:
 *   patch:
 *     summary: Update the profile picture of the user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: Validation error or no image provided
 *       500:
 *         description: Server error
 */
router.patch("/updateProfilePicture", cloudinaryUploadMiddleware("profile-img"), updateProfilePictureValidator, updateProfilePicture )

/**
 * @swagger
 * /users/getReservations:
 *   get:
 *     summary: Obtener el historial de reservaciones del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones del usuario
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error del servidor
 */
router.get("/getReservations", getUserReservationsValidator, getUserReservations);

router.get("/getUser", getRoleValidator, getUserLogged)

export default router;


