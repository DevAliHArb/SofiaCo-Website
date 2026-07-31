import React, { useContext, useEffect, useState } from 'react'
import classes from './BlogDetails.module.css'
import blogImg from '../../../assets/EventImg.webp'
import { FaFacebookF } from "react-icons/fa";
import XIcon from '@mui/icons-material/X';
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { RxPerson } from "react-icons/rx";
import { IoCalendarOutline } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AuthContext from '../../Common/authContext';
import { Button, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import RecentBlogs from './Recent Blogs/RecentBlogs';
import NewsLetterSection from '../../Home Page/NewsLetter/NewsLetterSection';
import Breadcrumb from '../../Common/Breadcrumb/Breadcrumb';
import Seo, { JsonLd, buildBreadcrumbJsonLd, buildBlogPostingJsonLd } from '../../Common/Seo';

const BlogDetails = () => {
  const authCtx = useContext(AuthContext);
  const { blogId } = useParams();
  const [form] = Form.useForm();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const user = useSelector((state) => state.products.userInfo);
  const [blog, setblog] = useState({ date: '2024-01-1 00:00:00' });
  const [headings, setHeadings] = useState([]);
  const [modifiedDescription, setModifiedDescription] = useState('');

  const extractHeadings = (htmlString) => {
    if (!htmlString) return [];
    const headingRegex = /<h([12])(?:\s[^>]*)?>([^<]+)<\/h\1>/gi;
    const headingsList = [];
    let match;
    while ((match = headingRegex.exec(htmlString)) !== null) {
      headingsList.push({ id: `heading-${headingsList.length}`, level: parseInt(match[1]), text: match[2] });
    }
    return headingsList;
  };

  const addIdsToHeadings = (htmlString) => {
    if (!htmlString) return htmlString;
    let counter = 0;
    return htmlString.replace(/<h([12])(\s[^>]*)?>([^<]+)<\/h\1>/gi, (match, level, attrs, text) => {
      const id = `heading-${counter++}`;
      return `<h${level}${attrs || ''} id="${id}">${text}</h${level}>`;
    });
  };

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 200, behavior: 'smooth' });
    }
  };

  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/blogs/${blogId}`);
      setblog(response.data);
    } catch (error) {}
  };

  useEffect(() => { fetchAbout(); }, [blogId]);

  useEffect(() => {
    if (blog?.description) {
      setHeadings(extractHeadings(blog.description));
      setModifiedDescription(addIdsToHeadings(blog.description));
    }
  }, [blog?.description]);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return language === 'eng' ? date.toDateString() : date.toLocaleDateString('fr-FR', options);
  };

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

  const HandleSubmit = async (e) => {
    const formData = { ...e, blog_id: blog?.id, user_id: user?.id };
    try {
      await axios.post(`${import.meta.env.VITE_TESTING_API}/blogs-reply`, formData);
      fetchAbout();
      toast.success("Comment uploaded successfully", { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
      form.resetFields();
    } catch (error) {
      toast.error(`An error occurred. Please try again.`, { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check this out!");
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    else if (platform === 'x') window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    else if (platform === 'copy') navigator.clipboard.writeText(window.location.href).then(() => alert("URL copied to clipboard!"));
  };

  const breadcrumbPaths = [
    { en: 'Home', fr: 'Accueil', url: '/main' },
    { en: `Blogs`, fr: `Blogs`, url: '/main/blogs' },
    { en: `${blog?.title}`, fr: `${blog?.title}`, url: '' }
  ];

  const canonicalPath = `/main/blogdetails/${blogId}`;

  return (
    <>
      <Seo
        title={blog?.title}
        description={blog?.introduction}
        path={canonicalPath}
        image={blog?.image}
        type="article"
        jsonLd={[
          buildBlogPostingJsonLd(blog, canonicalPath),
          buildBreadcrumbJsonLd(breadcrumbPaths, language),
        ]}
      />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className={classes.blogDetailsContainert}>
        <div className={classes.contantContainer}>
          <div className={classes.blogContant}>
            <h1>{blog?.title}</h1>
            <div className={classes.topContainer}>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: ".5em" }}>
                <div className={classes.contantRow}>
                  <IoCalendarOutline style={{ width: '1em', height: '1em', margin: 'auto .5em auto 0', objectFit: 'contain' }} />
                  <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{formatDate(blog?.created_at)}</p>
                </div>
                <div className={classes.contantRow}>
                  <RxPerson style={{ width: '1em', height: '1em', margin: 'auto .5em auto 0', objectFit: 'contain' }} />
                  <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{blog?.user?.first_name} {blog?.user?.last_name}</p>
                </div>
                <div className={classes.contantRow}>
                  <FaRegCommentDots style={{ width: '1em', height: '1em', margin: 'auto .5em auto 0', objectFit: 'contain' }} />
                  <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{blog?.blog_reply?.length}</p>
                  {blog?.blog_like?.some(like => like.user_id === user?.id) ? (
                    <BiSolidLike style={{ width: '1em', height: '1em', margin: 'auto .5em', objectFit: 'contain', cursor: 'pointer' }} onClick={() => HandleLike(blog?.id)} />
                  ) : (
                    <AiOutlineLike style={{ width: '1em', height: '1em', margin: 'auto .5em', objectFit: 'contain', cursor: 'pointer' }} onClick={() => HandleLike(blog?.id)} />
                  )}
                  <p style={{ textTransform: 'capitalize', fontWeight: '400', margin: 'auto 0' }}>{blog?.blog_like?.length}</p>
                </div>
              </div>
              <div className={classes.contantRow} style={{ backgroundColor: 'transparent' }}>
                <p style={{ color: "#898989", display: 'flex', flexDirection: "row", margin: 'auto 0' }}>{language === 'eng' ? "Share On" : "Partager sur"}</p>
                <div style={{ width: "2em", height: "2em", display: "flex", marginRight: "0.5em", marginLeft: "0.5em", background: "#fff", border: "1px solid var(--secondary-color)", borderRadius: "50%" }} onClick={() => handleShare('facebook')}><FaFacebookF style={{ color: 'var(--secondary-color)', margin: 'auto', cursor: 'pointer', fontSize: "1em" }} /></div>
                <div style={{ width: "2em", height: "2em", display: "flex", marginRight: "0.5em", background: "#fff", border: "1px solid var(--secondary-color)", borderRadius: "50%" }} onClick={() => handleShare('x')}><XIcon style={{ color: 'var(--secondary-color)', margin: 'auto', cursor: 'pointer', fontSize: "1em" }} /></div>
                <div style={{ width: "2em", height: "2em", display: "flex", marginRight: "0.5em", background: "#fff", border: "1px solid var(--secondary-color)", borderRadius: "50%" }} onClick={() => handleShare('copy')}><IoIosLink style={{ color: 'var(--secondary-color)', margin: 'auto', cursor: 'pointer', fontSize: "1em" }} /></div>
              </div>
            </div>
            <p style={{ margin: '1em 0' }}>{blog?.introduction}</p>
            <div className={classes.summaryContainer} style={{ display: 'flex', gap: '2em', alignItems: 'flex-start' }}>
              {headings.length > 0 && (
                <div className={classes.summary} style={{ flex: '0 0 250px', backgroundColor: '#f5f5f5', padding: '1.5em', borderRadius: '1em', maxHeight: '600px', overflowY: 'auto', position: 'relative', margin: '1em 0' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '1em', fontSize: '1.1em', fontWeight: '600' }}>{language === 'eng' ? 'Summary' : 'Sommaire'}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {headings.map((heading) => (
                      <li key={heading.id} style={{ marginBottom: '0.8em', marginLeft: heading.level === 2 ? '1.5em' : 0 }}>
                        <a onClick={() => scrollToHeading(heading.id)} style={{ cursor: 'pointer', color: 'var(--secondary-color)', textDecoration: 'none', fontSize: heading.level === 1 ? '1em' : '0.9em', fontWeight: heading.level === 1 ? '600' : '500', display: 'block', padding: '0.5em' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-color)'; e.currentTarget.style.textDecoration = 'underline'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--secondary-color)'; e.currentTarget.style.textDecoration = 'none'; }}>
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={classes.imagesCont}>
                <img alt='' src={blog?.image || blogImg} className={classes.blogImg} />
              </div>
            </div>
            <p dangerouslySetInnerHTML={{ __html: modifiedDescription }} />
            <Form layout="vertical" name="nest-messages" form={form} onFinish={HandleSubmit} className={classes.form}>
              <Form.Item name="description" style={{ width: '100%' }} rules={[{ required: true, message: `${language === 'eng' ? "please enter your comment" : "veuillez saisir votre commentaire"}` }]}>
                <Input name="description" size="large" placeholder={language === 'eng' ? "Enter your comment" : "Entrez votre commentaire"} style={{ border: '1px solid #D9D9D9', backgroundColor: "#fff", color: 'var(--accent-color)', height: '2.5em' }} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" className={classes.btnsave}>{language === "eng" ? "Add Comment" : "Ajouter un commentaire"}</Button>
              </Form.Item>
            </Form>
            {blog?.blog_reply?.map((props, index) => (
              <div className={classes.repliesCont} key={index}>
                <h2>{props?.user?.first_name} {props?.user?.last_name}</h2>
                <p>{props?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RecentBlogs />
      <NewsLetterSection />
    </>
  );
};

export default BlogDetails;
