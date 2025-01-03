import multer from "multer"; // 3rd party file upload middleware

const storage = multer.diskStorage({ // we are using diskstorage to store file on server
    destination: function(req, file, cb){ //define the destination path
        cb(null, './public/temp')
    },
    filename: function(req, file, cb){ // name of the file
        cb(null,Date.now()+'-'+file.originalname) // preffixing the filename with date.now to avoid the redundancy
    }
})

export const upload = multer({storage:storage})