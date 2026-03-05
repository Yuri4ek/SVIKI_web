export type QuestionType = {
  id: string;
  question: string;
  options: string[];
  triggerValue?: string;
  subQuestions?: QuestionType[];
};

export const QUIZ_DATA: QuestionType[] = [
  {
    id: "1",
    question: "У вас есть действующие кредиты?",
    options: ["Да", "Нет"],
    subQuestions: [
      {
        id: "1_1",
        triggerValue: "Да",
        question: "Укажите количество кредиторов:",
        options: ["1", "2", "3", "более 3х"],
      },
      {
        id: "1_2",
        triggerValue: "Да",
        question: "Кто ваши кредиторы?",
        options: ["Банки", "МФО", "И те и другие"],
      },
      {
        id: "1_3",
        triggerValue: "Да",
        question: "Есть действующие просрочки?",
        options: ["Да", "Нет"],
        subQuestions: [
          {
            id: "1_3_1",
            triggerValue: "Да",
            question: "Сколько месяцев длится просрочка?",
            options: ["1", "2", "3", "более 3х месяцев"],
          },
        ],
      },
      {
        id: "1_4",
        triggerValue: "Да",
        question: "Есть залоговое кредитование или ипотека?",
        options: ["Да", "Нет"],
        subQuestions: [
          {
            id: "1_4_1",
            triggerValue: "Да",
            question: "Какой примерный остаток по ипотеке?",
            options: ["до 1 млн", "до 2х млн", "до 3х млн", "свыше 3 млн"],
          },
        ],
      },
      {
        id: "1_5",
        triggerValue: "Да",
        question: "Есть автокредит?",
        options: ["Да", "Нет"],
        subQuestions: [
          {
            id: "1_5_1",
            triggerValue: "Да",
            question: "Остаток по автокредиту:",
            options: ["до 1 млн", "свыше 1 млн"],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    question:
      "Есть недвижимое имущество в собственности (кроме единственного жилья)?",
    options: ["Да", "Нет"],
  },
  {
    id: "3",
    question: "Есть автомобиль в собственности?",
    options: ["Да", "Нет"],
    subQuestions: [
      {
        id: "3_1",
        triggerValue: "Да",
        question: "Стоимость автомобиля:",
        options: ["до 1 млн", "свыше 1 млн"],
      },
    ],
  },
  {
    id: "4",
    question: "Официально трудоустроены?",
    options: ["Да", "Нет"],
  },
  {
    id: "5",
    question: "Долги ФССП (судебные приставы)?",
    options: ["Да", "Нет"],
    subQuestions: [
      {
        id: "5_1",
        triggerValue: "Да",
        question: "Какая сумма долга ФССП?",
        options: [
          "до 100т",
          "до 300т",
          "до 500т",
          "до 1 млн",
          "до 2х млн",
          "до 3х млн",
          "свыше 3 млн",
        ],
      },
    ],
  },
  {
    id: "6",
    question: "Долги по налогам?",
    options: ["Да", "Нет"],
    subQuestions: [
      {
        id: "6_1",
        triggerValue: "Да",
        question: "Какая сумма долга по налогам?",
        options: [
          "до 100т",
          "до 300т",
          "до 500т",
          "до 1 млн",
          "до 2х млн",
          "до 3х млн",
          "свыше 3 млн",
        ],
      },
    ],
  },
];
