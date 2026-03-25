document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const videoItems = document.querySelectorAll('.video-item');
    const workoutList = document.getElementById('workout-list');
    const workoutSection = document.getElementById('workout-section');
    let workoutItemsList = JSON.parse(localStorage.getItem('workoutPlan')) || [];

    // --- Search Logic ---
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            videoItems.forEach(item => {
                const title = item.querySelector('.video-title').textContent.toLowerCase();
                item.style.display = title.includes(query) ? 'block' : 'none';
            });
        });
    }

    // --- Video Hover Logic ---
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        item.addEventListener('mouseenter', () => video && video.play());
        item.addEventListener('mouseleave', () => video && video.pause());
    });

    // --- Workout Builder Functions ---
    window.renderWorkout = function() {
        if (!workoutList) return;
        workoutList.innerHTML = '';
        
        if (workoutItemsList.length > 0) {
            workoutSection.style.display = 'block';
            workoutItemsList.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'workout-item';
                li.innerHTML = `
                    <div class="workout-item-title">${item.title}</div>
                    <div class="workout-item-inputs">
                        <div class="input-group"><label>Sets</label><input type="text" value="${item.sets || ''}" oninput="updateItem(${index}, 'sets', this.value)"></div>
                        <div class="input-group"><label>Reps</label><input type="text" value="${item.reps || ''}" oninput="updateItem(${index}, 'reps', this.value)"></div>
                        <button onclick="removeItem(${index})" class="remove-btn">×</button>
                    </div>`;
                workoutList.appendChild(li);
            });
        } else {
            workoutSection.style.display = 'none';
        }
        localStorage.setItem('workoutPlan', JSON.stringify(workoutItemsList));
    };

    window.addToWorkout = function(btn) {
        const item = btn.closest('.video-item');
        const id = item.id;
        const title = item.querySelector('.video-title').textContent;
        if (!workoutItemsList.some(i => i.id === id)) {
            workoutItemsList.push({ id, title, sets: '', reps: '' });
            renderWorkout();
        }
    };

    window.updateItem = (index, key, val) => {
        workoutItemsList[index][key] = val;
        localStorage.setItem('workoutPlan', JSON.stringify(workoutItemsList));
    };

    window.removeItem = (index) => {
        workoutItemsList.splice(index, 1);
        renderWorkout();
    };

    window.clearWorkout = () => {
        if(confirm('Clear current plan?')) {
            workoutItemsList = [];
            renderWorkout();
        }
    };

    renderWorkout(); // Run on load
});
window.shareVideo = function(btn) {
    const videoItem = btn.closest('.video-item');
    const id = videoItem.id;
    // Creates a link directly to that exercise on the current page
    const shareUrl = `${window.location.origin}${window.location.pathname}#${id}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'COPIED!';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.color = '';
        }, 2000);
    });
};