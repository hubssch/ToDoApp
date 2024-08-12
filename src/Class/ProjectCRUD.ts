import { StoryCRUD } from './StoryCRUD';

export interface Project {
  id: string;
  name: string;
  description: string;
}

export class ProjectCRUD {
  private projectsContainer: HTMLDivElement;
  private storyCRUD: StoryCRUD;

  constructor(projectsContainerId: string) {
    this.projectsContainer = document.querySelector<HTMLDivElement>(`#${projectsContainerId}`)!;
    this.storyCRUD = new StoryCRUD('stories-container');
  }

  loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
    projects.forEach(project => {
      const projectElement = this.createProjectElement(project);
      this.projectsContainer.appendChild(projectElement);
    });
  }

  addNewProject(project: Project) {
    const projectElement = this.createProjectElement(project);
    this.projectsContainer.appendChild(projectElement);

    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
    existingProjects.push(project);
    localStorage.setItem('projects', JSON.stringify(existingProjects));

    console.log(`New Project added: ${project.name}`);
  }

  private createProjectElement(project: Project): HTMLDivElement {
    const projectElement = document.createElement('div') as HTMLDivElement;
    projectElement.classList.add('project');
    projectElement.textContent = `${project.name}: ${project.description}`;

    this.createEditButton(projectElement, project);
    this.createDeleteButton(projectElement, project);
    this.createDetailsButton(projectElement, project);

    return projectElement;
  }

  private createDetailsButton(projectElement: HTMLDivElement, project: Project) {
    const detailsButton = document.createElement('button') as HTMLButtonElement;
    detailsButton.classList.add('details-btn');
    detailsButton.textContent = 'View Details';

    detailsButton.addEventListener('click', () => this.showProjectDetails(project.id, project.name));
    projectElement.appendChild(detailsButton);
  }

  private showProjectDetails(projectId: string, projectName: string) {
    const projectsContainer = document.querySelector<HTMLDivElement>('#projects-container');
    const projectDetails = document.querySelector<HTMLDivElement>('#project-details');

    if (projectsContainer && projectDetails) {
      projectsContainer.style.display = 'none';
      projectDetails.style.display = 'block';

      projectDetails.querySelector('h2')!.textContent = `Project Details: ${projectName}`;

      // Wczytanie historii przypisanych do projektu
      this.storyCRUD.loadStories(projectId);

      // Obsługa dodawania nowej historii
      const addStoryButton = document.querySelector<HTMLButtonElement>('#new-story-btn');
      if (addStoryButton) {
        addStoryButton.onclick = () => {
          const storyNameInput = document.querySelector<HTMLInputElement>('#new-story-name')!;
          const storyDescriptionInput = document.querySelector<HTMLInputElement>('#new-story-description')!;
          const storyPrioritySelect = document.querySelector<HTMLSelectElement>('#new-story-priority')!;
          const storyOwnerInput = document.querySelector<HTMLInputElement>('#new-story-owner')!;
          const storyStatusSelect = document.querySelector<HTMLSelectElement>('#new-story-status')!;

          const newStory = {
            id: crypto.randomUUID(),
            name: storyNameInput.value.trim(),
            description: storyDescriptionInput.value.trim(),
            priority: storyPrioritySelect.value as 'Low' | 'Medium' | 'High',
            status: storyStatusSelect.value as 'To do' | 'Doing' | 'Done',
            owner: storyOwnerInput.value.trim(),
            project: { id: projectId, name: projectName, description: '' },
            createDate: new Date().toISOString()
          };

          if (newStory.name && newStory.description && newStory.owner) {
            this.storyCRUD.addNewStory(newStory);

            // Wyczyść pola formularza po dodaniu historii
            storyNameInput.value = '';
            storyDescriptionInput.value = '';
            storyOwnerInput.value = '';
            storyPrioritySelect.value = 'Low';
            storyStatusSelect.value = 'To do';
          }
        };
      }

      // Obsługa powrotu do listy projektów
      const backToProjectsButton = document.querySelector<HTMLButtonElement>('#back-to-projects-btn');
      if (backToProjectsButton) {
        backToProjectsButton.onclick = () => {
          projectsContainer.style.display = 'block';
          projectDetails.style.display = 'none';
          projectDetails.querySelector<HTMLDivElement>('#stories-container')!.innerHTML = '';
        };
      }
    }
  }

  private deleteProject(projectElement: HTMLDivElement, projectId: string) {
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
    const updatedProjects = existingProjects.filter(project => project.id !== projectId);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    projectElement.remove();
    console.log(`Project deleted: ${projectId}`);
  }

  private createDeleteButton(projectElement: HTMLDivElement, project: Project) {
    const deleteButton = document.createElement('button') as HTMLButtonElement;
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => this.deleteProject(projectElement, project.id));
    projectElement.appendChild(deleteButton);
  }

  private createEditButton(projectElement: HTMLDivElement, project: Project) {
    const editButton = document.createElement('button') as HTMLButtonElement;
    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit';

    editButton.addEventListener('click', () => this.editProject(projectElement, project, editButton));
    projectElement.appendChild(editButton);
  }

  private editProject(projectElement: HTMLDivElement, project: Project, editButton: HTMLButtonElement) {
    const newProjectName = prompt('Edit project name:', project.name);
    const newProjectDescription = prompt('Edit project description:', project.description);

    if (newProjectName && newProjectName.trim() && newProjectDescription && newProjectDescription.trim()) {
      projectElement.textContent = `${newProjectName.trim()}: ${newProjectDescription.trim()}`;
      projectElement.appendChild(editButton);
      this.createDeleteButton(projectElement, { ...project, name: newProjectName.trim(), description: newProjectDescription.trim() });

      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
      const projectIndex = existingProjects.findIndex(p => p.id === project.id);
      if (projectIndex > -1) {
        existingProjects[projectIndex].name = newProjectName.trim();
        existingProjects[projectIndex].description = newProjectDescription.trim();
        localStorage.setItem('projects', JSON.stringify(existingProjects));
      }

      console.log(`Project updated: ${newProjectName.trim()}`);
    }
  }
}