"use client";
import React, { useState } from "react";

const STORIES = [
  { id: 1, img: "/assets/images/card_ppl1.png", name: "Your Story", type: "profile" },
  { id: 2, img: "/assets/images/card_ppl2.png", name: "Ryan Roslansky", type: "public" },
  { id: 3, img: "/assets/images/card_ppl3.png", name: "Person 3", type: "public" },
  { id: 4, img: "/assets/images/card_ppl4.png", name: "Person 4", type: "public" },
  { id: 5, img: "/assets/images/card_ppl2.png", name: "Person 5", type: "public" },
  { id: 6, img: "/assets/images/card_ppl3.png", name: "Person 6", type: "public" },
];

export default function StoryCarousel() {
  const [start, setStart] = useState(0);
  const perPage = 4;

  function prev() {
    setStart((s) => Math.max(0, s - perPage));
  }

  function next() {
    setStart((s) => Math.min(STORIES.length - perPage, s + perPage));
  }

  const visible = STORIES.slice(start, start + perPage);

  return (
    <>
      {/* Desktop Stories (matches original feed.html structure) */}
      <div className="_feed_inner_ppl_card _mar_b16 d-none d-md-block">
        <div className="_feed_inner_story_arrow">
          <button type="button" className="_feed_inner_story_arrow_btn" onClick={prev} aria-label="Previous stories">
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8"><path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"/></svg>
          </button>
        </div>
        <div className="row">
          {visible.map((s) => (
            <div key={s.id} className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
              {s.type === "profile" ? (
                <div className="_feed_inner_profile_story _b_radious6 ">
                  <div className="_feed_inner_profile_story_image">
                    <img src={s.img} alt={s.name} className="_profile_story_img" />
                    <div className="_feed_inner_story_txt">
                      <div className="_feed_inner_story_btn">
                        <button type="button" className="_feed_inner_story_btn_link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                          </svg>
                        </button>
                      </div>
                      <p className="_feed_inner_story_para">{s.name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="_feed_inner_public_story _b_radious6">
                  <div className="_feed_inner_public_story_image">
                    <img src={s.img} alt={s.name} className="_public_story_img" />
                    <div className="_feed_inner_pulic_story_txt">
                      <p className="_feed_inner_pulic_story_para">{s.name}</p>
                    </div>
                    <div className="_feed_inner_public_mini">
                      <img src="/assets/images/mini_pic.png" alt="mini" className="_public_mini_img" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stories (matches original feed.html mobile layout) */}
      <div className="_feed_inner_ppl_card_mobile _mar_b16 d-block d-md-none">
        <div className="_feed_inner_ppl_card_area">
          <ul className="_feed_inner_ppl_card_area_list">
            {STORIES.map((s, idx) => (
              <li key={s.id} className="_feed_inner_ppl_card_area_item">
                <a href="#0" className="_feed_inner_ppl_card_area_link">
                  <div className={idx === 0 ? "_feed_inner_ppl_card_area_story" : (idx % 2 === 0 ? "_feed_inner_ppl_card_area_story_active" : "_feed_inner_ppl_card_area_story_inactive") }>
                    <img src={s.img} alt={s.name} className={idx === 0 ? "_card_story_img" : "_card_story_img1"} />
                    {idx === 0 && (
                      <div className="_feed_inner_ppl_btn">
                        <button type="button" className="_feed_inner_ppl_btn_link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="_feed_inner_ppl_card_area_link_txt">{s.name}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
