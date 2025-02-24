import { lazy } from 'react';

// Auth ve Layout
export const Auth = lazy(() => import('../auth/Auth'));
export const Login = lazy(() => import('../auth/Login'));
export const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
export const Navbar = lazy(() => import('../layout/Navbar'));
export const Sidebar = lazy(() => import('../layout/Sidebar'));
export const Content = lazy(() => import('../layout/Content'));

// Dashboards
export const Dashboards = lazy(() => import('../components/dashboards/Dashboards'));
export const DashboardDetail = lazy(() => import('../components/dashboards/DashboardDetail'));

// Appointments
export const Appointments = lazy(() => import('../components/appointments/Appointments'));
export const AppointmentsCreate = lazy(() => import('../components/appointments/AppointmentsCreate'));
export const AppointmentsDetail = lazy(() => import('../components/appointments/AppointmentsDetail'));
export const AppointmentsTable = lazy(() => import('../components/appointments/AppointmentsTable'));

// Companies
export const Companies = lazy(() => import('../components/companies/Companies'));
export const CompaniesCreate = lazy(() => import('../components/companies/CompaniesCreate'));
export const CompaniesDetail = lazy(() => import('../components/companies/CompaniesDetail'));
export const CompaniesTable = lazy(() => import('../components/companies/CompaniesTable'));

// Contacts
export const Contacts = lazy(() => import('../components/contacts/Contacts'));
export const ContactsCreate = lazy(() => import('../components/contacts/ContactsCreate'));
export const ContactsDetail = lazy(() => import('../components/contacts/ContactsDetail'));
export const ContactsTable = lazy(() => import('../components/contacts/ContactsTable'));

// Contracts
export const Contracts = lazy(() => import('../components/contracts/Contracts'));
export const ContractsDetail = lazy(() => import('../components/contracts/ContractsDetail'));
export const ContractsTable = lazy(() => import('../components/contracts/ContractsTable'));

// Emails
export const Emails = lazy(() => import('../components/emails/Emails'));
export const EmailsCreate = lazy(() => import('../components/emails/EmailsCreate'));
export const EmailsDetail = lazy(() => import('../components/emails/EmailsDetail'));
export const EmailsTable = lazy(() => import('../components/emails/EmailsTable'));

// Goals
export const Goals = lazy(() => import('../components/goals/Goals'));

// InterestedProducts
export const InterestedProducts = lazy(() => import('../components/interestedproducts/InterestedProducts'));
export const InterestedProductsCreate = lazy(() => import('../components/interestedproducts/InterestedProductsCreate'));
export const InterestedProductsDetail = lazy(() => import('../components/interestedproducts/InterestedProductsDetail'));
export const InterestedProductsTable = lazy(() => import('../components/interestedproducts/InterestedProductsTable'));

// Leads
export const Leads = lazy(() => import('../components/leads/Leads'));
export const LeadsCreate = lazy(() => import('../components/leads/LeadsCreate'));
export const LeadsDetail = lazy(() => import('../components/leads/LeadsDetail'));
export const LeadsTable = lazy(() => import('../components/leads/LeadsTable'));

// Offers
export const Offers = lazy(() => import('../components/offers/Offers'));
export const OffersCreate = lazy(() => import('../components/offers/OffersCreate'));
export const OffersDetail = lazy(() => import('../components/offers/OffersDetail'));
export const OffersTable = lazy(() => import('../components/offers/OffersTable'));

// QuoteDetails
export const QuoteDetails = lazy(() => import('../components/quotedetails/QuoteDetails'));
export const QuoteDetailsCreate = lazy(() => import('../components/quotedetails/QuoteDetailsCreate'));
export const QuoteDetailsDetail = lazy(() => import('../components/quotedetails/QuoteDetailsDetail'));
export const QuoteDetailsTable = lazy(() => import('../components/quotedetails/QuoteDetailsTable'));

// Opportunities
export const Opportunities = lazy(() => import('../components/opportunities/Opportunities'));
export const OpportunitiesCreate = lazy(() => import('../components/opportunities/OpportunitiesCreate'));
export const OpportunitiesDetail = lazy(() => import('../components/opportunities/OpportunitiesDetail'));
export const OpportunitiesTable = lazy(() => import('../components/opportunities/OpportunitiesTable'));

// Phones
export const Phones = lazy(() => import('../components/phones/Phones'));
export const PhonesCreate = lazy(() => import('../components/phones/PhonesCreate'));
export const PhonesDetail = lazy(() => import('../components/phones/PhonesDetail'));
export const PhonesTable = lazy(() => import('../components/phones/PhonesTable'));

// Profile
export const Profile = lazy(() => import('../components/profile/Profile'));

// Tasks
export const Tasks = lazy(() => import('../components/tasks/Tasks'));

// Error Pages
export const NotFound = lazy(() => import('../components/errorpage/NotFound'));
export const ErrorBoundary = lazy(() => import('../components/errorpage/ErrorBoundary'));

// Context Providers
export const AppContextProvider = lazy(() => import('../contexts/AppContext').then(module => ({
  default: module.AppContextProvider
}))); 