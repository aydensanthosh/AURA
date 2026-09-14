const calculateStreak = (checkIns) => {
  if (!checkIns || checkIns.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort dates descending
  const sortedDates = checkIns
    .map((date) => new Date(date).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  // Remove duplicates
  const uniqueDates = [...new Set(sortedDates)];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000;

  // Check if active streak
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    let checkDate = uniqueDates[0];
    for (let i = 0; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === checkDate) {
        currentStreak++;
        checkDate -= 86400000; // minus 1 day
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      if (uniqueDates[i - 1] - uniqueDates[i] === 86400000) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return { currentStreak, longestStreak };
};

module.exports = { calculateStreak };
