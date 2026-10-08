import ImageKit from "@imagekit/nodejs";

const client = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"], // This is the default and can be omitted
});

export async function uploadToImagekit(buffer, fileName) {
  const result = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: fileName,
  });

  return {
    url: result.url,
    file_id: result.fileId,
  };
}

export async function deleteFromImagekit(fileId) {
  await client.files.delete(fileId);
}
