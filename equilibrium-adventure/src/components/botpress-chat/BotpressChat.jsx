import { useEffect } from "react";

const BotpressChat = () => {
  useEffect(() => {
   
    Object.keys(localStorage)
      .filter((k) => k.startsWith('webchat:'))
      .forEach((k) => localStorage.removeItem(k));

    if (document.getElementById("bp-webchat-script")) return;
    const script = document.createElement("script");
    script.id = "bp-webchat-script";
    script.src = "http://localhost:3000/assets/modules/channel-web/inject.js";
    script.async = true;
    script.onload = () => {
      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          host: "http://localhost:3000",
          botId: "trilhai",
          showPoweredBy: false,
          enableReset: true,
        });
  
        window.botpressWebChat.onEvent(function(event) {
          if (event.type === "LIFECYCLE.LOADED") {
            window.botpressWebChat.sendEvent({ type: "reset" });
          }
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return null; 
};

export default BotpressChat;
