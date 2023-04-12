import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helper, ModuleController } from "../../../controllers/_Controllers";
import Questionnaire from "./Questionnaire";
import Result from "./Result";

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = Helper.getCurrentUser();
  const module = location.state.module;

  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState(null);


  useEffect(() => {

    async function getQuizResult () {

      let result = await ModuleController.getQuizResult(module.id, user.id);

      setResult(result);
      setLoaded(true);
    }

    if (!module) {
      navigate("/");
    }
    else {
      getQuizResult();
    }

  }, [module]);

  if(!loaded) return null;

  return (
    <>
      {
        result ? (
          <Result
            user={user}
            result={result}
            module={module}
          />
        ) : (
          <Questionnaire
            user={user}
            module={module}
            setResult={setResult}
          />
        )
      }
    </>
  );
}
