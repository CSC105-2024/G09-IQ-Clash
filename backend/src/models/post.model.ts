import { db } from "../index.js"; // Your Prisma client instance
import { Prisma } from '../generated/prisma/index.js';

export interface CreatePostInput {
    content: string;
    authorId: number;
    imageUrls?: string[];
    newFiles?: { name: string; url: string }[];
    linkUrls?: string[];
    tagNames?: string[];
}
export interface LikeUnlikePostInput {
    userId: number;
    postId: number;
}

export interface UpdatePostInput {
    content?: string;
    imageUrls?: string[]; 
    newFiles?: { name: string; url: string }[];
    linkUrls?: string[]; 
    tagNames?: string[]; 
}
export interface CreateCommentInput {
    content: string;
    postId: number;
    userId: number;
}
const postInclusions = {
    images: { select: { id: true, url: true } },
    files: { select: { id: true, name: true, url: true } },
    links: { select: { id: true, url: true } },
    tags: { select: { id: true, name: true } },
    _count: {
        select: {
            likes: true,
            comments: true,
        },
    },
};

const CreatePostModel = async (input: CreatePostInput) => {
    const { content, authorId, imageUrls, newFiles, linkUrls, tagNames } = input;
    const newPost = await db.$transaction(async (prisma) => {
        const author = await prisma.user.findUnique({
            where: { id: authorId },
            select: { username: true, profile: true }
        });
        if (!author) {
            throw new Error(`Author with ID ${authorId} not found.`);
        }
        const post = await prisma.post.create({
            data: {
                content: content,
                authorId: authorId,
                authorName: author.username,
                authorImage: author.profile || null,
            },

        });
        if (imageUrls && imageUrls.length > 0) {
            await prisma.image.createMany({
                data: imageUrls.map((url) => ({
                    url,
                    postId: post.id,
                })),
            });
        }
        if (newFiles && newFiles.length > 0) {
            await prisma.file.createMany({
                data: newFiles.map((file) => ({
                    name: file.name,
                    url: file.url,
                    postId: post.id,
                })),
            });
        }
        if (linkUrls && linkUrls.length > 0) {
            await prisma.link.createMany({
                data: linkUrls.map((url) => ({
                    url,
                    postId: post.id,
                })),
            });
        }

        if (tagNames && tagNames.length > 0) {
            await prisma.post.update({
                where: { id: post.id },
                data: {
                    tags: {
                        connectOrCreate: tagNames.map(name => ({
                            where: { name: name },
                            create: { name: name },
                        })),
                    },
                },
            });
        }

        const resultPost = await prisma.post.findUnique({
            where: { id: post.id },
            include: {
                images: true,
                files: true,
                links: true,
                tags: true,
            }
        });

        if (!resultPost) {
            throw new Error("Failed to retrieve the created post after creation and linking relations.");
        }
        return resultPost;
    });

    return newPost;
};

const UpdatePostModel = async (id: number, input: UpdatePostInput) => {
    const { content, imageUrls, newFiles, linkUrls, tagNames } = input;
    return db.$transaction(async (prisma) => {
        const existingPost = await prisma.post.findUnique({
            where: { id },

            include: { tags: { select: { id: true, name: true } } }
        });

        if (!existingPost) {
            const error = new Error(`Post with ID ${id} not found.`);
            (error as any).statusCode = 404;
            throw error;
        }

        const originalTags = existingPost.tags; 

        const postUpdateData: Prisma.PostUpdateInput = {};
        if (content !== undefined) postUpdateData.content = content;

        if (Object.keys(postUpdateData).length > 0) {
            await prisma.post.update({ where: { id }, data: postUpdateData });
        }

        if (imageUrls !== undefined) {
            await prisma.image.deleteMany({ where: { postId: id } });
            if (imageUrls.length > 0) await prisma.image.createMany({ data: imageUrls.map((url) => ({ url, postId: id })) });
        }
        if (newFiles !== undefined) {
            await prisma.file.deleteMany({ where: { postId: id } });
            if (newFiles.length > 0) await prisma.file.createMany({ data: newFiles.map((file) => ({ name: file.name, url: file.url, postId: id }))});
        }
        if (linkUrls !== undefined) {
            await prisma.link.deleteMany({ where: { postId: id } });
            if (linkUrls.length > 0) await prisma.link.createMany({ data: linkUrls.map((url) => ({ url, postId: id })) });
        }

        if (tagNames !== undefined) {
            await prisma.post.update({
                where: { id: id },
                data: {
                    tags: {
                        set: [],
                        connectOrCreate: tagNames.map(name => ({
                            where: { name: name },
                            create: { name: name }
                        }))
                    }
                },
            });

            if (originalTags && originalTags.length > 0) {
                const newTagNamesSet = new Set(tagNames);
                for (const originalTag of originalTags) {
                    const currentTagState = await prisma.tag.findUnique({
                        where: { id: originalTag.id },
                        include: { _count: { select: { posts: true } } }
                    });

                    if (currentTagState && currentTagState._count.posts === 0) {
                        console.log(`Tag "${originalTag.name}" (ID: ${originalTag.id}) became orphaned during post update. Deleting...`);
                        await prisma.tag.delete({ where: { id: originalTag.id } });
                    }
                }
            }
        }

        const updatedPost = await prisma.post.findUnique({ where: { id }, include: postInclusions });
        if (!updatedPost) throw new Error("Failed to retrieve the post after update.");
        return updatedPost;
    });
};



