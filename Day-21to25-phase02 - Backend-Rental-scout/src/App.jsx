import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import InquiryPage from "./pages/InquiryPage.jsx";
import { useState } from "react";

function App() {
  const [savedIds, setSavedIds] = useState([]);

  function toggleSaved(listingId) {
    setSavedIds((currentIds) =>
      currentIds.includes(listingId)
        ? currentIds.filter((id) => id !== listingId)
        : [...currentIds, listingId],
    );
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/listings"
          element={
            <BrowsePage savedIds={savedIds} onToggleSaved={toggleSaved} />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedPage savedIds={savedIds} onToggleSaved={toggleSaved} />
          }
        />
        <Route path="/listings/:listingId" element={<DetailPage />} />
        <Route path="/listings/:listingId/apply" element={<InquiryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
