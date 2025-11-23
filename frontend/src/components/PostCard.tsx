"use client";
import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

type PostProps = {
  author?: string;
  time?: string;
  title?: string;
  image?: string;
};

export default function PostCard({ postId, author = "Karim Saif", time = "5 minute ago", title = "-Healthy Tracking App", image = "/assets/images/timeline_img.png" }: PostProps & { postId?: number }) {
  const { isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [comments, setComments] = useState<Array<any>>([]);
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState<number | null>(null);
  const [postLiked, setPostLiked] = useState<boolean | null>(null);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      setLoadingComments(true);
      try {
        const [commentsResp, postResp] = await Promise.all([
          api.get(`/api/posts/${postId}/comments`),
          api.get(`/api/posts/${postId}`)
        ]);
        if (commentsResp?.data?.success) {
          setComments(commentsResp.data.data || []);
        }
        if (postResp?.data?.success && postResp.data.data) {
          setPostLikeCount(postResp.data.data.like_count ?? null);
          setPostLiked(!!postResp.data.data.liked_by_viewer);
        }
      } catch (e) {
        console.error('Load comments/post error', e);
      } finally {
        setLoadingComments(false);
      }
    })();
  }, [postId]);

  return (
    <article className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src="/assets/images/post_img.png" alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{author}</h4>
              <p className="_feed_inner_timeline_post_box_para">{time} . <a href="#0">Public</a></p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button className="_feed_timeline_post_dropdown_link" onClick={() => setDropdownOpen(!dropdownOpen)}> <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17"><circle cx="2" cy="2" r="2" fill="#C4C4C4" /><circle cx="2" cy="8" r="2" fill="#C4C4C4" /><circle cx="2" cy="15" r="2" fill="#C4C4C4" /></svg> </button>
            </div>
            <div className={`_feed_timeline_dropdown ${dropdownOpen ? "show" : ""}`}>
              <ul className="_feed_timeline_dropdown_list">
                <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Save Post</a></li>
                <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Turn On Notification</a></li>
                <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Hide</a></li>
                <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Edit Post</a></li>
                <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Delete Post</a></li>
              </ul>
            </div>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{title}</h4>
        <div className="_feed_inner_timeline_image">
          <img src={image} alt="" className="_time_img" />
        </div>
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img src="/assets/images/react_img1.png" alt="Image" className="_react_img1" />
          <p className="_feed_inner_timeline_total_reacts_para">{postLikeCount ?? '9+'}</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1"><span>{comments.length}</span> Comment</p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>122</span> Share</p>
        </div>
      </div>
      <div className="_feed_inner_timeline_reaction">
        <button className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${postLiked ? '_feed_reaction_active' : ''}`} onClick={async () => {
          if (!postId || !isAuthenticated) return;
          try {
            const resp = await api.post(`/api/posts/${postId}/like`);
            const payload = resp.data;
            if (payload?.success && payload.data) {
              setPostLiked(payload.data.liked);
              setPostLikeCount(payload.data.like_count);
            }
          } catch (e) {}
        }}>Haha</button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction" onClick={() => setShowCommentBox((s) => !s)}>Comment</button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">Share</button>
      </div>
      {showCommentBox && (
        <div className="_feed_inner_timeline_cooment_area"> 
          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={(e) => {
              e.preventDefault();
              if (!commentText.trim() || !postId) return;
              (async () => {
                try {
                  const resp = await api.post(`/api/posts/${postId}/comments`, { text: commentText.trim() });
                  const payload = resp.data;
                  if (payload?.success && payload.data) {
                    const newComment = payload.data;
                    setComments((c) => [...c, { ...newComment, author: (newComment.first_name || '') + ' ' + (newComment.last_name || ''), text: newComment.text }] as any);
                    setCommentText('');
                  }
                } catch (err) {
                  console.error('Post comment error', err);
                }
              })();
            }}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea className="form-control _comment_textarea" placeholder="Write a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button className="_feed_inner_comment_box_icon_btn" type="submit">Send</button>
              </div>
            </form>
          </div>
          <div className="_timline_comment_main">
            {comments.map(c => (
              <CommentItem key={c.id} comment={c} onReplyCreated={(reply:any) => {
                // append reply to comment's replies list if present
                setComments((prev) => prev.map(cm => cm.id === c.id ? { ...cm, replies: [...(cm.replies || []), reply], reply_count: (cm.reply_count || 0) + 1 } : cm));
              }} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function CommentItem({ comment, onReplyCreated }: { comment: any; onReplyCreated?: (r:any)=>void }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<any[]>(comment.replies || []);

  useEffect(() => {
    setReplies(comment.replies || []);
  }, [comment.replies]);

  const submitReply = async () => {
    if (!replyText.trim()) return;
    try {
      const resp = await api.post(`/api/comments/${comment.id}/replies`, { text: replyText.trim() });
      const payload = resp.data;
      if (payload?.success && payload.data) {
        const newReply = payload.data;
        setReplies((r) => [...r, newReply]);
        setReplyText('');
        setShowReplyBox(false);
        if (onReplyCreated) onReplyCreated(newReply);
      }
    } catch (e) {
      console.error('Submit reply error', e);
    }
  };

  const toggleCommentLike = async () => {
    try {
      const resp = await api.post(`/api/comments/${comment.id}/like`);
      const payload = resp.data;
      if (payload?.success && payload.data) {
        // update local like_count if present
        comment.like_count = payload.data.like_count;
      }
    } catch (e) {
      console.error('Comment like error', e);
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <a href="/profile" className="_comment_image_link"><img src="/assets/images/txt_img.png" alt="" className="_comment_img1" /></a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name"><a href="/profile"><h4 className="_comment_name_title">{(comment.first_name || '') + ' ' + (comment.last_name || '') || comment.author}</h4></a></div>
          </div>
          <div className="_comment_status"><p className="_comment_status_text"><span>{comment.text}</span></p></div>
          <div className="_total_reactions">
            <div className="_total_react">
              <button onClick={toggleCommentLike} className="_reaction_like" />
              <button className="_reaction_heart" />
            </div>
            <span className="_total">{comment.like_count || 0}</span>
            <button style={{ marginLeft: 12 }} onClick={() => setShowReplyBox(s => !s)}>Reply</button>
          </div>
          {showReplyBox && (
            <div style={{ marginTop: 8 }}>
              <textarea value={replyText} onChange={(e)=>setReplyText(e.target.value)} className="form-control" />
              <div style={{ marginTop: 6 }}>
                <button className="_feed_inner_comment_box_icon_btn" onClick={(e)=>{ e.preventDefault(); submitReply(); }}>Send</button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {replies.map((r:any) => (
                <div key={r.id} style={{ paddingLeft: 12, marginTop: 6 }}>
                  <strong>{(r.first_name || '') + ' ' + (r.last_name || '')}</strong>: <span>{r.text}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