const DeletePostModel = async (id: number) => {
    return db.$transaction(async (prisma) => {
        const postToDelete = await prisma.post.findUnique({
            where: { id },
            include: {
                images: true,
                files: true,
                links: true,
                tags: true,
            }
        });
        if (!postToDelete) {
            const error = new Error(`Post with ID ${id} not found.`);
            (error as any).statusCode = 404;
            throw error;
        }
        const tagsAssoc = postToDelete.tags;
        await prisma.image.deleteMany({ where: { postId: id } });
        await prisma.file.deleteMany({ where: { postId: id } });
        await prisma.link.deleteMany({ where: { postId: id } });
        await prisma.post.delete({ where: { id } });
        if (tagsAssoc && tagsAssoc.length > 0) {
            for (const tag of tagsAssoc) {
                // Check if this tag is still linked to any other posts
                const tagWithPostCount = await prisma.tag.findUnique({
                    where: { id: tag.id },
                    include: {
                        _count: {
                            select: { posts: true },
                        },
                    },
                });

                // If the tag exists and has no associated posts, it's orphaned.
                if (tagWithPostCount && tagWithPostCount._count.posts === 0) {
                    console.log(`Tag "${tag.name}" (ID: ${tag.id}) is orphaned. Deleting...`);
                    await prisma.tag.delete({ where: { id: tag.id } });
                }
            }
        }
        return postToDelete;
    });
};

const Like = async (postId: number, url: string) => {
}
const CreateCommentModel = async (input: CreateCommentInput) => {
    const { content, postId, userId } = input;

    return db.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found. Cannot create comment.`);
        }
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new Error(`Post with ID ${postId} not found. Cannot create comment.`);
        }

        const newComment = await prisma.comment.create({
            data: {
                content: content,
                postId: postId,
                userId: userId,
            },
            include: { 
                user: {
                    select: {
                        id: true,
                        username: true,
                        profile: true,
                    }
                }
            }
        });
        return newComment;
    });
};

const LikeUnlikePostModel = async (input: LikeUnlikePostInput) => {
    const { userId, postId } = input;

    return db.$transaction(async (prisma) => {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) throw new Error(`User with ID ${userId} not found.`);

        const postExists = await prisma.post.findUnique({ where: { id: postId } });
        if (!postExists) throw new Error(`Post with ID ${postId} not found.`);

        const existingLike = await prisma.like.findUnique({
            where: { userId_postId: { userId: userId, postId: postId } },
        });

        let liked: boolean;
        if (existingLike) {
            await prisma.like.delete({ where: { userId_postId: { userId: userId, postId: postId } } });
            liked = false;
        } else {
            await prisma.like.create({ data: { userId: userId, postId: postId } });
            liked = true;
        }

        const likeCount = await prisma.like.count({ where: { postId: postId } });
        return { liked: liked, likeCount: likeCount, postId: postId, userId: userId };
    });
};
const GetAllPostsModel = async (skip?: number, take?: number) => {
    return db.post.findMany({
        skip: skip,
        take: take,
        orderBy: {
            createdAt: 'desc', // Default order: newest first
        },
        include: postInclusions,
    });
};
const GetPostsByTagModel = async (tagName: string, skip?: number, take?: number) => {
    const tag = await db.tag.findUnique({
        where: { name: tagName },
    });

    if (!tag) {
        return null;
    }
    return db.post.findMany({
        where: {
            tags: {
                some: {
                    name: tagName,
                },
            },
        },
        skip: skip,
        take: take,
        orderBy: {
            createdAt: 'desc',
        },
        include: postInclusions,
    });
}
const GetAllTagsModel = async () => {
    return db.tag.findMany({
        include: {
            _count: {
                select: { posts: true },
            },
        },
        orderBy: {
            name: 'asc',
        },
    });
};
const GetCommentsForPostModel = async (postId: number, skip?: number, take?: number) => {

    const postExists = await db.post.findUnique({
        where: { id: postId },
    });
    if (!postExists) {

        return null;
    }

    return db.comment.findMany({
        where: {
            postId: postId,
        },
        orderBy: {
            createdAt: 'asc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profile: true,
                },
            },
        },
        skip: skip,
        take: take,
    });
};
const GetLikesForPostModel = async (postId: number) => {
    const postExists = await db.post.findUnique({
        where: { id: postId },
    });

    if (!postExists) {
        return null;
    }
    // Return the count of likes for the post
    const likeCount = await db.like.count({ 
        where: {
            postId: postId,
        },
    });
    return likeCount;
};
export default {CreatePostModel, UpdatePostModel, DeletePostModel,
    CreateCommentModel, LikeUnlikePostModel, GetAllPostsModel, GetPostsByTagModel,
    GetCommentsForPostModel,GetAllTagsModel,GetLikesForPostModel
}
