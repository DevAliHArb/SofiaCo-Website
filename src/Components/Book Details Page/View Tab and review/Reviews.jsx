import React, { useContext, useEffect, useState } from 'react'
import Rating from "@mui/material/Rating";
import classes from './Reviews.module.css'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Row, Col, Button, Checkbox, Form, Input } from 'antd';
import StarIcon from '@mui/icons-material/Star';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import AuthContext from '../../Common/authContext';
import axios from 'axios';
import { addSelectedBook } from '../../Common/redux/productSlice';
import { Avatar } from '@mui/material';

const allReviews = [
    {
        name:'Samantha D.',
        description:"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
        rate:4.5,
        date:'7/10/2023'
    },
    {
        name:'Alex M.',
        description:"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
        rate:1,
        date:'11/10/2023'
    },
    {
        name:'Ethan R.',
        description:"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
        rate:5,
        date:'1/10/2023'
    },
    {
        name:'Olivia P.',
        description:"I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
        rate:3,
        date:'12/10/2023'
    },
    {
        name:'Ethan R.',
        description:"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
        rate:5,
        date:'1/10/2023'
    },
    {
        name:'Olivia P.',
        description:"I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
        rate:3,
        date:'12/10/2023'
    },
]

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    bgcolor: '#fff',
    boxShadow: 24,
    fontSize:'calc(0.7rem + 0.2vw)',
    fontFamily:'montserrat',
    overflow:'hidden',
    borderRadius:'1em'
  };

  const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };
  
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }
  

  
const Reviews = () => {
    const user = useSelector((state) => state.products.userInfo);
    
    const authCtx = useContext  (AuthContext)
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [displayedObjects, setDisplayedObjects] = useState(2);
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(-1);
    const [bookreview, setBookreview] = useState([]);
    const selectedBook = useSelector((state) => state.products.selectedBook);
    const language = useSelector(
      (state) => state.products.selectedLanguage[0].Language
    );

     
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken()
    
    const showLess = () => {
        setDisplayedObjects(2); 
    };


    const showMore = () => {
        setDisplayedObjects(bookreview?.length); 
    };
    
    const fetchBook = async () => {
        try {
          const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/articles?id=${selectedBook[0].id}`);
          const book = response.data;
          console.log(book)
          dispatch(addSelectedBook(book))
        } catch (error) {
          console.error('Error fetching the book:', error);
        }
      };

  
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/articles/${selectedBook[0].id}/reviews`);
      console.log('Response data:', response.data);
      const reviews = response.data.data;

      setBookreview(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true)
      console.log('Review created:', {
        ...formData,
        user_id: user.id
    });
    if (!user){
      toast.error('Please login first', {hideProgressBar:true})
    }
    try {
      const response = await axios.post(`https://api.leonardo-service.com/api/bookshop/articles/${selectedBook[0].id}/reviews?ecom_type=sofiaco`, {
        ...formData,
        user_id: user.id,
        ecom_type:'albouraq'
    }, {
      headers: {
          Authorization: `Bearer ${token}` // Include token in the headers
      }
  });
      fetchReviews();
      fetchBook();
      setFormData({});
      handleClose();
      form.resetFields();
      toast.success( 'Review added successfully!' , {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
      });
      // Optionally, you can handle success (e.g., show a success message, redirect to another page, etc.)
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error( 'Review submit failed, try agian!' , {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
      });
      // Optionally, you can handle errors (e.g., show an error message to the user)
    } finally {
        setLoading(false)
    }
  };

useEffect(() => {
  fetchReviews();
}, []);
const handleReviewButtonClick = () => {
    if (user) {
      handleOpen(); // Open the review form if the user is logged in
    } else {
      toast.info(`Please login first`, { hideProgressBar: true }); // Display a toast message if the user is not logged in
    }
  };

    return (
        <div className={classes.rev_con}>
        <div   className={classes.input_box}>
            <Form
                        layout="vertical"
                        name="nest-messages"
                        form={form}
                        onFinish={handleSubmit}
                        className={classes.form}
            >
        <div className={classes.input_box_content}>
        <div
        className={classes.rev_input_head}
        >
                <h1 >{language === 'eng' ? "Write a Review" : "Write a Review_fr"}</h1>
                {/* {formData.rate !== null && (
                    <p> {hover !== -1 ? hover : formData.rate} ({labels[hover !== -1 ? hover : formData.rate]} /Amazing) </p>
                )} */}
                <p>{language === 'eng' ? 'How would you rate it?' : 'How would you rate it?_fr' }</p>
                <Rating
                style={{color:'var(--primary-color)',fontSize:'calc(1.3rem + .5vw)'}}
                    name="rate"
                    value={formData.rate}
                    getLabelText={getLabelText}
                    onChange={handleChange}
                    onChangeActive={(event, newHover) => {
                    setHover(newHover);
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                </div>
                <Form.Item
                name="description"
                label={<p >{language === 'eng' ? 'Review Content' : 'Review Content_fr' }</p>}
                rules={[{ required: true, message: `${language === 'eng' ? "Please enter the content" : " Please entr the content_fr"}` }]}
                style={{border:'none',borderRadius:'.5em',width:'88%', margin:'2em auto', background:'transparent'}}
                >
                <Input.TextArea rows={3}
                name="description"
                size="large" 
                placeholder={language === 'eng' ? 'Write down your feedback here...' : 'Write down your feedback here..._fr'}
                value={formData.street}
                        style={{border:'none',color:'var(--secondary-color)',textAlign:'start', background:'transparent'}}
                        onChange={handleChange}
                />
                </Form.Item>
                
        </div>
                <div style={{width:'88%', display:"flex", flexDirection:"row", justifyContent:'space-between',margin:'0'}}>
                    <Form.Item>
                        <Button 
                        size="large"
                        htmlType="submit"
                        disabled={loading}
                        style={{cursor: loading ? 'wait' : 'pointer'}}
                        className={classes.addbtn}>
                            Submit Review
                        </Button>
                    </Form.Item> 
                </div>
                </Form>
       </div>
        <div className={classes.reviewsCon}>
            <h1>{language === 'eng' ? "All Reviews" : "All Reviews_fr"}</h1>
        <div className={classes.big_con}>
            {bookreview?.slice(0, displayedObjects).map((item, index) => (
                <div className={classes.reviews_con} key={item.id} >
                  <div className={classes.image_con}>
                    <Avatar src={`https://api.leonardo-service.com/img/${item.user.image}`} alt={item.user.first_name} />
                  </div>
                    <div style={{ display: 'flex', flexDirection:'column',width:'90%',margin:'0 auto' }}>
                        <p style={{ fontWeight:'700',fontSize:'calc(0.9rem + .3vw)', margin:'0.3em 0'}}>{item.user.first_name} {item.user.last_name}   <span style={{fontWeight:400}}>  {item.created_at.substring(0, 10)}</span></p>
                        <Rating
                            style={{
                                color: "var(--primary-color)",
                            }}
                            size='small'
                            precision={0.5}
                            name="read-only"
                            value={item.rate}
                            readOnly
                        />
                    <p style={{color:'var(--secondary-color)'}}>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
            {bookreview.length > 2 && <>

                {displayedObjects < bookreview.length ? (
                    <p style={{margin:'0em'}} onClick={showMore} className={classes.addbtn}>{language === 'eng' ? 'View All Reviews' : 'View All Reviews_fr'}</p>
                ) : ( 
                    <p style={{margin:'00em '}} onClick={showLess}className={classes.addbtn}>{language === 'eng' ? 'View Less' : 'Voir Moins '}</p>
                )}
            </>} 
        </div>
     </div>
    );
}

export default Reviews