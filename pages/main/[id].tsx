import { NextPage } from "next";
import { useRouter } from "next/router";
import { Layout } from "../../components/Display/Layout";
import { Thumbnail } from "../../components/Thumbnail/Thumbnail";
import { useDrawing } from "../../hooks/useDrawing";
import { useUser } from "../../hooks/useUser";

const SharedPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const drawing = useDrawing(id as string);
  const loggedUser = useUser();

  return (
    <Layout>
      {drawing ? (
        <Thumbnail
          onlyViewButton
          loggedUser={loggedUser as string}
          drawing={drawing}
        />
      ) : null}
    </Layout>
  );
};

export default SharedPage;
