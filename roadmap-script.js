// Roadmap data embedded in JavaScript
// 
// Width options for sections:
// - "xsmall"  : Very narrow (150px)
// - "small"   : Narrow (220px)
// - "medium"  : Normal (300px) - default
// - "large"   : Wide (400px)
// - "xlarge"  : Very wide (500px)
//
// Highlighted parameter:
// - true  : Milestone will be highlighted with colored border, background, and icon
// - false : Normal milestone display
//
// Language support:
// - Add translations for "title", section "title", and milestone "date" and "description"
// - Use language object with "tr" and "en" keys
//

// Current language (default: tr)
let currentLanguage = 'tr';

const roadmapData = {
  "title": {
    "tr": "Direktörlük Yol Haritası",
    "en": "Directorate Roadmap"
  },
  "sections": [
    {
      "id": "short-term",
      "title": {
        "tr": "Kısa Vade (0-3 ay)",
        "en": "Short-Term (0-3 months)"
      },
      "width": "medium",
      "milestones": [
        {
          "date": {
            "tr": "Ocak 2026",
            "en": "January 2026"
          },
          "description": {
            "tr": "**İstanbul pilot acentelerde** Sungur Portal'ın canlıya geçişi",
            "en": "Go-live of Sungur Portal at **Istanbul pilot agencies**"
          },
          "highlighted": true
        },
        {
          "date": {
            "tr": "Ocak 2026",
            "en": "January 2026"
          },
          "description": {
            "tr": "ResAI - Mail AI geliştirmelerinin tamamlanması",
            "en": "Development Completion of ResAI - Mail AI"
          },
          "highlighted": false
        }
      ]
    },
    {
      "id": "mid-term",
      "title": {
        "tr": "Orta Vade (3-12 ay)",
        "en": "Mid-Term (3-12 months)"
      },
      "width": "medium",
      "milestones": [
        {
          "date": {
            "tr": "Mart 2026",
            "en": "March 2026"
          },
          "description": {
            "tr": "ResAI - Voice AI geliştirmelerinin tamamlanması",
            "en": "ResAI - Voice AI Development Completion"
          },
          "highlighted": false
        },
        {
          "date": {
            "tr": "Nisan 2026",
            "en": "April 2026"
          },
          "description": {
            "tr": "Sungur Portal'ın **tüm acentelerde yaygınlaştırmasının tamamlanması**",
            "en": "Full **roll-out completion** of Sungur Portal across all agencies"
          },
          "highlighted": true
        }
      ]
    },
    {
      "id": "long-term",
      "title": {
        "tr": "Uzun Vade (12+ ay)",
        "en": "Long-Term (12+ months)"
      },
      "width": "medium",
      "milestones": [
        {
          "date": {
            "tr": "2027 Q2",
            "en": "2027 Q2"
          },
          "description": {
            "tr": "Satış Modülünün tamamlanması",
            "en": "Completion of Sales Module"
          },
          "highlighted": true
        },
        {
          "date": {
            "tr": "2027 Q2",
            "en": "2027 Q2"
          },
          "description": {
            "tr": "**Terminal Operasyonları & Kargo Gelir Muhasebe** modülü geliştirmelerine başlanması",
            "en": "Start of development for **Terminal Operations & Cargo Revenue Accounting Module**"
          },
          "highlighted": true
        }
      ]
    }
  ]
};

// Get text in current language
function getText(textObj) {
    if (typeof textObj === 'string') return textObj;
    return textObj[currentLanguage] || textObj['en'] || '';
}

// Format text with bold highlighting (convert **text** to <strong> tags)
function formatText(text, sectionClass) {
    // Replace **text** with <strong class="highlight-{section}">text</strong>
    return text.replace(/\*\*(.+?)\*\*/g, `<strong class="highlight ${sectionClass}">$1</strong>`);
}

// Load and render roadmap from embedded data
function loadRoadmap() {
    try {
        const data = roadmapData;
        
        // Set page title
        document.getElementById('page-title').textContent = getText(data.title);
        
        // Get container
        const container = document.getElementById('roadmap-container');
        container.innerHTML = '';
        
        // Render each section
        data.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = `roadmap-section ${section.id}`;
            
            // Add width class if specified
            if (section.width) {
                sectionDiv.classList.add(`width-${section.width}`);
            }
            
            // Create section header
            const header = document.createElement('div');
            header.className = 'section-header';
            header.textContent = getText(section.title);
            sectionDiv.appendChild(header);
            
            // Create milestones list
            const milestonesList = document.createElement('div');
            milestonesList.className = 'milestones-list';
            
            // Add each milestone
            section.milestones.forEach(milestone => {
                const milestoneItem = document.createElement('div');
                milestoneItem.className = 'milestone-item';
                if (milestone.highlighted) {
                    milestoneItem.classList.add('highlighted');
                }
                
                const dateDiv = document.createElement('div');
                dateDiv.className = 'milestone-date';
                dateDiv.textContent = getText(milestone.date);
                
                const descDiv = document.createElement('div');
                descDiv.className = 'milestone-description';
                descDiv.innerHTML = formatText(getText(milestone.description), section.id);
                
                milestoneItem.appendChild(dateDiv);
                milestoneItem.appendChild(descDiv);
                milestonesList.appendChild(milestoneItem);
            });
            
            sectionDiv.appendChild(milestonesList);
            container.appendChild(sectionDiv);
        });
    } catch (error) {
        console.error('Error loading roadmap:', error);
        document.getElementById('roadmap-container').innerHTML = 
            '<p style="text-align: center; color: #e74c3c;">Error loading roadmap data.</p>';
    }
}

// Change language
function changeLanguage(lang) {
    currentLanguage = lang;
    loadRoadmap();
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
}

// Load roadmap when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadRoadmap();
    
    // Add language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.dataset.lang);
        });
    });
});
