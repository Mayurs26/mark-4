export function format(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      return formatTime(date);
    }
    
    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${formatTime(date)}`;
    }
    
    // Check if the date is within the last week
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    if (date > lastWeek) {
      return `${getDayName(date)}, ${formatTime(date)}`;
    }
    
    // Otherwise, return the full date
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${formatTime(date)}`;
  }
  
  function formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  
  function getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }