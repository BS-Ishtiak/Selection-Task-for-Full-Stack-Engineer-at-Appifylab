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
  const [postVisibility, setPostVisibility] = useState<string>('public');
  const [showLikers, setShowLikers] = useState(false);
  const [likers, setLikers] = useState<any[]>([]);
  const [loadingLikers, setLoadingLikers] = useState(false);
  const [likersError, setLikersError] = useState<string | null>(null);

  const fetchLikers = async (forceShow = false) => {
    if (!postId) return;
    setLoadingLikers(true);
    setLikersError(null);
    try {
      const resp = await api.get(`/api/posts/${postId}/likes`);
      if (resp?.status === 200 && resp?.data?.success) {
        setLikers(resp.data.data || []);
        if (forceShow) setShowLikers(true);
        return true;
      } else if (resp?.status === 401) {
        setLikersError('Please login to view who liked this post');
      } else {
        setLikersError('Could not load likers');
        console.error('Load likers unexpected response', resp);
      }
    } catch (e: any) {
      console.error('Load likers error', e);
      setLikersError(e?.response?.data?.message || 'Server error while loading likers');
    } finally {
      setLoadingLikers(false);
    }
    return false;
  };

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
          // Normalize numeric fields coming from DB (PG returns counts as strings)
          const normalized = (commentsResp.data.data || []).map((c: any) => ({
            ...c,
            reply_count: Number(c.reply_count || 0),
            like_count: Number(c.like_count || 0),
            replies: c.replies || [],
          }));
          setComments(normalized);
        }
        if (postResp?.data?.success && postResp.data.data) {
          setPostLikeCount(postResp.data.data.like_count ?? null);
          setPostLiked(!!postResp.data.data.liked_by_viewer);
          setPostVisibility(postResp.data.data.visibility || 'public');
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
              <p className="_feed_inner_timeline_post_box_para">{time} . <a href="#0">{postVisibility === 'private' ? 'Private' : 'Public'}</a></p>
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
        <div className="_feed_inner_timeline_total_reacts_image" style={{ position: 'relative' }}>
          <img src="/assets/images/react_img1.png" alt="Image" className="_react_img1" />
          <p className="_feed_inner_timeline_total_reacts_para" style={{ cursor: 'pointer' }} onClick={async () => {
            if (!postId) return;
            // If already visible, just hide
            if (showLikers) {
              setShowLikers(false);
              return;
            }
            // If already loaded, just show
            if (likers.length) {
              setShowLikers(true);
              return;
            }
            // Fetch likers and show if fetch succeeds
            await fetchLikers(true);
          }}>{postLikeCount ?? '9+'}</p>

          {showLikers && (
            <div style={{ position: 'absolute', top: 28, left: 0, minWidth: 200, background: '#fff', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 50, padding: 8 }}>
              {loadingLikers ? (
                <div style={{ padding: 8, color: '#666' }}>Loading...</div>
              ) : likers.length ? (
                <div>
                  {likers.map((u:any) => (
                      <div key={u.id || `${u.created_at}-${Math.random()}`} style={{ padding: '6px 8px', borderBottom: '1px solid #fafafa', fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{((u.first_name || '') + ' ' + (u.last_name || '')).trim() || 'Unknown'}</div>
                        <div style={{ color: '#777', fontSize: 12 }}>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{ padding: 8, color: '#666' }}>No likes yet</div>
              )}
            </div>
          )}
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1" onClick={() => setShowCommentBox(true)} style={{ cursor: 'pointer' }}><span>{comments.length}</span> Comment</p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Share</p>
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
                // refresh likers list so popup shows latest user who liked
                try { await fetchLikers(); } catch (err) { /* ignore */ }
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
                // append reply to comment's replies list if present and increment reply_count
                setComments((prev) => prev.map(cm => cm.id === c.id ? { ...cm, replies: [...(cm.replies || []), reply], reply_count: Number(cm.reply_count || 0) + 1 } : cm));
              }} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function CommentItem({ comment, onReplyCreated }: { comment: any; onReplyCreated?: (r:any)=>void }) {
  const { isAuthReady } = useAuth();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<any[]>(comment.replies || []);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(!!comment.liked_by_viewer);
  const [likeCount, setLikeCount] = useState<number>(Number(comment.like_count || 0));
  const [showCommentLikers, setShowCommentLikers] = useState(false);
  const [commentLikers, setCommentLikers] = useState<any[]>([]);
  const [loadingCommentLikers, setLoadingCommentLikers] = useState(false);

  const [showReplyLikersFor, setShowReplyLikersFor] = useState<number | null>(null);
  const [replyLikers, setReplyLikers] = useState<any[]>([]);
  const [loadingReplyLikers, setLoadingReplyLikers] = useState(false);

  useEffect(() => {
    setReplies(comment.replies || []);
    // default collapsed view (like Facebook) — user can click to view replies
    setLikeCount(Number(comment.like_count || 0));
    setLiked(!!comment.liked_by_viewer);
  }, [comment.replies]);

  // Load replies if not provided
  useEffect(() => {
    let mounted = true;
    if ((replies && replies.length) || !comment.id || !isAuthReady) return;
    (async () => {
      setLoadingReplies(true);
      try {
        const resp = await api.get(`/api/comments/${comment.id}/replies`);
        const payload = resp.data;
        if (payload?.success) {
          if (!mounted) return;
          setReplies(payload.data || []);
          setShowReplies((payload.data || []).length > 0);
        }
      } catch (e) {
        console.error('Load replies error', e);
      } finally {
        if (mounted) setLoadingReplies(false);
      }
    })();
    return () => { mounted = false; };
  }, [comment.id, isAuthReady]);

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const resp = await api.post(`/api/comments/${comment.id}/replies`, { text: replyText.trim() });
      const payload = resp.data;
      if (payload?.success && payload.data) {
        const newReply = payload.data;
        setReplies((r) => [...r, newReply]);
        setReplyText('');
        setShowReplyBox(false);
        setShowReplies(true);
        if (onReplyCreated) onReplyCreated(newReply);
      }
    } catch (e) {
      console.error('Submit reply error', e);
    } finally {
      setSubmittingReply(false);
    }
  };

  const toggleReplyLike = async (replyId: number) => {
    try {
      const resp = await api.post(`/api/replies/${replyId}/like`);
      const payload = resp.data;
      if (payload?.success && payload.data) {
        setReplies((prev) => prev.map((r) => r.id === replyId ? { ...r, like_count: Number(payload.data.like_count || 0), liked_by_viewer: !!payload.data.liked } : r));
      }
    } catch (e) {
      console.error('Reply like error', e);
    }
  };

  const toggleCommentLike = async () => {
    try {
      const resp = await api.post(`/api/comments/${comment.id}/like`);
      const payload = resp.data;
      if (payload?.success && payload.data) {
        setLikeCount(Number(payload.data.like_count || 0));
        setLiked(!!payload.data.liked);
      }
    } catch (e) {
      console.error('Comment like error', e);
    }
  };

  const fetchCommentLikers = async (forceShow = false) => {
    if (!comment.id || !isAuthReady) return;
    setLoadingCommentLikers(true);
    try {
      const resp = await api.get(`/api/comments/${comment.id}/likes`);
      if (resp?.data?.success) {
        setCommentLikers(resp.data.data || []);
        if (forceShow) setShowCommentLikers(true);
      }
    } catch (e: any) {
      console.error('Load comment likers error', e);
    } finally {
      setLoadingCommentLikers(false);
    }
  };

  const fetchReplyLikers = async (replyId: number, forceShow = false) => {
    if (!replyId || !isAuthReady) return;
    setLoadingReplyLikers(true);
    try {
      const resp = await api.get(`/api/replies/${replyId}/likes`);
      if (resp?.data?.success) {
        setReplyLikers(resp.data.data || []);
        if (forceShow) setShowReplyLikersFor(replyId);
      }
    } catch (e: any) {
      console.error('Load reply likers error', e);
    } finally {
      setLoadingReplyLikers(false);
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <a href="/profile" className="_comment_image_link"><img src="/assets/images/txt_img.png" alt="" className="_comment_img1" /></a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details" style={{ position: 'relative' }}>
          <div className="_comment_details_top">
            <div className="_comment_name"><a href="/profile"><h4 className="_comment_name_title">{(comment.first_name || '') + ' ' + (comment.last_name || '') || comment.author}</h4></a></div>
          </div>
          {showCommentLikers && (
            <div style={{ position: 'absolute', top: '100%', right: 0, minWidth: 220, background: '#fff', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 60, padding: 8 }}>
              {loadingCommentLikers ? (
                <div style={{ padding: 8, color: '#666' }}>Loading...</div>
              ) : commentLikers.length ? (
                commentLikers.map((u:any) => (
                  <div key={u.id || u.created_at} style={{ padding: '6px 8px', borderBottom: '1px solid #fafafa', fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{((u.first_name || '') + ' ' + (u.last_name || '')).trim() || 'Unknown'}</div>
                    <div style={{ color: '#777', fontSize: 12 }}>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 8, color: '#666' }}>No likes yet</div>
              )}
            </div>
          )}
          <div className="_comment_status"><p className="_comment_status_text"><span>{comment.text}</span></p></div>

          {/* Inline action row: small 'Reply', 'View X replies', and inline 'Like' link like Facebook */}
          <div style={{ marginTop: 6, display: 'flex', gap: 12, alignItems: 'center', fontSize: 13 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="button" onClick={() => setShowReplyBox(s => !s)} style={{ background: 'transparent', border: 'none', color: '#1877f2', padding: 0, cursor: 'pointer' }}>
                Reply
              </button>
              {replies.length > 0 && (
                <button type="button" onClick={() => setShowReplies(s => !s)} style={{ background: 'transparent', border: 'none', color: '#1877f2', padding: 0, cursor: 'pointer' }}>
                  {showReplies ? `Hide ${replies.length} repl${replies.length > 1 ? 'ies' : 'y'}` : `View ${replies.length} repl${replies.length > 1 ? 'ies' : 'y'}`}
                </button>
              )}
            </div>

            {/* Like count to the left of the Like button */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              {Number(likeCount) > 0 ? (
                <span onClick={async () => {
                    if (showCommentLikers) { setShowCommentLikers(false); return; }
                    if (commentLikers.length) { setShowCommentLikers(true); return; }
                    await fetchCommentLikers(true);
                  }} style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}>{likeCount}</span>
              ) : null}
              <button type="button" onClick={toggleCommentLike} style={{ background: 'transparent', border: 'none', color: liked ? '#1877f2' : '#666', padding: 0, cursor: 'pointer' }} aria-pressed={liked}>
                {liked ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>
          {showReplyBox && (
            <div style={{ marginTop: 12, clear: 'both' }}>
              <textarea value={replyText} onChange={(e)=>setReplyText(e.target.value)} className="form-control" placeholder="Write a reply..." />
              <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                <button className="_feed_inner_comment_box_icon_btn" onClick={(e)=>{ e.preventDefault(); submitReply(); }} disabled={submittingReply}>{submittingReply ? 'Sending...' : 'Send'}</button>
                <button className="_feed_inner_comment_box_icon_btn" onClick={(e)=>{ e.preventDefault(); setShowReplyBox(false); setReplyText(''); }}>{'Cancel'}</button>
              </div>
            </div>
          )}

          {loadingReplies ? (
            <div style={{ marginTop: 8, color: '#666' }}>Loading replies...</div>
          ) : (
            <>
              {replies.length > 0 && (
                <div style={{ marginTop: 12, clear: 'both' }}>
                  {!showReplies ? (
                    // collapsed: render preview only (controls are in the inline action row)
                    replies[replies.length - 1] ? (
                        <div style={{ marginTop: 6, borderLeft: '2px solid #eee', paddingLeft: 12, opacity: 0.95, position: 'relative' }}>
                          <div style={{ fontSize: 13 }}><strong>{(replies[replies.length - 1].first_name || '') + ' ' + (replies[replies.length - 1].last_name || '')}</strong> <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>{replies[replies.length - 1].created_at ? new Date(replies[replies.length - 1].created_at).toLocaleString() : ''}</span></div>
                          <div style={{ marginTop: 4 }}>{replies[replies.length - 1].text}</div>
                          <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                              {Number(replies[replies.length - 1].like_count) > 0 ? (
                                <span onClick={async () => {
                                    const rid = replies[replies.length - 1].id;
                                    if (showReplyLikersFor === rid) { setShowReplyLikersFor(null); return; }
                                    if (replyLikers.length && showReplyLikersFor === rid) { setShowReplyLikersFor(rid); return; }
                                    await fetchReplyLikers(replies[replies.length - 1].id, true);
                                  }} style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}>{replies[replies.length - 1].like_count}</span>
                              ) : null}
                              <button type="button" onClick={() => toggleReplyLike(replies[replies.length - 1].id)} style={{ background: 'transparent', border: 'none', color: replies[replies.length - 1].liked_by_viewer ? '#1877f2' : '#666', padding: 0, cursor: 'pointer' }}>
                                {replies[replies.length - 1].liked_by_viewer ? 'Liked' : 'Like'}
                              </button>
                              {showReplyLikersFor === replies[replies.length - 1].id && (
                                <div style={{ position: 'absolute', top: '100%', right: 0, minWidth: 200, background: '#fff', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 50, padding: 8 }}>
                                  {loadingReplyLikers ? (
                                    <div style={{ padding: 8, color: '#666' }}>Loading...</div>
                                  ) : replyLikers.length ? (
                                    replyLikers.map((u:any)=> (
                                      <div key={u.id || u.created_at} style={{ padding: '6px 8px', borderBottom: '1px solid #fafafa', fontSize: 13 }}>
                                        <div style={{ fontWeight: 600 }}>{((u.first_name || '') + ' ' + (u.last_name || '')).trim() || 'Unknown'}</div>
                                        <div style={{ color: '#777', fontSize: 12 }}>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</div>
                                      </div>
                                    ))
                                  ) : (
                                    <div style={{ padding: 8, color: '#666' }}>No likes yet</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        ) : null
                      ) : (
                    // expanded: render full replies list (no internal toggle button)
                    <>
                      {replies.map((r:any) => (
                        <div key={r.id} style={{ marginTop: 6, borderLeft: '2px solid #eee', paddingLeft: 12, position: 'relative' }}>
                          <div style={{ fontSize: 13 }}><strong>{(r.first_name || '') + ' ' + (r.last_name || '')}</strong> <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</span></div>
                          <div style={{ marginTop: 4 }}>{r.text}</div>
                          <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                              {Number(r.like_count) > 0 ? (
                                <span onClick={async () => {
                                    if (showReplyLikersFor === r.id) { setShowReplyLikersFor(null); return; }
                                    if (replyLikers.length && showReplyLikersFor === r.id) { setShowReplyLikersFor(r.id); return; }
                                    await fetchReplyLikers(r.id, true);
                                  }} style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}>{r.like_count}</span>
                              ) : null}
                              <button type="button" onClick={() => toggleReplyLike(r.id)} style={{ background: 'transparent', border: 'none', color: r.liked_by_viewer ? '#1877f2' : '#666', padding: 0, cursor: 'pointer' }}>
                                {r.liked_by_viewer ? 'Liked' : 'Like'}
                              </button>
                              {showReplyLikersFor === r.id && (
                                <div style={{ position: 'absolute', top: '100%', right: 0, minWidth: 200, background: '#fff', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 50, padding: 8 }}>
                                  {loadingReplyLikers ? (
                                    <div style={{ padding: 8, color: '#666' }}>Loading...</div>
                                  ) : replyLikers.length ? (
                                    replyLikers.map((u:any)=> (
                                      <div key={u.id || u.created_at} style={{ padding: '6px 8px', borderBottom: '1px solid #fafafa', fontSize: 13 }}>
                                        <div style={{ fontWeight: 600 }}>{((u.first_name || '') + ' ' + (u.last_name || '')).trim() || 'Unknown'}</div>
                                        <div style={{ color: '#777', fontSize: 12 }}>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</div>
                                      </div>
                                    ))
                                  ) : (
                                    <div style={{ padding: 8, color: '#666' }}>No likes yet</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
