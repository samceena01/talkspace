import type { NextPage } from "next";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { Layout } from "../components/Display/Layout";

const Profile: NextPage = () => {
  useProtectedRoute();

  return (
    <Layout>
      <div>profile page</div>
    </Layout>
  );
};

export default Profile;
