export const scoreAndRankJobs = (jobs, userSkills) => {
  const currentDate = new Date();

  const scoredJobs = jobs.map((job) => {
    const jobSkills = job.requiredSkills;

    const { matchedSkills, matchRatio } = calculateSkillMatch(
      jobSkills,
      userSkills
    );
    const recencyScore = calculateRecencyScore(job.createdAt, currentDate);

    // Combined score
    const totalScore = 0.6 * matchRatio + 0.4 * recencyScore;

    return {
      job: job,
      score: totalScore,
      matchedSkills: matchedSkills,
      matchPercentage: matchRatio * 100,
    };
  });

  return scoredJobs
    .filter((job) => job.matchPercentage >= 50)
    .sort((a, b) => b.score - a.score);
};

export const calculateSkillMatch = (jobSkills, userSkills) => {
  const matchedSkills = jobSkills.filter((skill) => userSkills.includes(skill));
  const matchRatio = matchedSkills.length / jobSkills.length;

  return { matchedSkills, matchRatio };
};

export const calculateRecencyScore = (postedDate, currentDate) => {
  const minutesSincePosted = Math.floor(
    (currentDate - postedDate) / (1000 * 60)
  );
  return 1 / (1 + minutesSincePosted); // inverse relationship
};

export const formatRecommendationResponse = (recommendedJobs) => {
  return recommendedJobs.map((job) => ({
    ...job,
    matchedSkills: job.matchedSkills,
    matchPercentage: job.matchPercentage.toFixed(2) + "%",
    score: job.score.toFixed(4),
  }));
};
