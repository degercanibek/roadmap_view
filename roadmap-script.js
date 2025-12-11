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
let currentTheme = 'thy-red'; // Default theme
let currentFontSize = 'medium'; // Default font size

// Available themes with their color schemes (popular design palettes)
const themes = {
    'thy-red': { name: 'THY Red', colors: ['#e30a17', '#f04e5a', '#f79298'] },
    'sunset-warm': { name: 'Sunset Warm', colors: ['#f97316', '#fb923c', '#fbbf24'] },
    'ocean-breeze': { name: 'Ocean Breeze', colors: ['#0891b2', '#06b6d4', '#67e8f9'] },
    'forest-sage': { name: 'Forest Sage', colors: ['#059669', '#10b981', '#34d399'] },
    'purple-pink': { name: 'Purple Pink', colors: ['#9333ea', '#d946ef', '#f0abfc'] },
    'coral-peach': { name: 'Coral Peach', colors: ['#f43f5e', '#fb7185', '#fda4af'] },
    'mint-teal': { name: 'Mint Teal', colors: ['#14b8a6', '#2dd4bf', '#5eead4'] },
    'lavender-blue': { name: 'Lavender Blue', colors: ['#6366f1', '#818cf8', '#a5b4fc'] },
    'tangerine': { name: 'Tangerine', colors: ['#ea580c', '#fb923c', '#fdba74'] },
    'berry-magenta': { name: 'Berry Magenta', colors: ['#be123c', '#e11d48', '#fb7185'] },
    'emerald-jade': { name: 'Emerald Jade', colors: ['#047857', '#059669', '#10b981'] },
    'sky-azure': { name: 'Sky Azure', colors: ['#0284c7', '#0ea5e9', '#38bdf8'] },
    'grape-violet': { name: 'Grape Violet', colors: ['#7c3aed', '#8b5cf6', '#a78bfa'] },
    'citrus-lime': { name: 'Citrus Lime', colors: ['#65a30d', '#84cc16', '#a3e635'] },
    'fuchsia-rose': { name: 'Fuchsia Rose', colors: ['#c026d3', '#d946ef', '#e879f9'] },
    'aqua-turquoise': { name: 'Aqua Turquoise', colors: ['#0891b2', '#06b6d4', '#22d3ee'] },
    'slate-blue': { name: 'Slate Blue', colors: ['#475569', '#64748b', '#94a3b8'] },
    'warm-earth': { name: 'Warm Earth', colors: ['#92400e', '#b45309', '#d97706'] },
    'cherry-red': { name: 'Cherry Red', colors: ['#991b1b', '#dc2626', '#ef4444'] },
    'midnight-blue': { name: 'Midnight Blue', colors: ['#1e3a8a', '#1e40af', '#3b82f6'] },
    'peachy-coral': { name: 'Peachy Coral', colors: ['#fb923c', '#fdba74', '#fcd34d'] },
    'tropical': { name: 'Tropical', colors: ['#f59e0b', '#10b981', '#06b6d4'] },
    'sunset-gradient': { name: 'Sunset Gradient', colors: ['#dc2626', '#f59e0b', '#fbbf24'] },
    'ocean-depth': { name: 'Ocean Depth', colors: ['#1e40af', '#0891b2', '#06b6d4'] },
    'spring-meadow': { name: 'Spring Meadow', colors: ['#84cc16', '#22c55e', '#10b981'] },
    
    // Rich Pastel color palettes (darker but still soft - better visibility on white)
    'soft-coral': { name: 'Soft Coral', colors: ['#f87171', '#fb923c', '#fbbf24'] },
    'dusty-rose': { name: 'Dusty Rose', colors: ['#f472b6', '#ec4899', '#db2777'] },
    'muted-lavender': { name: 'Muted Lavender', colors: ['#a78bfa', '#c084fc', '#d8b4fe'] },
    'sage-green': { name: 'Sage Green', colors: ['#4ade80', '#34d399', '#22d3ee'] },
    'soft-teal': { name: 'Soft Teal', colors: ['#2dd4bf', '#5eead4', '#94a3b8'] },
    'warm-peach': { name: 'Warm Peach', colors: ['#fdba74', '#fbbf24', '#fcd34d'] },
    'powder-blue': { name: 'Powder Blue', colors: ['#60a5fa', '#7dd3fc', '#93c5fd'] },
    'mauve-purple': { name: 'Mauve Purple', colors: ['#c084fc', '#d946ef', '#e879f9'] },
    'seafoam': { name: 'Seafoam', colors: ['#34d399', '#5eead4', '#67e8f9'] },
    'terracotta': { name: 'Terracotta', colors: ['#fb923c', '#f59e0b', '#eab308'] }
};

