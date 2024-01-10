//Amazon S3 controller
const { S3Client, PutObjectCommand, GetObjectCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const e = require('express');
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

const params = {
    Bucket: BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET"],
          AllowedOrigins: ["*"],
          MaxAgeSeconds: 3000
        }
      ]
    }
  };
  const run = async () => {
    try {
      const data = await s3.send(new PutBucketCorsCommand(params));
      console.log("Success", data);
    } catch (err) {
      console.log("Error", err);
    }
  };
  
  run();
exports.uploadFile = (req, res) => {
    try {
        const file = req.file;
        const fileName = file.originalname;
        s3Uploader(fileName, file.buffer).then((data) => {
            res.status(200).send({ message: "Uploaded successfully!" });
        }).catch((err) => {
            res.status(500).send({ message: err });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
};

exports.downloadFile = (req, res) => {
    try {
        const fileName = req.params.name;
        s3Downloader(fileName).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            res.status(500).send({ message: err });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

exports.s3Uploader = async (fileName, fileBuffer) => {
    const putCommand = new PutObjectCommand({
        Bucket: BUCKET,
        Key: fileName,
        Body: fileBuffer,
    });

    try {
        const data = await s3.send(putCommand);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.s3Downloader = async (fileName) => {
    const getCommand = new GetObjectCommand({
        Bucket: BUCKET,
        Key: fileName
    });

    try {
        const data = await s3.send(getCommand);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.s3GetSingedUrl = async (fileName) => {
    const getCommand = new GetObjectCommand({
        Bucket: BUCKET,
        Key: fileName,
        ACL:'public-read',
    });

    const signedUrlExpireSeconds = 60 * 60; // 1 hour

    const url = await getSignedUrl(s3, getCommand, { expiresIn: signedUrlExpireSeconds });
    return url;
}