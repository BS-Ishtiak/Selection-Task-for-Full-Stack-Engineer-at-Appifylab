"use client";
import React, { useState } from "react";

type PostProps = {
  author?: string;
  time?: string;
  title?: string;
  image?: string;
};

export default function PostCard({ author = "Karim Saif", time = "5 minute ago", title = "-Healthy Tracking App", image = "/assets/images/timeline_img.png" }: PostProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [comments, setComments] = useState<Array<{id:number; author:string; text:string}>>([
    { id: 1, author: 'Radovan SkillArena', text: 'It is a long established fact that a reader will be distracted by the readable content.' }
  ]);
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

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
          <p className="_feed_inner_timeline_total_reacts_para">9+</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1"><span>12</span> Comment</p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>122</span> Share</p>
        </div>
      </div>
      <div className="_feed_inner_timeline_reaction">
        <button className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_reaction_active">Haha</button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction" onClick={() => setShowCommentBox((s) => !s)}>Comment</button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">Share</button>
      </div>
      {showCommentBox && (
        <div className="_feed_inner_timeline_cooment_area"> 
          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={(e) => {
              e.preventDefault();
              if (!commentText.trim()) return;
              const newComment = { id: Date.now(), author: 'You', text: commentText.trim() };
              setComments((c) => [...c, newComment]);
              setCommentText('');
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
              <div key={c.id} className="_comment_main">
                <div className="_comment_image">
                  <a href="/profile" className="_comment_image_link"><img src="/assets/images/txt_img.png" alt="" className="_comment_img1" /></a>
                </div>
                <div className="_comment_area">
                  <div className="_comment_details">
                    <div className="_comment_details_top">
                      <div className="_comment_name"><a href="/profile"><h4 className="_comment_name_title">{c.author}</h4></a></div>
                    </div>
                    <div className="_comment_status"><p className="_comment_status_text"><span>{c.text}</span></p></div>
                    <div className="_total_reactions"><div className="_total_react"><span className="_reaction_like"/><span className="_reaction_heart"/></div><span className="_total">198</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
