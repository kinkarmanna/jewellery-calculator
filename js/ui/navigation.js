export function showView(viewId) {
    const views = document.querySelectorAll('main > section');
    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    });
}
