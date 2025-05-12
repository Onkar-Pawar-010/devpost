function editPost(button) {
    const postCard = button.closest('.post-card');
    const paragraph = postCard.querySelector('p');
    const currentText = paragraph.innerText;
    const newText = prompt("Edit post content:", currentText);
    if (newText !== null) {
      paragraph.innerText = newText;
    }
  }
  
  function postNow() {
    alert("Post published successfully!");
  }
  