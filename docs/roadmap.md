# Roadmap

Thanks go to all you [sponsors](sponsor.md#sponsor-with-stripe-or-paypal) it's your support that lets us continue to improve TRMM.

## Next Release

- [Policy Agent Exclusions Not Honored When Policy Applied to Site](https://github.com/amidaware/tacticalrmm/issues/2269)
- [Add Scheduled Reporting](https://github.com/amidaware/tacticalrmm/issues/846)
- [Mesh File Download delay or Failure](https://github.com/amidaware/tacticalrmm/issues/2231)
- [usernames with spaces bug](https://github.com/amidaware/tacticalrmm/issues/2265)

## Following Release

- [Windows Update Rework](https://github.com/amidaware/tacticalrmm/issues/1188) - Complete overhaul of the Windows Update management system for better reliability and performance.

## Future Releases

- [White Labeling](https://github.com/amidaware/tacticalrmm/issues/463) - Comprehensive white labeling solution allowing full customization of branding and UI elements.

<script>
// Auto-populate GitHub issue data
document.addEventListener('DOMContentLoaded', function() {
  const issueLinks = document.querySelectorAll('a[href*="github.com"][href*="/issues/"]');
  
  issueLinks.forEach(async (link) => {
    const url = link.href;
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
    
    if (match) {
      const [, owner, repo, issueNumber] = match;
      
      // Skip placeholder issues
      if (issueNumber === 'XXX') {
        return;
      }
      
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`);
        
        if (response.ok) {
          const issue = await response.json();
          
          // Update link text with issue title
          link.textContent = issue.title;
          
          // Replace the list item with a custom issue box
          const li = link.closest('li');
          if (li) {
            // Remove any existing meta
            const existingMeta = li.querySelector('.issue-box');
            if (existingMeta) {
              existingMeta.remove();
            }
            
            // Hide the default bullet point
            li.style.listStyle = 'none';
            li.style.marginLeft = '0';
            
            const issueBox = document.createElement('div');
            issueBox.className = 'issue-box';
            
            // Check for custom description after the link
            let description = 'No description available';
            const listItemText = li.textContent;
            const dashIndex = listItemText.indexOf(' - ');
            
            if (dashIndex > -1) {
              // Use custom description provided after the dash
              description = listItemText.substring(dashIndex + 3).trim();
              console.log('Using custom description:', description);
            } else if (issue.body && issue.body.trim()) {
              // Auto-extract from GitHub issue
              const body = issue.body.trim();
              
              console.log('Issue body:', body); // Debug log
              
              // Look for "Describe the bug" section with more flexible regex
              const bugDescMatch = body.match(/Describe the bug\s*\r?\n([^]*?)(?:\r?\n\r?\n|$)/i);
              
              console.log('Bug desc match:', bugDescMatch); // Debug log
              
              if (bugDescMatch && bugDescMatch[1]) {
                description = bugDescMatch[1].trim();
                console.log('Raw description:', description); // Debug log
                
                // Take first sentence or up to 200 chars
                const firstSentence = description.split(/[.!?]+/)[0];
                if (firstSentence && firstSentence.length > 20) {
                  description = firstSentence + '.';
                }
                
                if (description.length > 200) {
                  description = description.substring(0, 200) + '...';
                }
              } else {
                // More aggressive fallback - look for descriptive content
                const lines = body.split(/\r?\n/);
                let foundDesc = false;
                
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i].trim();
                  
                  // Skip empty lines and known headers
                  if (!line || line.match(/^(Server Info|Installation Method|Agent Info|Describe the bug)/i)) {
                    if (line.match(/Describe the bug/i)) {
                      // Found the header, get the next non-empty line
                      for (let j = i + 1; j < lines.length; j++) {
                        const nextLine = lines[j].trim();
                        if (nextLine && nextLine.length > 30) {
                          description = nextLine;
                          foundDesc = true;
                          break;
                        }
                      }
                    }
                    continue;
                  }
                  
                  // Look for a substantial line that looks like a description
                  if (!foundDesc && line.length > 50 && !line.includes(':') && !line.startsWith('-')) {
                    description = line;
                    break;
                  }
                }
                
                if (description.length > 200) {
                  description = description.substring(0, 200) + '...';
                }
              }
              
              // Remove markdown formatting for display
              description = description.replace(/[#*`\[\]]/g, '').replace(/\s+/g, ' ').trim();
              console.log('Final description:', description); // Debug log
            }
            
            // Get reactions and comments
            const thumbsUp = issue.reactions ? (issue.reactions['+1'] || 0) : 0;
            const comments = issue.comments || 0;
            
            issueBox.innerHTML = `
              <div class="issue-header">
                <h4><a href="${issue.html_url}" target="_blank">${issue.title}</a></h4>
                <span class="issue-number">#${issueNumber}</span>
              </div>
              <div class="issue-description">${description}</div>
              <div class="issue-footer">
                <div class="issue-stats-left">
                  <span class="thumbs-up">👍 ${thumbsUp}</span>
                  <span class="issue-state ${issue.state}">${issue.state}</span>
                </div>
                <div class="issue-stats-right">
                  <span class="comments">💬 ${comments}</span>
                </div>
              </div>
            `;
            
            // Replace the link with the issue box
            li.innerHTML = '';
            li.appendChild(issueBox);
          }
        } else {
          console.log('Failed to fetch issue:', response.status, response.statusText);
        }
      } catch (error) {
        console.log('Error fetching issue data for:', url, error);
      }
    }
  });
});
</script>

<style>
/* Hide default list styling for issue items */
ul li:has(.issue-box) {
  list-style: none;
  margin-left: 0;
}

.issue-box {
  background: var(--md-default-bg-color);
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 8px;
  margin: 0.25rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  overflow: hidden;
}

.issue-box:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #5865f2;
  color: white;
  padding: 0.25rem 1rem;
  margin: 0;
}

.issue-header h4 {
  margin: 0 !important;
  flex: 1;
  padding-right: 1rem;
  border: none !important;
  border-top: none !important;
  background: none !important;
  color: white !important;
  font-size: 1rem;
  line-height: 1.3;
  font-weight: 600;
  width: auto !important;
  text-indent: 0 !important;
  margin-top: 0 !important;
}

.issue-header h4 a {
  color: white !important;
  text-decoration: none !important;
  font-weight: 600;
  display: inline;
}

.issue-header h4 a:hover {
  text-decoration: underline !important;
  color: white !important;
}

/* Override dark mode link styling specifically for issue boxes */
[data-md-color-scheme="slate"] .issue-box a {
  color: white !important;
  text-decoration: none !important;
}

[data-md-color-scheme="slate"] .issue-box a:hover {
  text-decoration: underline !important;
  color: white !important;
}

.issue-number {
  background: rgba(255, 255, 255, 0.25);
  color: white !important;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-family: var(--md-code-font, monospace);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
}

.issue-description {
  color: var(--md-default-fg-color--light);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.25rem;
  padding: 0.55rem;
}

.issue-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem 0.25rem 0.25rem;
}

.issue-stats-left {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.issue-stats-right {
  display: flex;
  align-items: center;
}

.thumbs-up {
  background: var(--md-accent-bg-color);
  color: var(--md-accent-fg-color);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.issue-state {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.issue-state.open {
  background: #28a745;
  color: white;
}

.issue-state.closed {
  background: #dc3545;
  color: white;
}

.comments {
  background: var(--md-default-fg-color--lightest);
  color: var(--md-default-fg-color);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .issue-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .issue-header h4 {
    padding-right: 0;
  }
  
  .issue-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .issue-stats-right {
    align-self: flex-end;
  }
}
</style>