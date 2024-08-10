// Class/CRUD.ts

export class CRUD {
    private projectsContainer: HTMLDivElement;
  
    constructor(projectsContainerId: string) {
      this.projectsContainer = document.querySelector<HTMLDivElement>(`#${projectsContainerId}`)!;
    }
  
    loadProjects() {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
      projects.forEach(projectName => {
        const project = this.createProjectElement(projectName);
        this.projectsContainer.appendChild(project);
      });
    }
  
    addNewProject(projectName: string) {
      if (projectName) {
        const project = this.createProjectElement(projectName);
        this.projectsContainer.appendChild(project);
  
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
        existingProjects.push(projectName);
        localStorage.setItem('projects', JSON.stringify(existingProjects));
  
        console.log(`New Project added: ${projectName}`);
      } else {
        console.log('Project name is empty, cannot add project.');
      }
    }
  
    private createProjectElement(projectName: string): HTMLDivElement {
      const project = document.createElement('div') as HTMLDivElement;
      project.classList.add('project');
      project.textContent = projectName;
  
      this.createEditButton(project, projectName);
      this.createDeleteButton(project, projectName);
  
      return project;
    }
  
    private deleteProject(projectElement: HTMLDivElement, projectName: string) {
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
      const updatedProjects = existingProjects.filter(project => project !== projectName);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
  
      projectElement.remove();
      console.log(`Project deleted: ${projectName}`);
    }
  
    private createDeleteButton(projectElement: HTMLDivElement, projectName: string) {
      const deleteButton = document.createElement('button') as HTMLButtonElement;
      deleteButton.classList.add('delete-btn');
      deleteButton.textContent = 'Delete';
  
      deleteButton.addEventListener('click', () => this.deleteProject(projectElement, projectName));
      projectElement.appendChild(deleteButton);
    }
  
    private createEditButton(projectElement: HTMLDivElement, projectName: string) {
      const editButton = document.createElement('button') as HTMLButtonElement;
      editButton.classList.add('edit-btn');
      editButton.textContent = 'Edit';
  
      editButton.addEventListener('click', () => this.editProject(projectElement, projectName, editButton));
      projectElement.appendChild(editButton);
    }
  
    private editProject(projectElement: HTMLDivElement, projectName: string, editButton: HTMLButtonElement) {
      const newProjectName = prompt('Edit project name:', projectName);
      if (newProjectName && newProjectName.trim()) {
        projectElement.textContent = newProjectName.trim();
        projectElement.appendChild(editButton);
        this.createDeleteButton(projectElement, newProjectName.trim());
  
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]') as string[];
        const projectIndex = existingProjects.indexOf(projectName);
        if (projectIndex > -1) {
          existingProjects[projectIndex] = newProjectName.trim();
          localStorage.setItem('projects', JSON.stringify(existingProjects));
        }
  
        console.log(`Project updated: ${newProjectName.trim()}`);
      }
    }
  }
  