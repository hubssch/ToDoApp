import './style.css';
import { CRUD } from './Class/CRUD';

// Dodajemy zawartość do #app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id='projects-container'></div>
    <input placeholder='Project Name' id='new-project-input' />
    <button id='new-project-btn'>New Project</button>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const newProjectButton = document.querySelector<HTMLButtonElement>('#new-project-btn');
  const projectsContainerId = 'projects-container';

  // Inicjalizacja klasy CRUD
  const crud = new CRUD(projectsContainerId);

  if (newProjectButton) {
    // Funkcja do dodania nowego projektu
    const addNewProject = () => {
      const projectInput = document.querySelector<HTMLInputElement>('#new-project-input');

      if (projectInput) {
        const projectName = projectInput.value.trim();
        crud.addNewProject(projectName);
        projectInput.value = ''; // Czyścimy input po dodaniu projektu
      }
    };

    // Wczytanie projektów z localStorage na początku
    crud.loadProjects();

    // Dodanie nasłuchiwania na kliknięcie
    newProjectButton.addEventListener('click', addNewProject);
  } else {
    console.error('Elementy #new-project-btn lub #projects-container nie zostały znalezione.');
  }
});
