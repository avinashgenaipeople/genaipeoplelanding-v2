import { useEffect } from "react";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { trackEvent } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    trackEvent("page_view_lander", { page_path: window.location.pathname });
  }, []);

  return <QuizFlow />;
};

export default Index;
