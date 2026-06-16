import React, { useEffect, useState } from "react";
import classes from "./EditBlog.module.css";
import { Button, Form, Input, Upload } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useNavigate } from '@hooks/useNavigate';

const EditBlog = () => {
  const [data, setData] = useState('');
  const { blogId } = useParams();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const user = useSelector((state) => state.products.userInfo);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');

  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/blogs/${blogId}`);
      setTitle(response?.data?.title || '');
      setIntroduction(response?.data?.introduction || '');
      setData(response?.data?.description || '');
      form.setFieldsValue(response?.data);
      setCoverImage(response?.data?.image || null);
    } catch (error) {}
  };

  useEffect(() => { fetchAbout(); }, [blogId]);

  const handleImageUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => setCoverImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const HandleSubmit = async (statusId = null) => {
    const formData = { title, introduction, description: data, image: coverImage };
    if (statusId !== null) formData.status_id = statusId;
    try {
      await axios.put(`${import.meta.env.VITE_TESTING_API}/blogs/${blogId}`, formData);
      toast.success("Blog updated successfully", { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
      navigate('/main/blogs');
    } catch (error) {
      toast.error(`An error occurred. Please try again.`, { position: "top-right", autoClose: 1500, hideProgressBar: true, closeOnClick: true, theme: "colored" });
    }
  };

  return (
    <div className={classes.maincontainer}>
      <div className={classes.itemsHeading}>
        <div className={classes.headContainer}>
          <p className={classes.itemHead}>{language === 'eng' ? "Edit Blog" : "Editer Le Blog"}</p>
        </div>
      </div>
      <Form layout="vertical" name="nest-messages" form={form} className={classes.card1}>
        <Form.Item name="title" style={{ width: '100%' }} label={<p style={{ color: 'var(--primary-color)', fontWeight: '500', fontFamily: 'var(--font-family)', margin: '0' }}>{language === 'eng' ? "Blog Title" : "Titre du blog"}</p>}>
          <Input name="title" size="large" placeholder={language === 'eng' ? "Title" : "Titre"} style={{ border: '1px solid #D9D9D9', backgroundColor: "#F2F2F2", color: 'var(--primary-color)', height: '2.5em' }} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item name="introduction" style={{ width: '100%' }} label={<p style={{ color: 'var(--primary-color)', fontWeight: '500', fontFamily: 'var(--font-family)', margin: '0' }}>{language === 'eng' ? "Introduction" : "Introduction"}</p>}>
          <Input.TextArea name="introduction" rows={3} placeholder={language === 'eng' ? "Introduction" : "Introduction"} style={{ border: '1px solid #D9D9D9', backgroundColor: "#F2F2F2", color: 'var(--primary-color)' }} onChange={(e) => setIntroduction(e.target.value)} />
        </Form.Item>
        <Form.Item name="description" style={{ width: '100%' }} label={<p style={{ color: 'var(--primary-color)', fontWeight: '500', fontFamily: 'var(--font-family)', margin: '0' }}>{language === 'eng' ? "Content" : "Contenu"}</p>}>
          <Input.TextArea name="description" rows={10} placeholder={language === 'eng' ? "Write your blog content here..." : "Rédigez le contenu de votre blog ici..."} style={{ border: '1px solid #D9D9D9', backgroundColor: "#F2F2F2", color: 'var(--primary-color)' }} value={data} onChange={(e) => setData(e.target.value)} />
        </Form.Item>
        <Form.Item name="logo" style={{ marginTop: "2em" }} label={<p style={{ color: 'var(--primary-color)', fontWeight: '500', fontFamily: 'var(--font-family)', margin: '0' }}>{language === 'eng' ? "Upload Cover Image" : "Télécharger l'image de couverture"}</p>}>
          <Upload name="logo" listType="picture" maxCount={1} beforeUpload={() => false} accept="image/*" onChange={handleImageUpload}>
            {coverImage ? (
              <img src={coverImage} alt="Uploaded" style={{ maxWidth: "100%", width: "40em", height: "20em", objectFit: 'cover', margin: "0", borderRadius: ".5em" }} />
            ) : (
              <div style={{ maxWidth: "100%", width: "40em", height: "20em", margin: "0", display: "flex", flexDirection: "column", border: "1px solid #D9D9D9", borderRadius: ".5em",background:'#fff' }}>
                <div style={{ margin: "auto" }}>
                  <FiUpload style={{ color: "var(--primary-color)", margin: "auto", fontSize: "2em" }} />
                  <p style={{ margin: '0', fontWeight: '700' }}>{language === 'eng' ? "Drag and Drop files here" : "Glisser-déposer des fichiers ici"}</p>
                  <p style={{ margin: '0 0 .3em 0', color: '#B3B3B3' }}>Images</p>
                  <button style={{ background: "var(--primary-color)", border: "none", borderRadius: '.5em', padding: ".5em 1em", color: "#fff", cursor: "pointer" }}>{language === 'eng' ? "Upload File" : "Télécharger le fichier"}</button>
                </div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingTop: '2em', borderTop: '1px solid #E3E3E3' }}>
          <Button onClick={() => navigate('/main/blogs')} className={classes.btnsave} style={{ color: '#868686', fontWeight: '600', background: '#fff' }}>
            {language === 'eng' ? 'Discard' : 'Rejeter'}
          </Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5em' }}>
            <Button className={classes.btnsave} onClick={() => HandleSubmit(10)}>
              {language === 'eng' ? 'Save Draft' : 'Enregistrer le brouillon'}
            </Button>
            <Button className={classes.btnsave} onClick={async () => {
              try { await form.validateFields(); } catch (err) {
                toast.error(language === 'eng' ? 'Please fill required fields.' : "Veuillez remplir les champs requis.");
                return;
              }
              HandleSubmit(43);
            }}>
              {language === 'eng' ? 'Upload Blog to be reviewed' : "Télécharger le blog pour examen"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EditBlog;