// Font size options (array for easier increment/decrement)
const fontSizeKeys = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const fontSizes = {
    'xsmall': { name: 'Extra Small', base: '11px', date: '9px' },
    'small': { name: 'Small', base: '13px', date: '10px' },
    'medium': { name: 'Medium', base: '14px', date: '11px' },
    'large': { name: 'Large', base: '16px', date: '12px' },
    'xlarge': { name: 'Extra Large', base: '18px', date: '13px' }
};

// Check if first time visit
function isFirstVisit() {
    return !localStorage.getItem('roadmapData') && !localStorage.getItem('roadmapInitialized');
}

// Load default data from JSON file
async function loadDefaultData() {
    try {
        const response = await fetch('roadmap-data.json');
        if (!response.ok) {
            // If file doesn't exist, return null instead of empty structure
            return null;
        }
        defaultRoadmapData = await response.json();
        return defaultRoadmapData;
    } catch (error) {
        console.log('No default data file found. Starting with empty roadmap.');
        // Return null if file doesn't exist - let user start fresh
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
    
    // If still no data, return empty structure
    if (!defaultRoadmapData) {
        return {
            title: {
                tr: "Yol Haritası",
                en: "Roadmap"
            },
            sections: [
                {
                    id: "short-term",
                    title: {
                        tr: "Kısa Vade (0-3 ay)",
                        en: "Short-Term (0-3 months)"
                    },
                    width: "medium",
                    milestones: []
                },
                {
                    id: "mid-term",
                    title: {
                        tr: "Orta Vade (3-12 ay)",
                        en: "Mid-Term (3-12 months)"
                    },
                    width: "medium",
                    milestones: []
                },
                {
                    id: "long-term",
                    title: {
                        tr: "Uzun Vade (12+ ay)",
                        en: "Long-Term (12+ months)"
                    },
                    width: "medium",
                    milestones: []
                }
            ]
        };
    }
    
    return defaultRoadmapData;
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem('roadmapData', JSON.stringify(data));
}

// Load settings from localStorage
function loadSettings() {
    const savedTheme = localStorage.getItem('roadmapTheme');
    if (savedTheme && themes[savedTheme]) {
        currentTheme = savedTheme;
    }
    
    const savedFontSize = localStorage.getItem('roadmapFontSize');
    if (savedFontSize && fontSizes[savedFontSize]) {
        currentFontSize = savedFontSize;
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('roadmapTheme', currentTheme);
    localStorage.setItem('roadmapFontSize', currentFontSize);
}

// Apply theme colors
function applyTheme() {
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--color-short-term', theme.colors[0]);
    document.documentElement.style.setProperty('--color-mid-term', theme.colors[1]);
    document.documentElement.style.setProperty('--color-long-term', theme.colors[2]);
}

// Apply font size
function applyFontSize() {
    const size = fontSizes[currentFontSize];
    document.documentElement.style.setProperty('--font-size-base', size.base);
    document.documentElement.style.setProperty('--font-size-date', size.date);
}

// Change theme
function changeTheme(themeKey) {
    currentTheme = themeKey;
    saveSettings();
    applyTheme();
}

// Change font size
function changeFontSize(sizeKey) {
    currentFontSize = sizeKey;
    saveSettings();
    applyFontSize();
}

// Increase font size
function increaseFontSize() {
    const currentIndex = fontSizeKeys.indexOf(currentFontSize);
    if (currentIndex < fontSizeKeys.length - 1) {
        changeFontSize(fontSizeKeys[currentIndex + 1]);
    }
}

// Decrease font size
function decreaseFontSize() {
    const currentIndex = fontSizeKeys.indexOf(currentFontSize);
    if (currentIndex > 0) {
        changeFontSize(fontSizeKeys[currentIndex - 1]);
    }
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
            
            // Add width controls in edit mode
            if (editMode) {
                const headerContent = document.createElement('div');
                headerContent.style.display = 'flex';
                headerContent.style.alignItems = 'center';
                headerContent.style.justifyContent = 'center';
                headerContent.style.gap = '8px';
                
                const decreaseBtn = document.createElement('button');
                decreaseBtn.className = 'width-btn';
                decreaseBtn.textContent = 'W−';
                decreaseBtn.title = 'Decrease width';
                decreaseBtn.onclick = () => decreaseSectionWidth(section.id);
                
                const titleSpan = document.createElement('span');
                titleSpan.textContent = getText(section.title);
                titleSpan.style.flex = '1';
                
                const increaseBtn = document.createElement('button');
                increaseBtn.className = 'width-btn';
                increaseBtn.textContent = 'W+';
                increaseBtn.title = 'Increase width';
                increaseBtn.onclick = () => increaseSectionWidth(section.id);
                
                headerContent.appendChild(decreaseBtn);
                headerContent.appendChild(titleSpan);
                headerContent.appendChild(increaseBtn);
                header.appendChild(headerContent);
            } else {
                header.textContent = getText(section.title);
            }
            
            sectionDiv.appendChild(header);
            
            // Create milestones list
            const milestonesList = document.createElement('div');
            milestonesList.className = 'milestones-list';
            
            // Add each milestone
            section.milestones.forEach(milestone => {
                const milestoneItem = document.createElement('div');
                milestoneItem.className = 'milestone-item';
                
                // Add RAG status class
                const ragStatus = milestone.ragStatus || 'none';
                if (ragStatus !== 'none') {
                    milestoneItem.classList.add(`rag-${ragStatus}`);
                }
                
                // Date and Product container
                const headerContainer = document.createElement('div');
                headerContainer.className = 'milestone-header';
                
                const dateDiv = document.createElement('div');
                dateDiv.className = 'milestone-date';
                dateDiv.textContent = getText(milestone.date);
                headerContainer.appendChild(dateDiv);
                
                // Add product badge if exists
                if (milestone.product && milestone.product.trim() !== '') {
                    const productBadge = document.createElement('span');
                    productBadge.className = 'product-badge';
                    productBadge.textContent = milestone.product;
                    headerContainer.appendChild(productBadge);
                }
                
                const descDiv = document.createElement('div');
                descDiv.className = 'milestone-description';
                descDiv.innerHTML = formatText(getText(milestone.description), section.id);
                
                milestoneItem.appendChild(headerContainer);
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
                addBtn.className = `btn-add ${section.id}`;
                addBtn.textContent = '+ Add Milestone';
                addBtn.onclick = () => openAddModal(section.id);
                
                // Apply theme color to button
                const theme = themes[currentTheme];
                const colorIndex = section.id === 'short-term' ? 0 : section.id === 'mid-term' ? 1 : 2;
                addBtn.style.background = theme.colors[colorIndex];
                
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
}

// Width sizes array for increment/decrement
const widthKeys = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

// Change section width
async function changeSectionWidth(sectionId, width) {
    const data = await loadData();
    const section = data.sections.find(s => s.id === sectionId);
    section.width = width;
    saveData(data);
    await loadRoadmap();
}

// Increase section width
async function increaseSectionWidth(sectionId) {
    const data = await loadData();
    const section = data.sections.find(s => s.id === sectionId);
    const currentWidth = section.width || 'medium';
    const currentIndex = widthKeys.indexOf(currentWidth);
    if (currentIndex < widthKeys.length - 1) {
        section.width = widthKeys[currentIndex + 1];
        saveData(data);
        await loadRoadmap();
    }
}

// Decrease section width
async function decreaseSectionWidth(sectionId) {
    const data = await loadData();
    const section = data.sections.find(s => s.id === sectionId);
    const currentWidth = section.width || 'medium';
    const currentIndex = widthKeys.indexOf(currentWidth);
    if (currentIndex > 0) {
        section.width = widthKeys[currentIndex - 1];
        saveData(data);
        await loadRoadmap();
    }
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
    document.getElementById('product').value = milestone.product || '';
    document.getElementById('rag-status').value = milestone.ragStatus || 'none';
    
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
    document.getElementById('product').value = '';
    document.getElementById('rag-status').value = 'none';
    
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
        product: document.getElementById('product').value,
        ragStatus: document.getElementById('rag-status').value
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
    // Only save if JSON file exists and has data
    if (defaultData && defaultData.sections) {
        saveData(defaultData);
        localStorage.setItem('roadmapInitialized', 'true');
        await loadRoadmap();
    } else {
        // No JSON file - start with empty roadmap
        console.log('Starting with empty roadmap');
        localStorage.setItem('roadmapInitialized', 'true');
        await loadRoadmap();
    }
}

// Load roadmap when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Load settings first
    loadSettings();
    applyTheme();
    applyFontSize();
    
    // Populate theme selector with color indicators
    const themeSelect = document.getElementById('theme-select');
    Object.keys(themes).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = '⬤ ' + themes[key].name;
        option.setAttribute('data-color', themes[key].colors[0]);
        option.style.color = themes[key].colors[0];
        option.style.fontWeight = '600';
        if (key === currentTheme) option.selected = true;
        themeSelect.appendChild(option);
    });
    
    // Update theme select appearance based on selection
    function updateThemeSelectColor() {
        const selectedOption = themeSelect.options[themeSelect.selectedIndex];
        const color = selectedOption.getAttribute('data-color');
        themeSelect.style.color = color;
        themeSelect.style.fontWeight = '600';
    }
    updateThemeSelectColor();
    themeSelect.addEventListener('change', updateThemeSelectColor);
    
    // Set language selector
    const langSelect = document.getElementById('lang-select');
    langSelect.value = currentLanguage;
    
    // Check if first visit
    if (isFirstVisit()) {
        await showFirstTimeImport();
    } else {
        await loadRoadmap();
    }
    
    // Language selector
    langSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
    
    // Theme selector
    themeSelect.addEventListener('change', (e) => {
        changeTheme(e.target.value);
    });
    
    // Font size buttons
    document.getElementById('font-increase').addEventListener('click', increaseFontSize);
    document.getElementById('font-decrease').addEventListener('click', decreaseFontSize);
    
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
