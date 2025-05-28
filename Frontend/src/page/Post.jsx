// frontend/src/page/Post.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getPostsAPI,
  getPostsByTagAPI,
  getAllTagsAPI,
  createPostAPI,
  updatePostAPI,
  likeUnlikePostAPI,       // For like/unlike actions
  createCommentAPI,
  deletePostAPI,
  getCommentsForPostAPI,  // For BlogPostCard fetching its comments
  getPostLikeStatusAPI    // For BlogPostCard fetching initial like status & count
} from "../api/postApi";
import { fetchCurrentUser, logoutUser } from "../api/auth";
import Header from "../component/Header";
import Footer from "../component/Footer";

// --- BlogPostCard Component ---
const BlogPostCard = ({post, onLike, onComment, onDelete, onEdit, currentUser,}) => {
  const {
    id: postId, authorImage, authorName, createdAt, updatedAt,
    tags, content, images, links,
    likeCount: initialLikeCount, // Initial count from the bulk post load
    commentsCount: initialCommentsCount,
    authorId,
  } = post;

  const [showCommentInput, setShowCommentInput] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState("");

  const [currentLikes, setCurrentLikes] = useState(initialLikeCount || 0);
  const [currentCommentsCount, setCurrentCommentsCount] = useState(initialCommentsCount || 0);

  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingLikeStatus, setIsLoadingLikeStatus] = useState(false);

  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef(null);

  const [postComments, setPostComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsEverFetched, setCommentsEverFetched] = useState(false);

  useEffect(() => {
    setCurrentLikes(initialLikeCount || 0);
  }, [initialLikeCount]);

  useEffect(() => {
    setCurrentCommentsCount(initialCommentsCount || 0);
  }, [initialCommentsCount]);

  useEffect(() => {
    const fetchLikeData = async () => {
      if (currentUser && currentUser.id && postId) {
        setIsLoadingLikeStatus(true);
        try {
          const likeData = await getPostLikeStatusAPI(postId); // Expects { liked: boolean, likeCount: number }
          setIsLiked(likeData.liked || false);
          if (typeof likeData.likeCount === 'number') {
            setCurrentLikes(likeData.likeCount);
          }
        } catch (error) {
          console.error(`Failed to fetch like data for post ${postId}:`, error);
          setIsLiked(false); // Default on error
        } finally {
          setIsLoadingLikeStatus(false);
        }
      } else {
        setIsLiked(false);
        setIsLoadingLikeStatus(false);
      }
    };
    fetchLikeData();
  }, [currentUser, postId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsMenuOpen]);

  const fetchPostComments = useCallback(async () => {
    if (!postId || isLoadingComments) return;
    setIsLoadingComments(true);
    try {
      const fetchedComments = await getCommentsForPostAPI(postId);
      setPostComments(fetchedComments || []);
      setCurrentCommentsCount(fetchedComments ? fetchedComments.length : 0);
      setCommentsEverFetched(true);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      setPostComments([]);
      setCurrentCommentsCount(0);
      setCommentsEverFetched(true);
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId, isLoadingComments]); // Added isLoadingComments to dependency array

  useEffect(() => {
    if (showComments && postId && !commentsEverFetched) {
      fetchPostComments();
    }
  }, [showComments, postId, commentsEverFetched, fetchPostComments]);

  const handleToggleCommentsAndInput = () => {
    const willShow = !showComments;
    setShowComments(willShow);
    setShowCommentInput(willShow);
    if (willShow && postId && !commentsEverFetched) {
      fetchPostComments();
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() && currentUser?.id) {
      try {
        const newComment = await onComment(postId, commentText, currentUser.id);
        if (newComment) {
          setCommentText("");
          if (showComments) {
            fetchPostComments(); // Refresh comments list and count
          }
        }
      } catch (error) { /* Parent handles error alerts */ }
    } else if (!currentUser?.id) {
    }
  };

  const handleLikeClick = async () => {
    if (!currentUser?.id) {
      return;
    }
    const previousIsLiked = isLiked;
    setIsLiked(!previousIsLiked);

    try {
      const likeResult = await onLike(postId, currentUser.id);
      if (likeResult && typeof likeResult.liked === 'boolean' && typeof likeResult.likeCount === 'number') {
        setIsLiked(likeResult.liked);
        setCurrentLikes(likeResult.likeCount);
      } else {
        console.warn("onLike did not return expected like data. Reverting optimistic UI for button state.");
        setIsLiked(previousIsLiked);
      }
    } catch (error) {
      console.error("Error during like/unlike operation, reverting UI for button state:", error);
      setIsLiked(previousIsLiked);
    }
  };

  const handleDeleteClick = () => {
    setIsOptionsMenuOpen(false);
    if (currentUser?.id === authorId) {
      if (window.confirm("Are you sure you want to delete this post?")) {
        onDelete(postId);
      }
    } else {
    }
  };

  const handleEditClick = () => {
    setIsOptionsMenuOpen(false);
    if (currentUser?.id === authorId) {
      if (onEdit) {
        onEdit(post);
      } else {
      }
    } else {
    }
  };

  const displayImage = images && images.length > 0 ? images[0].url : null;
  const displayLink = links && links.length > 0 ? links[0] : null;
  const canModify = currentUser && currentUser.id === authorId;

  const creationDate = new Date(createdAt);
  const lastUpdatedDate = new Date(updatedAt);
  const displayCreationDate = creationDate.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const wasEdited = lastUpdatedDate.getTime() > creationDate.getTime() + 60000; // 1 minute threshold
  let editedDateString = "";
  if (wasEdited) {
    editedDateString = lastUpdatedDate.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  return (
      <article className="border bg-white mx-auto my-0 p-5 border-solid border-gray-200 max-sm:p-[15px] rounded-lg shadow-md mb-6 relative">
        <div className="flex items-start gap-4 mb-1">
          <img
              src={authorImage || '/usericon60px.png'}
              alt={`${authorName || 'User'}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/cccccc/FFFFFF?text=User"; }}
          />
          <div className="flex-grow">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">{authorName || 'Author'}</span>
              <div className="text-xs text-gray-500">
                <span>{displayCreationDate}</span>
                {wasEdited && <span className="ml-1 text-gray-400 italic">(edited {editedDateString})</span>}
              </div>
            </div>
          </div>
          {canModify && (
              <div className="relative" ref={optionsMenuRef}>
                <button
                    onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-label="Post options"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {isOptionsMenuOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <button onClick={handleEditClick} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#14AE5C]">Edit Post</button>
                      <button onClick={handleDeleteClick} className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 hover:text-red-700">Delete Post</button>
                    </div>
                )}
              </div>
          )}
        </div>

        {tags && tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1 self-start">
              {tags.map(tag => (<span key={tag.id || tag.name} className="text-white text-xs sm:text-sm bg-[#2F6F42] px-2 py-0.5 rounded-full">{tag.name}</span>))}
            </div>
        )}
        {(!tags || tags.length === 0) && (<div className="mb-2 self-start"><span className="text-white text-xs sm:text-sm bg-[#2F6F42] px-2 py-0.5 rounded-full">General</span></div>)}

        <div className="mb-4">
          <p className="text-gray-700 mb-3 whitespace-pre-line text-base">{content}</p>
          {displayImage && (<img src={displayImage} alt="Post content" className="w-full max-w-[700px] h-auto block mx-auto my-0 rounded-md shadow mb-3" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/700x350/eeeeee/999999?text=Image+Error"; }} />)}
          {displayLink && displayLink.url && (<div className="mt-2"><a href={displayLink.url.startsWith('http') ? displayLink.url : `//${displayLink.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 hover:underline break-all">{displayLink.url}</a></div>)}
        </div>
        <div className="flex justify-between items-center px-0 py-2 border-t border-gray-200 text-sm">
          <div className="text-gray-500">{currentLikes} Likes</div>
          <div className="text-gray-500">{currentCommentsCount > 0 ? `${currentCommentsCount} Comments` : "No Comments"}</div>
        </div>
        <div className="flex gap-x-4 mt-3 items-center">
          <button
              onClick={handleLikeClick}
              className={`text-sm p-1 hover:underline ${isLiked ? 'text-red-600 font-semibold' : 'text-[#14AE5C]'} ${isLoadingLikeStatus ? 'opacity-50 cursor-default' : ''}`}
              disabled={isLoadingLikeStatus}
              aria-pressed={isLiked}
          >
            {isLoadingLikeStatus ? "..." : (isLiked ? "Unlike" : "Like")}
          </button>
          <button onClick={handleToggleCommentsAndInput} className="text-sm text-[#14AE5C] hover:underline p-1">
            {showComments ? "Hide Comments" : `Show Comments (${currentCommentsCount || 0})`}
          </button>
        </div>

        {showCommentInput && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Write a comment</h4>
              <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your thoughts..." className="w-full p-2 border border-gray-300 rounded-md text-sm" rows="3" />
              <button onClick={handleCommentSubmit} className="mt-2 bg-[#14AE5C] hover:bg-[#129b52] text-white font-semibold py-1.5 px-3 rounded-md text-xs">Post Comment</button>
            </div>
        )}
        {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Comments ({currentCommentsCount})</h4>
              {isLoadingComments && <p className="text-gray-500 text-xs">Loading comments...</p>}
              {!isLoadingComments && postComments.length === 0 && commentsEverFetched && (<p className="text-gray-500 text-xs">No comments found, or an error occurred while loading.</p>)}
              {!isLoadingComments && postComments.length === 0 && !commentsEverFetched && (<p className="text-gray-500 text-xs">Preparing to load comments...</p>)}
              {!isLoadingComments && postComments.length > 0 && (
                  <ul className="space-y-3">
                    {postComments.map((comment) => (
                        <li key={comment.id} className="flex items-start space-x-3">
                          <img src={comment.user?.profile || '/usericon60px.png'} alt={`${comment.user?.username || 'User'}'s avatar`} className="w-8 h-8 rounded-full object-cover border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/32x32/cccccc/FFFFFF?text=U"; }} />
                          <div className="flex-1 bg-gray-50 p-2.5 rounded-md">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-semibold text-gray-800">{comment.user?.username || 'Anonymous User'}</span>
                              <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gray-600 whitespace-pre-line">{comment.content}</p>
                          </div>
                        </li>
                    ))}
                  </ul>
              )}
            </div>
        )}
      </article>
  );
};

