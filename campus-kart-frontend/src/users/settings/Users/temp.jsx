import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import Layout from '../../Layout';
import { useState, useEffect } from 'react';
import AddUserSidebar from './AddUserSidebar';
import EditUserSidebar from './EditUserSidebar';
import { BASE_URL } from '../../../config';

const Users = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [organisationCname, setOrganisationCname] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
      return;
    }

    let orgName = "";

    if (hostname.includes("localhost") && hostname !== "localhost") {
      orgName = parts[0];
    } else if (parts.length >= 4 && parts[1] === "dashboard" && parts[2] === "triumphiq") {
      orgName = parts[0];
    } else {
      navigate("/signup");
      return;
    }

    setOrganisationCname(orgName);
    sessionStorage.setItem("organisationCname", orgName);

    // Fetch users after setting the organization name
    fetchUsers(token, orgName);
  }, [navigate]);

  const fetchUsers = async (token, orgName) => {
    try {
      const response = await axios.get(`${BASE_URL}/users?organisationCname=${orgName}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      let data = response.data;
      if (!Array.isArray(data)) {
        data = [data];
      }
      if (data.length == 0) {
        data = [
          {
            "userEmailId": sessionStorage.getItem("email"),
            "username": sessionStorage.getItem("username"),
            "userRole": sessionStorage.getItem("role")
          }
        ];
      }
  
      // Mapping API response to local format:
      const formattedUsers = data.map((user, index) => ({
        // id: index+1, // Consider using the actual user id if available
        name: user.username, 
        email: user.userEmailId,
        role: user.userRole,
      }));
      
      const sortedUsers = formattedUsers.sort((a, b) => (a.role === 'Owner' ? -1 : 1));

      sortedUsers.forEach((user, index) => {
        user.id = index + 1;
      });
      
      setUsers(sortedUsers);
      console.log(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  // Handler for delete cancel
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Handler for delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      // Make API call to delete the user (update endpoint as needed)
      await axios.delete(`${BASE_URL}/users/${selectedUser.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
        }
      });
      // Update the users state by filtering out the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      // Optionally handle error, e.g. show a notification
    }
  };

  return (
    <Layout>
      <div className="mainFrame">
        {/* Breadcrumb */}
        <div className="rnpUpper">
          <div className="rnpUpperDiv1">
            <Link to="/settings" className="rnpUpperDiv11">Settings</Link>
            <span className="rnpUpperDiv12">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.3334 8.00033L4.66669 2.66699V13.3337L11.3334 8.00033Z" fill="#737373"/>
              </svg>
            </span>
            <span className="rnpUpperDiv13">Users</span>
          </div>
          <div className="rnpUpperDiv23">
            <div className="rnpUpperDiv2">
              <Link to="/settings" className="rnpUpperDiv2IconOuter">
                <div className="rnpUpperDiv2Icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1.00012 5H13" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.99998 1C4.99998 1 1.00001 3.94598 1 4.99998C0.99999 6.05407 4.99998 8.99995 4.99998 8.99995" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
              <h1 className="rnpUpperDiv2Text">Users</h1>
            </div>
            <p className="rnpUpperDiv3">
              Create, manage user accounts while assigning roles to ensure secure and role-based access to system features and functionalities.
            </p>
          </div>
        </div>
      </div>
      <div className="mainmain">
        {/* Total Users Count */}
        <div className="h-[42px] w-[100%] justify-between items-center inline-flex overflow-hidden">
          <div className="text-[#101010] text-base font-medium font-['Inter']">
            Total Active Users : {users.length}
          </div>
          {/* Header */}
          <div className="justify-start items-center gap-3 flex">
            <button
              className="h-[42px] w-[140px] px-2.5 py-3 bg-[#6938ef] rounded-lg justify-center items-center gap-[3px] flex"
              onClick={() => setIsAddUserOpen(true)}
            >
              <div data-svg-wrapper className="relative">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-white text-sm ml-[3px] font-[300] font-['Inter']">Add User</div>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="rnpTable">
          <table className="rnpTableMain">
            <thead className="rounded-t-[12px] h-[47px] px-[25px] py-[15px] bg-[#f7f7f7] justify-between items-center inline-flex">
              <tr>
                <th></th>
                <th className="w-[50px] pl-[23px] text-[#101010] text-sm font-medium font-['Inter']">Name</th>
                <th className="w-[350px] pl-[240px] text-[#101010] text-sm font-medium font-['Inter']">Email Id</th>
                <th className="w-[320px] pl-[260px] text-[#101010] text-sm font-medium font-['Inter']">Role</th>
                <th className="w-[391px] pl-[400px] text-center text-[#101010] text-sm font-medium font-['Inter']">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.slice().map((user) => (
                <tr key={user.id} className="h-[54px] px-[25px] py-2.5 bg-white border-b border-[#efefef] justify-between items-center inline-flex overflow-hidden">
                  <td className="text-[#0f0f0f]/80 text-sm font-normal font-['Inter'] mr-[15px]">{user.id}</td>
                  <td className="w-[200px] grow shrink basis-0 text-[#0f0f0f]/80 text-sm font-normal font-['Inter']">{user.name}</td>
                  <td className="w-[350px] pl-[110px] text-[#0f0f0f]/80 text-sm font-normal font-['Inter']">{user.email}</td>
                  <td className="w-[245px] pl-[115px] text-[#0f0f0f]/80 text-sm font-normal font-['Inter']">{user.role}</td>
                  {user.role !== 'Owner' ? 
                  (<td className="data-svg-wrapper w-[350px] pl-[290px]">
                    {(sessionStorage.getItem("role") === "Owner" ||
                      sessionStorage.getItem("role") === "Admin") ? (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditUserOpen(true);
                        }}
                        className="text-gray-600 hover:text-purple-600"
                      >
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.4106 12.4868L20.4619 11.4355C21.0425 10.8548 21.9839 10.8548 22.5645 11.4355C23.1451 12.0161 23.1451 12.9575 22.5645 13.5381L21.5132 14.5894M19.4106 12.4868L13.2352 18.6622C12.4512 19.4462 12.0592 19.8381 11.7923 20.3158C11.5254 20.7935 11.2568 21.9214 11 23C12.0786 22.7432 13.2065 22.4746 13.6842 22.2077C14.1618 21.9408 14.5538 21.5488 15.3378 20.7648L21.5132 14.5894M19.4106 12.4868L21.5132 14.5894" stroke="#101010" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.25 23H20.75" stroke="#101010" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.625 12.125L22.1602 19.6438C22.0414 21.5648 21.9821 22.5253 21.5006 23.2159C21.2625 23.5573 20.956 23.8455 20.6005 24.062C19.8816 24.5 18.9192 24.5 16.9945 24.5C15.0673 24.5 14.1037 24.5 13.3843 24.0612C13.0286 23.8443 12.722 23.5556 12.484 23.2136C12.0027 22.5219 11.9446 21.5601 11.8285 19.6364L11.375 12.125" stroke="#101010" strokeLinecap="round"/>
                          <path d="M10.25 12.125H23.75M20.0418 12.125L19.5298 11.0688C19.1897 10.3672 19.0196 10.0164 18.7263 9.79761C18.6612 9.74908 18.5923 9.7059 18.5203 9.66852C18.1954 9.5 17.8056 9.5 17.0259 9.5C16.2266 9.5 15.827 9.5 15.4968 9.67559C15.4236 9.71451 15.3537 9.75943 15.288 9.80988C14.9912 10.0375 14.8255 10.4012 14.494 11.1284L14.0397 12.125" stroke="#101010" strokeLinecap="round"/>
                          <path d="M15.125 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                          <path d="M18.875 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                     ) : (
                      <></>
                    )}
                  </td>)
                  :
                  (<td className="data-svg-wrapper w-[350px] pl-[300px]"></td>)
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full self-stretch px-8 inline-flex flex-col justify-start items-center gap-5">
          <div className="self-stretch rounded-xl outline outline-1 outline-zinc-100 flex flex-col justify-start items-center gap-[3px] overflow-hidden">
              <div className="self-stretch px-6 py-3.5 bg-neutral-100 inline-flex justify-between items-center">
                  <div className="w-28 min-w-28 pl-6 flex justify-start items-center gap-2.5">
                      <div className="justify-start text-stone-950 text-sm font-medium font-['Inter']">Name</div>
                  </div>
                  <div className="w-36 min-w-28 justify-start text-stone-950 text-sm font-medium font-['Inter']">Email Id</div>
                  <div className="w-56 min-w-48 justify-start text-stone-950 text-sm font-medium font-['Inter']">Role</div>
                  <div className="w-16 text-center justify-start text-stone-950 text-sm font-medium font-['Inter']">Action</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                {users.slice().map((user) => (
                  <div key={user.id} className="self-stretch px-6 py-2.5 bg-white border-b border-zinc-100 inline-flex justify-between items-center overflow-hidden">
                    <div className="min-w-28 flex justify-start items-center gap-3.5">
                        <div className="justify-center text-zinc-600 text-sm font-normal font-['Inter']">{user.id}</div>
                        <div className="flex-1 justify-center text-zinc-600 text-sm font-normal font-['Inter']">{user.name}</div>
                    </div>
                    <div className="min-w-36 justify-start text-zinc-600 text-sm font-normal font-['Inter']">{user.email}</div>
                    <div className="min-w-56 justify-start text-zinc-600 text-sm font-normal font-['Inter']">{user.role}</div>
                    {user.role !== 'Owner' ? 
                      (<div className="opacity-0 bg-zinc-600 flex justify-start items-center gap-[3px]">
                        {(sessionStorage.getItem("role") === "Owner" ||
                          sessionStorage.getItem("role") === "Admin") ? (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditUserOpen(true);
                            }}
                            className="text-gray-600 hover:text-purple-600"
                          >
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.4106 12.4868L20.4619 11.4355C21.0425 10.8548 21.9839 10.8548 22.5645 11.4355C23.1451 12.0161 23.1451 12.9575 22.5645 13.5381L21.5132 14.5894M19.4106 12.4868L13.2352 18.6622C12.4512 19.4462 12.0592 19.8381 11.7923 20.3158C11.5254 20.7935 11.2568 21.9214 11 23C12.0786 22.7432 13.2065 22.4746 13.6842 22.2077C14.1618 21.9408 14.5538 21.5488 15.3378 20.7648L21.5132 14.5894M19.4106 12.4868L21.5132 14.5894" stroke="#101010" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16.25 23H20.75" stroke="#101010" strokeLinecap="round"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.625 12.125L22.1602 19.6438C22.0414 21.5648 21.9821 22.5253 21.5006 23.2159C21.2625 23.5573 20.956 23.8455 20.6005 24.062C19.8816 24.5 18.9192 24.5 16.9945 24.5C15.0673 24.5 14.1037 24.5 13.3843 24.0612C13.0286 23.8443 12.722 23.5556 12.484 23.2136C12.0027 22.5219 11.9446 21.5601 11.8285 19.6364L11.375 12.125" stroke="#101010" strokeLinecap="round"/>
                              <path d="M10.25 12.125H23.75M20.0418 12.125L19.5298 11.0688C19.1897 10.3672 19.0196 10.0164 18.7263 9.79761C18.6612 9.74908 18.5923 9.7059 18.5203 9.66852C18.1954 9.5 17.8056 9.5 17.0259 9.5C16.2266 9.5 15.827 9.5 15.4968 9.67559C15.4236 9.71451 15.3537 9.75943 15.288 9.80988C14.9912 10.0375 14.8255 10.4012 14.494 11.1284L14.0397 12.125" stroke="#101010" strokeLinecap="round"/>
                              <path d="M15.125 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                              <path d="M18.875 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                        ) : (
                          <></>
                        )}
                      </div>)
                      :
                      (<div className="opacity-0 bg-zinc-600 flex justify-start items-center gap-[3px]"></div>)
                      }
                </div>
                ))}
              </div>
          </div>
      </div>
      {/* Render overlay for Add and Edit User sidebars */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/30 z-40"></div>
      )}
      <AddUserSidebar 
        formData={formData}
        setFormData={setFormData}
        users={users}
        setUsers={setUsers}
        isAddUserOpen={isAddUserOpen}
        setIsAddUserOpen={setIsAddUserOpen}
      />
      {isEditUserOpen && (
        <div className="fixed inset-0 bg-black/30 z-40"></div>
      )}
      <EditUserSidebar 
        formData={formData}
        setFormData={setFormData}
        users={users}
        setUsers={setUsers}
        isEditUserOpen={isEditUserOpen}
        setIsEditUserOpen={setIsEditUserOpen}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Delete Confirmation Modal */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <div className="relative w-[550px] h-[234px] pt-2.5 bg-white rounded-xl shadow-[0px_8px_36px_0px_rgba(0,0,0,0.16)] flex-col justify-center items-center overflow-hidden">
      
      {/* Close (Cross) Icon at Top Right */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleDeleteCancel}
      >
        <div className="w-8 h-8 relative">
          <div className="w-8 h-8 absolute bg-white rounded-[7px] border border-[#ececec]" />
          <div className="w-[17.45px] h-[17.45px] absolute left-[7.27px] top-[7.27px] bg-white rounded">
            <div className="w-[17.45px] h-[17.45px] absolute">
              <div className="w-[17.45px] h-[17.45px] absolute" />
              <div data-svg-wrapper className="absolute left-[3.31px] top-[2.87px]">
                <svg
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.8705 0.379038C11.5379 0.0642572 11.0175 0.0636908 10.6842 0.377747L6.36387 4.44902L2.04356 0.377777C1.71029 0.0637203 1.18986 0.0642868 0.857274 0.379067C0.496671 0.720366 0.497295 1.29467 0.85864 1.63519L5.10424 5.63603L0.858329 9.63716C0.496983 9.97767 0.496359 10.552 0.856962 10.8933C1.18955 11.2081 1.70998 11.2086 2.04325 10.8946L6.36387 6.82304L10.6845 10.8946C11.0178 11.2087 11.5382 11.2081 11.8708 10.8933C12.2314 10.552 12.2308 9.9777 11.8694 9.63719L7.6235 5.63603L11.8691 1.63516C12.2305 1.29464 12.2311 0.720337 11.8705 0.379038Z"
                    fill="#0A1629"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Modal Content */}
      <div data-svg-wrapper className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="16" fill="#FF0000" fillOpacity="0.2" />
          <path
            d="M23.5 9.5L22.8803 19.5251C22.7219 22.0864 22.6428 23.3671 22.0008 24.2879C21.6833 24.7431 21.2747 25.1273 20.8007 25.416C19.8421 26 18.559 26 15.9927 26C13.4231 26 12.1383 26 11.179 25.4149C10.7048 25.1257 10.296 24.7408 9.97868 24.2848C9.33688 23.3626 9.25945 22.0801 9.10461 19.5152L8.5 9.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 9.5H25M20.0557 9.5L19.3731 8.09173C18.9196 7.15626 18.6928 6.68852 18.3017 6.39681C18.215 6.3321 18.1231 6.27454 18.027 6.2247C17.5939 6 17.0741 6 16.0345 6C14.9688 6 14.436 6 13.9957 6.23412C13.8981 6.28601 13.805 6.3459 13.7173 6.41317C13.3216 6.7167 13.1006 7.20155 12.6586 8.17126L12.0529 9.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M13.5 20.5V14.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18.5 20.5V14.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="mt-8 self-stretch h-11 px-6 py-2.5 flex flex-col justify-start items-center overflow-hidden">
        <div className="text-center text-black text-lg font-bold font-['Inter'] leading-normal">
          Delete User
        </div>
      </div>
      <div className="self-stretch h-[66px] px-6 py-2 flex flex-col justify-start items-center gap-2.5">
        <div className="text-center text-[#9794aa] text-sm font-normal font-['Inter'] leading-tight">
          Are you sure you want to delete this user?
        </div>
        <div className="flex gap-2 items-center">
          <div data-svg-wrapper className="relative">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.8333 10.0003C18.8333 5.39795 15.1023 1.66699 10.5 1.66699C5.89758 1.66699 2.16663 5.39795 2.16663 10.0003C2.16663 14.6027 5.89758 18.3337 10.5 18.3337C15.1023 18.3337 18.8333 14.6027 18.8333 10.0003Z"
                stroke="#FCD451"
                strokeWidth="1.2"
              />
              <path
                opacity="0.4"
                d="M10.7019 14.167V10.0003C10.7019 9.60749 10.7019 9.41108 10.5798 9.28899C10.4578 9.16699 10.2614 9.16699 9.86853 9.16699"
                stroke="#FCD451"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                opacity="0.4"
                d="M10.4933 6.66699H10.501"
                stroke="#FCD451"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-center text-[#9794aa] text-sm font-normal font-['Inter'] leading-tight">
            Note: This will unassign all the managed account of the user
          </div>
        </div>
      </div>
      <div className="self-stretch px-6 pt-4 pb-6 flex justify-center items-center gap-4">
        <div
          className="w-52 h-[42px] px-4 py-1.5 bg-[#6938ef] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleDeleteConfirm}
        >
          <div className="text-center text-white text-xs font-medium font-['Inter']">
            Confirm
          </div>
        </div>
        <div
          className="w-52 h-[42px] px-4 py-1.5 rounded-lg border border-[#6938ef] flex justify-center items-center cursor-pointer"
          onClick={handleDeleteCancel}
        >
          <div className="text-center text-[#6938ef] text-xs font-medium font-['Inter']">
            Cancel
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
};

export default Users;
