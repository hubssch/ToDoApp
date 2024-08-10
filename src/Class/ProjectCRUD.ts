// Class/ProjectCRUD.ts

export interface Project {
  id: string;
  name: string;
  description: string;
}

export class ProjectCRUD {
  private projectsContainer: HTMLDivElement;

  constructor(projectsContainerId: string) {
    this.projectsContainer = document.querySelector<HTMLDivElement>(`#${projectsContainerId}`)!;
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

    return projectElement;
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
