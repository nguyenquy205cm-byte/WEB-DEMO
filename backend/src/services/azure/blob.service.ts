import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { ApiError } from "../../utils/apiError";
import crypto from "crypto";

const getConnectionString = () => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new ApiError("Missing AZURE_STORAGE_CONNECTION_STRING", 500);
  }
  return connectionString;
};

const getContainerName = () => {
  const containerName = process.env.AZURE_STORAGE_CONTAINER;
  if (!containerName) {
    throw new ApiError("Missing AZURE_STORAGE_CONTAINER", 500);
  }
  return containerName;
};

const getContainerClient = async (): Promise<ContainerClient> => {
  const connectionString = getConnectionString();
  const containerName = getContainerName();
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    await containerClient.createIfNotExists();
  } catch (error) {
    throw new ApiError(`Failed to access Azure Blob container: ${(error as Error).message}`, 500);
  }

  return containerClient;
};

const generateBlobName = (originalName: string) => {
  const extension = originalName.includes(".") ? originalName.substring(originalName.lastIndexOf(".")) : "";
  const prefix = crypto.randomBytes(8).toString("hex");
  return `${prefix}-${Date.now()}${extension}`;
};

export const uploadImage = async (file: Express.Multer.File) => {
  if (!file.buffer) {
    throw new ApiError("File buffer is required", 400);
  }

  const blobName = generateBlobName(file.originalname);
  const containerClient = await getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });
  } catch (error) {
    throw new ApiError(`Failed to upload image: ${(error as Error).message}`, 500);
  }

  return {
    url: blockBlobClient.url,
    blobName,
  };
};

export const deleteImage = async (blobName: string) => {
  const containerClient = await getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    await blockBlobClient.deleteIfExists();
  } catch (error) {
    throw new ApiError(`Failed to delete image: ${(error as Error).message}`, 500);
  }
};

export const getBlobUrl = async (blobName: string) => {
  const containerClient = await getContainerClient();
  return containerClient.getBlockBlobClient(blobName).url;
};
