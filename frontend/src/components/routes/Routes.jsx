import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";

import App from "../../App"; // ✅ Import your App.jsx here

import Landing from "../landingPage/Landing";
import ReviewForm from "../landingPage/ReviewForm";
import HeaderDisplay from "../landingPage/Header";
import CustomPhoto from "../landingPage/CustomPhoto";
import FooterDisplay from "../landingPage/Footer";
import PrivacyPolicyDisplay from "../landingPage/PrivacyPolicy";
import RefundPolicyDisplay from "../landingPage/RefundPolicyDisplay";

import Login from "../adminPanel/LoginPage";

import HeaderEditor from "../adminPanel/HeaderEditor";
import FooterEditor from "../adminPanel/FooterEditor";
import LogoEditor from "../adminPanel/LogoEditor";
import SocialEditor from "../adminPanel/SocialEditor";

import AboutEditor from "../adminPanel/AboutEditor";
import HeroEditor from "../adminPanel/HeroEditor";
import GalleryEditor from "../adminPanel/GalleryEditor";
import CustomPhotoDisplay from "../adminPanel/CustomPhotoDisplay";
import FaqEditor from "../adminPanel/FaqEditor";
import ContactList from "../adminPanel/ContactList";
import ReviewDisplay from "../adminPanel/ReviewDisplay";

import PrivacyPolicyEditor from "../adminPanel/PrivacyPolicyEditor";
import RefundPolicyEditor from "../adminPanel/RefundPolicyEditor";

import PaymentQREditor from "../adminPanel/PaymentQREditor";
import PurchaseRequests from "../adminPanel/PurchaseRequests";

import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardLayout from "../routes/DashboardLayout";
import ChangePassword from "../adminPanel/ChangePassword";
import Dashboard from "../adminPanel/Dashboard";
import MemberDetails from "../adminPanel/MemberEditor";
import GalleryDisplay from "../landingPage/Gallery";
import DonationQRDisplay from "../landingPage/DonationQRDisplay";
import MembersDisplay from "../adminPanel/MembersDisplay";
import LiveAartiDisplay from "../landingPage/LiveAartiDisplay";
import LiveAartiEditor from "../adminPanel/LiveAartiEditor";
import DonorListEditor from "../adminPanel/DonorListEditor";
import DonorListDisplay from "../landingPage/DonorListDisplay";
import AartiTimingEditor from "../adminPanel/AartiTimingEditor";

const routermain = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
       <Route path="/home" element={<Landing />} />
      <Route path="/admin" element={<Login />} />
      <Route path="/gallery" element={<GalleryDisplay />} />
      <Route path="/donate" element={<DonationQRDisplay />} />
      <Route path="/members" element={<MembersDisplay />} />
      <Route path="/aarti" element={<LiveAartiDisplay />} />
      <Route path="/donor-list" element={<DonorListDisplay />} />
      <Route
        path="/review"
        element={
          <>
            <HeaderDisplay />
            <ReviewForm />
            <FooterDisplay />
          </>
        }
      />
      <Route
        path="/sketch"
        element={
          <>
            <HeaderDisplay />
            <CustomPhoto />
            <FooterDisplay />
          </>
        }
      />
      <Route
        path="/privacypolicy"
        element={
          <>
            <HeaderDisplay />
            <PrivacyPolicyDisplay />
            <FooterDisplay />
          </>
        }
      />
      <Route
        path="/refundpolicy"
        element={
          <>
            <HeaderDisplay />
            <RefundPolicyDisplay />
            <FooterDisplay />
          </>
        }
      />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/header-editor" element={<HeaderEditor />} />
          <Route path="/admin/member-editor" element={<MemberDetails />} />
          <Route path="/admin/footer-editor" element={<FooterEditor />} />
          <Route path="/admin/logo-editor" element={<LogoEditor />} />
          <Route path="/admin/social-editor" element={<SocialEditor />} />
          <Route path="/admin/about-editor" element={<AboutEditor />} />
          <Route path="/admin/hero-editor" element={<HeroEditor />} />
          <Route path="/admin/gallery-editor" element={<GalleryEditor />} />
          <Route
            path="/admin/custom-photo-display"
            element={<CustomPhotoDisplay />}
          />
          <Route path="/admin/faq-editor" element={<FaqEditor />} />
          <Route path="/admin/contact-list" element={<ContactList />} />
          <Route path="/admin/review-display" element={<ReviewDisplay />} />
          <Route
            path="/admin/privacy-policy-editor"
            element={<PrivacyPolicyEditor />}
          />
          <Route
            path="/admin/refund-policy-editor"
            element={<RefundPolicyEditor />}
          />
          <Route path="/admin/paymentqr-editor" element={<PaymentQREditor />} />
          <Route
            path="/admin/purchase-requests"
            element={<PurchaseRequests />}
          />
          <Route
            path="/admin/live-aarti-editor"
            element={<LiveAartiEditor />}
          />
          <Route
            path="/admin/donor-list-editor"
            element={<DonorListEditor />}
          />
          <Route path="/admin/change-password" element={<ChangePassword />} />
           <Route path="/admin/aarti-timing-editor" element={<AartiTimingEditor />} />
        </Route>
      </Route>
    </Route>
  )
);

export default routermain;
