import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Spinner from '../widgets/Spinner';
import PrivateRoute from './PrivateRoute';
import * as LazyComponents from './lazyComponents';
import { ErrorBoundary } from 'react-error-boundary';
import Profile from '../components/profile/Profile';

const AppRouter: React.FC = () => {
  const LoadingFallback = <Spinner type="hash" size={50} color="#d0052d" />;

  // Error Fallback komponenti
  const ErrorFallback = () => (
    <div>
      <h2>Bir hata oluştu</h2>
      <button onClick={() => window.location.reload()}>Yenile</button>
    </div>
  );

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/*" element={
        <Suspense fallback={LoadingFallback}>
          <LazyComponents.Auth />
        </Suspense>
      } />
      <Route path="/forgotpassword/*" element={
        <Suspense fallback={LoadingFallback}>
          <LazyComponents.ForgotPassword />
        </Suspense>
      } />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/dashboards" />} />
        
        {/* Dashboards */}
        <Route path="/dashboards/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Dashboards />
          </Suspense>
        } />

        {/* Appointments */}
        <Route path="/appointments/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Appointments />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.AppointmentsTable />} />
          <Route path="create" element={<LazyComponents.AppointmentsCreate />} />
          <Route path="detail/:id" element={<LazyComponents.AppointmentsDetail />} />
        </Route>

        {/* Companies */}
        <Route path="/companies/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Companies />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.CompaniesTable />} />
          <Route path="create" element={<LazyComponents.CompaniesCreate />} />
          <Route path="detail/:id" element={<LazyComponents.CompaniesDetail />} />
        </Route>

        {/* Contacts */}
        <Route path="/contacts/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Contacts />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.ContactsTable />} />
          <Route path="create" element={<LazyComponents.ContactsCreate />} />
          <Route path="detail/:id" element={<LazyComponents.ContactsDetail />} />
        </Route>

        {/* Contracts */}
        <Route path="/contracts/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Contracts />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.ContractsTable />} />
        </Route>

        {/* Emails */}
        <Route path="/emails/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Emails />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.EmailsTable />} />
          <Route path="create" element={<LazyComponents.EmailsCreate />} />
          <Route path="detail/:id" element={<LazyComponents.EmailsDetail />} />
        </Route>

        {/* Goals */}
        <Route path="/goals/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Goals />
          </Suspense>
        } />

        {/* Interested Products */}
        <Route path="/interestedproducts/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.InterestedProducts />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.InterestedProductsTable />} />
          <Route path="create" element={<LazyComponents.InterestedProductsCreate />} />
          <Route path="detail/:id" element={<LazyComponents.InterestedProductsDetail />} />
        </Route>

        {/* Leads */}
        <Route path="/leads/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Leads />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.LeadsTable />} />
          <Route path="create" element={<LazyComponents.LeadsCreate />} />
          <Route path="detail/:id" element={<LazyComponents.LeadsDetail />} />
        </Route>

        {/* Offers */}
        <Route path="/offers/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Offers />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.OffersTable />} />
          <Route path="create" element={<LazyComponents.OffersCreate />} />
          <Route path="detail/:id" element={<LazyComponents.OffersDetail />} />
        </Route>

        {/*SalesOrder */}
        <Route path="/salesorders/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.SalesOrder />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.SalesOrderTable />} />
          <Route path="detail/:id" element={<LazyComponents.SalesOrderDetail />} /> 
        </Route>

        {/*BranchInformation */}
        <Route path="/branchinformation/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.BranchInformations />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.BranchInformationsTable />} />
          <Route path="detail/:id" element={<LazyComponents.BranchInformationsDetail />} /> 
        </Route>

        {/* QuoteDetails */}
        <Route path="/quotedetails/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.QuoteDetails />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.QuoteDetailsTable />} />
          <Route path="create" element={<LazyComponents.QuoteDetailsCreate />} />
          <Route path="detail/:id" element={<LazyComponents.QuoteDetailsDetail />} />
        </Route>

        {/* Opportunities */}
        <Route path="/opportunities/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Opportunities />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.OpportunitiesTable />} />
          <Route path="create" element={<LazyComponents.OpportunitiesCreate />} />
          <Route path="detail/:id" element={<LazyComponents.OpportunitiesDetail />} />
        </Route>

        {/* Phones */}
        <Route path="/phones/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Phones />
          </Suspense>
        }>
          <Route path="" element={<LazyComponents.PhonesTable />} />
          <Route path="create" element={<LazyComponents.PhonesCreate />} />
          <Route path="detail/:id" element={<LazyComponents.PhonesDetail />} />
        </Route>

        {/* Tasks */}
        <Route path="/tasks/*" element={
          <Suspense fallback={LoadingFallback}>
            <LazyComponents.Tasks />
          </Suspense>
        }/>

        {/* Profile */}
        <Route path="/profile/*" element={
          <Suspense fallback={LoadingFallback}>
            <ErrorBoundary 
              FallbackComponent={ErrorFallback}
              onError={(error) => {
                console.error('Profile error:', error);
                window.location.href = '/';
              }}
            >
              <Profile />
            </ErrorBoundary>
          </Suspense>
        } />
      </Route>

      {/* Error Routes */}
      <Route path="*" element={
        <Suspense fallback={LoadingFallback}>
          <LazyComponents.NotFound />
        </Suspense>
      } />
      
      <Route path="/error" element={
        <Suspense fallback={LoadingFallback}>
          <LazyComponents.ErrorBoundary children={undefined} />
        </Suspense>
      } />
    </Routes>
  );
};

export default AppRouter;
