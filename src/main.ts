import './style.css';
import { ProjectCRUD } from './Class/ProjectCRUD';
import { StoryCRUD } from './Class/StoryCRUD';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id='projects-container'></div>
    <div id='project-details' style='display: none;'>
      <h2 id="header">Project Details</h2>
      <select id="filter-story-status">
        <option value="all">All</option>
        <option value="To do">To do</option>
        <option value="Doing">Doing</option>
        <option value="Done">Done</option>
      </select>
      <div id='stories-container'></div>
      <input placeholder='Story Name' id='new-story-name' />
      <input placeholder='Story Description' id='new-story-description' />
      <select id='new-story-priority'>
        <option value='Low'>Low</option>
        <option value='Medium'>Medium</option>
        <option value='High'>High</option>
      </select>
      <input placeholder='Story Owner' id='new-story-owner' />
      <select id='new-story-status'>
        <option value='To do'>To do</option>
        <option value='Doing'>Doing</option>
        <option value='Done'>Done</option>
      </select>
      <button id='new-story-btn'>Add Story</button>
      <button id='back-to-projects-btn'>Back to Projects</button>
    </div>
    <input placeholder='Project Name' id='new-project-input' />
    <input placeholder='Project Description' id='new-project-description' />
    <button id='new-project-btn'>New Project</button>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const newProjectButton = document.querySelector<HTMLButtonElement>('#new-project-btn');
  const projectsContainerId = 'projects-container';
  const storiesContainerId = 'stories-container';
  const filterStoryStatus = document.querySelector<HTMLSelectElement>('#filter-story-status');

  const projectCRUD = new ProjectCRUD(projectsContainerId);
  const storyCRUD = new StoryCRUD(storiesContainerId);

  const handleFilterChange = () => {
    const selectedStatus = filterStoryStatus?.value || 'all';
    const currentProjectId = document.querySelector<HTMLInputElement>('#project-id')?.value || ''; // Pobierz ID projektu
    if (currentProjectId) {
      storyCRUD.loadStories(currentProjectId, selectedStatus);
    }
  };

  if (filterStoryStatus) {
    filterStoryStatus.addEventListener('change', handleFilterChange);
  }

  if (newProjectButton) {
    const addNewProject = () => {
      const projectInput = document.querySelector<HTMLInputElement>('#new-project-input');
      const projectDescriptionInput = document.querySelector<HTMLInputElement>('#new-project-description');

      if (projectInput && projectDescriptionInput) {
        const projectName = projectInput.value.trim();
        const projectDescription = projectDescriptionInput.value.trim();

        if (projectName && projectDescription) {
          const newProject = {
            id: crypto.randomUUID(),
            name: projectName,
            description: projectDescription
          };

          projectCRUD.addNewProject(newProject);

          projectInput.value = '';
          projectDescriptionInput.value = '';
        } else {
          console.log('Project name or description is empty, cannot add project.');
        }
      }
    };

    projectCRUD.loadProjects();

    newProjectButton.addEventListener('click', addNewProject);
  } else {
    console.error('Elementy #new-project-btn lub #projects-container nie zostały znalezione.');
  }
});
