import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router(); // initializes a new Router instance

router.route("/register").post(
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

export default router