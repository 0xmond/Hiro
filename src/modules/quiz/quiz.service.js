import { Skills } from "../../utils/enum/index.js";
import { Quiz } from "../../db/models/quiz.model.js";
import { Question } from "../../db/models/question.model.js";
import { Employee } from "../../db/models/user.model.js";

// create a test for the choosen skill
export const getSkillQuiz = async (req, res, next) => {
  console.log(req.body);

  const skill = req.body.skill;

  const questions = await Question.aggregate([
    { $match: { skill } },
    { $sample: { size: 5 } },
  ]);

  if (!questions || questions?.length < 5) {
    return next(
      new Error("There is a problem right now, come back soon", { cause: 500 })
    );
  }

  const userQuiz = await Quiz.create({
    skill,
    user: req.user.profileId,
    questions,
  });

  await userQuiz.populate([{ path: "questions" }]);
  const finalQuiz = userQuiz.questions.map((q) => ({
    skill: q.skill,
    question: q.question,
    options: q.options,
  }));

  return res
    .status(200)
    .json({ success: true, data: { quizId: userQuiz._id, quiz: finalQuiz } });
};

// submit the quiz and calculate the score
export const submitQuiz = async (req, res, next) => {
  const { answers, quizId } = req.body;
  if (!answers.length)
    return next(new Error("No asnwers provided", { cause: 400 }));

  // check if the submition is still valid
  const quiz = await Quiz.findOne({
    user: req.user.profileId,
    _id: quizId,
  }).populate([{ path: "questions" }]);

  if (!quiz)
    return next(new Error("There is no Quiz as this ", { cause: 404 }));

  if (quiz.attempted)
    return next(new Error("You Did Submit This Before ", { cause: 403 }));

  if (quiz.expiresAt < new Date())
    return next(new Error("Quiz Timeout ", { cause: 408 }));

  const score = calculateScore(quiz, answers);
  quiz.score = score;
  quiz.attempted = true;

  if (score > 2) {
    await Employee.updateOne(
      { _id: req.user._id },
      {
        $set: {
          "skills.$[s].verified": true,
        },
      },
      {
        arrayFilters: [{ "s.skill": quiz.skill }],
      }
    );
  }

  await quiz.save();

  return res.status(200).json({
    success: true,
    message:
      score > 2
        ? "Skill verified successfully"
        : "Sorry! You didn't pass the quiz",
    score,
  });
};

function calculateScore(quiz, answers) {
  let score = 0;
  for (let i = 0; i < quiz.questions.length; i++) {
    if (answers[i] == quiz.questions[i].answer) score += 1;
  }
  return score;
}

// check if the skill avilable to be verified
export const isAvailable = async (req, res, next) => {
  if (Object.values(Skills).includes(req.body.skill)) {
    return next();
  }
  return next(new Error("Skill will be available soon", { cause: 400 }));
};
