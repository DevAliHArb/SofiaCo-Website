import React, { useContext, useEffect, useState } from 'react';
import Rating from "@mui/material/Rating";
import classes from './Reviews.module.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Input, Button } from 'antd';
import StarIcon from '@mui/icons-material/Star';
import AuthContext from '../../Common/authContext';
import axios from 'axios';
import { addSelectedBook } from '../../Common/redux/productSlice';
import { Avatar } from '@mui/material';

const Reviews = () => {
    const user = useSelector((state) => state.products.userInfo);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ rate: 0, description: '' }); // Initialize formData with rate and description
    const [form] = Form.useForm();
    const [displayedObjects, setDisplayedObjects] = useState(2);
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

    const token = getToken();

    const showLess = () => {
        setDisplayedObjects(2);
    };

    const showMore = () => {
        setDisplayedObjects(bookreview?.length);
    };

    const fetchBook = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_TESTING_API_IMAGE}/articles?id=${selectedBook[0].id}&ecom_type=sofiaco`);
          const book = response.data;
          dispatch(addSelectedBook(book))
          
        } catch (error) {
        //   console.error('Error fetching the book:', error);
        }
      };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_TESTING_API_IMAGE}/articles/${selectedBook[0].id}/reviews?ecom_type=sofiaco`);
            const reviews = response.data.data;
            setBookreview(reviews);
        } catch (error) {
            // console.error('Error fetching reviews:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        // console.log('Review created:', { ...formData, user_id: user.id });

        if (!user) {
            toast.error(language === "eng" ? "Please login first." : "Veuillez d'abord vous connecter.", { hideProgressBar: true });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_TESTING_API_IMAGE}/articles/${selectedBook[0].id}/reviews`, {
                ...formData,
                user_id: user.id,
                ecom_type: 'sofiaco'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchReviews();
            fetchBook();
            setFormData({ ...formData, rate: 0 }); // Resetting the rating value to 0
            form.resetFields();
            toast.success(language === "eng" ? "Review added successfully!" : "Avis ajouté avec succès !", { position: "top-right", autoClose: 1500 });
        } catch (error) {
            // console.error('Error creating review:', error);
            toast.error(language === "eng" ? "Review submission failed, try again!" : "Échec de la soumission de l'avis, veuillez réessayer !", { position: "top-right", autoClose: 1500 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);
    
    useEffect(() => {
        fetchReviews();
    }, [selectedBook]);

    const handleReviewButtonClick = () => {
        if (user) {
            form.resetFields(); // Reset form fields if the user clicks on review button
            setFormData({ ...formData, rate: 0 }); // Clear form data including rating value
            setLoading(false); // Reset loading state
        } else {
            toast.info(
                language === "eng" ? "Please login first." : "Veuillez d'abord vous connecter.", { hideProgressBar: true });
        }
    };

    return (
        <div className={classes.rev_con}>
            <div className={classes.input_box}>
                <Form
                    layout="vertical"
                    name="nest-messages"
                    form={form}
                    onFinish={handleSubmit}
                    className={classes.form}
                >
                    <div className={classes.input_box_content}>
                        <div className={classes.rev_input_head}>
                            <h1>{language === 'eng' ? "Write a Review" : "Écrire un commentaire"}</h1>
                            <p>{language === 'eng' ? 'How would you rate it?' : "Comment l'évaluez-vous ?"}</p>
                            <Rating
                                style={{ color: 'var(--primary-color)', fontSize: 'calc(1.3rem + .5vw)' }}
                                name="rate"
                                value={formData.rate}
                                onChange={(e, newValue) => setFormData({ ...formData, rate: newValue })}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                        </div>
                        <Form.Item
                            name="description"
                            label={<p>{language === 'eng' ? 'Review Content' : 'Contenu de la révision'}</p>}
                            rules={[{ required: true, message: `${language === 'eng' ? "Please enter the content" : "Veuillez saisir le contenu"}` }]}
                            style={{ border: 'none', borderRadius: '.5em', width: '88%', margin: '2em auto', background: 'transparent' }}
                        >
                            <Input.TextArea
                                rows={3}
                                name="description"
                                size="large"
                                placeholder={language === 'eng' ? 'Write down your feedback here...' : 'Notez vos commentaires ici...'}
                                value={formData.description}
                                style={{ border: 'none', color: 'var(--secondary-color)', textAlign: 'start', background: 'transparent' }}
                                onChange={handleChange}
                            />
                        </Form.Item>
                    </div>
                    <div className={classes.submit_con}>
                        <Form.Item>
                            <Button
                                size="large"
                                htmlType="submit"
                                disabled={loading}
                                style={{ cursor: loading ? 'wait' : 'pointer' }}
                                className={classes.addbtn}
                            >
                                {language === 'eng' ? "Submit Review" : "Soumettre un avis"}
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
            <div className={classes.reviewsCon}>
                <h1>{language === 'eng' ? "All Reviews" : "Tous les commentaires"}</h1>
                <div className={classes.big_con}>
                    {bookreview?.slice(0, displayedObjects).map((item, index) => (
                        <div className={classes.reviews_con} key={item.id}>
                            <div className={classes.image_con}>
                                <Avatar src={`${import.meta.env.VITE_TESTING_API_IMAGE}/img/${item.user.image}`} alt={item.user.first_name} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '90%', margin: '0 auto' }}>
                                <p style={{ fontWeight: '700', fontSize: 'calc(0.9rem + .3vw)', margin: '0.3em 0' }}>{item.user.first_name} {item.user.last_name} <span style={{ fontWeight: 400 }}> {item.created_at.substring(0, 10)}</span></p>
                                <Rating
                                    style={{ color: "var(--primary-color)" }}
                                    size='small'
                                    precision={0.5}
                                    name="read-only"
                                    value={item.rate}
                                    readOnly
                                />
                                <p style={{ color: 'var(--secondary-color)' }}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {bookreview.length > 2 && (
                    <p style={{ margin: '0em' }} onClick={displayedObjects < bookreview.length ? showMore : showLess} className={classes.addbtn}>
                        {displayedObjects < bookreview.length ? (language === 'eng' ? 'View All Reviews' : 'Voir tous les commentaires') : (language === 'eng' ? 'View Less' : 'Voir Moins')}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Reviews;
