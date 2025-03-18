import { Card } from 'flowbite-react';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import './settings.css';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const Settings = () => {
  useEffect(() => {
    const name = Cookies.get("username");
    const role = Cookies.get("role");
    const authToken = Cookies.get("authToken");
    const expiresIn = Cookies.get("expiresIn");
    const organisationUrl = Cookies.get("organisationUrl");
    const email = Cookies.get("email");

    if (name && role && authToken && expiresIn && organisationUrl) {
      sessionStorage.setItem("username", name);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("authToken", authToken);
      sessionStorage.setItem("expiresIn", expiresIn);
      sessionStorage.setItem("organisationUrl", organisationUrl);
      sessionStorage.setItem("email", email);

      // Optionally, remove cookies if you don't need them anymore
      Cookies.remove("username", { domain: '.localhost', path: '/' });
      Cookies.remove("role", { domain: '.localhost', path: '/' });
      Cookies.remove("authToken", { domain: '.localhost', path: '/' });
      Cookies.remove("expiresIn", { domain: '.localhost', path: '/' });
      Cookies.remove("organisationUrl", { domain: '.localhost', path: '/' });
      Cookies.remove("email", { domain: '.localhost', path: '/' });
    }
  }, []);
  return (
    <Layout>
      <div className="mainFrame">
        {/* Teams Section */}
        <div className="mainFrameDiv">
          <div className="headerFrame">  
            <div className="headerTitle">Teams</div>
          </div>  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mainFrameCardsDiv">
            <Link to="/settings/roles">
              <Card className="mainFrameCards">
                <div className="mainFrameCardsDivBox12">
                  <div className="mainFrameCardsDivBox1">
                    <div className="w-[20px] h-[20px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M18.0145 5.95132L17.6032 5.23749C17.2921 4.69763 17.1366 4.42771 16.8719 4.32006C16.6072 4.21243 16.3079 4.29736 15.7093 4.46723L14.6925 4.75365C14.3103 4.84178 13.9093 4.79178 13.5604 4.61249L13.2797 4.45051C12.9804 4.25886 12.7503 3.97627 12.6228 3.64411L12.3446 2.81296C12.1616 2.26295 12.0701 1.98794 11.8523 1.83064C11.6345 1.67334 11.3452 1.67334 10.7665 1.67334H9.8375C9.25892 1.67334 8.96958 1.67334 8.75175 1.83064C8.53396 1.98794 8.44247 2.26295 8.25949 2.81296L7.98119 3.64411C7.85379 3.97627 7.62363 4.25886 7.32439 4.45051L7.04366 4.61249C6.6947 4.79178 6.29374 4.84178 5.91157 4.75365L4.89471 4.46723C4.29609 4.29736 3.99679 4.21243 3.73214 4.32006C3.46749 4.42771 3.31196 4.69763 3.00088 5.23749L2.58956 5.95132C2.29797 6.45736 2.15217 6.71039 2.18047 6.97974C2.20876 7.24909 2.40394 7.46615 2.7943 7.90026L3.6535 8.86083C3.8635 9.12667 4.01259 9.59 4.01259 10.0066C4.01259 10.4233 3.86355 10.8865 3.65353 11.1524L2.7943 12.113C2.40394 12.5472 2.20877 12.7642 2.18047 13.0336C2.15217 13.3029 2.29797 13.5559 2.58956 14.0619L3.00087 14.7757C3.31194 15.3156 3.46749 15.5856 3.73214 15.6932C3.99679 15.8008 4.2961 15.7159 4.89473 15.546L5.91153 15.2596C6.29378 15.1714 6.69481 15.2215 7.04381 15.4008L7.3245 15.5628C7.62368 15.7545 7.85378 16.037 7.98117 16.3692L8.25949 17.2004C8.44247 17.7504 8.53396 18.0254 8.75175 18.1827C8.96958 18.34 9.25892 18.34 9.8375 18.34H10.7665C11.3452 18.34 11.6345 18.34 11.8523 18.1827C12.0701 18.0254 12.1616 17.7504 12.3446 17.2004L12.6229 16.3692C12.7503 16.037 12.9803 15.7545 13.2796 15.5628L13.5603 15.4008C13.9093 15.2215 14.3103 15.1714 14.6925 15.2596L15.7093 15.546C16.3079 15.7159 16.6072 15.8008 16.8719 15.6932C17.1366 15.5856 17.2921 15.3156 17.6032 14.7757L18.0145 14.0619C18.3061 13.5559 18.4518 13.3029 18.4236 13.0336C18.3952 12.7642 18.2001 12.5472 17.8098 12.113L16.9505 11.1524C16.7405 10.8865 16.5914 10.4233 16.5914 10.0066C16.5914 9.59 16.7406 9.12667 16.9505 8.86083L17.8098 7.90026C18.2001 7.46615 18.3952 7.24909 18.4236 6.97974C18.4518 6.71039 18.3061 6.45736 18.0145 5.95132Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round"/>
                        <path d="M7.33325 13.3333C7.91544 12.3269 9.00361 11.6497 10.2499 11.6497C11.4962 11.6497 12.5844 12.3269 13.1666 13.3333M11.9166 7.91667C11.9166 8.83715 11.1704 9.58332 10.2499 9.58332C9.32944 9.58332 8.58328 8.83715 8.58328 7.91667C8.58328 6.99619 9.32944 6.25 10.2499 6.25C11.1704 6.25 11.9166 6.99619 11.9166 7.91667Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <div className="mainFrameCardsHead">
                      Roles and Permission
                    </div>
                  </div>
                  <div className="mainFrameCardsDivBox2">
                    Manage user roles and permissions to control access and ensure secure collaboration within the platform
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/settings/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer mainFrameCards">
                <div className="mainFrameCardsDivBox12">
                  <div className="mainFrameCardsDivBox1">
                    <div className="w-[20px] h-[20px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.3117 15C17.9361 15 18.4327 14.6071 18.8787 14.0576C19.7916 12.9328 18.2927 12.034 17.7211 11.5938C17.14 11.1463 16.4912 10.8928 15.8333 10.8333M15 9.16667C16.1506 9.16667 17.0833 8.23392 17.0833 7.08333C17.0833 5.93274 16.1506 5 15 5" stroke="#101010" stroke-width="1.2" stroke-linecap="round"/>
                        <path d="M2.68822 15C2.0638 15 1.56715 14.6071 1.1212 14.0576C0.208328 12.9328 1.70715 12.034 2.27879 11.5938C2.8599 11.1463 3.50874 10.8928 4.16659 10.8333M4.58325 9.16667C3.43266 9.16667 2.49992 8.23392 2.49992 7.08333C2.49992 5.93274 3.43266 5 4.58325 5" stroke="#101010" stroke-width="1.2" stroke-linecap="round"/>
                        <path d="M6.73642 12.5925C5.88494 13.119 3.6524 14.1941 5.01217 15.5393C5.6764 16.1965 6.41619 16.6665 7.34627 16.6665H12.6536C13.5837 16.6665 14.3234 16.1965 14.9877 15.5393C16.3474 14.1941 14.1149 13.119 13.2634 12.5925C11.2667 11.3578 8.7331 11.3578 6.73642 12.5925Z" stroke="#101010" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.9166 6.25016C12.9166 7.861 11.6108 9.16683 9.99994 9.16683C8.3891 9.16683 7.08325 7.861 7.08325 6.25016C7.08325 4.63933 8.3891 3.3335 9.99994 3.3335C11.6108 3.3335 12.9166 4.63933 12.9166 6.25016Z" stroke="#101010" stroke-width="1.2"/>
                      </svg>
                    </div>
                    <div className="mainFrameCardsHead">
                      Users
                    </div>
                  </div>
                  <div className="mainFrameCardsDivBox2">
                    Create and manage user accounts while assigning roles
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Account Management Section */}
        <div className="mainFrameDiv">
          <div className="headerFrame">
            <div className="headerTitle">Account Management</div>
          </div>  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mainFrameCardsDiv">
            <Link to="/settings/account-information">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer mainFrameCards">
              <div className="mainFrameCardsDivBox12">
                <div className="mainFrameCardsDivBox1">
                  <div className="w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.99992 6.6665C13.6818 6.6665 16.6666 5.54722 16.6666 4.1665C16.6666 2.78579 13.6818 1.6665 9.99992 1.6665C6.31802 1.6665 3.33325 2.78579 3.33325 4.1665C3.33325 5.54722 6.31802 6.6665 9.99992 6.6665Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                      <path d="M16.6666 10C16.6666 11.3808 13.6818 12.5 9.99992 12.5C6.31802 12.5 3.33325 11.3808 3.33325 10" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                      <path d="M16.6666 4.1665V15.8332C16.6666 17.2139 13.6818 18.3332 9.99992 18.3332C6.31802 18.3332 3.33325 17.2139 3.33325 15.8332V4.1665" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                      <path d="M6.66675 6.6665V8.33317" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round"/>
                      <path d="M6.66675 12.5V14.1667" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div className="mainFrameCardsHead">
                    Account Information
                  </div>
                </div>
                <div className="mainFrameCardsDivBox2">
                  Customize your account fields. Edit or update the predefined fields
                </div>
              </div>
            </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer mainFrameCards">
              <div className="mainFrameCardsDivBox12">
                <div className="mainFrameCardsDivBox1">
                  <div className="w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M17.75 2.5H2.75V17.5H17.75V2.5Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linejoin="round"/>
                      <path d="M8.58333 5.8335H15.25M5.25 5.8335H6.91667M5.25 10.0002H6.91667M5.25 14.1668H6.91667M8.58333 10.0002H15.25M8.58333 14.1668H15.25" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                    </svg>
                  </div>
                  <div className="mainFrameCardsHead">
                    Contact Information
                  </div>
                </div>
                <div className="mainFrameCardsDivBox2">
                  Customize your account fields. Edit or update the predefined fields
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer mainFrameCards">
              <div className="mainFrameCardsDivBox12">
                <div className="mainFrameCardsDivBox1">
                  <div className="w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M10.5001 3.75V12.0833M10.5001 3.75C9.91658 3.75 8.82636 5.41192 8.41675 5.83333M10.5001 3.75C11.0836 3.75 12.1738 5.41192 12.5834 5.83333" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17.1666 13.75C17.1666 15.8183 16.7349 16.25 14.6666 16.25H6.33325C4.26492 16.25 3.83325 15.8183 3.83325 13.75" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div className="mainFrameCardsHead">
                    Contact Upload
                  </div>
                </div>
                <div className="mainFrameCardsDivBox2">
                  Upload list of contacts
                </div>
              </div>
            </Card>

            <Link to="/settings/account-data-upload">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer mainFrameCards">
              <div className="mainFrameCardsDivBox12">
                <div className="mainFrameCardsDivBox1">
                  <div className="w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M4.0835 10.8294V12.1168C4.0835 14.8224 4.0835 16.1752 4.82189 17.0914C4.97106 17.2765 5.13959 17.4452 5.3246 17.5944C6.24042 18.3332 7.59251 18.3332 10.2967 18.3332C10.8847 18.3332 11.1786 18.3332 11.4478 18.2381C11.5038 18.2183 11.5587 18.1956 11.6122 18.17C11.8698 18.0468 12.0777 17.8388 12.4934 17.4228L16.4405 13.4737C16.9222 12.9918 17.1631 12.7508 17.29 12.4443C17.4168 12.1378 17.4168 11.7971 17.4168 11.1155V8.32812C17.4168 5.18384 17.4168 3.6117 16.4405 2.63489C15.6644 1.85835 14.5122 1.69915 12.4934 1.6665M11.5835 17.9163V17.4994C11.5835 15.1412 11.5835 13.9621 12.3157 13.2295C13.048 12.4969 14.2265 12.4969 16.5835 12.4969H17.0002" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7.41683 8.14378C8.88959 8.14378 10.0835 6.92274 10.0835 5.4165C10.0835 3.91027 8.88959 2.68923 7.41683 2.68923M7.41683 8.14378C5.94407 8.14378 4.75016 6.92274 4.75016 5.4165C4.75016 3.91027 5.94407 2.68923 7.41683 2.68923M7.41683 8.14378V9.1665M7.41683 2.68923V1.6665M4.99291 3.9289L4.08387 3.37105M10.7502 7.46196L9.84116 6.9041M9.84075 3.9289L10.7498 3.37105M4.0835 7.46196L4.99254 6.9041" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div className="mainFrameCardsHead">
                    Account Data Upload
                  </div>
                </div>
                <div className="mainFrameCardsDivBox2">
                  Upload your Accounts, Details and assign the Team
                </div>
              </div>
            </Card>
            </Link>
          </div>
        </div>

        {/* Health Management Section */}
        <div className="mainFrameDiv">
          <div className="headerFrame">
            <div className="headerTitle">Health Management</div>
          </div>  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mainFrameCardsDiv">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer mainFrameCards">
              <div className="mainFrameCardsDivBox12">
                <div className="mainFrameCardsDivBox1">
                  <div className="w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3.15741 7.53093C2.56792 7.85003 1.02232 8.50162 1.96369 9.31695C2.42354 9.7152 2.93571 10 3.57961 10H7.25389C7.89779 10 8.40992 9.7152 8.86983 9.31695C9.81117 8.50162 8.26558 7.85003 7.67609 7.53093C6.29376 6.78266 4.53974 6.78266 3.15741 7.53093Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                      <path d="M7.29175 3.56045C7.29175 4.60644 6.45228 5.45438 5.41675 5.45438C4.38121 5.45438 3.54175 4.60644 3.54175 3.56045C3.54175 2.51445 4.38121 1.6665 5.41675 1.6665C6.45228 1.6665 7.29175 2.51445 7.29175 3.56045Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                      <path d="M3.33325 12.5C3.33325 15.2642 5.56897 17.5 8.33325 17.5L7.61897 16.0714" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16.6667 7.5C16.6667 4.73572 14.431 2.5 11.6667 2.5L12.381 3.92858" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12.3239 15.8644C11.7344 16.1835 10.1888 16.8351 11.1302 17.6504C11.5901 18.0487 12.1022 18.3335 12.7461 18.3335H16.4204C17.0643 18.3335 17.5764 18.0487 18.0363 17.6504C18.9777 16.8351 17.4321 16.1835 16.8426 15.8644C15.4603 15.1162 13.7063 15.1162 12.3239 15.8644Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                      <path d="M16.4583 11.8939C16.4583 12.9399 15.6188 13.7879 14.5833 13.7879C13.5478 13.7879 12.7083 12.9399 12.7083 11.8939C12.7083 10.8479 13.5478 10 14.5833 10C15.6188 10 16.4583 10.8479 16.4583 11.8939Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                    </svg>
                  </div>
                  <div className="mainFrameCardsHead">
                    Communication Integration
                  </div>
                </div>
                <div className="mainFrameCardsDivBox2">
                  Customize your account fields. Edit or update the predefined fields
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer mainFrameCards">
              <div className="mainFrameCardsDivBox12">
                <div className="mainFrameCardsDivBox1">
                  <div className="w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M8.82425 18.3011H8.07584C5.36876 18.3011 4.01522 18.3011 3.17424 17.4469C2.33325 16.5925 2.33325 15.2176 2.33325 12.4678V8.3011C2.33325 5.55124 2.33325 4.17632 3.17424 3.32205C4.01522 2.46777 5.36876 2.46777 8.07584 2.46777H10.5369C13.244 2.46777 14.8255 2.51376 15.6666 3.36803C16.5076 4.2223 16.4999 5.55124 16.4999 8.3011V9.28977" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.5377 1.6665V3.33317M9.371 1.6665V3.33317M5.20435 1.6665V3.33317" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6.08325 12.5002H9.41659M6.08325 8.3335H12.7499" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round"/>
                      <path opacity="0.93" d="M17.5499 12.3986C16.7954 11.5532 16.3427 11.6036 15.8397 11.7545C15.4876 11.8048 14.2804 13.2138 13.7774 13.6625C12.9516 14.4784 12.122 15.3184 12.0673 15.428C11.9109 15.6822 11.7655 16.1325 11.6951 16.6357C11.5643 17.3905 11.3756 18.2402 11.6146 18.3131C11.8535 18.3858 12.5199 18.246 13.2744 18.1352C13.7774 18.0447 14.1295 17.944 14.381 17.7931C14.7331 17.5817 15.387 16.837 16.5137 15.7299C17.2204 14.9859 17.9019 14.4718 18.1032 13.9687C18.3044 13.2138 18.0026 12.8112 17.5499 12.3986Z" stroke="#101010" stroke-opacity="0.8" stroke-width="1.2"/>
                    </svg>
                  </div>
                  <div className="mainFrameCardsHead">
                    Communication Score
                  </div>
                </div>
                <div className="mainFrameCardsDivBox2">
                  Customize your account fields. Edit or update the predefined fields
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
