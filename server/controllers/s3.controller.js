//Amazon S3 controller
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const multer = require('multer');

const REGION = process.env.S3_REGION; 
const BUCKET = process.env.S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});
// Uploads a file to S3
const storage = multer.memoryStorage(); // Use memoryStorage so the file will be available as a buffer in the 'file' object
const upload = multer({ storage: storage }).single('avatar'); // 
exports.uploadFile = (req, res) => {
    try {
        upload(req, res, (err) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
    
            const file = req.file;
            const fileName = file.originalname;
            const fileType = file.mimetype;

            const putCommand = new PutObjectCommand({
                Bucket: BUCKET,
                Key: fileName,
                Body: file.buffer,
                ContentType: fileType
            });

            s3.send(putCommand)
                .then((data) => {
                    res.status(200).send({ message: "Uploaded successfully!" });
                })
                .catch((err) => {
                    res.status(500).send({ message: err });
                });
    
        });
    } catch (error) {
        console.log(error);
    }
};

// Downloads a file from S3

exports.downloadFile = (req, res) => {
    const fileName = req.params.name;

    const params = {
        Bucket: BUCKET,
        Key: fileName
    };

    res.attachment(fileName);

    const fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);
};