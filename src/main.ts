import './style.css'

// Dodajemy zawartość do #app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id='projects-container'></div>
    <input placeholder='Project Name' id='new-project-input' />
    <button id='new-project-btn'>New Project</button>
    
  </div>
`

// Pobieramy przycisk i dodajemy obsługę zdarzenia, gdy DOM jest gotowy
document.addEventListener('DOMContentLoaded', () => {
  const newProjectButton = document.querySelector<HTMLButtonElement>('#new-project-btn');
  const projectsContainer = document.querySelector<HTMLDivElement>('#projects-container');

  if (newProjectButton && projectsContainer) {
    // Funkcja do dodania nowego projektu
    const addNewProject = () => {
      const projectInput = document.querySelector<HTMLInputElement>('#new-project-input');
      
      if (projectInput) {
        const projectName = projectInput.value.trim(); // Pobieramy i obcinamy białe znaki
        if (projectName) {
          const project = document.createElement('div') as HTMLDivElement;
          project.classList.add('project');
          project.textContent = projectName; // Ustawiamy tekst z inputa jako treść projektu
          projectsContainer.appendChild(project); // Dodajemy projekt do kontenera
          console.log(`New Project added: ${projectName}`);
          
          projectInput.value = ''; // Czyścimy input po dodaniu projektu
        } else {
          console.log('Project name is empty, cannot add project.');
        }
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      
    })

    // Dodanie nasłuchiwania na kliknięcie
    newProjectButton.addEventListener('click', addNewProject);
  } else {
    console.error('Elementy #new-project-btn lub #projects-container nie zostały znalezione.');
  }
});
