import React, { useEffect ,useState} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { IsTokenValid } from "../src/components/ApiCalls";
import DataLoader from "../src/components/Loader";

const ProtectedRoute = ({ children }) => {
 const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const result = IsTokenValid();
    setIsValid(result);
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
 
    return <DataLoader />; 
  }

  if (!isValid) {
    const redirectLink = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/?redirectLink=${redirectLink}`} replace />;
  }

  return children;
};

export default ProtectedRoute;