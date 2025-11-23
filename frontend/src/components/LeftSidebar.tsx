"use client";
import React from "react";

export default function LeftSidebar() {
  return (
    <aside className="_layout_left_sidebar_wrap">
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_explore _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <h4 className="_left_inner_area_explore_title _title5  _mar_b24">Explore</h4>
          <ul className="_left_inner_area_explore_list">
            <li className="_left_inner_area_explore_item _explore_item">
              <a href="#0" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path fill="#666" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0z" />
                </svg>Learning</a> <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">Insights</a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="/find-friends" className="_left_inner_area_explore_link">Find friends</a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">Bookmarks</a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="/group" className="_left_inner_area_explore_link">Group</a>
            </li>
            <li className="_left_inner_area_explore_item _explore_item">
              <a href="#0" className="_left_inner_area_explore_link">Gaming</a> <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">Settings</a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">Save post</a>
            </li>
            <li className="_left_inner_area_explore_item">
              <a href="#0" className="_left_inner_area_explore_link">More</a>
            </li>
          </ul>
        </div>

        <div className="_left_inner_area_suggest _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
            <span className="_left_inner_area_suggest_content_txt">
              <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
            </span>
          </div>
          <div className="_left_inner_area_suggest_info">
            <div className="_left_inner_area_suggest_info_box">
              <div className="_left_inner_area_suggest_info_image">
                <a href="/profile">
                  <img src="/assets/images/people1.png" alt="Image" className="_info_img" />
                </a>
              </div>
              <div className="_left_inner_area_suggest_info_txt">
                <a href="/profile">
                  <h4 className="_left_inner_area_suggest_info_title">Steve Jobs</h4>
                </a>
                <p className="_left_inner_area_suggest_info_para">CEO of Apple</p>
              </div>
            </div>
            <div className="_left_inner_area_suggest_info_link"> <a href="#0" className="_info_link">Connect</a>
            </div>
          </div>
          <div className="_left_inner_area_suggest_info">
            <div className="_left_inner_area_suggest_info_box">
              <div className="_left_inner_area_suggest_info_image">
                <a href="/profile">
                  <img src="/assets/images/people2.png" alt="Image" className="_info_img1" />
                </a>
              </div>
              <div className="_left_inner_area_suggest_info_txt">
                <a href="/profile">
                  <h4 className="_left_inner_area_suggest_info_title">Ryan Roslansky</h4>
                </a>
                <p className="_left_inner_area_suggest_info_para">CEO of Linkedin</p>
              </div>
            </div>
            <div className="_left_inner_area_suggest_info_link"> <a href="#0" className="_info_link">Connect</a>
            </div>
          </div>
          <div className="_left_inner_area_suggest_info">
            <div className="_left_inner_area_suggest_info_box">
              <div className="_left_inner_area_suggest_info_image">
                <a href="/profile">
                  <img src="/assets/images/people3.png" alt="Image" className="_info_img1" />
                </a>
              </div>
              <div className="_left_inner_area_suggest_info_txt">
                <a href="/profile">
                  <h4 className="_left_inner_area_suggest_info_title">Dylan Field</h4>
                </a>
                <p className="_left_inner_area_suggest_info_para">CEO of Figma</p>
              </div>
            </div>
            <div className="_left_inner_area_suggest_info_link"> <a href="#0" className="_info_link">Connect</a>
            </div>
          </div>
        </div>

        <div className="_left_inner_area_event _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_event_content">
            <h4 className="_left_inner_event_title _title5">Events</h4>
            <a href="/event" className="_left_inner_event_link">See all</a>
          </div>
          <a className="_left_inner_event_card_link" href="/event-single">
            <div className="_left_inner_event_card">
              <div className="_left_inner_event_card_iamge">
                <img src="/assets/images/feed_event1.png" alt="Image" className="_card_img" />
              </div>
              <div className="_left_inner_event_card_content">
                <div className="_left_inner_card_date">
                  <p className="_left_inner_card_date_para">10</p>
                  <p className="_left_inner_card_date_para1">Jul</p>
                </div>
                <div className="_left_inner_card_txt">
                  <h4 className="_left_inner_event_card_title">No more terrorism no more cry</h4>
                </div>
              </div>
              <hr className="_underline" />
              <div className="_left_inner_event_bottom">
                <p className="_left_iner_event_bottom">17 People Going</p>
                <button type="button" className="_left_iner_event_bottom_link">Going</button>
              </div>
            </div>
          </a>
          <a className="_left_inner_event_card_link" href="/event-single">
            <div className="_left_inner_event_card">
              <div className="_left_inner_event_card_iamge">
                <img src="/assets/images/feed_event1.png" alt="Image" className="_card_img" />
              </div>
              <div className="_left_inner_event_card_content">
                <div className="_left_inner_card_date">
                  <p className="_left_inner_card_date_para">10</p>
                  <p className="_left_inner_card_date_para1">Jul</p>
                </div>
                <div className="_left_inner_card_txt">
                  <h4 className="_left_inner_event_card_title">No more terrorism no more cry</h4>
                </div>
              </div>
              <hr className="_underline" />
              <div className="_left_inner_event_bottom">
                <p className="_left_iner_event_bottom">17 People Going</p>
                <button type="button" className="_left_iner_event_bottom_link">Going</button>
              </div>
            </div>
          </a>
        </div>
      </div>
    </aside>
  );
}
