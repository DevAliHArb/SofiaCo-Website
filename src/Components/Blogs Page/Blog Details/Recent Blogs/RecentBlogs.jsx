import React, { useContext, useEffect, useState } from 'react';
import classes from './RecentBlogs.module.css'
import { useNavigate } from '@hooks/useNavigate';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AuthContext from '../../../Common/authContext';
import blogImg from '../../../../assets/EventImg.webp'
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { toast } from 'react-toastify';
import { stripHtmlTags, truncateText } from '../../../Common/TextUtils';

const RecentBlogs = () => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const user = useSelector((state) => state.products.userInfo);
  const [blogData, setblogData] = useState([]);

  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/blogs?ecom_type=sofiaco`);
      const activeData = response.data?.filter(blog => blog.is_active === true);
      const sortedData = activeData?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setblogData(sortedData);
    } catch (error) {}
  };

  useEffect(() => { fetchAbout(); }, []);

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const HandleLike = async (blogId) => {
    const formData = { blog_id: blogId, user_id: user?.id };
    try {
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/blogs-like`, formData);
      fetchAbout();
      toast.success(response.data?.message, { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
    } catch (error) {
      toast.error(`An error occurred. Please try again.`, { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
    }
  };

  return (
    <div className={classes.blogContainert}>
      <div className={classes.header} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '2em' }}>
        <div className={classes.title} style={{ margin: 'auto' }}>
          <h2 style={{ textAlign: 'center' }}>{language === 'eng' ? "Recent Blogs" : "Blogs récents"}</h2>
        </div>
      </div>
      <div className={classes.cardsGridContainer} style={{ position: 'relative' }}>
        <Swiper
          navigation={{ nextEl: `.${classes.navButton_next}`, prevEl: `.${classes.navButton_prev}` }}
          modules={[Navigation]}
          breakpoints={{ 0: { slidesPerView: 2, spaceBetween: 5 }, 651: { slidesPerView: 2, spaceBetween: 5 }, 951: { slidesPerView: 3, spaceBetween: 30 } }}
        >
          {blogData?.map((blog, index) => (
            <SwiperSlide key={blog.id} className={classes.swiperslide}>
              <div className={classes.cardGrid} key={index} onClick={() => navigate(`/main/blogdetails/${blog.id}`)}>
                <div className={classes.gridblogContant}>
                  <div style={{ position: 'relative', width: '100%', zIndex: 2 }}>
                    <div className={classes.imagesCont}>
                      <img alt='' src={blog?.image || blogImg} className={classes.blogImg} />
                    </div>
                    <div className={classes.titleCon}>
                      <h2>{blog.title}</h2>
                    </div>
                    <p className={classes.description}>{truncateText(stripHtmlTags(blog?.description || ''), 160)}</p>
                    <p style={{ color: '#868686', borderBottom: '1px solid #D9D9D9', paddingBottom: "1em", marginBottom: "1em" }}>{blog?.user?.first_name} {blog?.user?.last_name}</p>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: "0 0" }}>
                      <div className={classes.contantRow} style={{ backgroundColor: 'transparent' }}>
                        {blog.blog_like?.some(like => like.user_id === user?.id) ? (
                          <BiSolidLike style={{ fontSize: '1.5em', color: 'var(--secondary-color)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); HandleLike(blog.id); }} />
                        ) : (
                          <AiOutlineLike style={{ fontSize: '1.5em', color: 'var(--secondary-color)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); HandleLike(blog.id); }} />
                        )}
                      </div>
                      <div className={classes.contantRow}>
                        <FaRegCommentDots style={{ width: '1em', height: '1em', margin: 'auto .5em auto 0', objectFit: 'contain' }} />
                        <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{blog?.blog_reply?.length}</p>
                        <AiOutlineLike style={{ width: '1em', height: '1em', margin: 'auto .5em', objectFit: 'contain' }} />
                        <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{blog?.blog_like?.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={classes.customNavigation}>
          <button className={classes.navButton_prev}><KeyboardArrowLeftIcon className={classes.nav_icon} /></button>
          <button className={classes.navButton_next}><KeyboardArrowLeftIcon style={{ transform: 'rotate(180deg)' }} className={classes.nav_icon} /></button>
        </div>
      </div>
    </div>
  );
};

export default RecentBlogs;
