import axios from "axios";
import { SERVER_HOST } from "./Config";

export const getAllBlogs = async(getAllBlogsSuccessCb, getAllBlogsErrorCb) => {
    axios.get(`${SERVER_HOST}/blogs/get/all`)
        .then((response) => {
          console.log("getAllBlogs: " + response)
            getAllBlogsSuccessCb(response);
        })
        .catch((error) => {
            getAllBlogsErrorCb(error);
        })
}

export const getBlogById = async(id, getBlogSuccessCb, getBlogErrorCb) => {
    axios.get(`${SERVER_HOST}/blogs/get/${id}`)
        .then((response) => {
            getBlogSuccessCb(response);
        })
        .catch((error) => {
            getBlogErrorCb(error);
        })
}

export const createBlogPost = (blog_id, title, author, tags, image_url, content, community_id, apiSuccessCb, apiFailureCb) => {
    const video = {
        blog_post_id: blog_id,
        title,
        author,
        tags,
        image_url,
        content,
        community_id,
    };
  
    axios.post(`${SERVER_HOST}/blogs/create`, video)
        .then((response) => {
            apiSuccessCb(response);
        })
        .catch((error) => {
            apiFailureCb(error);
        });
}

export const getMaxId = () => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_HOST}/blogs/get/all`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.blogs) && response.data.blogs.length > 0) {
            const maxId = response.data.blogs.reduce((max, blog) => {
              return blog._id > max ? blog._id : max;
            }, response.data.blogs[0]._id);
            resolve(maxId);
          } else {
            reject("No blogs found");
          }
        })
        .catch((error) => {
          reject(error.message);
        });
    });
};

export const getAllBlogsByUserId = async(userId, getAllBlogsSuccessCb, getAllBlogsErrorCb) => {
  axios.get(`${SERVER_HOST}/blogs/get/users/${userId}`)
      .then((response) => {
          getAllBlogsSuccessCb(response);
      })
      .catch((error) => {
          getAllBlogsErrorCb(error);
      })
}
