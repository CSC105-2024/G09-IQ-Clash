import { Axios } from "../utils/axiosInstance";
export const getPostsAPI = async () => {
    try {
        const response = await Axios.get('post/GetPosts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const getPostsByTagAPI = async (tagName) => {
    try {
        const encodedTagName = encodeURIComponent(  tagName);
        const response = await Axios.get(`post/${encodedTagName}/GetPostsByTag`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching posts by tag "${tagName}":`, error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const getAllTagsAPI = async () => {
    try {
       const response = await Axios.get('post/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching all tags:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const createPostAPI = async (postData) => {
    try {
        const response = await Axios.post('post/CreatePost', postData);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const updatePostAPI = async (postId, updateData) => {
    try {
        const response = await Axios.put(`post/${postId}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const deletePostAPI = async (postId) => {
    try {
        const response = await Axios.delete('post/DeletePost', { data: { id: postId } });
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const likeUnlikePostAPI = async (postId, userId) => {
    try {
        const response = await Axios.post(`post/${postId}/Like`, { userId });
        return response.data;
    } catch (error) {
        console.error('Error liking/unliking post:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const createCommentAPI = async (postId, commentData) => {
    try {
        const response = await Axios.post(`post/${postId}/CreateComment`, commentData);
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};

export const getCommentsForPostAPI = async (postId) => {
    try {
        const response = await Axios.get(`post/${postId}/GetComments`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};
export const getPostLikeStatusAPI = async (postId) => {
    try {
        const response = await Axios.get(`/post/${postId}/GetLikes`);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching likes for post ${postId}:`, error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error;
    }
};
