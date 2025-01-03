import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router(); // initializes a new Router instance

router
.route("/register")
.post(
    upload.fields( // added the upload middleware of multer
        [
            {
                name:"avatar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1
            }
        ]
    ),
    registerUser);// mounts the registerUser function on the /register path
router
.route("/login")
.post(loginUser);
// Secure route

router
.route("/logout")
.post(
    VerifyJWT, logoutUser
)

router
.route("/refresh-token")
.post(
    VerifyJWT, refreshAccessToken
)

router
.route("/update-password")
.post(
    VerifyJWT, changeCurrentPassword
)

router
.route("/current-user")
.get(
    VerifyJWT, getCurrentUser)

router
.route("/update-account")
.post(
    VerifyJWT,updateAccountDetails
)

router
.route("/avatar")
.post(
    VerifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)

router
.route("/coverImage")
.post(
    VerifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
)


export default router