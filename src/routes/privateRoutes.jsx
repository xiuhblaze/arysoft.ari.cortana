
import { 
    faBuilding,
    faCity,
    faFileCircleCheck,
    faHome,
    faLandmark,
    faMagnifyingGlass,
    faPuzzlePiece,
    faUsers
} from "@fortawesome/free-solid-svg-icons";

import { lazy } from "react";

const lazyDashboard = lazy(() => import('../views/Dashboard/Dashboard'));
const laztAudits = lazy(() => import('../views/audits'));
const lazyApplicants = lazy(() => import('../views/applicants'));
const lazyAuditors = lazy(() => import('../views/auditors'));
const lazyOrganizations = lazy(() => import('../views/organizations'));

const lazyADCConcepts = lazy(() => import('../views/adcConcepts'));
const lazyCatAuditorDocuments = lazy(() => import('../views/catAuditorDocuments'));
const lazyNacecodes = lazy(() => import('../views/nacecodes'));
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
        title: 'Audits',
        key: 'audits',
        path: '/audits/*',
        icon: faMagnifyingGlass,
        element: laztAudits
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
        title: 'ADC Concepts',
        key: 'adcConcepts',
        path: '/adc-concepts/*',
        icon: faPuzzlePiece,
        element: lazyADCConcepts
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