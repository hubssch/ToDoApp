import './style.css'

// Dodajemy zawartość do #app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <input placeholder='Project Name'/>
    <button id='new-project-btn'>New Project</button>
  </div>
`

// Pobieramy przycisk i dodajemy obsługę zdarzenia, gdy DOM jest gotowy
document.addEventListener('DOMContentLoaded', () => {
  const newProjectButton = document.querySelector<HTMLButtonElement>('#new-project-btn');

  if (newProjectButton) {
    // Funkcja do dodania nowego projektu
    const addNewProject = () => {
      const project = document.createElement('div') as HTMLDivElement;
      project.classList.add('project');
      console.log('New Project added'); 
      // Dodaj inne funkcjonalności tutaj
    }

    // Dodanie nasłuchiwania na kliknięcie
    newProjectButton.addEventListener('click', addNewProject);
  } else {
    console.error('Element #new-project-btn nie został znaleziony.');
  }
});
