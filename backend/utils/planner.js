function generateSchedule(subjects, availableHours, mood) {
  // A simple rule-based algorithm for timetable generation
  const blocks = [];
  const totalMinutes = availableHours * 60;
  let remainingMinutes = totalMinutes;
  
  let startTime = new Date();
  startTime.setHours(9, 0, 0, 0); // Start at 9:00 AM by default
  
  // Adjust intensity based on mood
  let maxBlockDuration = 60;
  let breakDuration = 10;
  
  if (mood === 'Stressed' || mood === 'Lazy') {
    maxBlockDuration = 45; // Shorter study blocks
    breakDuration = 15;    // Longer breaks
  } else if (mood === 'Productive') {
    maxBlockDuration = 90; // Longer deep work sessions
    breakDuration = 10;
  }
  
  // Flatten topics and calculate weights
  let topicsToStudy = [];
  subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      if (!topic.completed) {
        // Priority weight: High=3, Medium=2, Low=1
        const priorityWeight = topic.priority === 'High' ? 3 : topic.priority === 'Medium' ? 2 : 1;
        // Total weight combines priority and difficulty
        const weight = priorityWeight * topic.difficulty;
        
        topicsToStudy.push({
          subjectId: subject._id,
          subjectName: subject.name,
          ...topic.toObject(),
          weight
        });
      }
    });
  });
  
  // Sort by weight descending (highest priority + hardest first)
  topicsToStudy.sort((a, b) => b.weight - a.weight);
  
  let totalStudyTime = 0;
  
  for (let i = 0; i < topicsToStudy.length; i++) {
    const topic = topicsToStudy[i];
    if (remainingMinutes <= 0) break;
    
    // Determine block duration
    let duration = Math.min(topic.estimatedTime, maxBlockDuration, remainingMinutes);
    if (duration < 15 && topic.estimatedTime >= 15) continue; // Skip blocks that are too short unless the task itself is short
    
    // Add Study Block
    const blockStartStr = formatTime(startTime);
    startTime = addMinutes(startTime, duration);
    const blockEndStr = formatTime(startTime);
    
    blocks.push({
      title: `${topic.subjectName}: ${topic.name}`,
      type: 'Study',
      startTime: blockStartStr,
      endTime: blockEndStr,
      duration: duration,
      subjectId: topic.subjectId
    });
    
    remainingMinutes -= duration;
    totalStudyTime += duration;
    
    // If topic still needs time, we'd theoretically re-add it or keep track.
    // For simplicity, we just allocate max one block per topic in a day,
    // or if we have lots of time, we could loop. Let's just do one block per topic for now to ensure variety.
    
    if (remainingMinutes > breakDuration) {
      // Add Break Block
      const breakStartStr = formatTime(startTime);
      startTime = addMinutes(startTime, breakDuration);
      const breakEndStr = formatTime(startTime);
      
      blocks.push({
        title: 'Take a break!',
        type: 'Break',
        startTime: breakStartStr,
        endTime: breakEndStr,
        duration: breakDuration
      });
      remainingMinutes -= breakDuration;
    }
  }
  
  // Add a final revision block if there's still time and we had study blocks
  if (remainingMinutes >= 30 && blocks.some(b => b.type === 'Study')) {
    const revStartStr = formatTime(startTime);
    startTime = addMinutes(startTime, 30);
    const revEndStr = formatTime(startTime);
    
    blocks.push({
      title: 'Daily Revision',
      type: 'Revision',
      startTime: revStartStr,
      endTime: revEndStr,
      duration: 30
    });
    totalStudyTime += 30;
  }
  
  return { blocks, totalStudyTime };
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

module.exports = { generateSchedule };
