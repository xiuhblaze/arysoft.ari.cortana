
import { 
    faBuilding,
    faCity,
    faFileCircleCheck,
    faHome,
    faLandmark,
    faUsers
} from "@fortawesome/free-solid-svg-icons";

import { lazy } from "react";

const lazyApplicants = lazy(() => import('../views/applicants'));
const lazyAuditors = lazy(() => import('../views/auditors'));
const lazyCatAuditorDocuments = lazy(() => import('../views/catAuditorDocuments'));
const lazyDashboard = lazy(() => import('../views/Dashboard/Dashboard'));
const lazyNacecodes = lazy(() => import('../views/nacecodes'));
const lazyOrganizations = lazy(() => import('../views/organizations'));
const lazyStandards = lazy(() => import('../views/standards'));

const privateRoute = [
    {
        type: 'collapse',
        title: 'Dashboard',
        key: 'dashboard',
        path: '/dashboard',
        icon: faHome,
        element: lazyDashboard
    },
    {
        type: 'collapse',
        title: 'Applicants',
        key: 'applicants',
        path: '/applicants/*',
        icon: faBuilding,
        element: lazyApplicants
    },
    {
        type: 'collapse',
        title: 'Auditors',
        key: 'auditors',
        path: '/auditors/*',
        icon: faUsers,
        element: lazyAuditors
    },
    {
        type: 'collapse',
        title: 'Organizations',
        key: 'organizations',
        path: '/organizations/*',
        icon: faCity,
        element: lazyOrganizations
    },
    {
        type: 'title',
        title: 'Catalogs',
        key: 'catalogs',
    },
    {
        type: 'collapse',
        title: 'Auditor Documents',
        key: 'catAuditorDocuments',
        path: '/auditors-documents/*',
        icon: faFileCircleCheck,
        element: lazyCatAuditorDocuments
    },
    {
        type: 'collapse',
        title: 'Standards',
        key: 'standards',
        path: '/standards/*',
        icon: faLandmark,
        element: lazyStandards
    },
    {
        type: 'collapse',
        title: 'NACE Codes',
        key: 'nacecodes',
        path: '/nace-codes/*',
        icon: faLandmark,
        element: lazyNacecodes
    },
    // {
    //   type: 'title',
    //   title: 'Account',
    //   key: 'account',
    // },
    // { 
    //   type: 'collapse',
    //   title: 'Profile',
    //   key: 'profile',
    //   path: '/profile',
    //   icon: faUserGear,
    //   element: <Profile />
    // },
];

export default privateRoute;