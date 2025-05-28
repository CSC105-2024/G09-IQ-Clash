
import type { Context } from 'hono';
import postModel from "../models/post.model.js";
import {
    type LikeUnlikePostInput,
    type CreateCommentInput,
    type CreatePostInput,
    type UpdatePostInput
} from '../models/post.model.js';
import { Prisma } from '../generated/prisma/index.js'; 


const createPost = async (c: Context) => {
    try {
        const body = await c.req.json() as CreatePostInput;
  
        if (!body.content || body.authorId === undefined) {
            return c.json({error: 'Missing required fields: content, authorId'}, 400);
        }
        const newPost = await postModel.CreatePostModel(body);
        return c.json(newPost, 201);
    } catch (error: any) {
        console.error('Error creating post:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') { 
                return c.json({ error: 'Invalid authorId. Ensure the author exists.' }, 400);
            }
        }
        if (error.message.includes("Author with ID") && error.message.includes("not found")) {
            return c.json({ error: error.message }, 400); 
        }
        return c.json({ error: 'Failed to create post', details: error.message || 'Unknown error' }, 500);
    }
};

const updatePost = async (c: Context) => {
    try {
        const postIdString = c.req.param('id');
        const rawBody: unknown = await c.req.json();
        if (typeof rawBody !== 'object' || rawBody === null) return c.json({ error: 'Invalid request body: Expected a JSON object.' }, 400);

        const updateData: UpdatePostInput = {};
        const potentialBody = rawBody as Record<string, unknown>;

        if (potentialBody.hasOwnProperty('content')) updateData.content = String(potentialBody.content);
        if (potentialBody.hasOwnProperty('imageUrls')) updateData.imageUrls = potentialBody.imageUrls as string[];
        if (potentialBody.hasOwnProperty('newFiles')) updateData.newFiles = potentialBody.newFiles as { name: string; url: string }[];
        if (potentialBody.hasOwnProperty('linkUrls')) updateData.linkUrls = potentialBody.linkUrls as string[];
        if (potentialBody.hasOwnProperty('tagNames')) updateData.tagNames = potentialBody.tagNames as string[];

        if (!postIdString) return c.json({ error: 'Post ID is required.' }, 400);
        const postId = parseInt(postIdString, 10);
        if (isNaN(postId)) return c.json({ error: 'Invalid post ID format.' }, 400);
        if (Object.keys(updateData).length === 0) return c.json({ error: 'No valid update data provided.' }, 400);

        const updatedPost = await postModel.UpdatePostModel(postId, updateData);
        return c.json(updatedPost, 200);
    } catch (error: any) {
        console.error('Error updating post:', error);
        if (error.statusCode === 404) return c.json({ error: error.message }, 404);
        if (error instanceof Prisma.PrismaClientKnownRequestError) return c.json({ error: 'Database error.', details: error.message }, 500);
        return c.json({ error: 'Failed to update post.', details: error.message }, 500);
    }
};
const deletePost = async (c: Context) => {
    try {
        const body = await c.req.json();
        const postIdString = body.id;


        if (postIdString === undefined || postIdString === null) {
            return c.json({ error: 'Post ID is required in the request body.' }, 400);
        }

        const postId = parseInt(String(postIdString), 10);

        if (isNaN(postId)) {
            return c.json({ error: 'Invalid post ID format. Must be an integer.' }, 400);
        }

        const deletedPost = await postModel.DeletePostModel(postId);

        return c.json({ message: 'Post deleted successfully', data: deletedPost }, 200);

    } catch (error: any) {
        console.error('Error deleting post:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return c.json({ error: 'Database error during deletion.', details: error.message }, 500);
        }

        if (error.statusCode === 404) {
            return c.json({ error: error.message }, 404);
        }

        return c.json({ error: 'Failed to delete post.', details: error.message || 'Unknown error' }, 500);
    }
};
const createComment = async (c: Context) => {
    try {
        const postIdString = c.req.param('postId'); // Assuming postId comes from URL parameter
        const body = await c.req.json() as Partial<CreateCommentInput>; // Use Partial for initial validation

        if (!postIdString) {
            return c.json({ error: 'Post ID is required in the URL path.' }, 400);
        }
        const postId = parseInt(postIdString, 10);
        if (isNaN(postId)) {
            return c.json({ error: 'Invalid Post ID format in URL.' }, 400);
        }

        if (!body.content || typeof body.content !== 'string' || body.content.trim() === "") {
            return c.json({ error: 'Comment content is required and must be a non-empty string.' }, 400);
        }
        if (body.userId === undefined || typeof body.userId !== 'number' || isNaN(body.userId)) {
            return c.json({ error: 'User ID is required and must be a number.' }, 400);
        }

        const input: CreateCommentInput = {
            content: body.content,
            postId: postId,
            userId: body.userId

        };

        const newComment = await postModel.CreateCommentModel(input);
        return c.json(newComment, 201);

    } catch (error: any) {
        console.error('Error creating comment:', error);
        if (error.message.includes("not found")) { // Catch specific "not found" errors from the model
            return c.json({ error: error.message }, 404);
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                return c.json({ error: 'Invalid user or post ID for comment operation.' }, 400);
            }
            return c.json({ error: 'Database error during comment creation.', details: error.message }, 500);
        }
        return c.json({ error: 'Failed to create comment.', details: error.message || 'Unknown error' }, 500);
    }
};

