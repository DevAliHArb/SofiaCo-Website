import React, { useContext, useEffect, useState } from "react";
import classes from "./Review.module.css";
import addimage from "../../../../assets/addimage.svg";
import addvideo from "../../../../assets/addvideo.svg";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import AuthContext from "../../../Common/authContext";
import Typography from '@mui/material/Typography';

import Rating from "@mui/material/Rating";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Row, Col, Button, Checkbox, Form, Input } from 'antd';
import StarIcon from '@mui/icons-material/Star';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import bookPlaceHolder from '../../../../assets/bookPlaceholder.png';
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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
  fontFamily:'var(--font-family)',
  overflow:'hidden',
  borderRadius:'1em'
};

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const Review = ({props}) => {
  const user = useSelector((state) => state.products.userInfo);
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [data, setData] = useState([]);
  const [images, setimages] = useState([]);
  const [description, setdescription] = useState("");
  const [form] = Form.useForm();
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [reviewData, setreviewData] = useState([]);
  const [selectedReview, setselectedReview] = useState({});

  const authCtx = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const imagefileInputRefs = React.createRef();

  useEffect(() => {
    // setData(authCtx.reviewData);
    setData(props)
  }, []);

  const handleAddImageClick = () => {
    // Trigger the file input for a specific item
    // if (imagefileInputRefs[itemIndex]) {
      imagefileInputRefs.current.click();
    // }
  };

  const handleImageChange = (event,) => {
    const file = event.target.files[0];

    if (file) {
      const imageId = Date.now();
      const newImage = { id: imageId, attached_file: file };

      
      setimages((prevImages) => [...prevImages, newImage]);
    }
  };

  const handleRemoveImage = (imageId) => {
    setimages((prevImages) => prevImages.filter((image) => image.id !== imageId));
  };

  const handleSubmit = async () => {
    console.log("testt",{
      article_id: selectedReview.article.id,
      description: description || '',
      rate: value || 0,
      review_attachments: images || [] ,
      user_id: user.id
  })
    try {
      const base64Images = await Promise.all((images || []).map(async (image) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(image.attached_file);
        return new Promise((resolve, reject) => {
          fileReader.onload = () => {
            resolve({
              id: image.id,
              attached_file: fileReader.result 
            });
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      }));
      const response = await axios.post(`https://api.leonardo-service.com/api/bookshop/articles/${selectedReview.article.id}/reviews`, {
        description: description || '',
        rate: value || 0,
        user_id: user.id,
        review_attachments: base64Images || [] ,
        order_invoice_id: selectedReview.id,
        ecom_type: 'sofiaco'
    });
      console.log('Review created:', response.data);
      setreviewData([...reviewData, {
        article_id: selectedReview.article.id,
        description: description || '',
        rate: value || 0,
        review_attachments: images || [] ,
        user_id: user.id
    }])
       setValue(0);
       setdescription('');
      setimages([]);
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
    }
  };

  return (
    <div className={classes.review_con}>
      {data.order_invoice_items?.map((item, index) => {
        let isReviewed = reviewData?.find(data => data.article_id === item.article.id);
        return (
          <>
          <div className={classes.content}>
            <div className={classes.imgContainer} onClick={()=>console.log(reviewData)}>
              <img src={item.article.articleimage[0]?.link ? item.article.articleimage[0].link : bookPlaceHolder} alt="" style={{width:'100%',height:'100%',objectFit:'fill'}} />

            </div>
              <div className={classes.btn_con}>
                <h3 className={classes.imgContainerh3}>{item.article.designation}</h3>
                {!isReviewed ? <button onClick={()=>setselectedReview(item) & handleOpen()}>Review</button> : 
                <div style={{display:'flex',flexDirection:'column',fontFamily:'var(--font-family)'}}>
               <p style={{width:'100%',textAlign:'start',fontSize:'calc(.6rem + .2vw)',display:'flex',flexDirection:'row',marginBottom:'0'}}><Rating
                style={{color:'var(--primary-color)',fontSize:'calc(.6rem + .3vw)',marginBottom:'-2em'}}
                    name="hover-feedback"
                    value={isReviewed.rate}
                    precision={0.5}
                    getLabelText={getLabelText}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                /> <p style={{margin:'.1em 0 0 .3em'}}>{isReviewed.rate}/5 </p></p> 
                <p style={{width:'100%',textAlign:'start',fontSize:'calc(.7rem + .3vw)'}}>{isReviewed.description}</p>
                <div style={{width:'100%',display:'flex',flexWrap:'wrap',gap:'.5em'}}>
                  {(isReviewed.review_attachments || []).map((image) => (
                      <img
                        src={URL.createObjectURL(image.attached_file)}
                        alt={`Image ${image.id}`}
                        style={{
                          width: "3em",
                          height: "3em",
                          objectFit:'cover',
                          cursor: "pointer",
                        }}
                        onDoubleClick={()=>{setFullScreenImage(URL.createObjectURL(image.attached_file));handleOpen()}}
                      />
                  ))}
                </div></div>
                }
              </div>
          </div>
        </>
        );
      })} 
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
            fontFamily:'var(--font-family)'
        }}
        >
            <div style={{width:'100%', display:"flex", flexDirection:"row", justifyContent:'space-between',margin:'0.2em 0 0 0'}}> 
                <p style={{ fontWeight:'600',marginLeft:'5%',fontSize:'calc(1rem + .3vw)',color:'var(--primary-color)',width:'fit-content',fontFamily:'var(--font-family)'}}>Write a Review</p>
                <div style={{marginRight:'5%'}}>
                <button style={{position:'relative',border:'none',backgroundColor:'transparent',color:'var(--primary-color)',cursor:'pointer',width:'fit-content'}} onClick={handleClose}>
                <CloseSharpIcon style={{fontSize:'2em',marginTop:'0.6em'}} />
                </button></div>
            </div>
                {value !== null && (
                    <p style={{ fontWeight:'700',fontSize:'calc(0.8rem + .3vw)',marginTop:'2em',color:'var(--secondary-color)',width:'fit-content',marginBottom:'0.2em'}}> {hover !== -1 ? hover : value} ({labels[hover !== -1 ? hover : value]} /Amazing) </p>
                )}
                <Rating
                style={{color:'var(--primary-color)',fontSize:'calc(1.8rem + .5vw)',marginTop:'.2em'}}
                    name="hover-feedback"
                    value={value}
                    precision={1}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                    setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                    setHover(newHover);
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <div
                style={{
                  display: "flex",
                  flexWrap:'wrap',
                  gap: "2em",
                  padding: "1em 0",
                }}
              >
                {!(images && images?.length >= 5) && (
                  <img
                    style={{width:'6em'}}
                    src={addimage}
                    alt="addimage"
                    onClick={() => handleAddImageClick()}
                  />
                )}
                {(images || []).map((image) => (
                  <div key={image.id} style={{position:'relative'}}>
                    <img
                      src={URL.createObjectURL(image.attached_file)}
                      alt={`Image ${image.id}`}
                      style={{
                        width: "6em",
                        height: "6em",
                        objectFit:'cover',
                        cursor: "pointer",
                      }}
                      onDoubleClick={()=>{setFullScreenImage(URL.createObjectURL(image.attached_file));handleOpen()}}
                    />
                    <button
                      style={{
                        position:'absolute',
                        bottom:'0',
                        left:'0',
                        width: "100%",
                        background: "red",
                        color: "#fff",
                        fontSize:'smaller'
                      }}
                      onClick={() => handleRemoveImage(image.id)}
                    >
                     remove 
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => handleImageChange(event)}
                  ref={imagefileInputRefs}
                />
              </div>
                </div>
            <Form
                        layout="vertical"
                        name="nest-messages"
                        form={form}
                        style={{
                        width: '100%',
                        margin:'0 auto',
                        alignItems: "center",
                        textAlign: "center",
                        justifyItems: "center",
                        maxHeight:'80vh',
                        padding:'0% 5% 0% 5%',
                        }}
                        className="reviewForm"
            >
                <Form.Item
                name="Feedback"
                label={<p style={{color:'var(--primary-color)',fontWeight:'600',fontFamily:'var(--font-family)',margin:'0 ',fontSize:'calc(0.7rem + .3vw)'}}>Feedback</p>}
                rules={[{ required: true, message: 'Veuillez saisir votre adresse!' }]}
                style={{border:'none',borderRadius:'.5em',width:'100%'}}
                >
                <Input.TextArea rows={4}
                name="Feedback"
                size="large" 
                onChange={(e)=>setdescription(e.target.value)}
                placeholder='Write down your feedback here...'
                style={{backgroundColor:'var(--authbg-color)',color:'#fff',textAlign:'start'}}
                />
                </Form.Item>
                <div style={{width:'fit-content',gap:'2em', display:"flex", flexDirection:"row",margin:'1em 0 0 auto'}}>
                <Button size="large" className={classes.addbtn} style={{backgroundColor:'var(--secondary-color)',color:'#fff'}} onClick={handleClose}>
                    Cancel
                </Button>
                    <Form.Item>
                        <Button 
                        size="large"
                        htmlType="submit"
                        onClick={handleSubmit}
                        className={classes.addbtn}>
                            Submit Review
                        </Button>
                    </Form.Item> 
                </div>
                
            </Form>
       </Box>
     </Modal>
    </div>
  );
};

export default Review;
