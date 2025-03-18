import Layout from '../Layout';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';

const Accounts = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            const response = await axios.get(`${BASE_URL}/accounts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            const accounts = response.data;
            const columnsSet = new Set();
            const formattedData = accounts.map(accounts => {
                const accountData = {};
                for (const moduleKey in accounts.moduleDataMap) {
                    const fieldData = accounts.moduleDataMap[moduleKey].fieldData;
                    for (const fieldKey in fieldData) {
                        columnsSet.add(fieldKey);
                        accountData[fieldKey] = fieldData[fieldKey];
                    }
                }
                return accountData;
            });

            if (formattedData.length == 0) {
                const hardcodedData = [
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "mathworks.com",
                        "Company Name": "mathworks",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    },
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "navi.com",
                        "Company Name": "navi",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    },
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "mathworks.com",
                        "Company Name": "mathworks",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    },
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "navi.com",
                        "Company Name": "navi",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    },
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "mathworks.com",
                        "Company Name": "mathworks",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    },
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "navi.com",
                        "Company Name": "navi",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    },
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "mathworks.com",
                        "Company Name": "mathworks",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    },
                    {
                        "Account Owner": "nca10@iitbbs.ac.in",
                        "Account ID": "navi.com",
                        "Company Name": "navi",
                        "MRR (In USD)": "6",
                        "Account Stage": "Stage 1",
                        "Account Category": "Category 1",
                        "Created At (In yyyy-mm-dd format)": "2024-01-12"
                    }
                ];
                const columnsSet = new Set(Object.keys(hardcodedData[0]));
                setColumns(Array.from(columnsSet));
                setData(hardcodedData);
            } else {
                setColumns(Array.from(columnsSet));
                setData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center gap-[15px] flex-1 self-stretch mt-[15px] pl-[0px]">
        <div className="self-stretch px-8 py-3 inline-flex justify-between items-center">
            <div className="inline-flex flex-col justify-center items-start gap-[4px]">
                <div className="justify-center text-stone-950 text-[22px] font-medium font-['Inter']">Accounts</div>
                <div className="justify-center text-neutral-700 text-sm font-normal font-['Inter']">Manage user roles and access.</div>
            </div>
            <div className="flex justify-start items-top gap-3.5">
                <div className="h-9 px-2.5 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center gap-[3px]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Add">
                        <path id="Vector" d="M9 3V15" stroke="#6938EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_2" d="M3 9H15" stroke="#6938EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                    </svg>
                    <div className="justify-start text-violet-600 text-sm font-medium font-['Inter']">Add Account</div>
                </div>
                <div className="h-9 px-2.5 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center gap-[3px]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Add">
                        <path id="Vector" d="M9 3V15" stroke="#6938EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_2" d="M3 9H15" stroke="#6938EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                    </svg>
                    <div className="justify-start text-violet-600 text-sm font-medium font-['Inter']">Add Contact</div>
                </div>
            </div>
        </div>
        <div className="self-stretch px-8 inline-flex justify-between items-center">
            <div className="h-9 pl-3.5 pr-3 py-5 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-start items-center gap-2">
                <div className="justify-center text-stone-950 text-sm font-medium font-['Inter']">Default View</div>
                <div className="w-6 h-6 relative">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Frame">
                    <path id="Vector" d="M6 9.00005L12 15L18 9" stroke="#49475A" stroke-width="1.5" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    </svg>
                </div>
            </div>
            <div className="flex justify-start items-center gap-3">
                <div className="w-72 h-9 pl-2 pr-2.5 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-start items-center gap-[3px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="search">
                    <path id="Icon" d="M13.3891 13.3891L19 19M9.5 15C12.5376 15 15 12.5376 15 9.5C15 6.46243 12.5376 4 9.5 4C6.46243 4 4 6.46243 4 9.5C4 12.5376 6.46243 15 9.5 15Z" stroke="#454545" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    </svg>
                    <div className="flex justify-start items-center gap-2">
                        <div className="justify-start text-zinc-500 text-sm font-normal font-['Inter']">Search Field Name</div>
                    </div>
                </div>
                <div className="h-9 px-2.5 py-3 opacity-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center gap-[3px]">
                    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Group 47292">
                        <path id="Vector" d="M1 1H17" stroke="#454545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_2" d="M15 6H3" stroke="#454545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_3" d="M5 11H13" stroke="#454545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                    </svg>
                    <div className="justify-start text-zinc-500 text-sm font-medium font-['Inter']">Filter</div>
                </div>
                <div className="h-9 px-2.5 py-3 opacity-50 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-red-600 flex justify-center items-center gap-[3px]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Delete">
                        <path id="Vector" d="M14.625 4.125L14.1602 11.6438C14.0414 13.5648 13.9821 14.5253 13.5006 15.2159C13.2625 15.5573 12.956 15.8455 12.6005 16.062C11.8816 16.5 10.9192 16.5 8.99452 16.5C7.06734 16.5 6.10372 16.5 5.38429 16.0612C5.0286 15.8443 4.722 15.5556 4.48401 15.2136C4.00266 14.5219 3.94459 13.5601 3.82846 11.6364L3.375 4.125" stroke="#F0272A" stroke-linecap="round"/>
                        <path id="Vector_2" d="M2.25 4.125H15.75M12.0418 4.125L11.5298 3.0688C11.1897 2.3672 11.0196 2.01639 10.7263 1.79761C10.6612 1.74908 10.5923 1.7059 10.5203 1.66852C10.1954 1.5 9.80558 1.5 9.02588 1.5C8.2266 1.5 7.827 1.5 7.49676 1.67559C7.42357 1.71451 7.35373 1.75943 7.28797 1.80988C6.99123 2.03753 6.82547 2.40116 6.49396 3.12844L6.03969 4.125" stroke="#F0272A" stroke-linecap="round"/>
                        <path id="Vector_3" d="M7.125 12.375V7.875" stroke="#F0272A" stroke-linecap="round"/>
                        <path id="Vector_4" d="M10.875 12.375V7.875" stroke="#F0272A" stroke-linecap="round"/>
                        </g>
                    </svg>
                    <div className="justify-start text-red-600 text-sm font-medium font-['Inter']">Discard</div>
                </div>
                <div className="flex gap-[1px] flex-1 self-stretch">
                    <div className="h-9 px-2.5 py-3 bg-violet-600 rounded-tl-lg rounded-bl-lg inline-flex justify-center items-center gap-[3px]">
                        <div className="justify-start text-white text-sm font-medium font-['Inter']">Save View</div>
                    </div>
                    <div className="px-2 py-2 bg-violet-600 rounded-tr-lg rounded-br-lg border-r border-white/80">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Frame">
                        <path id="Vector" d="M4.5 6.75004C4.5 6.75004 7.81418 11.25 9 11.25C10.1859 11.25 13.5 6.75 13.5 6.75" stroke="white" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full max-w-[1225px] overflow-x-auto rounded-xl">
            <div className="min-w-max">
                <div className="w-full px-[2px] py-[2px] inline-flex flex-col justify-start items-start gap-5">
                <div className="self-stretch rounded-xl outline outline-1 outline-zinc-100 inline-flex justify-start items-start gap-px overflow-hidden">
                    <div className="flex flex-nowrap justify-start items-center gap-px">
                    {/* Fixed first column */}
                    <div className="w-12 self-stretch border-r border-zinc-100 inline-flex flex-col justify-start items-start">
                        <div className="self-stretch h-[48px] p-3.5 bg-neutral-100" />
                        <div className="self-stretch flex flex-col justify-start items-start">
                        {data.map((item, index) => (
                            <div
                            key={index}
                            className="self-stretch h-[41px] px-3.5 py-2.5 bg-white border-b border-zinc-100 inline-flex justify-center items-center overflow-hidden"
                            >
                            <div className="text-zinc-600 text-sm font-normal font-['Inter']">
                                {index + 1}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Other columns */}
                    {columns.map((column) => (
                        <div
                        key={column}
                        className="min-w-[390px] border-r border-zinc-100 inline-flex flex-col justify-start items-start"
                        >
                        <div className="self-stretch p-3.5 bg-neutral-100 inline-flex justify-start items-center gap-[3px]">
                            <div className="flex justify-center items-center gap-2.5">
                            <div className="text-stone-950 text-sm font-medium font-['Inter']">
                                {column}
                            </div>
                            </div>
                            <div className="w-3 h-4 relative">
                            <svg
                                width="12"
                                height="15"
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="Frame">
                                <path
                                    id="Vector"
                                    d="M8.99998 8C8.99998 8 6.79053 11 5.99998 11C5.20943 11 3 8 3 8"
                                    stroke="#101010"
                                    strokeOpacity="0.8"
                                    strokeWidth="0.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                </g>
                            </svg>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start">
                            {data.map((item, index) => (
                            <div
                                key={index}
                                className="self-stretch px-3.5 py-[10.1px] bg-white border-b border-zinc-100 inline-flex justify-start items-center"
                            >
                                <div
                                data-property-1="Default"
                                className="flex-1 flex justify-start items-center gap-[3px]"
                                >
                                <div className="flex justify-start items-center gap-5">
                                    <div className="text-zinc-600 text-sm font-normal font-['Inter']">
                                    {item[column]}
                                    </div>
                                </div>
                                <div className="p-[2.50px] opacity-0 rounded-[83.33px] outline outline-[0.83px] outline-offset-[-0.83px] flex justify-center items-center gap-[2.50px]">
                                    <div className="w-3.5 h-3.5 relative">
                                    <div className="w-2.5 h-2.5 absolute left-[2.50px] top-[2.50px] outline outline-[0.83px] outline-offset-[-0.42px] outline-violet-600" />
                                    <div className="w-1 h-0 absolute left-[6.88px] top-[12.50px] outline outline-[0.83px] outline-offset-[-0.42px] outline-violet-600" />
                                    </div>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
      </div>
    </Layout>
  );
};

export default Accounts;
