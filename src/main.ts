import './style.css';
import { ProjectCRUD } from './Class/ProjectCRUD';

// Dodajemy zawartość do #app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id='projects-container'></div>
    <div id='project-details' style='display: none;'></div> <!-- Sekcja na szczegóły projektu -->
    <input placeholder='Project Name' id='new-project-input' />
    <input placeholder='Project Description' id='new-project-description' />
    <button id='new-project-btn'>New Project</button>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const newProjectButton = document.querySelector<HTMLButtonElement>('#new-project-btn');
  const projectsContainerId = 'projects-container';

  // Inicjalizacja klasy CRUD
  const projectCRUD = new ProjectCRUD(projectsContainerId);

  if (newProjectButton) {
    // Funkcja do dodania nowego projektu
    const addNewProject = () => {
      const projectInput = document.querySelector<HTMLInputElement>('#new-project-input');
      const projectDescriptionInput = document.querySelector<HTMLInputElement>('#new-project-description');

      if (projectInput && projectDescriptionInput) {
        const projectName = projectInput.value.trim();
        const projectDescription = projectDescriptionInput.value.trim();
        
        if (projectName && projectDescription) {
          const newProject = {
            id: crypto.randomUUID(), // Generowanie unikalnego ID
            name: projectName,
            description: projectDescription
          };

          projectCRUD.addNewProject(newProject);

          projectInput.value = ''; // Czyścimy input po dodaniu projektu
          projectDescriptionInput.value = ''; // Czyścimy opis po dodaniu projektu
        } else {
          console.log('Project name or description is empty, cannot add project.');
        }
      }
    };

    // Wczytanie projektów z localStorage na początku
    projectCRUD.loadProjects();

    // Dodanie nasłuchiwania na kliknięcie
    newProjectButton.addEventListener('click', addNewProject);
  } else {
    console.error('Elementy #new-project-btn lub #projects-container nie zostały znalezione.');
  }
});
