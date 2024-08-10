import './style.css'

// Dodajemy zawartość do #app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id='projects-container'></div>
    <input placeholder='Project Name' id='new-project-input' />
    <button id='new-project-btn'>New Project</button>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  const newProjectButton = document.querySelector<HTMLButtonElement>('#new-project-btn');
  const projectsContainer = document.querySelector<HTMLDivElement>('#projects-container');

  // Funkcja do usunięcia projektu
  const deleteProject = (projectElement: HTMLDivElement, projectName: string) => {
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
    const updatedProjects = existingProjects.filter(project => project !== projectName);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    projectElement.remove();
    console.log(`Project deleted: ${projectName}`);
  };

  // Funkcja do stworzenia przycisku "Delete"
  const createDeleteButton = (projectElement: HTMLDivElement, projectName: string) => {
    const deleteButton = document.createElement('button') as HTMLButtonElement;
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => deleteProject(projectElement, projectName));
    projectElement.appendChild(deleteButton);
  };

  // Funkcja do dodania przycisku "Edit" i jego obsługi
  const createEditButton = (projectElement: HTMLDivElement, projectName: string) => {
    const editButton = document.createElement('button') as HTMLButtonElement;
    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit';

    // Funkcja do edycji projektu
    const editProject = () => {
      const newProjectName = prompt('Edit project name:', projectName);
      if (newProjectName && newProjectName.trim()) {
        projectElement.textContent = newProjectName.trim();
        projectElement.appendChild(editButton); // Dodajemy z powrotem przycisk "Edit"
        projectElement.appendChild(createDeleteButton(projectElement, newProjectName.trim()));

        // Aktualizacja w localStorage
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
        const projectIndex = existingProjects.indexOf(projectName);
        if (projectIndex > -1) {
          existingProjects[projectIndex] = newProjectName.trim();
          localStorage.setItem('projects', JSON.stringify(existingProjects));
        }

        console.log(`Project updated: ${newProjectName.trim()}`);
      }
    };

    editButton.addEventListener('click', editProject);
    projectElement.appendChild(editButton);
  };

  // Funkcja do wczytania projektów z localStorage
  const loadProjects = () => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
    projects.forEach(projectName => {
      const project = document.createElement('div') as HTMLDivElement;
      project.classList.add('project');
      project.textContent = projectName;
      projectsContainer?.appendChild(project);

      createEditButton(project, projectName); // Dodajemy przycisk "Edit" do projektu
      createDeleteButton(project, projectName); // Dodajemy przycisk "Delete" do projektu
    });
  };

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

          createEditButton(project, projectName); // Dodajemy przycisk "Edit" do projektu
          createDeleteButton(project, projectName); // Dodajemy przycisk "Delete" do projektu

          // Zapisanie projektu do localStorage
          const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
          existingProjects.push(projectName);
          localStorage.setItem('projects', JSON.stringify(existingProjects));

          console.log(`New Project added: ${projectName}`);
          
          projectInput.value = ''; // Czyścimy input po dodaniu projektu
        } else {
          console.log('Project name is empty, cannot add project.');
        }
      }
    };

    // Wczytanie projektów z localStorage na początku
    loadProjects();

    // Dodanie nasłuchiwania na kliknięcie
    newProjectButton.addEventListener('click', addNewProject);
  } else {
    console.error('Elementy #new-project-btn lub #projects-container nie zostały znalezione.');
  }
});
