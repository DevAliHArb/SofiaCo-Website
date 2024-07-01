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
    const [displayedObjects, setDisplayedObjects] = useState(4);
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(-1);
    const [bookreview, setBookreview] = useState([]);
    const selectedBook = useSelector((state) => state.products.selectedBook);

     
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken()
    
    const showLess = () => {
        setDisplayedObjects(4); 
    };


    const showMore = () => {
        setDisplayedObjects(prev => prev + 2); 
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
    try {
      const response = await axios.post(`https://api.leonardo-service.com/api/bookshop/articles/${selectedBook[0].id}/reviews`, {
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
        <>
        <div className={classes.reviewsCon}>
            <div style={{width:'100%', display:"flex", flexDirection:"row", justifyContent:'space-between',margin:'2em 0'}}> 
                <p style={{ fontWeight:'700',fontSize:'calc(0.9rem + .3vw)',color:'var(--accent-color)'}}>All Reviews({bookreview?.length})</p>
                <button className={classes.addbtn} onClick={handleReviewButtonClick}>Write A Review</button>
            </div>
        <div className={classes.big_con}>
            {bookreview?.slice(0, displayedObjects).map((item, index) => (
                <div className={classes.reviews_con} key={item.id} >
                    <div style={{ display: 'flex', flexDirection:'column',width:'90%',margin:'0 auto' }}>
                        <p style={{ fontWeight:'700',fontSize:'calc(0.9rem + .3vw)'}}>{item.user.first_name} {item.user.last_name}</p>
                        <Rating
                            style={{
                                color: "var(--forth-color)",
                            }}
                            size='small'
                            precision={0.5}
                            name="read-only"
                            value={item.rate}
                            readOnly
                        />
                    <p style={{color:'var(--accent-color)'}}>{item.description}</p>
                    <p style={{ fontWeight:'400',fontSize:'calc(0.6rem + .2vw)',color:'var(--accent-color)'}}>Posted on {item.created_at.substring(0, 10)}</p>
                    </div>
                </div>
            ))}

                {/*{user && <>
                
                 {AddReview && <div className={classes.addreview_con}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <p>Rate this book: </p>
                        <Rating

                            style={{
                                color: "#0085B0",
                                justifySelf: 'end',
                            }}
                            name="book-rate"
                        // value={}
                        />
                    </div>
                    <p style={{ lineHeight: '20px', paddingTop: '4%' }}>Write a review:</p>
                    <textarea type='textarea' className={classes.textarea}
                        placeholder='Describe your experience' />
                    <p>Your review will be published to the public.</p>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <button className={classes.addbtn} onClick={()=>  toast.success(`merci pour la critique`)}>Publish</button>
                        <div className={classes.cancelbtn} onClick={() => setAddReview(false)}>Cancel</div>
                    </div>
                </div>} 
                </>}*/}
        </div>
            {bookreview.length > 2 && <>

                {displayedObjects < bookreview.length ? (
                    <p style={{margin:'-4em auto 0 auto'}} onClick={showMore} className={classes.addbtn}>Voir Plus</p>
                ) : ( 
                    <p style={{margin:'00em auto 0 auto'}} onClick={showLess}className={classes.addbtn}>Voir Moins </p>
                )}
            </>} 
        </div>
        <Modal
       open={open}
       onClose={handleClose}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
       style={{overflow:'hidden'}}
     >
       <Box sx={style}  >
        <div
        style={{
            width: '100%',
            display: 'flex',
            flexDirection:'column',
            alignItems: 'center',
            margin:'0',
            fontFamily:'montserrat'
        }}
        >
            <div style={{width:'100%', display:"flex", flexDirection:"row", justifyContent:'space-between',margin:'0.2em 0 0 0',borderBottom:'1px solid var(--primary-color)',borderRadius:'1em'}}> 
                <p style={{ fontWeight:'600',marginLeft:'5%',fontSize:'calc(1rem + .3vw)',color:'var(--accent-color)',width:'fit-content'}}>Write a Review</p>
                <div style={{marginRight:'5%'}}>
                <button style={{position:'relative',border:'none',backgroundColor:'transparent',color:'var(--forth-color)',cursor:'pointer',width:'fit-content'}} onClick={handleClose}>
                <CloseSharpIcon style={{fontSize:'2em',marginTop:'0.6em'}} />
                </button></div>
            </div>
                {formData.rate !== null && (
                    <p style={{ fontWeight:'700',fontSize:'calc(0.8rem + .3vw)',marginTop:'2em',color:'var(--accent-color)',width:'fit-content',marginBottom:'0.2em'}}> {hover !== -1 ? hover : formData.rate} ({labels[hover !== -1 ? hover : formData.rate]} /Amazing) </p>
                )}
                <Rating
                style={{color:'var(--forth-color)',fontSize:'calc(1.8rem + .5vw)',marginTop:'.2em'}}
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
            <Form
                        layout="vertical"
                        name="nest-messages"
                        form={form}
                        onFinish={handleSubmit}
                        style={{
                        width: '100%',
                        margin:'0 auto',
                        alignItems: "center",
                        textAlign: "center",
                        justifyItems: "center",
                        maxHeight:'80vh',
                        padding:'5% 5% 2% 5%',
                        }}
            >
                <Form.Item
                name="description"
                label={<p style={{color:'var(--accent-color)',fontWeight:'600',fontFamily:'montserrat',margin:'0 ',fontSize:'calc(0.7rem + .3vw)'}}>Feedback</p>}
                rules={[{ required: true, message: 'Veuillez saisir votre adresse!' }]}
                style={{border:'none',borderRadius:'.5em',width:'100%'}}
                >
                <Input.TextArea rows={4}
                name="description"
                size="large" 
                placeholder='Write down your feedback here...'
                value={formData.street}
                        style={{border:'1px solid var(--primary-color)',color:'var(--accent-color)',textAlign:'start'}}
                        onChange={handleChange}
                />
                </Form.Item>
                <div style={{width:'100%', display:"flex", flexDirection:"row", justifyContent:'space-between',margin:'1em 0 0 0'}}>
                <Button size="large" className={classes.addbtn} style={{backgroundColor:'#DED8CC',color:'var(--forth-color)',fontWeight:'600'}}>
                    Cancel
                </Button>
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
       </Box>
     </Modal>
     </>
    );
}

export default Reviews