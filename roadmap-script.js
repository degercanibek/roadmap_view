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
let editMode = false;
let defaultRoadmapData = null;

// Check if first time visit
function isFirstVisit() {
    return !localStorage.getItem('roadmapData') && !localStorage.getItem('roadmapInitialized');
}

// Load default data from JSON file
async function loadDefaultData() {
    try {
        const response = await fetch('roadmap-data.json');
        defaultRoadmapData = await response.json();
        return defaultRoadmapData;
    } catch (error) {
        console.error('Error loading default data:', error);
        return null;
    }
}

// Load data from localStorage or JSON file
async function loadData() {
    const savedData = localStorage.getItem('roadmapData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    
    // Load from JSON file
    if (!defaultRoadmapData) {
        await loadDefaultData();
    }
    return defaultRoadmapData;
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem('roadmapData', JSON.stringify(data));
}

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
async function loadRoadmap() {
    try {
        const data = await loadData();
        
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
                
                // Add edit controls if in edit mode
                if (editMode) {
                    const editControls = document.createElement('div');
                    editControls.className = 'edit-controls';
                    
                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn-edit';
                    editBtn.textContent = 'Edit';
                    editBtn.onclick = () => openEditModal(section.id, section.milestones.indexOf(milestone));
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn-delete';
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.onclick = () => deleteMilestone(section.id, section.milestones.indexOf(milestone));
                    
                    editControls.appendChild(editBtn);
                    editControls.appendChild(deleteBtn);
                    milestoneItem.appendChild(editControls);
                }
                
                milestonesList.appendChild(milestoneItem);
            });
            
            sectionDiv.appendChild(milestonesList);
            
            // Add "Add New" button in edit mode
            if (editMode) {
                const addBtn = document.createElement('button');
                addBtn.className = 'btn-add';
                addBtn.textContent = '+ Add Milestone';
                addBtn.onclick = () => openAddModal(section.id);
                milestonesList.appendChild(addBtn);
            }
            
            container.appendChild(sectionDiv);
        });
    } catch (error) {
        console.error('Error loading roadmap:', error);
        document.getElementById('roadmap-container').innerHTML = 
            '<p style="text-align: center; color: #e74c3c;">Error loading roadmap data.</p>';
    }
}

// Change language
async function changeLanguage(lang) {
    currentLanguage = lang;
    await loadRoadmap();
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
}

// Toggle edit mode
async function toggleEditMode() {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    const btn = document.getElementById('edit-mode-btn');
    if (editMode) {
        btn.textContent = '✓ Done';
        btn.classList.add('active');
    } else {
        btn.textContent = '✏️ Edit';
        btn.classList.remove('active');
    }
    await loadRoadmap();
}

// Open modal to edit milestone
async function openEditModal(sectionId, milestoneIndex) {
    const data = await loadData();
    const section = data.sections.find(s => s.id === sectionId);
    const milestone = section.milestones[milestoneIndex];
    
    document.getElementById('modal-title').textContent = 'Edit Milestone';
    document.getElementById('edit-section-id').value = sectionId;
    document.getElementById('edit-milestone-index').value = milestoneIndex;
    document.getElementById('date-tr').value = milestone.date.tr;
    document.getElementById('date-en').value = milestone.date.en;
    document.getElementById('desc-tr').value = milestone.description.tr;
    document.getElementById('desc-en').value = milestone.description.en;
    document.getElementById('highlighted').checked = milestone.highlighted;
    
    document.getElementById('edit-modal').classList.add('show');
}

// Open modal to add new milestone
function openAddModal(sectionId) {
    document.getElementById('modal-title').textContent = 'Add New Milestone';
    document.getElementById('edit-section-id').value = sectionId;
    document.getElementById('edit-milestone-index').value = '-1';
    document.getElementById('date-tr').value = '';
    document.getElementById('date-en').value = '';
    document.getElementById('desc-tr').value = '';
    document.getElementById('desc-en').value = '';
    document.getElementById('highlighted').checked = false;
    
    document.getElementById('edit-modal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('edit-modal').classList.remove('show');
}

// Save milestone
async function saveMilestone(event) {
    event.preventDefault();
    
    const data = await loadData();
    const sectionId = document.getElementById('edit-section-id').value;
    const milestoneIndex = parseInt(document.getElementById('edit-milestone-index').value);
    const section = data.sections.find(s => s.id === sectionId);
    
    const milestone = {
        date: {
            tr: document.getElementById('date-tr').value,
            en: document.getElementById('date-en').value
        },
        description: {
            tr: document.getElementById('desc-tr').value,
            en: document.getElementById('desc-en').value
        },
        highlighted: document.getElementById('highlighted').checked
    };
    
    if (milestoneIndex === -1) {
        // Add new
        section.milestones.push(milestone);
    } else {
        // Edit existing
        section.milestones[milestoneIndex] = milestone;
    }
    
    saveData(data);
    closeModal();
    await loadRoadmap();
}

// Delete milestone
async function deleteMilestone(sectionId, milestoneIndex) {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    
    const data = await loadData();
    const section = data.sections.find(s => s.id === sectionId);
    section.milestones.splice(milestoneIndex, 1);
    saveData(data);
    await loadRoadmap();
}

// Export data to JSON file
async function exportData() {
    const data = await loadData();
    
    // Ask for filename
    const filename = prompt('Enter filename:', 'roadmap-data.json');
    if (!filename) return;
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.json') ? filename : filename + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('File downloaded! Please save it to your project folder.');
}

// Import data from JSON file
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            saveData(data);
            localStorage.setItem('roadmapInitialized', 'true');
            await loadRoadmap();
            alert('Data imported successfully!');
        } catch (error) {
            console.error('Error importing data:', error);
            alert('Error importing data. Please check the file format.');
        }
    };
    input.click();
}

// Show first time import - just load default data
async function showFirstTimeImport() {
    const defaultData = await loadDefaultData();
    if (defaultData) {
        saveData(defaultData);
        localStorage.setItem('roadmapInitialized', 'true');
        await loadRoadmap();
    }
}

// Load roadmap when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Check if first visit
    if (isFirstVisit()) {
        await showFirstTimeImport();
    } else {
        await loadRoadmap();
    }
    
    // Add language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.dataset.lang);
        });
    });
    
    // Edit mode button
    document.getElementById('edit-mode-btn').addEventListener('click', toggleEditMode);
    
    // Export/Import buttons
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', importData);
    
    // Modal events
    document.querySelector('.close').addEventListener('click', closeModal);
    document.querySelector('.btn-cancel').addEventListener('click', closeModal);
    document.getElementById('milestone-form').addEventListener('submit', saveMilestone);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('edit-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
});
