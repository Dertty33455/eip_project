import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from './layouts/AdminLayout'
import { AppLayout } from './layouts/AppLayout'
import { RequireAdmin } from './routes/RequireAdmin'
import { RequireAuth } from './routes/RequireAuth'

import { AboutPage } from './pages/AboutPage'
import { AdminBooksPage } from './pages/admin/AdminBooksPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminReportsPage } from './pages/admin/AdminReportsPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AuthPage } from './pages/AuthPage'
import { BookDetailsPage } from './pages/BookDetailsPage'
import { BooksListPage } from './pages/BooksListPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HelpPage } from './pages/HelpPage'
import { HomePage } from './pages/HomePage'
import { MessagesPage } from './pages/MessagesPage'
import { MeetupPage } from './pages/MeetupPage'
import { MyListingsPage } from './pages/MyListingsPage'
import { OrdersPage } from './pages/OrdersPage'
import { PaymentPage } from './pages/PaymentPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { PublishBookPage } from './pages/PublishBookPage'
import { TermsPage } from './pages/TermsPage'
import { UserProfilePage } from './pages/UserProfilePage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="auth" element={<AuthPage />} />

        <Route path="books" element={<BooksListPage />} />
        <Route path="books/:bookId" element={<BookDetailsPage />} />

        <Route
          path="sell"
          element={
            <RequireAuth>
              <PublishBookPage />
            </RequireAuth>
          }
        />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <UserProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="messages"
          element={
            <RequireAuth>
              <MessagesPage />
            </RequireAuth>
          }
        />
        <Route
          path="my-listings"
          element={
            <RequireAuth>
              <MyListingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="favorites"
          element={
            <RequireAuth>
              <FavoritesPage />
            </RequireAuth>
          }
        />
        <Route
          path="payment"
          element={
            <RequireAuth>
              <PaymentPage />
            </RequireAuth>
          }
        />
        <Route
          path="orders"
          element={
            <RequireAuth>
              <OrdersPage />
            </RequireAuth>
          }
        />
        <Route
          path="meetup"
          element={
            <RequireAuth>
              <MeetupPage />
            </RequireAuth>
          }
        />

        <Route path="about" element={<AboutPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
      </Route>

      <Route
        path="admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="books" element={<AdminBooksPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
