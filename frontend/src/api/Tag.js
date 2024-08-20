import axios from "axios";
import { SERVER_HOST } from "./Config";

export const getAllTagsWithCounts = async (successCallback, errorCallback) => {
  axios
    .get(`${SERVER_HOST}/tags/all`)
    .then((response) => {
      successCallback(response.data);
    })  
    .catch((error) => {
      errorCallback(error);
    });
};
