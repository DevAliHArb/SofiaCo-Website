import React, { useContext, useEffect, useState } from 'react';
import classes from './BlogPage.module.css'
import { useNavigate } from '@hooks/useNavigate';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AuthContext from '../../Common/authContext';
import blogImg from '../../../assets/EventImg.png'
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import { Popover } from '@mui/material';
import { toast } from 'react-toastify';
import { Input } from 'antd';
import { LuSearch } from 'react-icons/lu';
import { IoIosArrowDown } from "react-icons/io";
import NewsLetterSection from '../../Home Page/NewsLetter/NewsLetterSection';
import Breadcrumb from '../../Common/Breadcrumb/Breadcrumb';

const BlogPage = () => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const user = useSelector((state) => state.products.userInfo);
  const [selectedBlog, setselectedBlog] = useState({});
  const [blogData, setblogData] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpandedA, setIsExpandedA] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getToken = () => sessionStorage.getItem("token");
  const token = getToken();

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleExpandA = () => setIsExpandedA(!isExpandedA);

  const handleOpen1 = (event) => setAnchorEl(event.currentTarget);
  const handleClose1 = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    setselectedBlog({});
  };

  const fetchUserBlogs = async () => {
    if (user?.id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/blogs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserBlogs(response.data.data);
      } catch (error) {}
    }
  };

  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/blogs?ecom_type=sofiaco`);
      const activeData = response.data?.filter(blog => blog.is_active === true);
      const sortedData = activeData?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setblogData(sortedData);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAbout();
    fetchUserBlogs();
  }, []);

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

  const handleRemove = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_TESTING_API}/blogs/${selectedBlog.id}`);
      fetchAbout();
      setAnchorEl(null);
      toast.success("Blog deleted successfully", { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
    } catch (error) {
      toast.error(`An error occurred. Please try again.`, { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
    }
  };

  const handleEdit = () => navigate(`/main/edit-blog/${selectedBlog.id}`);

  const handleUploadToReview = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_TESTING_API}/blogs/${selectedBlog.id}`, { status_id: 43 });
      fetchUserBlogs();
      fetchAbout();
      setAnchorEl(null);
      setselectedBlog({});
      toast.success(language === 'eng' ? 'Blog uploaded for review' : 'Blog envoyé pour examen', { position: 'top-right', autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: 'colored' });
    } catch (error) {
      toast.error(language === 'eng' ? 'An error occurred. Please try again.' : "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const filteredblogs1 = blogData?.filter((blog) => {
    const fullName = `${blog?.user?.first_name} ${blog?.user?.last_name}`.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase())
    );
  });

  const breadcrumbPaths = [
    { en: 'Home', fr: 'Accueil', url: '/main' },
    { en: `Blogs`, fr: `Blogs`, url: '' },
  ];

  return (
    <>
      <Breadcrumb paths={breadcrumbPaths} />
      <div className={classes.blogContainert}>
        {user?.id && (
          <div className={classes.headtitle}>
            <h1 style={{ display: "flex", flexDirection: 'row' }} onClick={fetchUserBlogs}>
              {language === 'eng' ? "My Blogs" : "Mes blogs"}
              <div onClick={toggleExpand} style={{ cursor: 'pointer', width: "1.1em", height: '1.1em', margin: 'auto 0 auto .3em', display: "flex", borderRadius: '50%', background: "#F6F6F6" }}>
                <IoIosArrowDown style={{ fontSize: ".8em", margin: "auto", transition: "transform 0.3s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
              </div>
            </h1>
            <button onClick={() => navigate('/main/add-blog')}>{language === 'eng' ? "Write a Blog" : "Rédiger un blog"}</button>
          </div>
        )}
        <div className={classes.cardsGridContainer} style={{ maxHeight: isExpanded ? "fit-content" : "0px", overflow: "hidden", transition: "all 0.5s ease" }}>
          {userBlogs?.map((blog, index) => (
            <div className={classes.cardGrid} key={index} onClick={() => navigate(`/main/blogdetails/${blog.id}`)}>
              <div className={classes.gridblogContant}>
                <div style={{ position: 'relative', width: '98%', marginLeft: 'auto', zIndex: 2 }}>
                  <div className={classes.titleCon}>
                    <h1 style={{ display: "flex", flexDirection: 'row' }}>
                      {blog.title}
                      <span style={{ fontSize: '0.5em', fontWeight: '400', margin: 'auto 1em', color: '#fff', backgroundColor: blog?.status_id === 11 ? '#3CB101' : blog?.status_id === 12 ? '#FF6B6B' : blog?.status_id === 43 ? '#FFB02E' : 'var(--primary-color)', padding: '.3em 1em', borderRadius: '1em' }}>
                        {blog?.status_id === 10 ? (language === 'eng' ? 'Draft' : 'Brouillon') : blog?.status_id === 43 ? (language === 'eng' ? 'Submitted for review' : 'Soumis pour examen') : (language === 'eng' ? blog?.look_up?.name : blog?.look_up?.name_fr)}
                      </span>
                    </h1>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: blog?.description }} className={classes.description} />
                  {blog?.status_id === 12 && <p className={classes.description} style={{ color: 'var(--primary-color)' }}>{language === 'eng' ? "Reason of rejection: " : "Raison du rejet: "}{blog?.reason}</p>}
                  <p style={{ color: '#868686', borderBottom: '1px solid #D9D9D9', paddingBottom: "1em", marginBottom: "1em" }}>{blog?.user?.first_name} {blog?.user?.last_name}</p>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: "0 0" }}>
                    <div className={classes.contantRow} style={{ backgroundColor: 'transparent' }}>
                      {blog.blog_like?.some(like => like.user_id === user?.id) ? (
                        <BiSolidLike style={{ fontSize: '1.5em', color: 'var(--secondary-color)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); HandleLike(blog.id); }} />
                      ) : (
                        <AiOutlineLike style={{ fontSize: '1.5em', color: 'var(--secondary-color)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); HandleLike(blog.id); }} />
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
                      <div className={classes.contantRow}>
                        <FaRegCommentDots style={{ width: '1em', height: '1em', margin: 'auto .5em auto 0', objectFit: 'contain' }} />
                        <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{blog?.blog_reply?.length}</p>
                        <AiOutlineLike style={{ width: '1em', height: '1em', margin: 'auto .5em', objectFit: 'contain' }} />
                        <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{blog?.blog_like?.length}</p>
                      </div>
                      <div className={classes.contantRow} onClick={(event) => { event.stopPropagation(); handleOpen1(event); setselectedBlog(blog); }}>
                        <HiDotsHorizontal style={{ cursor: 'pointer', margin: 'auto' }} />
                        <Popover id={`simple-popover-${blog.id}`} open={Boolean(anchorEl && selectedBlog?.id === blog.id)} anchorEl={anchorEl} onClose={handleClose1} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', background: '#F2F2F2' }}>
                            {blog?.status_id !== 11 && (
                              <button className={classes.editBtn} onClick={(e) => { e.stopPropagation(); handleEdit(); }}>{language === 'eng' ? 'Edit' : 'Modifier'}</button>
                            )}
                            {blog?.status_id === 10 && (
                              <button className={classes.editBtn} onClick={(e) => { e.stopPropagation(); handleUploadToReview(); }}>{language === 'eng' ? 'Upload Blog to be reviewed' : "Télécharger le blog pour examen"}</button>
                            )}
                            <button className={classes.editBtn} style={{ color: '#FF6B6B' }} onClick={(e) => { e.stopPropagation(); handleRemove(); }}>{language === 'eng' ? 'Remove' : 'Supprimer'}</button>
                          </div>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.gridImg}>
                <img alt='' src={blog?.image || blogImg} className={classes.blogImg} />
              </div>
            </div>
          ))}
        </div>

        <div className={classes.headtitle}>
          <h1 style={{ display: "flex", flexDirection: 'row' }}>
            {language === 'eng' ? "Blogs" : "Blogs"}
            <div onClick={toggleExpandA} style={{ cursor: 'pointer', width: "1.1em", height: '1.1em', margin: 'auto 0 auto .3em', display: "flex", borderRadius: '50%', background: "#F6F6F6" }}>
              <IoIosArrowDown style={{ fontSize: ".8em", margin: "auto", transition: "transform 0.3s ease", transform: isExpandedA ? "rotate(180deg)" : "rotate(0deg)" }} />
            </div>
          </h1>
        </div>
        <div className={classes.cardsGridContainer} style={{ maxHeight: isExpandedA ? "fit-content" : "0px", overflow: "hidden", transition: "all 0.5s ease" }}>
          <Input
            size="large"
            placeholder={language === "eng" ? "Search" : "Rechercher"}
            style={{ height: "2.6em", backgroundColor: "#F2F2F2", width: "20em", margin: "0 1em 1em 0", borderRadius: "10em" }}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className={classes.inputtt}
            prefix={<LuSearch style={{ color: "#868686" }} />}
          />
          {filteredblogs1?.map((blog, index) => (
            <div className={classes.cardGrid} key={index} onClick={() => navigate(`/main/blogdetails/${blog.id}`)}>
              <div className={classes.gridblogContant}>
                <div style={{ position: 'relative', width: '96%', marginLeft: 'auto', zIndex: 2 }}>
                  <div className={classes.titleCon}>
                    <h1>{blog.title}</h1>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: blog?.description }} className={classes.description} />
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
              <div className={classes.gridImg}>
                <img alt='' src={blog?.image || blogImg} className={classes.blogImg} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <NewsLetterSection />
    </>
  );
};

export default BlogPage;
