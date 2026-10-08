import api from "./axios";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const verifyEmail = async (email, otp) => {
  const response = await api.post("/auth/verify-email", {
    email,
    otp,
  });

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const resendOtp = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

export const logOut = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const verifyResetOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-reset-otp", {
    email,
    otp,
  });

  return response.data;
};

export const resetPassword = async (newPassword, confirmPassword) => {
  const response = await api.post("/auth/reset-password", {
    newPassword,
    confirmPassword,
  });

  return response.data;
};

export const getMe = async (accessToken) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// NOTE API SECTION

export const createNote = async (accessToken, noteData) => {
  const response = await api.post("/note/", noteData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const createImage = async (accessToken, noteId, imageFile) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await api.post(`/image/notes/${noteId}`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const deleteImage = async (accessToken, noteId, fileId) => {
  const response = await api.delete(`/image/${noteId}/images/${fileId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const getNotes = async (accessToken) => {
  const response = await api.get("/note/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const getNoteById = async (accessToken, noteId) => {
  return api.get(`/note/${noteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteNote = async (accessToken, noteId) => {
  return api.delete(`/note/${noteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateNote = async (accessToken, noteId, data) => {
  return api.patch(`/note/${noteId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
