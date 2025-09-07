# Roadmap

This roadmap provides a directional view of upcoming work. It is not exhaustive, and scope, sequencing, and timing may change. We also ship fixes and enhancements continuously in parallel with the items listed below.

<div class="roadmap-grid">
  <div class="roadmap-section">
    <h2>Next Release</h2>
    <ul>
      
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/846">Add Scheduled Reporting</a></li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/1973">Uninstall Software</a></li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/2269">Policy Agent Exclusions Not Honored When Policy Applied to Site</a></li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/2231">Mesh File Download delay or Failure</a></li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/2265">usernames with spaces bug</a></li>
    </ul>
  </div>

  <div class="roadmap-section">
    <h2>Future Releases</h2>
    <ul>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/463">White Labeling</a> - Comprehensive white labeling solution allowing full customization of branding and UI elements.</li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/1188">Windows Update Rework</a> - Complete overhaul of the Windows Update management system for better reliability and performance.</li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/653">Tagging/Groups </a></li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/1452">Background Registry Editor</a></li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/1149">Bulk Edit Agents</a></li>
      <li><a href="https://github.com/amidaware/tacticalrmm/issues/308">customizable columns in the agent list</a></li>
    </ul>
  </div>
</div>

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
            } else if (issue.body && issue.body.trim()) {
              // Auto-extract from GitHub issue
              const body = issue.body.trim();
              
              
              // Look for "Describe the bug" section with more flexible regex
              const bugDescMatch = body.match(/Describe the bug\s*\r?\n([^]*?)(?:\r?\n\r?\n|$)/i);
              

              if (bugDescMatch && bugDescMatch[1]) {
                description = bugDescMatch[1].trim();

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
            }
            
            // Get reactions and comments
            const thumbsUp = issue.reactions ? (issue.reactions['+1'] || 0) : 0;
            const comments = issue.comments || 0;
            
            issueBox.innerHTML = `
              <div class="issue-header">
                <div class="issue-title"><a href="${issue.html_url}" target="_blank">${issue.title}</a></div>
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
        }
      } catch (error) {
      }
    }
  });
});
</script>

<style>
/* Create a grid layout for release sections */
.roadmap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem; /* Reduced from 0.5rem */
  margin-top: 0.5rem; /* Reduced from 1rem */
}

.roadmap-section {
  background: var(--md-default-bg-color);
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 8px;
  padding: 0.5rem; /* Reduced from 1rem */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.roadmap-section h2 {
  margin-top: 0 !important;
  margin-bottom: 0.5rem !important; /* Reduced from 0.75rem */
  text-align: center;
  border: none !important;
  background: linear-gradient(135deg, #5865f2, #7289da) !important;
  color: white !important;
  padding: 0.5rem !important; /* Reduced from 0.75rem */
  border-radius: 6px !important;
  width: 100% !important;
  text-indent: 0 !important;
}

.roadmap-section ul {
  margin: 0 !important; /* Remove default ul margins */
  padding: 0 !important; /* Remove default ul padding */
}

[data-md-color-scheme="slate"] .roadmap-section h2 {
  background: linear-gradient(135deg, #5865f2) !important;
  color: white !important;
}

/* Hide default list styling for issue items */
ul li:has(.issue-box) {
  list-style: none;
  margin-left: 0;
  margin-bottom: 0.125rem; /* Reduced spacing between items */
}

ul li:has(.issue-box):last-child {
  margin-bottom: 0; /* Remove margin from last item */
}

.issue-box {
  background: var(--md-default-bg-color);
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 6px;
  margin: 0; /* Removed vertical margins */
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
  padding: 0.4rem 0.6rem; /* Reduced from 0.5rem 0.75rem */
  margin: 0;
}

.issue-title {
  margin: 0 !important;
  flex: 1;
  padding-right: 0.5rem; /* Reduced from 0.75rem */
  color: white !important;
  font-size: 0.85rem; /* Reduced from 0.9rem */
  line-height: 1.2;
  font-weight: 400;
}

.issue-title a {
  color: white !important;
  text-decoration: none !important;
  font-weight: 600;
  display: inline;
}

.issue-title a:hover {
  text-decoration: underline !important;
  color: white !important;
}

.issue-number {
  background: rgba(255, 255, 255, 0.25);
  color: white !important;
  padding: 0.25rem 0.4rem; /* Reduced from 0.3rem 0.5rem */
  border-radius: 4px;
  font-family: var(--md-code-font, monospace);
  font-size: 0.7rem; /* Reduced from 0.75rem */
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
}

.issue-description {
  color: var(--md-default-fg-color--light);
  font-size: 0.8rem; /* Reduced from 0.85rem */
  line-height: 1.3; /* Reduced from 1.4 */
  margin-bottom: 0; /* Removed bottom margin */
  padding: 0.3rem; /* Reduced from 0.4rem */
}

.issue-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.3rem 0.3rem 0.3rem; /* Reduced from 0.25rem */
}

.issue-stats-left {
  display: flex;
  gap: 0.4rem; /* Reduced from 0.5rem */
  align-items: center;
}

.issue-stats-right {
  display: flex;
  align-items: center;
}

.thumbs-up {
  background: var(--md-accent-bg-color);
  color: var(--md-accent-fg-color);
  padding: 0.15rem 0.3rem; /* Reduced from 0.2rem 0.4rem */
  border-radius: 8px; /* Reduced from 10px */
  font-size: 0.7rem; /* Reduced from 0.75rem */
  font-weight: 500;
}

.issue-state {
  padding: 0.15rem 0.3rem; /* Reduced from 0.2rem 0.4rem */
  border-radius: 8px; /* Reduced from 10px */
  font-size: 0.65rem; /* Reduced from 0.7rem */
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
  padding: 0.15rem 0.3rem; /* Reduced from 0.2rem 0.4rem */
  border-radius: 8px; /* Reduced from 10px */
  font-size: 0.7rem; /* Reduced from 0.75rem */
  font-weight: 200;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .roadmap-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem; /* Reduced from 1rem */
  }
}

@media (max-width: 768px) {
  .roadmap-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem; /* Reduced from 0.75rem */
  }
  
  .roadmap-section {
    padding: 0.5rem; /* Reduced from 0.75rem */
  }
  
  .issue-header {
    flex-direction: column;
    gap: 0.2rem; /* Reduced from 0.25rem */
    align-items: flex-start;
  }
  
  .issue-title {
    padding-right: 0;
  }
  
  .issue-footer {
    flex-direction: column;
    gap: 0.2rem; /* Reduced from 0.25rem */
    align-items: flex-start;
  }
  
  .issue-stats-right {
    align-self: flex-end;
  }
}
</style>