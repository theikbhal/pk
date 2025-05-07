// Supabase configuration
const SUPABASE_URL = 'SUPABASE_URL';
const SUPABASE_KEY = 'SUPABASE_KEY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const ideaForm = document.getElementById('ideaForm');
const ideaInput = document.getElementById('ideaInput');
const ideasList = document.getElementById('ideasList');

// Load ideas from Supabase
async function loadIdeas() {
    try {
        const { data, error } = await supabase
            .from('pk_ideas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        renderIdeas(data);
    } catch (error) {
        console.error('Error loading ideas:', error);
        showError('Failed to load ideas. Please try again.');
    }
}

// Add a new idea
async function addIdea(text) {
    try {
        const { data, error } = await supabase
            .from('pk_ideas')
            .insert([
                {
                    text,
                    status: 'active'
                }
            ])
            .select();

        if (error) throw error;
        await loadIdeas();
        ideaInput.value = '';
    } catch (error) {
        console.error('Error adding idea:', error);
        showError('Failed to add idea. Please try again.');
    }
}

// Delete an idea
async function deleteIdea(id) {
    try {
        const { error } = await supabase
            .from('pk_ideas')
            .delete()
            .eq('id', id);

        if (error) throw error;
        await loadIdeas();
    } catch (error) {
        console.error('Error deleting idea:', error);
        showError('Failed to delete idea. Please try again.');
    }
}

// Toggle idea status
async function toggleStatus(id, currentStatus) {
    try {
        const newStatus = currentStatus === 'active' ? 'completed' : 'active';
        const { error } = await supabase
            .from('pk_ideas')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;
        await loadIdeas();
    } catch (error) {
        console.error('Error updating idea:', error);
        showError('Failed to update idea. Please try again.');
    }
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.ideas').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Render ideas list
function renderIdeas(ideas) {
    ideasList.innerHTML = ideas.map(idea => `
        <div class="idea-card ${idea.status}">
            <p>${idea.text}</p>
            <div class="idea-meta">
                <span>${formatDate(idea.created_at)}</span>
                <div class="idea-actions">
                    <button onclick="toggleStatus(${idea.id}, '${idea.status}')" class="status-btn">
                        ${idea.status === 'active' ? '✓ Complete' : '↩ Reactivate'}
                    </button>
                    <button onclick="deleteIdea(${idea.id})" class="delete-btn">🗑 Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Event Listeners
ideaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = ideaInput.value.trim();
    if (text) {
        addIdea(text);
    }
});

// Load Supabase client
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
script.onload = () => {
    // Initial load
    loadIdeas();
};
document.head.appendChild(script); 