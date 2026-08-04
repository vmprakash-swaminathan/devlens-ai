import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import EmbeddedAIChat from "../../components/Repository/EmbeddedAIChat";

function AIChat() {
  const { repoId } = useParams();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto", height: "calc(100vh - 110px)" }}>
        <EmbeddedAIChat
          repoId={repoId}
          isFullPage={true}
          onBack={() => navigate(-1)}
        />
      </div>
    </MainLayout>
  );
}

export default AIChat;
