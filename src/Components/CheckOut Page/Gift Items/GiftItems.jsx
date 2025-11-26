import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./GiftItems.module.css";
import image from "../../../assets/bookPlaceholder.png";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Rate, Input } from "antd";
import AuthContext from "../../Common/authContext";
import { stripHtmlTags, truncateText } from "../../Common Components/TextUtils";
import axios from "axios"; 

const GiftItems = ({ handleGiftChange, selectedGiftItems, subtotalAmt, onMaxGiftsChange, onGiftsconfigurationChange }) => {
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
    const authCtx = useContext(AuthContext);
    const productData = useSelector((state) => state.products.productData);
  const SelectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
  const [articles, setArticles] = useState([]);
  const [giftConfiguration, setGiftConfiguration] = useState([]);

    function giftConfigToString(configArr) {
  return configArr
    .map(obj => `value: ${obj.value}, gifts_number: ${obj.gifts_number}`)
    .join(' ; ');
}
  // selectedItems will be array of selected article objects
  const fetchArticles = async () => {
      try {
      let articleFamilleIdParam = '';
      if (SelectedCategoryId && SelectedCategoryId !== 'null') {
        articleFamilleIdParam = `&articlefamilleparent_id=${SelectedCategoryId}`;
      }
        const response = await axios.get(
          `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco&is_gift${articleFamilleIdParam}`
        );
        setArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
  const fetchGiftConfiguration = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_TESTING_API}/gift-configuration?ecom_type=sofiaco`
        );
        setGiftConfiguration(response.data);
        const giftConfig = giftConfigToString(response.data);
        onGiftsconfigurationChange(giftConfig);
        console.log("Gift Configuration:", response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };



  useEffect(() => {
    fetchArticles();
    fetchGiftConfiguration();
  }, [SelectedCategoryId]);



    // Find the max gifts_number allowed for the current subtotalAmt
    let maxGifts = 0;
    if (giftConfiguration && giftConfiguration.length > 0) {
      // Sort descending by value
      const sortedConfig = [...giftConfiguration].sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
      for (let config of sortedConfig) {
        if (subtotalAmt >= parseFloat(config.value)) {
          maxGifts = config.gifts_number;
          break;
        }
      }
    }

    useEffect(() => {
      if (onMaxGiftsChange) {
        onMaxGiftsChange(maxGifts);
      }
    }, [maxGifts, onMaxGiftsChange]);

    return (
      <>
        {articles?.length > 0 && <div className={classes.header}>
            <h2>{maxGifts > 0
                    ? (
                        language === "eng"
                        ? `You can select ${maxGifts} gift${maxGifts > 1 ? 's' : ''}`
                        : `Vous pouvez sélectionner ${maxGifts} cadeau${maxGifts > 1 ? 'x' : ''}`
                    )
                    : (
                        language === "eng"
                        ? 'No gifts available for your subtotal'
                        : "Aucun cadeau disponible pour votre sous-total"
                    )}
                </h2>
          </div>}
        {articles?.map((props) => {
          const isSelected = selectedGiftItems.some((item) => item.id === props.id);
          const outOfStock = props._qte_a_terme_calcule <= 0;
          const selectionDisabled = outOfStock || (!isSelected && selectedGiftItems.length >= maxGifts);
          return (
            <div
              className={`${classes.card}`}
              key={props.id}
              onClick={() => !selectionDisabled && handleGiftChange({id: props.id, article_id: props.id, cost: props.prixpublic})}
              style={{
                cursor: selectionDisabled ? 'not-allowed' : 'pointer',
                border: isSelected ? '2px solid var(--primary-color)' : '2px solid #f1f1f1',
                opacity: selectionDisabled ? 0.5 : 1
              }}
            >
              <div style={{display:"flex",flexDirection:"row",gap:"1em",width:"100%"}}>
                <div className={classes.imageCont}>
                  <img src={props.articleimage[0] ? props.articleimage[0]?.link : image} alt="" style={{height:'100%',objectFit:'cover' ,maxWidth:'350px' }}/>
                </div>
                <div style={{height:'fit-content',justifyContent:'space-between',display:'flex', flexDirection:'column', margin:'auto 0',fontSize:'calc(.5rem + 0.2vw)',fontFamily:'var(--font-family)',width:"100%"}}>
                  <div className={classes.infoCont}>
                    <div style={{width:"fit-content",maxWidth:"100%",display:'flex',flexDirection:'column'}}>
                      <p style={{color:'#000',fontSize:'calc(.6rem + 0.2vw)',fontWeight:'700',width:"85%",textAlign:'start',marginBottom:'.3em'}} onClick={()=>console.log(props)}> {props.designation}</p>
                      <p style={{color:'var(--secondary-color)',width:"85%" ,fontSize:'calc(.5rem + .2vw)',fontWeight:'500',margin:'0.5em 0',textAlign:'start'}}>{props.dc_auteur}</p>
                      <p style={{color:'#000',fontSize:'calc(.5rem + .2vw)',fontWeight:'500',margin:'0',textAlign:'start'}}> {truncateText(stripHtmlTags(props.descriptif), 5000)}</p>
                      <p
                        style={{
                          margin: ".5em auto .5em 0",
                          color:
                            props._qte_a_terme_calcule > 0
                              ? "#3BB143"
                              : "#EE5858",
                          fontWeight: "600",
                        }}
                      >
                        {props._qte_a_terme_calcule > 0
                          ? `IN STOCK`
                          : `${
                              language === "eng" ? "OUT OF STOCK" : "HORS STOCK"
                            }`} {" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

export default GiftItems