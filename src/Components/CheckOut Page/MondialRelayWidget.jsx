import React, { useEffect, useRef } from "react";

const normalizeCountryCode = (countryValue) => {
  console.log('countryValue:', countryValue);
  
  if (!countryValue) return "FR";
  const normalizedCountry = String(countryValue).trim().toLowerCase();
  console.log('normalizedCountry:', normalizedCountry);
  if (normalizedCountry.length === 2) return normalizedCountry.toUpperCase();
  if (["france", "français", "francais"].includes(normalizedCountry)) {
    return "FR";
  }
  return "FR";
};

const MondialRelayWidget = ({ country, postCode, onPointSelect, onClose }) => {
  const inputRef = useRef();
  useEffect(() => {
    const widgetCountry = normalizeCountryCode(country);
    const widgetPostCode = postCode ? String(postCode) : "77330";
    // Dynamically load scripts and CSS
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const loadCss = (href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    loadCss("//unpkg.com/leaflet/dist/leaflet.css");

    Promise.all([
      loadScript("//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"),
      loadScript("//unpkg.com/leaflet/dist/leaflet.js"),
      loadScript("//widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js"),
    ]).then(() => {
      if (window.$ && window.$.fn && window.$.fn.MR_ParcelShopPicker) {
        window.$("#Zone_Widget").MR_ParcelShopPicker({
          Target: "#Target_Widget",
          Brand: "CC23IE3G",
          Country: widgetCountry,
          PostCode: widgetPostCode,
          ColLivMod: "24R",
          NbResults: "7",
          Responsive: true,
          ShowResultsOnMap: true,
          OnParcelShopSelected: function (data) {
            if (onPointSelect) onPointSelect(data);
            if (onClose) onClose();
          }
        });
      }
    });
  }, [country, postCode, onPointSelect, onClose]);

  return (
    <div>
      <div id="Zone_Widget"></div>
      <input type="text" id="Target_Widget" ref={inputRef} />
    </div>
  );
};

export default MondialRelayWidget;