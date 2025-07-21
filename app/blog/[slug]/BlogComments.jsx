// app/blog/[slug]/BlogComments.jsx
"use client";

import { useEffect, useState } from "react";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { BASE_URL } from "@/baseUrl/baseUrl";

export default function BlogComments({ blogId, initialComments = [] }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  //console.log('Initial comments:', initialComments);
  // console.log('replyto', replyingTo)
  // console.log('replyContent', replyContent)
  //console.log("State comments:", comments);

  useEffect(() => {
    if (initialComments.length > 0) {
      setComments(initialComments);
    }
  }, [initialComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!session?.accessToken) {
      toast.error("Please sign in to comment");
      return;
    }
  
    if (!comment.trim() || comment.length < 5) {
      toast.error("Comment must be at least 5 characters long");
      return;
    }
  
    setIsCommenting(true);
    try {
      const response = await fetch(`${BASE_URL}/blogs/${blogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ comment }),
      });
  
      if (!response.ok) throw new Error("Failed to post comment");
  
      const newComment = await response.json();
  
      // Push new comment to state (should now have full comment with user data)
      setComments([...comments, newComment]);
  
      setComment("");
      toast.success("Comment posted!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.message);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();

    if (!session?.accessToken) {
      toast.error("Please sign in to reply");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      // Optimistic update
      const tempReply = {
        id: `temp-${Date.now()}`,
        reply: replyContent,
        user_id: session.user.id,
        comment_id: commentId,
        createdAt: new Date().toISOString(),
        replied_by: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
      };

      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                comment_replies: [...(c.comment_replies || []), tempReply],
              }
            : c
        )
      );

      setReplyContent("");
      setReplyingTo(null);

      // API call
      const response = await fetch(
        `${BASE_URL}/blogs/${blogId}/comment/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            reply: replyContent,
            user_id: session.user.id, // explicitly include it
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post reply");

      const newReply = await response.json();

      // Replace temporary reply with actual response
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                comment_replies: [
                  ...(c.comment_replies || []).filter(
                    (r) => !r.id.startsWith("temp-")
                  ),
                  newReply.data,
                ],
              }
            : c
        )
      );

      toast.success("Reply posted!");
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error(error.message);

      // Revert optimistic update on error
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                comment_replies: (c.comment_replies || []).filter(
                  (r) => !r.id.startsWith("temp-")
                ),
              }
            : c
        )
      );
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!session?.accessToken) {
      toast.error("Please sign in to like comments");
      return;
    }

    try {
      // Find the comment and check if current user has already liked it
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      const isLiked = comment.likes?.some(
        (like) => like.liked_by?.id === session?.user?.id
      );
      const existingLike = comment.likes?.find(
        (like) => like.liked_by?.id === session?.user?.id
      );

      // Optimistic update - immediately update UI
      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c.id === commentId) {
            const updatedLikes = isLiked
              ? c.likes.filter(
                  (like) => like.liked_by?.id !== session?.user?.id
                )
              : [
                  ...(c.likes || []),
                  {
                    id: `temp-${Date.now()}`,
                    comment_id: commentId,
                    liked_by: {
                      id: session.user.id,
                      name: session.user.name,
                    },
                    created_at: new Date().toISOString(), // Add this if your API expects it
                  },
                ];

            return {
              ...c, // Preserve all other comment properties
              likes: updatedLikes,
            };
          }
          return c;
        })
      );

      // API call
      let response;
      if (isLiked && existingLike) {
        // Unlike - delete the like
        response = await fetch(
          `${BASE_URL}/blogs/${blogId}/comment/${commentId}/like/${existingLike.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
      } else {
        // Like - create new like
        response = await fetch(
          `${BASE_URL}/blogs/${blogId}/comment/${commentId}/like`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          isLiked ? "Failed to unlike comment" : "Failed to like comment"
        );
      }

      const responseData = await response.json();

      // Update with server response while preserving all other comment data
      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c.id === commentId) {
            return {
              ...c, // Preserve all existing comment data
              likes: isLiked
                ? c.likes.filter((like) => like.id !== existingLike?.id)
                : [
                    ...(c.likes || []).filter(
                      (like) => !like.id?.startsWith("temp-")
                    ),
                    responseData.data, // Use the actual like object from server
                  ],
            };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Error toggling comment like:", error);
      toast.error(error.message);

      // Revert optimistic update on error
      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              likes:
                comments.find((orig) => orig.id === commentId)?.likes || [],
            };
          }
          return c;
        })
      );
    }
  };

  return (
    <section className="mt-20">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-amber-500" />
          Comments ({comments.length})
        </h3>

        {comments.length > 0 ? (
          <div className="space-y-6 mb-8">
            {comments.map((comment) => (
              <div key={comment.id} className="group">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 ring-2 ring-gray-100 group-hover:ring-amber-200 transition-all duration-300">
                    {comment.commented_by?.name?.charAt(0) || "A"}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-4 group-hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {comment.commented_by?.name || "Anonymous"}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comment.comment}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 space-x-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          comment.likes?.some(
                            (like) => like.liked_by?.id === session?.user?.id
                          )
                            ? "text-red-600"
                            : "text-gray-500 hover:text-red-600"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${
                            comment.likes?.some(
                              (like) => like.liked_by?.id === session?.user?.id
                            )
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        <span>{comment.likes?.length || 0}</span>
                      </button>
                      <button
                        className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id
                          )
                        }
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <form
                        onSubmit={(e) => handleReplySubmit(e, comment.id)}
                        className="mt-4"
                      >
                        <textarea
                          rows="3"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400"
                          placeholder="Write your reply..."
                          required
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            Post Reply
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Replies */}
                    {comment.comment_replies?.length > 0 && (
                      <div className="mt-4 pl-8 border-l-2 border-amber-100 space-y-4">
                        {comment.comment_replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                              {reply.replied_by?.name?.charAt(0) || "A"}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-medium text-gray-800 text-sm">
                                    {reply.replied_by?.name || "Anonymous"}
                                  </h5>
                                  <span className="text-xs text-gray-400">
                                    {new Date(
                                      reply.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  {reply.reply}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl">
            <p className="text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}

        {/* Comment Form */}
        <div className="border-t border-gray-100 pt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Join the conversation
          </h4>
          <form onSubmit={handleCommentSubmit}>
            <div className="space-y-4">
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400"
                placeholder="Share your thoughts or ask a question..."
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCommenting}
                  className="bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-70 flex items-center"
                >
                  {isCommenting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
