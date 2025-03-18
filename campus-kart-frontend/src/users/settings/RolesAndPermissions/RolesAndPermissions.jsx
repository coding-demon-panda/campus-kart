import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../Layout';

const RolesAndPermissions = () => {
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
            <span className="rnpUpperDiv13">Roles and Permission</span>
          </div>

          {/* Header */}
          <div className="rnpUpperDiv23">
            <div className="rnpUpperDiv2">
              <Link to="/settings" className="rnpUpperDiv2IconOuter">
                <div className="rnpUpperDiv2Icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1.00012 5H13" stroke="#101010" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.99998 1C4.99998 1 1.00001 3.94598 1 4.99998C0.99999 6.05407 4.99998 8.99995 4.99998 8.99995" stroke="#101010" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </Link>
              <h1 className="rnpUpperDiv2Text">Roles and Permission</h1>
            </div>
            <p className="rnpUpperDiv3">
              Use predefined roles with specific permissions to create users. Additional customization options will be available soon.
            </p>
          </div>
        </div>

        <div className="rnpLower">
          {/* Roles Table */}
          <div className="rnpTable">
              <div className="w-full h-[199px] rounded-xl border border-[#efefef] flex-col justify-start items-center gap-[3px] inline-flex overflow-hidden">
                <div className="self-stretch px-[25px] py-[13px] bg-[#f7f7f7] justify-start items-center gap-[315px] inline-flex">
                    <div className="w-[200px] text-[#0f0f0f]/80 text-[15px] font-normal font-['Inter']">Role </div>
                    <div className="w-[500px] text-[#0f0f0f]/80 text-[15px] font-normal font-['Inter']">Description</div>
                </div>
                <div className="self-stretch h-[148px] flex-col justify-start items-start flex">
                    <div className="self-stretch px-[25px] py-2.5 bg-white border-b border-[#efefef] justify-start items-center gap-[315px] inline-flex overflow-hidden">
                        <div className="w-[200px] text-[#5e5e5e] text-sm font-normal font-['Inter']">Owner</div>
                        <div className="text-[#5e5e5e] text-sm font-normal font-['Inter']">All organization-level permissions</div>
                    </div>
                    <div className="self-stretch px-[25px] py-2.5 bg-white border-b border-[#efefef] justify-start items-center gap-[315px] inline-flex overflow-hidden">
                        <div className="w-[200px] text-[#5e5e5e] text-sm font-normal font-['Inter']">Admin</div>
                        <div className="text-[#5e5e5e] text-sm font-normal font-['Inter']">All organization-level permissions except the ability to delete the owner.</div>
                    </div>
                    <div className="self-stretch px-[25px] py-2.5 bg-white border-b border-[#efefef] justify-start items-center gap-[315px] inline-flex overflow-hidden">
                        <div className="w-[200px] text-[#5e5e5e] text-sm font-normal font-['Inter']">Member</div>
                        <div className="text-[#5e5e5e] text-sm font-normal font-['Inter']">Can view all data, edit their assigned accounts, view but not edit others' data</div>
                    </div>
                    <div className="self-stretch px-[25px] py-2.5 pb-[14px] bg-white border-b justify-start items-center gap-[315px] inline-flex overflow-hidden">
                        <div className="w-[200px] text-[#5e5e5e] text-sm font-normal font-['Inter']">Viewer</div>
                        <div className="text-[#5e5e5e] text-sm font-normal font-['Inter']">Can view data but cannot create contacts, accounts, or use integrations.</div>
                    </div>
                </div>
            </div>
          </div>

          {/* Add Users Link */}
          <div className="rnpTableLower flex justify-center w-[100%]">
            <Link 
              to="/settings/users" 
              className="text-[#7C3AED] flex items-center gap-1"
            >
              <div className="rnpTableLowerText">
                Add Users
              </div> 
              <span className="rnpTableLowerIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M15.4999 10.209H5.49996" stroke="#6938EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12.5 7C12.5 7 15.8333 9.455 15.8333 10.3333C15.8334 11.2118 12.5 13.6667 12.5 13.6667" stroke="#6938EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RolesAndPermissions;