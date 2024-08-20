import axios from "axios";
import { SERVER_HOST } from "./Config";

export const getAllVideos = async(apiSuccessCb, apiFailureCb) => {
    axios.get(`${SERVER_HOST}/videos/get/all`)
        .then((response) => {
            apiSuccessCb(response);
        })
        .catch((error) => {
            apiFailureCb(error);
        })
}

export const getVideoById = async(id, apiSuccessCb, apiFailureCb) => {
    axios.get(`${SERVER_HOST}/videos/get/${id}`)
        .then((response) => {
            apiSuccessCb(response);
        })
        .catch((error) => {
            apiFailureCb(error);
        })
}

export const createVideoPost = (video_id, video_url, title, author, tags, time, thumbnail_url, content, community_id, apiSuccessCb, apiFailureCb) => {
    const video = {
        video_post_id: video_id,
        video_url,
        title,
        author,
        tags,
        time,
        thumbnail_url,
        content,
        community_id
    };
  
    axios.post(`${SERVER_HOST}/videos/create`, video)
        .then((response) => {
            console.log(video);
            apiSuccessCb(response);
        })
        .catch((error) => {
            apiFailureCb(error);
        });
}

export const getMaxId = (apiSuccessCb, apiFailureCb) => {
    axios.get(`${SERVER_HOST}/videos/get/all`)
        .then((response) => {
            if (response.data && response.data.videos) {
                const maxId = response.data.videos.reduce((max, video) => {
                    return video._id > max ? video._id : max;
                }, response.data.videos[0]._id);
                apiSuccessCb(maxId);
            } else {
                apiFailureCb("No videos found");
            }
        })
        .catch((error) => {
            apiFailureCb(error.message);
        });
};

export const getAllVideosByUserId = async(userId, apiSuccessCb, apiFailureCb) => {
    axios.get(`${SERVER_HOST}/videos/get/users/${userId}`)
        .then((response) => {
            apiSuccessCb(response);
        })
        .catch((error) => {
            apiFailureCb(error);
        })
};