import api from "./axios";

export const uploadPDF = async (file) => {
  const formData = new FormData();

  formData.append("pdf", file);

  const { data } = await api.post(
    "/pdf/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};