// --- EditPostModal Component ---
// ADDED: showNotification prop
const EditPostModal = ({ isOpen, onClose, postToEdit, onUpdatePost, currentUser, showNotification }) => {
  const [editedContent, setEditedContent] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedTagsString, setEditedTagsString] = useState("");
  const [editedLinkUrl, setEditedLinkUrl] = useState("");

  useEffect(() => {
    if (postToEdit) {
      setEditedContent(postToEdit.content || "");
      setEditedImage(postToEdit.images && postToEdit.images.length > 0 ? postToEdit.images[0].url : "");
      setEditedTagsString(postToEdit.tags && postToEdit.tags.length > 0 ? postToEdit.tags.map(tag => tag.name).join(', ') : "");
      setEditedLinkUrl(postToEdit.links && postToEdit.links.length > 0 ? postToEdit.links[0].url : "");
    }
  }, [postToEdit]);

  if (!isOpen || !postToEdit) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedContent.trim()) {
      if (showNotification) { // ADDED: Call showNotification if available
        showNotification("Post content cannot be empty!", "error");
      }
      return;
    }
    const tagNamesArray = editedTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    const updatedData = {
      content: editedContent.trim(),
      imageUrls: editedImage.trim() ? [editedImage.trim()] : [],
      tagNames: tagNamesArray.length > 0 ? tagNamesArray : [],
      linkUrls: editedLinkUrl.trim() ? [editedLinkUrl.trim()] : [],
    };
    onUpdatePost(postToEdit.id, updatedData);
  };

  return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
        <div className="relative p-6 border w-full max-w-lg shadow-xl rounded-lg bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Edit Post</h3>
          <div className="flex items-start gap-3">
            {currentUser && (<img src={currentUser.avatar} alt="Your avatar" className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/cccccc/FFFFFF?text=Me"; }} />)}
            <form onSubmit={handleSubmit} className="flex-grow">
              <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} placeholder="What's on your mind about trees today?" className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-1 focus:ring-[#14AE5C] focus:border-transparent text-sm" rows="4"></textarea>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 mt-3 items-center text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                  <input type="text" value={editedImage} onChange={(e) => setEditedImage(e.target.value)} placeholder="Update Photo URL" className="flex-grow p-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#14AE5C] w-full" />
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h10a3 3 0 013 3v5a.997.997 0 01-.293-.707zM11 5a1 1 0 10-2 0v3H7a1 1 0 100 2h2v3a1 1 0 102 0v-3h2a1 1 0 100-2h-2V5z" clipRule="evenodd"></path></svg>
                  <input type="text" value={editedTagsString} onChange={(e) => setEditedTagsString(e.target.value)} placeholder="Update Tags (comma-separated)" className="flex-grow p-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#14AE5C] w-full" />
                </div>
                <div className="flex items-center sm:col-span-2">
                  <svg className="w-5 h-5 text-gray-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.976-1.138 2.5 2.5 0 01-.142-3.667l3-3z"></path><path d="M8.603 14.97a2.5 2.5 0 01-3.535-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.976 1.138 2.5 2.5 0 01.142 3.667l-3 3z"></path></svg>
                  <input type="url" value={editedLinkUrl} onChange={(e) => setEditedLinkUrl(e.target.value)} placeholder="Update Link URL (optional)" className="flex-grow p-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#14AE5C] w-full" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#14AE5C] hover:bg-[#129b52] text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14AE5C]">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

// --- Post Component (Main Page Logic) ---
export const Post = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostTagsString, setNewPostTagsString] = useState("");
  const [newPostLinkUrl, setNewPostLinkUrl] = useState("");

  const [activeFilter, setActiveFilter] = useState("All topics");
  const [availableTopics, setAvailableTopics] = useState([{ name: "All topics", count: 0 }]);

  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ADDED: State and ref for notification
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        if (userData && userData.user && userData.user.id) {
          setCurrentUser({
            id: userData.user.id,
            name: userData.user.username,
            avatar: userData.user.profile || "/usericon60px.png",
          });
          setIsUserLoggedIn(true);
        } else {
          setIsUserLoggedIn(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth Error: Failed to fetch current user.", error);
        setIsUserLoggedIn(false);
        setCurrentUser(null);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getAllTagsAPI();
        setAvailableTopics([{ name: "All topics", count: 0 }, ...(fetchedTags || [])]);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setAvailableTopics([{ name: "All topics", count: 0 }]);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        let fetchedPostsData;
        if (activeFilter === "All topics") {
          fetchedPostsData = await getPostsAPI();
        } else {
          fetchedPostsData = await getPostsByTagAPI(activeFilter);
        }
        const processedPosts = (fetchedPostsData || []).map(p => ({
          ...p,
          createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
          likeCount: typeof p.likeCount === 'number' ? p.likeCount : 0,
          commentsCount: typeof p.commentsCount === 'number' ? p.commentsCount : 0,
        }));
        setPosts(processedPosts);
      } catch (error) {
        console.error(`Failed to fetch posts for filter "${activeFilter}":`, error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [activeFilter, currentUser]); // Original dependency array

  // ADDED: Function to show notification
  const showNotification = (message, type = "success") => {
    if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ show: true, message, type });
    notificationTimeoutRef.current = setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
    }, 3000); // Auto-hide after 3 seconds
  };

  const handleActualLogout = async () => {
    try {
      await logoutUser();
      setIsUserLoggedIn(false);
      setCurrentUser(null);
      setActiveFilter("All topics");
      showNotification("You have been logged out."); // ADDED
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      showNotification("Logout failed. Please try again.", "error"); // ADDED
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) {
        showNotification("Post content cannot be empty!", "error"); // ADDED
        return;
    }
    if (!currentUser?.id) {
        showNotification("You must be logged in to create a post.", "error"); // ADDED
        navigate("/login"); return;
    }
    const tagNamesArray = newPostTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    const postData = {
      content: newPostText.trim(), authorId: currentUser.id,
      imageUrls: newPostImage.trim() ? [newPostImage.trim()] : [],
      tagNames: tagNamesArray.length > 0 ? tagNamesArray : [],
      linkUrls: newPostLinkUrl.trim() ? [newPostLinkUrl.trim()] : [],
    };
    try {
      const createdPostFromAPI = await createPostAPI(postData);
      const newPostForState = {
        ...createdPostFromAPI,
        createdAt: createdPostFromAPI.createdAt ? new Date(createdPostFromAPI.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: createdPostFromAPI.updatedAt ? new Date(createdPostFromAPI.updatedAt).toISOString() : new Date().toISOString(),
        likeCount: createdPostFromAPI.likeCount !== undefined ? createdPostFromAPI.likeCount : 0,
        commentsCount: createdPostFromAPI.commentsCount !== undefined ? createdPostFromAPI.commentsCount : 0,
        authorName: currentUser.name,
        authorImage: currentUser.avatar,
      };
      setPosts([newPostForState, ...posts]);
      setNewPostText(""); setNewPostImage(""); setNewPostTagsString(""); setNewPostLinkUrl("");
      showNotification("Post created successfully!"); // ADDED
    } catch (error) {
      console.error("Failed to create post", error);
      showNotification(`Error creating post: ${error?.error || 'Please try again.'}`, "error"); // ADDED
    }
  };

  const handleLikePost = async (postId, userId) => {
    if (!userId) {
      showNotification("Please log in to like a post.", "error"); // ADDED
      throw new Error("User not logged in to like.");
    }
    try {
      const result = await likeUnlikePostAPI(postId, userId); // Expects { likeCount: number, liked: boolean }
      setPosts(prevPosts => prevPosts.map(p =>
          p.id === postId ? { ...p, likeCount: result.likeCount } : p
      ));
      // showNotification(result.liked ? "Post liked!" : "Post unliked!"); // Optional: notification for like/unlike
      return { liked: result.liked, likeCount: result.likeCount }; // Return full result
    } catch (error) {
      console.error("Failed to like/unlike post in Post.jsx:", error);
      showNotification(`Error liking/unliking post: ${error?.error || 'Please try again.'}`, "error"); // ADDED
      throw error;
    }
  };

  const handleCreateComment = async (postId, commentContent, userId) => {
    if (!userId) {
        showNotification("Please log in to comment.", "error"); // ADDED
        navigate("/login"); throw new Error("User not logged in");
    }
    try {
      const newCommentData = await createCommentAPI(postId, { content: commentContent, userId: userId });
      setPosts(prevPosts => prevPosts.map(p =>
          p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
      ));
      showNotification("Comment posted!"); // ADDED
      return newCommentData;
    } catch (error) {
      console.error("Failed to create comment from Post.jsx:", error);
      showNotification(`Error creating comment: ${error?.error || 'Please try again.'}`, "error"); // ADDED
      throw error;
    }
  };

  const handleDeletePost = async (postId) => {
    if (!currentUser?.id) {
        showNotification("You must be logged in to delete a post.", "error"); // ADDED
        navigate("/login"); return;
    }
    try {
      await deletePostAPI(postId);
      setPosts(posts.filter(p => p.id !== postId));
      showNotification("Post deleted successfully."); // ADDED
    } catch (error) {
      console.error("Failed to delete post:", error);
      showNotification(`Error deleting post: ${error?.error || 'Please try again.'}`, "error"); // ADDED
    }
  };

  const handleEditPostTrigger = (postToEdit) => {
    setEditingPost(postToEdit);
    setShowEditModal(true);
  };

  const handleUpdatePostSubmit = async (postId, updatedData) => {
    if (!currentUser?.id) {
        showNotification("You must be logged in to update a post.", "error"); // ADDED
        return;
    }
    try {
      const updatedPostFromAPI = await updatePostAPI(postId, updatedData);
      setPosts(prevPosts => prevPosts.map(p =>
          p.id === postId ? {
            ...p,
            ...updatedPostFromAPI,
            createdAt: updatedPostFromAPI.createdAt ? new Date(updatedPostFromAPI.createdAt).toISOString() : p.createdAt,
            updatedAt: updatedPostFromAPI.updatedAt ? new Date(updatedPostFromAPI.updatedAt).toISOString() : new Date().toISOString(),
          } : p
      ));
      setShowEditModal(false); setEditingPost(null);
      showNotification("Post updated successfully!"); // ADDED
    } catch (error) {
      console.error("Failed to update post:", error);
      showNotification(`Error updating post: ${error?.error || 'Please try again.'}`, "error"); // ADDED
    }
  };

  return (
      <div className="w-full bg-gray-100 flex flex-col min-h-screen font-sans">
        {/* ADDED: Notification Display */}
        {notification.show && (
            <div
                className={`fixed top-4 right-4 z-[1000] p-4 rounded-md shadow-lg text-white
                ${notification.type === "success" ? "bg-green-500" : ""}
                ${notification.type === "error" ? "bg-red-500" : ""}
                ${notification.type === "info" ? "bg-blue-500" : ""}`}
            >
                {notification.message}
                <button
                    onClick={() => {
                        if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
                        setNotification({ show: false, message: "", type: "success" });
                    }}
                    className="ml-4 text-lg font-semibold leading-none"
                    aria-label="Close notification"
                >&times;</button>
            </div>
        )}

        <Header isLoggedIn={isUserLoggedIn} userName={currentUser?.name} userAvatar={currentUser?.avatar} onLogout={handleActualLogout} />
        <main className="flex-grow w-full max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Discussion</h1>
          <div className="mb-6 flex flex-wrap gap-2">
            {availableTopics.map(topic => (
                <button key={topic.name} onClick={() => setActiveFilter(topic.name)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFilter === topic.name ? 'bg-[#14AE5C] text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {topic.name}
                </button>
            ))}
          </div>

          {isUserLoggedIn && currentUser && (
              <div className="bg-white p-5 rounded-lg shadow-md mb-8">
                <div className="flex items-start gap-3">
                  <img src={currentUser.avatar} alt="Your avatar" className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/cccccc/FFFFFF?text=Me"; }} />
                  <form onSubmit={handleCreatePost} className="flex-grow">
                    <textarea value={newPostText} onChange={(e) => setNewPostText(e.target.value)} placeholder="What's on your mind about trees today?" className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-1 focus:ring-[#14AE5C] focus:border-transparent text-sm" rows="3"></textarea>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-2 mt-2 items-center text-sm">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                        <input type="text" value={newPostImage} onChange={(e) => setNewPostImage(e.target.value)} placeholder="Add Photo URL (optional)" className="flex-grow p-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#14AE5C] w-full"/>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h10a3 3 0 013 3v5a.997.997 0 01-.293-.707zM11 5a1 1 0 10-2 0v3H7a1 1 0 100 2h2v3a1 1 0 102 0v-3h2a1 1 0 100-2h-2V5z" clipRule="evenodd"></path></svg>
                        <input type="text" value={newPostTagsString} onChange={(e) => setNewPostTagsString(e.target.value)} placeholder="Add Tags (comma-separated)" className="flex-grow p-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#14AE5C] w-full"/>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.976-1.138 2.5 2.5 0 01-.142-3.667l3-3z"></path><path d="M8.603 14.97a2.5 2.5 0 01-3.535-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.976 1.138 2.5 2.5 0 01.142 3.667l-3 3z"></path></svg>
                        <input type="url" value={newPostLinkUrl} onChange={(e) => setNewPostLinkUrl(e.target.value)} placeholder="Add Link URL (optional)" className="flex-grow p-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#14AE5C] w-full"/>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button type="submit" className="bg-[#14AE5C] hover:bg-[#129b52] text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors">Post</button>
                    </div>
                  </form>
                </div>
              </div>
          )}

          <div>
            {isLoading && <p className="text-center text-gray-500 py-10">Loading posts...</p>}
            {!isLoading && posts.length === 0 && (<p className="text-center text-gray-500 py-10">No posts found for "{activeFilter}".{isUserLoggedIn && currentUser && " Why not create one?"}{!isUserLoggedIn && " Login to create posts or view more."}</p>)}
            {!isLoading && posts.length > 0 && (
                posts.map(post => (
                    <BlogPostCard key={post.id} post={post} onLike={handleLikePost} onComment={handleCreateComment} onDelete={handleDeletePost} onEdit={handleEditPostTrigger} currentUser={currentUser} />
                ))
            )}
          </div>
        </main>
        <Footer />
        {/* ADDED: Pass showNotification to EditPostModal */}
        <EditPostModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingPost(null); }} postToEdit={editingPost} onUpdatePost={handleUpdatePostSubmit} currentUser={currentUser} showNotification={showNotification} />
      </div>
  );
};

export default Post;
