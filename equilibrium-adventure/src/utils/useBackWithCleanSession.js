import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useBackWithCleanSession(redirectPath = -1) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = () => {
      sessionStorage.clear();
      navigate(redirectPath);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, redirectPath]);

  const goBack = () => {
    sessionStorage.clear();
    navigate(redirectPath);
  };

  return { goBack };
}
