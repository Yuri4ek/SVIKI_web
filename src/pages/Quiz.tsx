import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clientService, authService, QuestionnaireDto } from "@/lib/api";
import { QUIZ_DATA, QuestionType } from "@/lib/constants";
import { ROUTES } from "@/lib/constants/routes";
import { useOnboardingStore, useUserStore, UserRole } from "@/lib/store";
import { quizStyles } from "@/styles";

const getVisibleQuestions = (
  questions: QuestionType[],
  answers: Record<string, string>,
): QuestionType[] => {
  let visible: QuestionType[] = [];
  questions.forEach((q) => {
    visible.push(q);
    const userAnswer = answers[q.id];

    if (q.subQuestions && userAnswer) {
      const activeSubQuestions = q.subQuestions.filter(
        (sub: QuestionType) =>
          !sub.triggerValue || sub.triggerValue === userAnswer,
      );

      if (activeSubQuestions.length > 0) {
        visible = [
          ...visible,
          ...getVisibleQuestions(activeSubQuestions, answers),
        ];
      }
    }
  });
  return visible;
};

export function QuizPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const { regData, clear } = useOnboardingStore();
  const login = useUserStore((state) => state.login);

  const visibleQuestions = useMemo(() => {
    return getVisibleQuestions(QUIZ_DATA, answers);
  }, [answers]);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isQuizComplete = () => {
    return visibleQuestions.every((q) => !!answers[q.id]);
  };

  const collectAndLogResults = async () => {
    if (isSending) return;

    if (!regData) {
      window.alert("Ошибка: Нет данных для регистрации. Вернитесь назад.");
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    try {
      setIsSending(true);

      const rawData = visibleQuestions.reduce(
        (acc, q) => {
          acc[q.id] = answers[q.id];
          return acc;
        },
        {} as Record<string, string>,
      );

      const mappedQuiz: Partial<QuestionnaireDto> = {
        hasActiveLoans: rawData["1"] === "Да",
        creditorsCount: rawData["1_1"],
        creditorsType: rawData["1_2"],
        hasGracePeriod: rawData["1_3"] === "Да",
        gracePeriodMonths: rawData["1_3_1"],
        hasMortgage: rawData["1_4"] === "Да",
        mortgageBalance: rawData["1_4_1"],
        hasCarLoan: rawData["1_5"] === "Да",
        carLoanBalance: rawData["1_5_1"],
        hasAdditionalProperty: rawData["2"] === "Да",
        hasCar: rawData["3"] === "Да",
        carValue: rawData["3_1"],
        isEmployed: rawData["4"] === "Да",
        hasFSSPDebt: rawData["5"] === "Да",
        fsspDebtAmount: rawData["5_1"],
        hasTaxDebt: rawData["6"] === "Да",
        taxDebtAmount: rawData["6_1"],
      };

      await authService.register(
        Number(regData.phone),
        regData.password,
        regData.role,
      );

      const loginRes = await authService.login(regData.phone, regData.password);

      const emptyQuiz = await clientService.getQuestionnaire();

      const finalPayload: QuestionnaireDto = {
        ...mappedQuiz,
        id: emptyQuiz.id,
        clientId: emptyQuiz.clientId,
        hasActiveLoans: mappedQuiz.hasActiveLoans || false,
        hasGracePeriod: mappedQuiz.hasGracePeriod || false,
        hasMortgage: mappedQuiz.hasMortgage || false,
        hasAdditionalProperty: mappedQuiz.hasAdditionalProperty || false,
        hasCar: mappedQuiz.hasCar || false,
        hasCarLoan: mappedQuiz.hasCarLoan || false,
        isEmployed: mappedQuiz.isEmployed || false,
        hasFSSPDebt: mappedQuiz.hasFSSPDebt || false,
        hasTaxDebt: mappedQuiz.hasTaxDebt || false,
      };

      await clientService.saveQuestionnaire(finalPayload);

      clear();
      login(loginRes.role as UserRole);
      navigate(ROUTES.MAIN, { replace: true });
    } catch (e: any) {
      console.error("Ошибка сохранения данных", e);

      let errorMsg = "Не удалось завершить регистрацию";

      if (e.response?.data) {
        if (typeof e.response.data === "string") {
          errorMsg = e.response.data;
        } else if (e.response.data.message) {
          errorMsg = e.response.data.message;
        } else if (e.response.data.errors) {
          errorMsg = Object.values(e.response.data.errors).flat().join("\n");
        }
      } else if (e.message) {
        errorMsg = e.message;
      }

      window.alert(`Внимание: ${errorMsg}`);
    } finally {
      setIsSending(false);
    }
  };

  const renderOption = (
    option: string,
    questionId: string,
    selectedValue: string,
  ) => {
    const isSelected = selectedValue === option;

    return (
      <button
        key={option}
        type="button"
        onClick={() => handleSelect(questionId, option)}
        className={`${quizStyles.optionButton} ${
          isSelected ? quizStyles.optionSelected : quizStyles.optionUnselected
        }`}
      >
        {option}
      </button>
    );
  };

  const renderQuestion = (item: QuestionType) => {
    const selectedValue = answers[item.id];
    const isChild = !!item.triggerValue;

    return (
      <div
        key={item.id}
        className={`${quizStyles.card} ${isChild ? quizStyles.cardChild : ""}`}
      >
        <h3 className={quizStyles.questionText}>{item.question}</h3>
        <div className={quizStyles.optionsContainer}>
          {item.options.map((opt) => renderOption(opt, item.id, selectedValue))}
        </div>
      </div>
    );
  };

  return (
    <main className={quizStyles.container}>
      <div className={quizStyles.contentContainer}>
        {visibleQuestions.map(renderQuestion)}
      </div>

      <footer className={quizStyles.footer}>
        <div className={quizStyles.footerInner}>
          <button
            type="button"
            disabled={!isQuizComplete() || isSending}
            onClick={collectAndLogResults}
            className={`${quizStyles.submitButton} ${
              !isQuizComplete() || isSending
                ? quizStyles.submitButtonDisabled
                : quizStyles.submitButtonEnabled
            }`}
          >
            {isSending ? (
              <svg
                className={quizStyles.spinner}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className={quizStyles.spinnerCircle}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className={quizStyles.spinnerPath}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <span className={quizStyles.submitButtonText}>
                Завершить регистрацию
              </span>
            )}
          </button>
        </div>
      </footer>
    </main>
  );
}
