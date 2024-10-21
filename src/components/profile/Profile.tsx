import { Route, Routes } from "react-router-dom";
import ProfileDetail from "./ProfileDetail";

const Profile: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<ProfileDetail />} />
    </Routes>
  );
};

export default Profile;