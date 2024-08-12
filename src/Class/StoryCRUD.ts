export interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To do' | 'Doing' | 'Done';
  owner: string;
  project: {
    id: string;
    name: string;
    description: string;
  };
  createDate: string;
}

export class StoryCRUD {
  private storiesContainer: HTMLDivElement;

  constructor(storiesContainerId: string) {
    this.storiesContainer = document.querySelector<HTMLDivElement>(`#${storiesContainerId}`)!;
  }

  loadStories(projectId: string) {
    const stories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
    const projectStories = stories.filter(story => story.project.id === projectId);

    projectStories.forEach(story => {
      const storyElement = this.createStoryElement(story);
      this.storiesContainer.appendChild(storyElement);
    });
  }

  addNewStory(story: Story) {
    const storyElement = this.createStoryElement(story);
    this.storiesContainer.appendChild(storyElement);

    const existingStories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
    existingStories.push(story);
    localStorage.setItem('stories', JSON.stringify(existingStories));

    console.log(`New Story added: ${story.name}`);
  }

  private createStoryElement(story: Story): HTMLDivElement {
    const storyElement = document.createElement('div') as HTMLDivElement;
    storyElement.classList.add('story');

    // Tworzenie divu na informacje o historii
    const storyInfo = document.createElement('div') as HTMLDivElement;
    storyInfo.classList.add('story-info');
    storyInfo.textContent = `${story.name}: ${story.description} (Priority: ${story.priority}, Status: ${story.status}, Owner: ${story.owner})`;

    // Tworzenie divu na przyciski
    const storyActions = document.createElement('div') as HTMLDivElement;
    storyActions.classList.add('story-actions');

    // Tworzenie przycisków i dodanie ich do divu na przyciski
    this.createEditButton(storyActions, story);
    this.createDeleteButton(storyActions, story);

    // Dodanie divów do głównego elementu
    storyElement.appendChild(storyInfo);
    storyElement.appendChild(storyActions);

    return storyElement;
  }

  private deleteStory(storyElement: HTMLDivElement, storyId: string) {
    const existingStories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
    const updatedStories = existingStories.filter(story => story.id !== storyId);
    localStorage.setItem('stories', JSON.stringify(updatedStories));

    storyElement.remove();
    console.log(`Story deleted: ${storyId}`);
  }

  private createDeleteButton(storyActions: HTMLDivElement, story: Story) {
    const deleteButton = document.createElement('button') as HTMLButtonElement;
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => this.deleteStory(storyActions.parentElement as HTMLDivElement, story.id));
    storyActions.appendChild(deleteButton);
  }

  private createEditButton(storyActions: HTMLDivElement, story: Story) {
    const editButton = document.createElement('button') as HTMLButtonElement;
    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit';

    editButton.addEventListener('click', () => this.editStory(storyActions.parentElement as HTMLDivElement, story, editButton));
    storyActions.appendChild(editButton);
  }

  private editStory(storyElement: HTMLDivElement, story: Story, editButton: HTMLButtonElement) {
    const newStoryName = prompt('Edit story name:', story.name);
    const newStoryDescription = prompt('Edit story description:', story.description);
    const newStoryPriority = prompt('Edit story priority (Low, Medium, High):', story.priority);
    const newStoryStatus = prompt('Edit story status (To do, Doing, Done):', story.status);
    const newStoryOwner = prompt('Edit story owner:', story.owner);

    if (newStoryName && newStoryName.trim() && newStoryDescription && newStoryDescription.trim() &&
      newStoryPriority && ['Low', 'Medium', 'High'].includes(newStoryPriority) &&
      newStoryStatus && ['To do', 'Doing', 'Done'].includes(newStoryStatus) &&
      newStoryOwner && newStoryOwner.trim()) {

      const storyInfo = storyElement.querySelector('.story-info') as HTMLDivElement;
      storyInfo.textContent = `${newStoryName.trim()}: ${newStoryDescription.trim()} (Priority: ${newStoryPriority}, Status: ${newStoryStatus}, Owner: ${newStoryOwner})`;

      const existingStories = JSON.parse(localStorage.getItem('stories') || '[]') as Story[];
      const storyIndex = existingStories.findIndex(s => s.id === story.id);
      if (storyIndex > -1) {
        existingStories[storyIndex].name = newStoryName.trim();
        existingStories[storyIndex].description = newStoryDescription.trim();
        existingStories[storyIndex].priority = newStoryPriority as 'Low' | 'Medium' | 'High';
        existingStories[storyIndex].status = newStoryStatus as 'To do' | 'Doing' | 'Done';
        existingStories[storyIndex].owner = newStoryOwner.trim();
        localStorage.setItem('stories', JSON.stringify(existingStories));
      }

      console.log(`Story updated: ${newStoryName.trim()}`);
    }
  }
}
