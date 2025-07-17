// GitHub API integration
document.addEventListener('DOMContentLoaded', function() {
    const username = 'amankr59';
    const projectsContainer = document.getElementById('projects-container');
    const searchInput = document.getElementById('search-projects');
    const repoCountEl = document.getElementById('repo-count');
    const starsCountEl = document.getElementById('stars-count');
    const forksCountEl = document.getElementById('forks-count');
    const avatarContainer = document.getElementById('github-avatar');
    const bioElement = document.getElementById('github-bio');
    
    let allRepos = [];
    
    // Fetch user profile data
    async function fetchUserProfile() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            
            const userData = await response.json();
            
            // Update avatar
            if (userData.avatar_url) {
                const avatarImg = document.createElement('img');
                avatarImg.src = userData.avatar_url;
                avatarImg.alt = `${username}'s avatar`;
                avatarContainer.appendChild(avatarImg);
            }
            
            // Update bio if available
            if (userData.bio) {
                bioElement.textContent = userData.bio;
            }
            
            // Update repo count
            if (userData.public_repos) {
                repoCountEl.textContent = userData.public_repos;
            }
            
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }
    
    // Fetch repositories
    async function fetchRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            allRepos = await response.json();
            
            // Calculate total stars and forks
            const totalStars = allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            const totalForks = allRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
            
            // Update stats
            starsCountEl.textContent = totalStars;
            forksCountEl.textContent = totalForks;
            
            // Display repositories
            displayRepositories(allRepos);
            
        } catch (error) {
            console.error('Error fetching repositories:', error);
            showErrorMessage('Failed to load repositories. Please try again later.');
        }
    }
    
    // Display repositories
    function displayRepositories(repos) {
        // Clear loading spinner
        projectsContainer.innerHTML = '';
        
        if (repos.length === 0) {
            showNoResultsMessage();
            return;
        }
        
        // Create repository cards
        repos.forEach(repo => {
            const card = createRepoCard(repo);
            projectsContainer.appendChild(card);
        });
    }
    
    // Create repository card
    function createRepoCard(repo) {
        const card = document.createElement('div');
        card.className = 'repo-card';
        
        // Language color mapping
        const languageColors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C#': '#178600',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB',
            'Rust': '#dea584',
            'C++': '#f34b7d',
            'C': '#555555'
        };
        
        // Format date
        const updatedDate = new Date(repo.updated_at);
        const formattedDate = updatedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Repository icon based on fork status
        const repoIcon = repo.fork ? 'fa-code-fork' : 'fa-book-open';
        
        card.innerHTML = `
            <div class="repo-header">
                <h3 class="repo-name">
                    <i class="fas ${repoIcon}"></i>
                    ${repo.name}
                </h3>
            </div>
            <div class="repo-body">
                <p class="repo-description">${repo.description || 'No description available'}</p>
                ${repo.language ? `
                <div class="repo-language">
                    <span class="language-color" style="background-color: ${languageColors[repo.language] || '#858585'}"></span>
                    <span>${repo.language}</span>
                </div>
                ` : ''}
                <div class="repo-meta">
                    <div class="repo-meta-item">
                        <i class="far fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="repo-meta-item">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                    <div class="repo-meta-item">
                        <i class="far fa-clock"></i>
                        <span>${formattedDate}</span>
                    </div>
                </div>
            </div>
            <div class="repo-footer">
                <a href="${repo.html_url}" target="_blank" class="view-repo-btn">
                    <i class="fab fa-github"></i>
                    View on GitHub
                </a>
            </div>
        `;
        
        return card;
    }
    
    // Show error message
    function showErrorMessage(message) {
        projectsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
            </div>
        `;
    }
    
    // Show no results message
    function showNoResultsMessage() {
        projectsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No repositories found</h3>
                <p>Try adjusting your search or check back later for new projects.</p>
            </div>
        `;
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayRepositories(allRepos);
            return;
        }
        
        const filteredRepos = allRepos.filter(repo => 
            repo.name.toLowerCase().includes(searchTerm) || 
            (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
            (repo.language && repo.language.toLowerCase().includes(searchTerm))
        );
        
        displayRepositories(filteredRepos);
    });
    
    // Initialize
    fetchUserProfile();
    fetchRepositories();
}); 