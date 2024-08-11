// Class/StoryCRUD.ts

import { Project } from './ProjectCRUD';

interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  project: Project;
  createDate: string;
  status: 'To do' | 'Doing' | 'Done';
  owner: string;
}

export class StoryCRUD {
  private storiesContainer: HTMLDivElement | null;

  constructor(storiesContainerId: string) {
    this.storiesContainer = document.querySelector<HTMLDivElement>(`#${storiesContainerId}`);
  }

  loadStories(projectId: string) {
    const stories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
    const filteredStories = stories.filter(story => story.project.id === projectId);
    filteredStories.forEach(story => {
      const storyElement = this.createStoryElement(story);
      this.storiesContainer?.appendChild(storyElement);
    });
  }

  addNewStory(story: Story) {
    const storyElement = this.createStoryElement(story);
    this.storiesContainer?.appendChild(storyElement);

    const existingStories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
    existingStories.push(story);
    localStorage.setItem('stories', JSON.stringify(existingStories));

    console.log(`New Story added: ${story.name}`);
  }

  private createStoryElement(story: Story): HTMLDivElement {
    const storyElement = document.createElement('div') as HTMLDivElement;
    storyElement.classList.add('story');
    storyElement.textContent = `${story.name}: ${story.description} (Priority: ${story.priority}, Status: ${story.status})`;

    this.createEditButton(storyElement, story);
    this.createDeleteButton(storyElement, story);

    return storyElement;
  }

  private deleteStory(storyElement: HTMLDivElement, storyId: string) {
    const existingStories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
    const updatedStories = existingStories.filter(story => story.id !== storyId);
    localStorage.setItem('stories', JSON.stringify(updatedStories));

    storyElement.remove();
    console.log(`Story deleted: ${storyId}`);
  }

  private createDeleteButton(storyElement: HTMLDivElement, story: Story) {
    const deleteButton = document.createElement('button') as HTMLButtonElement;
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => this.deleteStory(storyElement, story.id));
    storyElement.appendChild(deleteButton);
  }

  private createEditButton(storyElement: HTMLDivElement, story: Story) {
    const editButton = document.createElement('button') as HTMLButtonElement;
    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit';

    editButton.addEventListener('click', () => this.editStory(storyElement, story, editButton));
    storyElement.appendChild(editButton);
  }

  private editStory(storyElement: HTMLDivElement, story: Story, editButton: HTMLButtonElement) {
    const newStoryName = prompt('Edit story name:', story.name);
    const newStoryDescription = prompt('Edit story description:', story.description);
    const newStoryPriority = prompt('Edit story priority (Low, Medium, High):', story.priority);
    const newStoryStatus = prompt('Edit story status (To do, Doing, Done):', story.status);

    if (newStoryName && newStoryName.trim() && newStoryDescription && newStoryDescription.trim() &&
      newStoryPriority && ['Low', 'Medium', 'High'].includes(newStoryPriority) &&
      newStoryStatus && ['To do', 'Doing', 'Done'].includes(newStoryStatus)) {
        
      storyElement.textContent = `${newStoryName.trim()}: ${newStoryDescription.trim()} (Priority: ${newStoryPriority}, Status: ${newStoryStatus})`;
      storyElement.appendChild(editButton);
      this.createDeleteButton(storyElement, { ...story, name: newStoryName.trim(), description: newStoryDescription.trim(), priority: newStoryPriority as 'Low' | 'Medium' | 'High', status: newStoryStatus as 'To do' | 'Doing' | 'Done' });

      const existingStories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
      const storyIndex = existingStories.findIndex(s => s.id === story.id);
      if (storyIndex > -1) {
        existingStories[storyIndex].name = newStoryName.trim();
        existingStories[storyIndex].description = newStoryDescription.trim();
        existingStories[storyIndex].priority = newStoryPriority as 'Low' | 'Medium' | 'High';
        existingStories[storyIndex].status = newStoryStatus as 'To do' | 'Doing' | 'Done';
        localStorage.setItem('stories', JSON.stringify(existingStories));
      }

      console.log(`Story updated: ${newStoryName.trim()}`);
    }
  }
}
