import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [userData, setUserData] = useState(null);
  const [organisationCname, setOrganisationCname] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname; 
    const parts = hostname.split(".");

    if (hostname.includes("localhost") && hostname !== "localhost") {
      setOrganisationCname(parts[0]);
      sessionStorage.setItem('organisationCname', parts[0]);
    } else if (parts.length >= 4 && parts[1] === 'campus-kart-frontend' && parts[2] === 'vercel') {
      setOrganisationCname(parts[0]);
      sessionStorage.setItem('organisationCname', parts[0]);
    } else {
      navigate('/signup');
    }
  }, [navigate]);

  useEffect(() => {
    console.log(sessionStorage.getItem("username"));
    setUserData({
      username: sessionStorage.getItem("username"),
      userrole: sessionStorage.getItem("role")
    });
  }, []); 

  useEffect(() => {
    console.log("Updated userData:", userData);
  }, [userData]);

  return (
    <div className="topbarOuter">
      <div className="topbarTextBoxOuter">
        <div className="searchIcon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13.3891 13.3891L19 19M9.5 15C12.5376 15 15 12.5376 15 9.5C15 6.46243 12.5376 4 9.5 4C6.46243 4 4 6.46243 4 9.5C4 12.5376 6.46243 15 9.5 15Z" stroke="#454545" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Accounts"
          className="myInputClass"
        />
      </div>
      
      <div className="topbarIconsGroup">
        <div className="topbarOuterIcon">
          <div className="topbarInnerIcon">
            <div className="topbarIcon pt-[1px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path d="M1 4L8.8906 9.2604C9.5624 9.70827 10.4376 9.70827 11.1094 9.2604L19 4M3 15H17C18.1046 15 19 14.1046 19 13V3C19 1.89543 18.1046 1 17 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15Z" stroke="#454545" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
              <div className="topbarIconBubble">
                <div className="topbarIconBubbleValue">
                  9+
                </div>
            </div>
          </div>
        </div>
        <div className="topbarOuterIcon">
          <div className="topbarInnerIcon">
            <div className="topbarIcon pl-[1px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path d="M8 3.5C10.7614 3.5 13 5.73858 13 8.5V10.7396C13 11.2294 13.1798 11.7022 13.5052 12.0683L14.7808 13.5035C15.6407 14.4708 14.954 16 13.6597 16H2.34025C1.04598 16 0.35927 14.4708 1.21913 13.5035L2.4948 12.0683C2.82022 11.7022 2.99998 11.2294 2.99998 10.7396L3 8.5C3 5.73858 5.23858 3.5 8 3.5ZM8 3.5V1M6.99994 19H8.99994" stroke="#454545" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div className="topbarIconBubble">
              <div className="topbarIconBubbleValue">
                8
              </div>
            </div>
          </div>
        </div>
        <div className="topbarProfileFrame">
          <div className="topbaruserIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
              <path d="M4.57757 14.4816C3.1628 15.324 -0.546637 17.0441 1.71266 19.1966C2.81631 20.248 4.04549 21 5.59087 21H14.4091C15.9545 21 17.1837 20.248 18.2873 19.1966C20.5466 17.0441 16.8372 15.324 15.4224 14.4816C12.1048 12.5061 7.89519 12.5061 4.57757 14.4816Z" stroke="#454545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.5 5.5C14.5 7.98528 12.4853 10 10 10C7.51472 10 5.5 7.98528 5.5 5.5C5.5 3.01472 7.51472 1 10 1C12.4853 1 14.5 3.01472 14.5 5.5Z" stroke="#454545" stroke-width="1.5"/>
            </svg>
          </div>
          <div className="topbarProfileDiv">
            <div className="topbarProfileName">
              {/* Adarsh Dhakar */}
              {/* {authData ? authData.username : "Loading..."} */}
              { userData ? userData.username : "Loading..."} 
            </div>
            <div className="topbarProfilePosition">
              {/* {authData ? authData.role : "User"} */}
              { userData ? userData.userrole : "User"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;