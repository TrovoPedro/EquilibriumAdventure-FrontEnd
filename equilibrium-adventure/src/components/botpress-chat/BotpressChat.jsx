import { useEffect } from "react";

const BotpressChat = () => {
  useEffect(() => {
    // Limpa o localStorage do Botpress WebChat para evitar histórico compartilhado
    Object.keys(localStorage)
      .filter((k) => k.startsWith('webchat:'))
      .forEach((k) => localStorage.removeItem(k));

    // Evita múltiplas injeções do script
    if (document.getElementById("bp-webchat-script")) return;
    const script = document.createElement("script");
    script.id = "bp-webchat-script";
    script.src = "http://localhost:3002/assets/modules/channel-web/inject.js";
    script.async = true;
    script.onload = () => {
      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          host: "http://localhost:3002",
          botId: "trilhai",
          showPoweredBy: false,
          enableReset: true,
        });
        // Sempre limpa o chat ao abrir
        window.botpressWebChat.onEvent(function(event) {
          if (event.type === "LIFECYCLE.LOADED") {
            window.botpressWebChat.sendEvent({ type: "reset" });
          }
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return null; // Não renderiza nada visível
};

export default BotpressChat;
