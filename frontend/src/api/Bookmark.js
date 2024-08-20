// Author - Namrata Bhaumik (B00957053)
import axios from "axios";
import { SERVER_HOST } from "./Config";

const api = axios.create({
  baseURL: SERVER_HOST,
});

export const addBookmark = (userId, postId, successCb, errorCb) => {
  api
    .post("/bookmarks/add", { user_id: userId, post_id: postId })
    .then((response) => successCb(response))
    .catch((error) => errorCb(error));
};

export const removeBookmark = (userId, postId, successCb, errorCb) => {
  api
    .post("/bookmarks/remove", { user_id: userId, post_id: postId })
    .then((response) => successCb(response))
    .catch((error) => errorCb(error));
};

export const getUserBookmarks = (userId, successCb, errorCb) => {
  api
    .get(`/bookmarks/${userId}`)
    .then((response) => successCb(response))
    .catch((error) => errorCb(error));
};
