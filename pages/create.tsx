import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { Layout } from "../components/Display/Layout";

import DrawingBoard from "../components/Drawing/DrawingBoard";

const Create = () => {
  useProtectedRoute();

  return (
    <Layout>
      <DrawingBoard />
    </Layout>
  );
};

export default Create;
