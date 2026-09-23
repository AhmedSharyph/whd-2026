// hashtagUI.js - Renders and manages hashtag components with clean flow and font styling

export function renderHashtags(tags, containerElement, onTagClick) {
  if (!containerElement) return;
  
  containerElement.innerHTML = '';

  tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'hashtag-item';
    span.textContent = tag.startsWith('#') ? tag : `#${tag}`;
    
    if (onTagClick) {
      span.addEventListener('click', () => onTagClick(tag));
    }

    containerElement.appendChild(span);
  });
}