const likeUnlikePost = async (c: Context) => {
    try {
        const postIdString = c.req.param('postId');
        const body = await c.req.json();
        const userId = body.userId;

        if (!postIdString) return c.json({ error: 'Post ID is required in the URL path.' }, 400);
        const postId = parseInt(postIdString, 10);
        if (isNaN(postId)) return c.json({ error: 'Invalid Post ID format in URL.' }, 400);

        if (userId === undefined || typeof userId !== 'number' || isNaN(userId)) {
            return c.json({ error: 'User ID is required in the request body and must be a number.' }, 400);
        }

        const input: LikeUnlikePostInput = { userId, postId };
        const result = await postModel.LikeUnlikePostModel(input);
        return c.json(result, 200);
    } catch (error: any) {
        console.error('Error liking/unliking post:', error);
        if (error.message.includes("not found")) {
            return c.json({ error: error.message }, 404);
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') return c.json({ error: 'Invalid user or post ID for like operation.' }, 400);
            return c.json({ error: 'Database error during like/unlike operation.', details: error.message }, 500);
        }
        return c.json({ error: 'Failed to like/unlike post.', details: error.message || 'Unknown error' }, 500);
    }
};
const getAllPosts = async (c: Context) => {
    try {
        const skip = parseInt(c.req.query('skip') || '0', 10);
        const take = parseInt(c.req.query('take') || '10', 10);

        if (isNaN(skip) || isNaN(take) || skip < 0 || take < 1) {
            return c.json({ error: 'Invalid pagination parameters: skip must be >= 0, take must be >= 1.' }, 400);
        }

        const posts = await postModel.GetAllPostsModel(skip, take);
        return c.json(posts, 200);
    } catch (error: any) {
        console.error('Error getting all posts:', error);
        return c.json({ error: 'Failed to retrieve posts.', details: error.message }, 500);
    }
};
const getPostsByTag = async (c: Context) => {
    try {
        const tagName = c.req.param('tagName');
        const skip = parseInt(c.req.query('skip') || '0', 10);
        const take = parseInt(c.req.query('take') || '10', 10);

        if (!tagName || tagName.trim() === "") {
            return c.json({ error: 'Tag name is required in the URL path.' }, 400);
        }
        if (isNaN(skip) || isNaN(take) || skip < 0 || take < 1) {
            return c.json({ error: 'Invalid pagination parameters: skip must be >= 0, take must be >= 1.' }, 400);
        }

        const posts = await postModel.GetPostsByTagModel(tagName, skip, take);

        if (posts === null) { 
            return c.json({ error: `Tag with name "${tagName}" not found or has no posts.` }, 404);
        }

        return c.json(posts, 200);
    } catch (error: any) {
        console.error(`Error getting posts by tag "${c.req.param('tagName')}":`, error);
        return c.json({ error: 'Failed to retrieve posts by tag.', details: error.message }, 500);
    }
};
const getAllTags = async (c: Context) => {
    try {
        const tags = await postModel.GetAllTagsModel();
        return c.json(tags, 200);
    } catch (error: any) {
        console.error('Error getting all tags:', error);
        return c.json({ error: 'Failed to retrieve tags.', details: error.message }, 500);
    }
};
const getCommentsForPost = async (c: Context) => {
    try {
        const postIdString = c.req.param('postId');
        const skip = parseInt(c.req.query('skip') || '0', 10);
        const take = parseInt(c.req.query('take') || '25', 10); // Default to 25 comments

        if (!postIdString) {
            return c.json({ error: 'Post ID is required in the URL path.' }, 400);
        }
        const postId = parseInt(postIdString, 10);
        if (isNaN(postId)) {
            return c.json({ error: 'Invalid Post ID format in URL.' }, 400);
        }

        if (isNaN(skip) || isNaN(take) || skip < 0 || take < 1) {
            return c.json({ error: 'Invalid pagination parameters: skip must be >= 0, take must be >= 1.' }, 400);
        }

        const comments = await postModel.GetCommentsForPostModel(postId, skip, take);

        if (comments === null) { // Post not found by the model
            return c.json({ error: `Post with ID ${postId} not found.` }, 404);
        }

        return c.json(comments, 200);

    } catch (error: any) {
        console.error(`Error getting comments for post ${c.req.param('postId')}:`, error);
        return c.json({ error: 'Failed to retrieve comments.', details: error.message }, 500);
    }
};
const getLikesForPost = async (c: Context) => {
    try {
        const postIdString = c.req.param('postId');

        if (!postIdString) {
            return c.json({ error: 'Post ID is required in the URL path.' }, 400);
        }

        const postId = parseInt(postIdString, 10);
        if (isNaN(postId)) {
            return c.json({ error: 'Invalid Post ID format in URL.' }, 400);
        }

        const likeCount = await postModel.GetLikesForPostModel(postId);

        if (likeCount === null) {
            return c.json({ error: `Post with ID ${postId} not found.` }, 404);
        }

        return c.json({ likeCount }, 200);

    } catch (error: any) {
        console.error(`Error getting likes for post ${c.req.param('postId')}:`, error);
        return c.json({ error: 'Failed to retrieve like count.', details: error.message }, 500);
    }
};

export {createPost,updatePost,deletePost,createComment,
    likeUnlikePost,getAllPosts,getPostsByTag,
    getAllTags,getCommentsForPost,getLikesForPost }
