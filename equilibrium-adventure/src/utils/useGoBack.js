import { useNavigate } from "react-router-dom";

export default function useGoBack(redirectPath = -1) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(redirectPath);
  };

  return goBack;
}