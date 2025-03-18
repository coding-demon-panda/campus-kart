import Layout from '../../Layout';
import { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config';

const AccountDataUpload = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [lastFileName, setLastFileName] = useState('');
  
  const handleUploadClick = () => {
    document.getElementById('fileInput').click();
  }
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      setIsModalOpen(true);
      setIsUploading(true);

      const token = sessionStorage.getItem("authToken");
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${BASE_URL}/accounts/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
          }
        }, 200);
      }
      catch (error) {
        console.error('There was problem with the upload operation:', error);
        setIsUploading(false);
      }
    } else {
      alert('Please upload a valid CSV file.');
    }

    event.target.value = '';
  }
  const handleCloseUploadModal = () => {
    setLastFileName(fileName);
    setIsModalOpen(false);
    setUploadProgress(0);
    setFileName('');
  }

  const handleDownloadClick = async () => {
    const token = sessionStorage.getItem("authToken"); 
  
    try {
      const response = await axios.get(`${BASE_URL}/accounts/csv`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/csv',
        },
        responseType: 'blob', // ✅ Necessary for file downloads
      });
  
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'accounts_data.csv'; // Match the filename from the response
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('There was a problem with the file download:', error);
    }
  }; 
  
  const handleDownloadErrorFile = async () => {

  };

  return (
    <Layout>
      <div className="mainFrame">
        <div className="rnpUpper">
          <div className="rnpUpperDiv1">
            <Link to="/settings" className="rnpUpperDiv11">Settings</Link>
            <span className="rnpUpperDiv12">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.3334 8.00033L4.66669 2.66699V13.3337L11.3334 8.00033Z" fill="#737373"/>
              </svg>
            </span>
            <span className="rnpUpperDiv13">Account Data Upload</span>
          </div>
          
          <div className="self-stretch inline-flex justify-start items-center gap-6">
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
              <div className="rnpUpperDiv2">
                <Link to="/settings" className="rnpUpperDiv2IconOuter">
                  <div className="rnpUpperDiv2Icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1.00012 5H13" stroke="#101010" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4.99998 1C4.99998 1 1.00001 3.94598 1 4.99998C0.99999 6.05407 4.99998 8.99995 4.99998 8.99995" stroke="#101010" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </Link>
                <h1 className="rnpUpperDiv2Text">Account Data Upload</h1>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 justify-center text-neutral-700 text-sm font-normal font-['Inter']">Import your existing accounts in bulk for seamless and efficient account management.</div>
              </div>
            </div>
            <button onClick={() => { navigate("/accounts") }} className="px-2.5 py-3 bg-violet-600 rounded-lg flex justify-center items-center gap-[3px]">
              <div className="justify-start text-white text-sm font-[400] font-['Inter']">See Uploaded Data</div>
            </button>
          </div>

          <div className="w-[100%] px-8 py-2.5 bg-neutral-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-center items-start gap-[5px] font-['Inter'] text-[12px] font-normal leading-[180%]">
              <div className="pb-[3px] justify-center text-stone-950 text-xs font-medium font-['Inter']">Instructions:</div>
              <div className="justify-center text-zinc-700 text-xs font-normal font-['Inter'] leading-[22px]">
                &nbsp;1. &nbsp;Download CSV file containing existing data if available in the system, or a blank template if no data exists.
                <br/>
                &nbsp;2. &nbsp;Enter data into the CSV file according to the defined field types or update the existing data.
                <br/>
                &nbsp;3. &nbsp;Adding Mandatory fields is compulsory. 
                <br/>
                &nbsp;4. &nbsp;Upload the spreadsheet and see the magic.
              </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col align-top justify-start mt-4">
        <div className="self-stretch px-8 py-7 bg-white border-t border-zinc-100 inline-flex flex-col justify-start items-center gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-7">
            <div className="self-stretch pl-2.5 pr-4 py-5 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-start items-center gap-7">
              <div className="flex-1 flex justify-start items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.75 19.2812V6.15625M15.75 19.2812C14.831 19.2812 13.1139 16.6637 12.4688 16M15.75 19.2812C16.669 19.2812 18.3862 16.6637 19.0312 16" stroke="#6938EF" stroke-width="1.96875" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M26.25 21.9062C26.25 25.1639 25.5701 25.8438 22.3125 25.8438H9.1875C5.92987 25.8438 5.25 25.1639 5.25 21.9062" stroke="#6938EF" stroke-width="1.96875" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-[5px]">
                  <div className="self-stretch justify-center text-stone-950 text-lg font-medium font-['Inter']">Download CSV file</div>
                  <div className="self-stretch justify-center text-zinc-400 text-xs font-normal font-['Inter']">You can download the attached example and use them as a starting point for your own file. </div>
                </div>
              </div>
              <button
                onClick={handleDownloadClick}
              >
                <div className="px-2.5 py-3 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center gap-[3px]">
                  <div className="justify-start text-violet-600 text-sm font-medium font-['Inter']">Download</div>
                </div>
              </button>
            </div>
          </div>
          <div className="self-stretch h-80 p-10 bg-neutral-50 rounded-2xl outline-1 outline-[#d6d6d6] outline-dashed outline-offset-[-0.50px] inline-flex flex-col justify-center items-center gap-5">
            <div className="w-32 h-25 relative overflow-hidden">
              <img src="/spreadsheet.png" alt="spreadsheet" />
            </div>
            <div className="justify-center text-stone-950 text-base font-normal font-['Inter']">Import from Spreadsheet</div>
            <div className="flex flex-col justify-start items-center gap-1.5">
              <button
                onClick={handleUploadClick}
              >
                <div className="h-10 px-5 py-3 bg-violet-600 rounded-md inline-flex justify-center items-center gap-2.5 overflow-hidden">
                    <div className="justify-start text-white text-sm font-medium font-['Inter']">Upload CSV File</div>
                </div>
              </button>
              <div className="text-right justify-center text-neutral-700 text-xs font-normal font-['Inter']">Maximum size : 25MB</div>
            </div>
          </div>

          {lastFileName && (
          <div className="self-stretch inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch inline-flex justify-start items-center gap-36">
                <div className="text-right justify-center text-stone-950 text-base font-normal font-['Inter']">Last Uploaded File</div>
            </div>
            <div className="self-stretch pl-2.5 pr-4 py-5 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-start items-center gap-7">
              <div className="flex-1 flex justify-start items-center gap-[12px]">
                <svg width="21" height="26" viewBox="0 0 21 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="21" height="26" fill="#303030"/>
                <g id="Account Data Uploaded files" clip-path="url(#clip0_0_1)">
                <rect width="1440" height="1030" transform="translate(-277 -917)" fill="white"/>
                <g id="Dashboard Left Content">
                <g id="Account Data Upload">
                <rect width="1211" height="608" transform="translate(-48 -544)" fill="white"/>
                <g id="ADU Inside ">
                <g id="Frame 1171276443">
                <g id="Sample" filter="url(#filter0_d_0_1)">
                <path d="M-15.5 -13C-15.5 -21.0081 -9.00813 -27.5 -1 -27.5H1116C1124.01 -27.5 1130.5 -21.0081 1130.5 -13V39C1130.5 47.0081 1124.01 53.5 1116 53.5H-0.999973C-9.0081 53.5 -15.5 47.0081 -15.5 39V-13Z" stroke="#F0F0F0" shape-rendering="crispEdges"/>
                <g id="Download+Content">
                <g id="Frame" filter="url(#filter1_d_0_1)">
                <path id="Vector" d="M11.8671 23.6154V23.0567C11.8671 19.8963 11.8671 18.3161 12.849 17.3342C13.8309 16.3524 15.4111 16.3524 18.5715 16.3524H19.1302M19.6889 14.5009V10.7654C19.6889 6.55138 19.6889 4.4444 18.3798 3.13528C17.0707 1.82617 14.9637 1.82617 10.7497 1.82617C6.53577 1.82617 4.42878 1.82617 3.11966 3.13528C1.81055 4.44439 1.81055 6.55138 1.81055 10.7654V15.843C1.81055 19.469 1.81055 21.282 2.80064 22.51C3.00067 22.7581 3.22664 22.984 3.47472 23.184C4.70272 24.1741 6.51571 24.1741 10.1416 24.1741C10.9301 24.1741 11.3242 24.1741 11.6852 24.0468C11.7603 24.0203 11.8338 23.9898 11.9057 23.9555C12.2511 23.7902 12.5298 23.5115 13.0872 22.9541L18.3798 17.6615C19.0257 17.0155 19.3487 16.6926 19.5189 16.2818C19.6889 15.8712 19.6889 15.4144 19.6889 14.5009Z" stroke="#6938EF" stroke-width="1.6761" stroke-linecap="round" stroke-linejoin="round"/>
                <path id="Vector_2" d="M6.8125 8.07812H14.6875" stroke="#6938EF" stroke-width="1.6761" stroke-linecap="round" stroke-linejoin="round"/>
                <path id="Vector_3" d="M6.8125 12.0156H10.75" stroke="#6938EF" stroke-width="1.6761" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                </g>
                </g>
                </g>
                </g>
                </g>
                </g>
                </g>
                <defs>
                <filter id="filter0_d_0_1" x="-31" y="-39" width="1177" height="112" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="7.5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
                </filter>
                <filter id="filter1_d_0_1" x="-16.25" y="-11" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="3"/>
                <feGaussianBlur stdDeviation="5.625"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
                </filter>
                <clipPath id="clip0_0_1">
                <rect width="1440" height="1030" fill="white" transform="translate(-277 -917)"/>
                </clipPath>
                </defs>
                </svg>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-[5px]">
                  <div className="self-stretch justify-center text-stone-950 text-lg font-medium font-['Inter']">{lastFileName}</div>
                  <div className="self-stretch justify-center text-zinc-400 text-xs font-normal font-['Inter']">Uploaded on {new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</div>
                </div>
              </div>
              <div className="flex-1 h-10" />
            </div>
          </div>
          ) }
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="w-[550px] p-10 bg-neutral-50 rounded-2xl outline-1 outline-dashed outline-offset-[-0.50px] outline-zinc-300 inline-flex flex-col justify-center items-center gap-5">
            <div className="w-[500px] px-6 py-2.5 flex flex-col justify-start items-start overflow-hidden">
              <div className="self-stretch text-center justify-center text-black text-lg font-bold font-['Inter'] leading-normal">{isUploading ? 'Upload in progress...' : 'Upload Complete'}</div>
            </div>
            <div className="self-stretch pt-3.5 pb-4 bg-white rounded-xl outline-dashed outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-center gap-[5px] overflow-hidden">
              <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
                <div data-state="start" className="w-24 h-24 relative">
                  <svg className="w-24 h-24 left-0 top-0 absolute" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#D1D5DB" strokeWidth="7" fill="none" />
                    <circle cx="50" cy="50" r="45" stroke="#10B981" strokeWidth="7" fill="none" strokeDasharray="282.6" strokeDashoffset={282.6 - (uploadProgress / 100) * 282.6} transform="rotate(-90 50 50)"/>
                  </svg>
                </div>
                <div className="self-stretch text-center justify-center text-stone-950 text-sm font-normal font-['Inter']">
                  {isUploading ? `Uploading ${fileName}` : `Uploaded file ${fileName}`}
                </div>
              </div>
              {!isUploading && (
                <div className="flex flex-col">
                  <button onClick={ handleDownloadErrorFile } className="self-stretch text-center justify-center text-violet-600 text-sm mb-[20px] font-normal font-['Inter'] underline">Download error file</button>
                  <div className="self-stretch inline-flex justify-center items-start gap-2.5">
                    <button onClick={ handleCloseUploadModal } className="h-10 px-5 py-3 bg-violet-600 rounded-md flex justify-center items-center gap-2.5 overflow-hidden">
                        <div className="justify-start text-white text-xs font-medium font-['Inter']">Done</div>
                    </button>
                    <button onClick={() => { navigate("/accounts") }} className="h-10 px-5 py-3 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center gap-2.5 overflow-hidden">
                        <div className="justify-start text-violet-600 text-xs font-medium font-['Inter']">See Uploaded Data</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange} />
    </Layout>
  );
};

export default AccountDataUpload;