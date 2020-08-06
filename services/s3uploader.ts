import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-west-3",
});
export default async function uploadS3File(
  filename: string,
  fileType: string,
  file: Buffer
) {
  const s3Params: PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    ContentType: fileType,
    Body: file,
  };

  const data = await s3.upload(s3Params).promise();
  return data.Location;
}
