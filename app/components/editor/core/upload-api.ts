import axios from "axios";

export async function uploadToCloudinary(
  file: File, 
  onProgress?: (progress: number) => void
) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    if (res.data.url) return res.data;
    console.log(res);
    throw new Error("Upload failed without a secure url.");
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Upload failed");
  }
}
