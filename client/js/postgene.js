// JavaScript: Functionality for Post Generator
function generatePost() {
    const input = document.getElementById('achievementInput').value.trim();
    const output = document.getElementById('postOutput');
  
    if (input) {
      output.textContent = `🎉 Achievement Unlocked! ${input} #achievement #success #growth`;
    } else {
      output.textContent = 'Please enter an achievement to generate a post.';
    }
  }
  
  function copyPost() {
    const postText = document.getElementById('postOutput').textContent;
    navigator.clipboard.writeText(postText)
      .then(() => alert('Post copied to clipboard!'))
      .catch(err => alert('Failed to copy text: ' + err));
  }
  
  function autoPost() {
    const postText = document.getElementById('postOutput').textContent;
    if (postText && !postText.includes('Please enter')) {
      alert('Auto-posting: ' + postText);
      // Add API integration logic here
    } else {
      alert('Generate a valid post before auto-posting.');
    }
  }
  
  function switchTab(platform) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
  
    if (platform === 'linkedin') {
      tabs[0].classList.add('active');
    } else if (platform === 'twitter') {
      tabs[1].classList.add('active');
    }
  }