import api from "./axios";

export async function createShare(noteId, role) {
  return api.post(`/share/${noteId}`, {
    role,
  });
}

export async function getSharedNote(token) {
  return api.get(`/share/${token}`);
}

export async function getNoteShares(noteId) {
  return api.get(`/share/note/${noteId}`);
}

export async function updateShareRole(shareId, role) {
  return api.patch(`/share/${shareId}`, {
    role,
  });
}

export async function revokeShare(shareId) {
  return api.delete(`/share/${shareId}`);
}
