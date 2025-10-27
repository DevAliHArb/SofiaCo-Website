import React, { useEffect, useRef } from "react";

const MondialRelayWidget = ({ onPointSelect, onClose }) => {
  const inputRef = useRef();
  useEffect(() => {
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
          Brand: "BDTEST  ",
          Country: "FR",
          PostCode: "77330",
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
  }, []);

  return (
    <div>
      <div id="Zone_Widget"></div>
      <input type="text" id="Target_Widget" ref={inputRef} />
    </div>
  );
};

export default MondialRelayWidget;