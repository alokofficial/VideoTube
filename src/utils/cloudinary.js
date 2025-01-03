import { v2 as cloudinary } from "cloudinary" //3rd party file upload on cloud
import fs from "fs"

cloudinary.config({ // configured the cloudinary
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    api_key:process.env.CLOUDINARY_API_KEY,
    secure:true,
})
const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null;
        const result = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type:"auto" // any file can be uploaded from localfilepath
            }
        )
        console.log(result.url) // return an url                  
        return result
    }catch(error){
        fs.unlinkSync(localFilePath);
        return null
    }
}

export {uploadOnCloudinary}