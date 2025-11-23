"use client";
import React from "react";

export default function MobileBottomNav() {
  return (
    <div className="_mobile_navigation_bottom_wrapper">
      <div className="_mobile_navigation_bottom_wrap">
        <div className="conatiner">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <ul className="_mobile_navigation_bottom_list">
                <li className="_mobile_navigation_bottom_item">
                  <a href="/feed" className="_mobile_navigation_bottom_link _mobile_navigation_bottom_link_active">Home</a>
                </li>
                <li className="_mobile_navigation_bottom_item">
                  <a href="/friend-request" className="_mobile_navigation_bottom_link">Friends</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
