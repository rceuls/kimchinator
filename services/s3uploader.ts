import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.UPLOAD_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.UPLOAD_AWS_SECRET_ACCESS_KEY,
  region: process.env.UPLOAD_AWS_REGION,
});

export default async function uploadS3File(filename: string, type: string) {
  const params = {
    Bucket: process.env.UPLOAD_AWS_BUCKET_NAME,
    Key: filename,
    Expires: 60,
    ContentType: type,
  };
  const uploadPath = await s3.getSignedUrlPromise("putObject", params);
  const displayPath = `https://${process.env.UPLOAD_AWS_BUCKET_NAME}.s3.${process.env.UPLOAD_AWS_REGION}.amazonaws.com/${filename}`;
  return [uploadPath, displayPath];
}
