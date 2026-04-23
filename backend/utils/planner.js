function generateSchedule(subjects, availableHours, mood, startTimeStr) {
  // A simple rule-based algorithm for timetable generation
  const blocks = [];
  const totalMinutes = availableHours * 60;
  let remainingMinutes = totalMinutes;
  
  let startTime = new Date();
  if (startTimeStr) {
    const [hours, minutes] = startTimeStr.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  } else {
    startTime.setHours(9, 0, 0, 0); // Start at 9:00 AM by default
  }
  
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
  const subjectTimeAllocated = {}; // Keep track of time spent per subject

  subjects.forEach(subject => {
    subjectTimeAllocated[subject._id] = 0;
    subject.topics.forEach(topic => {
      if (!topic.completed) {
        // Priority weight: High=3, Medium=2, Low=1
        const priorityWeight = topic.priority === 'High' ? 3 : topic.priority === 'Medium' ? 2 : 1;
        const weight = priorityWeight * topic.difficulty;
        
        topicsToStudy.push({
          subjectId: subject._id,
          subjectName: subject.name,
          targetTime: subject.targetTime || 60, // Default to 60 if not set
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
    
    // Check if we've already hit the target time for this subject
    const timeAlreadySpent = subjectTimeAllocated[topic.subjectId] || 0;
    const timeLeftForSubject = Math.max(0, topic.targetTime - timeAlreadySpent);
    
    if (timeLeftForSubject <= 0) continue; // Skip if subject's target time reached
    
    // Determine block duration
    let duration = Math.min(topic.estimatedTime, maxBlockDuration, remainingMinutes, timeLeftForSubject);
    if (duration < 15 && topic.estimatedTime >= 15 && timeLeftForSubject >= 15) continue; 
    
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
    subjectTimeAllocated[topic.subjectId] += duration;
    
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
