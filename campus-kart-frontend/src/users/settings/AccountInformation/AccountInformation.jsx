import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import Layout from '../../Layout';
import { useState, useEffect } from 'react';
import AddModuleSidebar from './AddModuleSidebar';
import AddFieldSidebar from './AddFieldSidebar';
import EditFieldSidebar from './EditFieldSidebar';
import Toast from './Toast';
import { BASE_URL } from '../../../config';

const AccountInformation = () => {
  const [toast, setToast] = useState(null);
  const [organisationCname, setOrganisationCname] = useState("");
  const [modules, setModules] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showAccountIDTooltip, setShowAccountIDTooltip] = useState(false);

  // State for editing module names:
  const [editingModuleKey, setEditingModuleKey] = useState(null);
  const [editedModuleName, setEditedModuleName] = useState("");

  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);

  const [selectedField, setSelectedField] = useState(null);
  const [selectedFieldName, setSelectedFieldName] = useState(null);

  const [isDeleteModuleOpen, setIsDeleteModuleOpen] = useState(false);
  const [isDeleteFieldOpen, setIsDeleteFieldOpen] = useState(false);

  const [expandedModules, setExpandedModules] = useState({});
  const [moduleToDelete, setModuleToDelete] = useState(null);

  // Handler for delete cancel
  const handleDeleteModuleCancel = () => {
    setIsDeleteModuleOpen(false);
    setModuleToDelete(null);
  };
  const handleDeleteFieldCancel = () => {
    setIsDeleteFieldOpen(false);
    setSelectedField(null);
  };

  // Handler for delete confirmation
  const handleDeleteModuleConfirm = async () => {
    if (moduleToDelete) {
      const updatedModules = {...modules};
      delete updatedModules[moduleToDelete];
    
      const token = sessionStorage.getItem("authToken"); 
      try {
        await axios.patch(`${BASE_URL}/module`, updatedModules, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        setModules(updatedModules);
        setIsDeleteModuleOpen(false);
        setModuleToDelete(null);
        setToast({
          type: "success",
          title: "Module Deleted",
          message: "The module has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting module", error);
        setToast({
          type: "error",
          title: "Error",
          message: "There was an error deleting the module.",
        });
      }
    }
  };
  const handleDeleteFieldConfirm = async () => {
    if(selectedField && moduleToDelete) {
      const updatedModules = {...modules};
    
      const fieldKey = Object.keys(updatedModules[moduleToDelete].fields).find(
        key => updatedModules[moduleToDelete].fields[key].fieldId === selectedField.fieldId
      )

      delete updatedModules[moduleToDelete].fields[fieldKey];

      const token = sessionStorage.getItem("authToken");
      try {
        await axios.patch(`${BASE_URL}/module`, updatedModules, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        setModules(updatedModules);
        setIsDeleteFieldOpen(false);
        setSelectedField(null);
        setToast({
          type: "success",
          title: "Field Deleted",
          message: "The field has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting field", error);
        setToast({
          type: "error",
          title: "Error",
          message: "There was an error deleting the field.",
        });
      }
    }
  };

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

    axios.get(`${BASE_URL}/module`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => {
      setModules(response.data);
    })
    .catch(error => {
      console.error("Error fetching module data:", error);
    });

  }, [navigate]);

  // Handler to start editing a module name.
  const handleEditClick = (moduleName, currentName) => {
    setEditingModuleKey(moduleName);
    setEditedModuleName(currentName);
  };

  const handleOnBlur = async (e, moduleKey, oldModuleName) => {
    e.preventDefault();
    const token = sessionStorage.getItem("authToken");
    try {
      await axios.patch(
        `${BASE_URL}/module/module-name`,
        {
          oldModuleName: oldModuleName,
          newModuleName: editedModuleName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      // Update module locally.
      setModules(prev => {
        const updatedModules = { ...prev };
        updatedModules[editedModuleName] = updatedModules[oldModuleName];
        delete updatedModules[oldModuleName];
        return updatedModules;
      });
    } catch (error) {
      console.error("Error updating module name", error);
      if(editedModuleName != oldModuleName) {
        setToast({
          type: "error",
          title: "Error",
          message: "error",
        });
      }
    }
    setEditingModuleKey(null);
    setEditedModuleName("");
  };
  
  // Handler when user presses Enter in the input.
  const handleKeyDown = async (e, moduleKey, oldModuleName) => {
    console.log(editedModuleName);
    if (e.key === "Escape") {
      setEditingModuleKey(null);
    }
    if (e.key === "Enter") {
      console.log(oldModuleName);
      console.log(editedModuleName);
      e.preventDefault();
      const token = sessionStorage.getItem("authToken");
      try {
        await axios.patch(
          `${BASE_URL}/module/module-name`,
          {
            oldModuleName: oldModuleName,
            newModuleName: editedModuleName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        // Update module locally.
        setModules(prev => {
          const updatedModules = { ...prev };
          updatedModules[editedModuleName] = updatedModules[oldModuleName];
          delete updatedModules[oldModuleName];
          return updatedModules;
        });
      } catch (error) {
        console.error("Error updating module name", error);
        if(editedModuleName != oldModuleName) {
          setToast({
            type: "error",
            title: "Duplicate Module Name",
            message: "A module with this name already exists.",
          });
        }
      }
      setEditingModuleKey(null);
      setEditedModuleName("");
    }
  };

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filtered modules based on search query
  const filteredModules = Object.entries(modules).reduce((outputFields, [moduleName, moduleData]) => {
    const filteredFields = Object.entries(moduleData.fields).filter(([fieldName, fieldData]) =>
      fieldName.toLowerCase().includes(searchQuery)
    );

    if (filteredFields.length > 0) {
      outputFields[moduleName] = {
        ...moduleData,
        fields: Object.fromEntries(filteredFields)
      };
    }
    if (filteredFields.length == 0 && searchQuery == "") {
      outputFields[moduleName] = {
        ...moduleData,
        fields: Object.fromEntries(filteredFields)
      };
    }

    return outputFields;
  }, {});

  const toggleModuleFields = (moduleName) => {
    setExpandedModules(prev => ({
      ...prev, 
      [moduleName]: !prev[moduleName]
    }));
  };

  return (
    <Layout>
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
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
            <span className="rnpUpperDiv13">Account Information</span>
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
              <h1 className="rnpUpperDiv2Text">Account Information</h1>
            </div>
            <p className="rnpUpperDiv3">
              Customize your account fields by creating modules, adding and managing fields, and updating value types as needed.
            </p>
          </div>
        </div>
      </div>
      <div className="mainmain">
        <div className="w-[100%] h-[45px] inline-flex justify-between items-center overflow-hidden">
          <div className="flex justify-center items-center gap-2.5">
              <div className="relative justify-center text-[#f0272a] text-sm font-normal font-['Inter']">*Mandatory Fields</div>
          </div>
          <div className="flex justify-start items-center gap-3">
              <div className="w-[279px] pl-2 pr-2.5 py-[9px] bg-white rounded-lg border border-[#cbcad7] flex justify-start items-center gap-[3px]">
                  <div className="w-6 h-6 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M17.5 17.5L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                  </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="h-6 flex-1 bg-transparent border-none text-[#888] font-['Inter'] text-sm font-normal leading-normal"
                    />
              </div>
              
              <button
                 onClick={() => navigate("/settings/account-data-upload")}
              >
                <div className="h-10 px-2.5 py-3 bg-[#6938ef]/10 rounded-lg border border-[#6938ef] flex justify-center items-center gap-[3px]">
                  <div className="w-[18px] h-[18px]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#6938ef" fill="none">
                      <path d="M2.99996 14L3.2338 14.6626C4.14396 17.2413 4.59903 18.5307 5.63738 19.2654C6.67572 20 8.04305 20 10.7777 20H13.2222C15.9569 20 17.3242 20 18.3625 19.2654C19.4009 18.5307 19.856 17.2413 20.7661 14.6626L21 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M12 4V14M12 4C11.2997 4 9.99149 5.9943 9.49996 6.5M12 4C12.7002 4 14.0084 5.9943 14.5 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div className="relative justify-start text-[#6938ef] text-sm font-medium font-['Inter']">Upload Data</div>
              </div>
              </button>
              
              <button
                onClick = {() => {
                  setIsAddFieldOpen(true);
                }}
              >
              <div className="px-2.5 py-3 rounded-lg border border-[#6938ef] flex justify-center items-center gap-[3px]">
                  <div className="w-[18px] h-[18px] relative overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#6938ef" fill="none">
                      <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div className="relative justify-start text-[#6938ef] text-sm font-medium font-['Inter']">Add Field</div>
              </div>
              </button>
              <button
                onClick = {() => {
                  setIsAddModuleOpen(true);
                }}
              >
              <div className="h-10 px-2.5 py-3 bg-[#6938ef] rounded-lg flex justify-center items-center gap-[3px]">
                  <div className="w-[18px] h-[18px] relative overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#fff" fill="none">
                      <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div className="relative justify-start text-white text-sm font-medium font-['Inter']">Add Module</div>
              </div>
              </button>
          </div>
        </div>  
      </div>
       {/* Render a table for each module */}
       {Object.entries(filteredModules).sort(([, a], [, b]) => a.moduleId - b.moduleId).map(([moduleName, moduleData]) => {
          const isExpanded = expandedModules[moduleName];
          const fieldsToShow = isExpanded ? Object.entries(moduleData.fields) : Object.entries(moduleData.fields).slice(0, 4);
        
          return (<div key={moduleData.moduleId} className="module-section my-5">
            <div className="inline-flex flex-col justify-start items-start gap-2">
              <div className="inline-flex justify-start items-center gap-[5px]">
                <div className="pl-8 flex justify-center items-center gap-2.5">
                  <div className="text-[#101010] text-lg font-medium font-['Inter']">
                    Module: 
                  </div>
                  {editingModuleKey === moduleName ? (
                    <div
                      className="p-0.5 bg-white rounded-[2px] border border-[#6938EF] shadow-[0px_4px_25px_0px_rgba(0,0,0,0.10)] outline-1 outline-offset-[-1px] outline-[#6938ef] inline-flex justify-center items-center gap-2.5 text-[#101010] text-lg font-medium font-['Inter']"
                    >
                      <input
                        type="text"
                        value={editedModuleName}
                        onChange={(e) => setEditedModuleName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, moduleData.moduleId, moduleName)} 
                        onBlur={(e) => handleOnBlur(e, moduleData.moduleId, moduleName)}  
                        autoFocus
                        className="p-0.5 border-none"
                      />
                    </div>
                  ) : (
                    <div className="relative justify-center text-[#101010] text-lg font-medium font-['Inter']">
                      {moduleName}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {/* Edit Module Icon */}
                  <div className="w-[15px] cursor-pointer" onClick={() => handleEditClick(moduleName, moduleName)}>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.4106 12.4868L20.4619 11.4355C21.0425 10.8548 21.9839 10.8548 22.5645 11.4355C23.1451 12.0161 23.1451 12.9575 22.5645 13.5381L21.5132 14.5894M19.4106 12.4868L13.2352 18.6622C12.4512 19.4462 12.0592 19.8381 11.7923 20.3158C11.5254 20.7935 11.2568 21.9214 11 23C12.0786 22.7432 13.2065 22.4746 13.6842 22.2077C14.1618 21.9408 14.5538 21.5488 15.3378 20.7648L21.5132 14.5894" stroke="#101010" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.25 23H20.75" stroke="#101010" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {/* Delete Module Icon – rendered only if module.deletable is true */}
                  {moduleData.deletable && (
                    <button 
                      onClick={() => {
                        setIsDeleteModuleOpen(true);
                        setModuleToDelete(moduleName);
                      }}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <div className="w-[15px]">
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.625 12.125L22.1602 19.6438C22.0414 21.5648 21.9821 22.5253 21.5006 23.2159C21.2625 23.5573 20.956 23.8455 20.6005 24.062C19.8816 24.5 18.9192 24.5 16.9945 24.5C15.0673 24.5 14.1037 24.5 13.3843 24.0612C13.0286 23.8443 12.722 23.5556 12.484 23.2136C12.0027 22.5219 11.9446 21.5601 11.8285 19.6364L11.375 12.125" stroke="#101010" strokeLinecap="round"/>
                          <path d="M10.25 12.125H23.75M20.0418 12.125L19.5298 11.0688C19.1897 10.3672 19.0196 10.0164 18.7263 9.79761C18.6612 9.74908 18.5923 9.7059 18.5203 9.66852C18.1954 9.5 17.8056 9.5 17.0259 9.5C16.2266 9.5 15.827 9.5 15.4968 9.67559C15.4236 9.71451 15.3537 9.75943 15.288 9.80988C14.9912 10.0375 14.8255 10.4012 14.494 11.1284L14.0397 12.125" stroke="#101010" strokeLinecap="round"/>
                          <path d="M15.125 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                          <path d="M18.875 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              </div>
              <div className="pl-8 inline-flex justify-center items-center gap-2.5">
                <div className="relative justify-center text-[#434343] text-sm font-normal font-['Inter']">
                  {/* You can customize this text as needed */}
                  {moduleData.deletable ? "Manage Module Fields" : "Create and manage Primary Account Fields"}
                </div>
              </div>
            </div>

            {/* Module Fields Table */}
            <div data-property className="w-[100%] px-8 my-3 inline-flex flex-col justify-start items-center gap-5">
              <div className="self-stretch rounded-xl shadow-[0px_4px_30px_0px_rgba(0,0,0,0.07)] ring-1 ring-[#efefef] flex flex-col justify-start items-center gap-[3px] overflow-hidden">
                <div className="self-stretch p-[15px] bg-[#f7f7f7] inline-flex justify-between items-center">
                  <div className="min-w-[220px] pl-[22px] flex justify-center items-center gap-2.5">
                    <div className="flex-1 relative justify-start text-[#101010] text-sm font-medium font-['Inter']">Field Name</div>
                  </div>
                  <div className="w-[140px] min-w-[118px] relative justify-start text-[#101010] text-sm font-medium font-['Inter']">Type</div>
                  <div className="w-[71px] relative text-center justify-start text-[#101010] text-sm font-medium font-['Inter']">Action</div>
                </div>
                {Object.keys(moduleData.fields).length !== 0 ? (
                <div className="self-stretch flex flex-col justify-start items-start">
                  {/* {moduleData.fields && Object.entries(moduleData.fields).map(([fieldName, fieldData], index) => ( */}
                  {fieldsToShow.sort(([, a], [, b]) => a.fieldId - b.fieldId).map(([fieldName, fieldData], index) => (
                    <div key={fieldName} className="self-stretch px-[15px] py-2.5 bg-white border-b border-[#efefef] inline-flex justify-between items-center overflow-hidden">
                      <div className="min-w-[220px] flex justify-start items-center gap-[3px]">
                        <div className="flex justify-start items-center gap-[15px]">
                          <div className="relative justify-center text-[#0f0f0f]/80 text-sm font-normal font-['Inter']">
                            {index + 1}
                          </div>
                          <div className="relative justify-center text-[#0f0f0f]/80 text-sm font-normal font-['Inter']">
                            {fieldName == "Created At (In yyyy-mm-dd format)" ? "Created At" : fieldName}{fieldData.mandatory && "*"} 
                          </div>
                        </div>
                        {/* Information Icon */}
                        {fieldName === "Account ID" && (
                          <div className="relative">
                            {showAccountIDTooltip && (
                              <div 
                                className="absolute -top-2 z-50 rounded-lg left-10 w-[250.06px] px-[15px] py-3 inline-flex justify-center items-start gap-2.5 shadow-lg"
                                style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15))' }}
                                onMouseEnter={() => setShowAccountIDTooltip(true)}
                                onMouseLeave={() => setShowAccountIDTooltip(false)}
                              >
                                <div className="w-[220px] relative text-center justify-start text-[#101010] text-xs font-normal font-['Inter']">
                                  This is the unique account identifier.
                                </div>
                              </div>
                            )}
                            <svg 
                              onMouseEnter={() => setShowAccountIDTooltip(true)}
                              onMouseLeave={() => setShowAccountIDTooltip(false)}
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              width="24" 
                              height="24" 
                              color="#6938ef" 
                              fill="none"
                              className="cursor-pointer"
                            >
                              <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M11.992 8H12.001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}                        
                      </div>
                      <div className="min-w-[140px] relative justify-start text-[#0f0f0f]/80 text-sm font-normal font-['Inter']">
                        {fieldData.dataType == "Text" && (<div> String </div>)}
                        {fieldData.dataType == "EmailId" && (<div> TIQ User Email </div>)}
                        {fieldData.dataType == "Date" && (<div> dd-mm-yyyy </div>)}
                        {fieldData.dataType == "Number" && (<div> Number </div>)}
                        {fieldData.dataType == "Dropdown" && (<div> Dropdown </div>)}
                        {fieldData.dataType == "Boolean" && (<div> Boolean </div>)}
                      </div>
                      <div className="w-[65px] flex justify-start items-center gap-[16px]">
                        {/* Edit Field Icon */}
                        <button
                          onClick = {() => {
                            setSelectedField(fieldData);
                            setSelectedFieldName(fieldName);
                            setIsEditFieldOpen(true);
                          }}
                        >
                          <div className="w-[15px]">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.4106 12.4868L20.4619 11.4355C21.0425 10.8548 21.9839 10.8548 22.5645 11.4355C23.1451 12.0161 23.1451 12.9575 22.5645 13.5381L21.5132 14.5894M19.4106 12.4868L13.2352 18.6622C12.4512 19.4462 12.0592 19.8381 11.7923 20.3158C11.5254 20.7935 11.2568 21.9214 11 23C12.0786 22.7432 13.2065 22.4746 13.6842 22.2077C14.1618 21.9408 14.5538 21.5488 15.3378 20.7648L21.5132 14.5894" stroke="#101010" strokeLinecap="round"/>
                              <path d="M16.25 23H20.75" stroke="#101010" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </button>
                        {/* Delete Field Icon – rendered only if field.deletable is true */}
                        {fieldData.deletable && (
                          <button
                            onClick = {() => {
                              setIsDeleteFieldOpen(true);
                              setSelectedField(fieldData);
                              setModuleToDelete(moduleName);
                            }}
                          >
                          <div className="w-[15px]">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.625 12.125L22.1602 19.6438C22.0414 21.5648 21.9821 22.5253 21.5006 23.2159C21.2625 23.5573 20.956 23.8455 20.6005 24.062C19.8816 24.5 18.9192 24.5 16.9945 24.5C15.0673 24.5 14.1037 24.5 13.3843 24.0612C13.0286 23.8443 12.722 23.5556 12.484 23.2136C12.0027 22.5219 11.9446 21.5601 11.8285 19.6364L11.375 12.125" stroke="#101010" strokeLinecap="round"/>
                              <path d="M10.25 12.125H23.75M20.0418 12.125L19.5298 11.0688C19.1897 10.3672 19.0196 10.0164 18.7263 9.79761C18.6612 9.74908 18.5923 9.7059 18.5203 9.66852C18.1954 9.5 17.8056 9.5 17.0259 9.5C16.2266 9.5 15.827 9.5 15.4968 9.67559C15.4236 9.71451 15.3537 9.75943 15.288 9.80988C14.9912 10.0375 14.8255 10.4012 14.494 11.1284L14.0397 12.125" stroke="#101010" strokeLinecap="round"/>
                              <path d="M15.125 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                              <path d="M18.875 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                            </svg>
                          </div>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                 ) : (
                  <div className="px-[15px] py-2.5 bg-white border-b border-[#efefef] inline-flex justify-between items-center overflow-hidden text-[rgba(16,16,16,0.80)] font-['Inter'] text-[14px] font-normal leading-normal">
                    When fields will be added to this module, they will appear here.
                  </div>
                 )}
                  {Object.entries(moduleData.fields).length > 4 && (
                    <button onClick={() => toggleModuleFields(moduleName)}>
                      {isExpanded ? (
                        <div className="mt-[15px] mb-[15px] flex pt-[8px] pr-[5px] pb-[8px] pl-[10px] gap-1 rounded-[8px] border-[1.5px] border-[#CBCAD7]">
                          <div className="text-[#888] font-inter text-[14px] text-[500] line-height-normal">
                            See Less
                          </div>
                          <div className="w-[12px] h-[10px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
                              <g transform="scale(1, -1) translate(0, -14)">
                                <path d="M4.50049 13L4.50049 1.00009" stroke="#454545" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M0.5 9.00002C0.5 9.00002 3.44598 13 4.49998 13C5.55407 13 8.49995 9.00002 8.49995 9.00002" stroke="#454545" strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-[15px] mb-[15px] flex pt-[8px] pr-[5px] pb-[8px] pl-[10px] gap-1 rounded-[8px] border-[1.5px] border-[#CBCAD7]">
                          <div className="text-[#888] font-inter text-[14px] text-[500] line-height-normal">
                            See More
                          </div>
                          <div className="w-[12px] h-[8px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
                              <path d="M4.50049 13L4.50049 1.00009" stroke="#454545" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M0.5 9.00002C0.5 9.00002 3.44598 13 4.49998 13C5.55407 13 8.49995 9.00002 8.49995 9.00002" stroke="#454545" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  )}
              </div>
            </div>
          </div>
          );
        })}

        {isAddModuleOpen && (
          <div className="fixed inset-0 bg-black/30 z-40"></div>
        )}
        <AddModuleSidebar 
          modules={modules}
          isAddModuleOpen={isAddModuleOpen}
          setIsAddModuleOpen={setIsAddModuleOpen}
        />

        {isAddFieldOpen && (
          <div className="fixed inset-0 bg-black/30 z-40"></div>
        )}
        <AddFieldSidebar 
          modules={modules}
          isAddFieldOpen={isAddFieldOpen}
          setIsAddFieldOpen={setIsAddFieldOpen}
        />
        
        {isEditFieldOpen && (
          <div className="fixed inset-0 bg-black/30 z-40"></div>
        )}
        <EditFieldSidebar 
          fieldName={selectedFieldName}
          selectedField={selectedField}
          isEditFieldOpen={isEditFieldOpen}
          setIsEditFieldOpen={setIsEditFieldOpen}
        />
        {/* Delete Confirmation Modal */}
{isDeleteModuleOpen && (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <div className="relative w-[550px] h-[234px] pt-2.5 bg-white rounded-xl shadow-[0px_8px_36px_0px_rgba(0,0,0,0.16)] flex-col justify-center items-center overflow-hidden">
      
      {/* Close (Cross) Icon at Top Right */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleDeleteModuleCancel}
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
          Delete Module
        </div>
      </div>
      <div className="self-stretch h-[66px] px-6 py-2 flex flex-col justify-start items-center gap-2.5">
        <div className="text-center text-[#9794aa] text-sm font-normal font-['Inter'] leading-tight">
          Are you sure you want to delete this module?
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
            Note: This will delete all the fields under this module.
          </div>
        </div>
      </div>
      <div className="self-stretch px-6 pt-4 pb-6 flex justify-center items-center gap-4">
        <div
          className="w-52 h-[42px] px-4 py-1.5 bg-[#6938ef] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleDeleteModuleConfirm}
        >
          <div className="text-center text-white text-xs font-medium font-['Inter']">
            Confirm
          </div>
        </div>
        <div
          className="w-52 h-[42px] px-4 py-1.5 rounded-lg border border-[#6938ef] flex justify-center items-center cursor-pointer"
          onClick={handleDeleteModuleCancel}
        >
          <div className="text-center text-[#6938ef] text-xs font-medium font-['Inter']">
            Cancel
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{isDeleteFieldOpen && (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <div className="relative w-[550px] h-[234px] pt-2.5 bg-white rounded-xl shadow-[0px_8px_36px_0px_rgba(0,0,0,0.16)] flex-col justify-center items-center overflow-hidden">
      
      {/* Close (Cross) Icon at Top Right */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleDeleteFieldCancel}
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
          Delete Field
        </div>
      </div>
      <div className="self-stretch h-[66px] px-6 py-2 flex flex-col justify-start items-center gap-2.5">
        <div className="text-center text-[#9794aa] text-sm font-normal font-['Inter'] leading-tight">
          Are you sure you want to delete this field?
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
            Note: This will delete all the data related to this field.
          </div>
        </div>
      </div>
      <div className="self-stretch px-6 pt-4 pb-6 flex justify-center items-center gap-4">
        <div
          className="w-52 h-[42px] px-4 py-1.5 bg-[#6938ef] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleDeleteFieldConfirm}
        >
          <div className="text-center text-white text-xs font-medium font-['Inter']">
            Confirm
          </div>
        </div>
        <div
          className="w-52 h-[42px] px-4 py-1.5 rounded-lg border border-[#6938ef] flex justify-center items-center cursor-pointer"
          onClick={handleDeleteFieldCancel}
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

export default AccountInformation;

