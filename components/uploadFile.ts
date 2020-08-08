import Compress from "compress.js";
import { IReportElement } from "../services/model";

export default async function uploadImageForReport({
  reportId,
  files,
  otherItemCount,
  addedBy,
}) {
  const compress = new Compress();
  let newElements: IReportElement[] = [];
  for (const file of files) {
    const fileName = `${reportId}/${file.name}`;
    const resizedImage = await compress.compress([file], {
      size: 0.5, // the max size in MB, defaults to 2MB
      quality: 1, // the quality of the image, max is 1
      maxWidth: 600,
      maxHeight: 600,
      resize: true,
    });
    const img = resizedImage[0];
    const base64str = img.data;
    const asFile = Compress.convertBase64ToFile(base64str, img.ext);
    var url = `/api/reports/${reportId}/image`;
    const asFormData = new FormData();
    asFormData.append("image", asFile, fileName);
    const reservedUrlResponse = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify({
        contentType: file.type,
        fileName: fileName,
      }),
    });
    const s3Response = await reservedUrlResponse.json();
    await fetch(s3Response.uploadPath, {
      method: "PUT",
      cache: "no-cache",
      body: asFile,
    });
    newElements = [
      {
        id: (otherItemCount + newElements.length + 1).toString(),
        image: s3Response.filePath,
        addedOn: new Date(),
        addedBy,
        byDate: new Date(),
        responsible: "",
        description: "",
      },
      ...newElements,
    ];
  }
  return newElements;
}
