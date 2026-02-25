import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, DragDropModule, CommonModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  // ------------------ DATA ------------------

  tasks: any[] = [];

  columns: any[] = [
    { id: 'new', name: 'NEW TASK', isDefault: true },
    { id: 'progress', name: 'IN PROGRESS', isDefault: true },
    { id: 'completed', name: 'COMPLETED', isDefault: true },
    { id: 'delivered', name: 'DELIVERED', isDefault: true }
  ];

  // ------------------ UI STATES ------------------

  showTaskModal = false;
  showDeleteModal = false;
  showColumnModal = false;
  showColumnDeleteModal = false;

  showSuccessPopup = false;
  showDeletePopup = false;
  showUpdatePopup = false;
  showColumnSuccessPopup = false;
  showColumnDeleteSuccessPopup = false;
  showColumnEditSuccessPopup = false;

  modalMode: 'add' | 'edit' = 'add';
  editingIndex: number | null = null;
  deleteIndex: number | null = null;

  newTask = { title: '', desc: '', priority: 'Low', status: 'new', date: '' };
  newColumnName = '';

  columnToDeleteKey: string | null = null;
  editingColumnId: string | null = null;
  editedColumnName = '';
  showFilter = false;
  isDarkMode = false;
  searchText: string = ''; 
  currentUser: string = '';
  showUserMenu: boolean = false;
  constructor(private router: Router) {}  

  // ------------------ INIT ------------------
 ngOnInit() {
  const user = localStorage.getItem('currentUser');

  if (!user) {
    this.router.navigate(['/login']);
    return;
  }

  const parsedUser = JSON.parse(user);   
  this.currentUser = parsedUser.email;   

  this.loadData();
}

  // ------------------ TASK METHODS ------------------

 getTasksByStatus(status: string) {
  return this.tasks.filter(t =>
    t.status === status &&
    (
      t.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      t.desc.toLowerCase().includes(this.searchText.toLowerCase())
    )
  );
}

  openAddModal(status: string) {
    this.modalMode = 'add';
    this.newTask = { title: '', desc: '', priority: 'Low', status: status, date: '' };
    this.showTaskModal = true;
  }

  addTask() {
    this.tasks.push({ ...this.newTask });
    this.showTaskModal = false;
    this.showSuccessPopup = true;
    setTimeout(() => this.showSuccessPopup = false, 2000);
    this.saveData();
  }

  openEditModal(index: number) {
    this.modalMode = 'edit';
    this.editingIndex = index;
    this.newTask = { ...this.tasks[index] };
    this.showTaskModal = true;
  }

  updateTask() {
    if (this.editingIndex !== null) {
      this.tasks[this.editingIndex] = { ...this.newTask };
      this.showTaskModal = false;
      this.showUpdatePopup = true;
      setTimeout(() => this.showUpdatePopup = false, 2000);
      this.saveData();
    }
  }

  openDeleteModal(index: number) {
    this.deleteIndex = index;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.deleteIndex !== null) {
      this.tasks.splice(this.deleteIndex, 1);
      this.showDeleteModal = false;
      this.showDeletePopup = true;
      setTimeout(() => this.showDeletePopup = false, 2000);
      this.saveData();
    }
  }

  drop(event: CdkDragDrop<any[]>, status: string) {

  const draggedTask = event.item.data;

  // SAME COLUMN REORDER
  if (event.previousContainer === event.container) {

    const columnTasks = this.getTasksByStatus(status);

    moveItemInArray(
      columnTasks,
      event.previousIndex,
      event.currentIndex
    );

    // Rebuild tasks array to reflect new order
    this.tasks = [
      ...this.tasks.filter(t => t.status !== status),
      ...columnTasks
    ];

  }
  else {

    // MOVING BETWEEN COLUMNS
    draggedTask.status = status;
  }

  this.saveData();
}

  // ------------------ COLUMN METHODS ------------------

  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.saveData();
  }

  openColumnModal() {
    this.newColumnName = '';
    this.showColumnModal = true;
  }

  createColumn() {
    if (!this.newColumnName.trim()) return;

    const id = this.newColumnName.toLowerCase().replace(/\s+/g, '');

    this.columns.push({
      id: id,
      name: this.newColumnName,
      isDefault: false
    });

    this.showColumnModal = false;
    this.showColumnSuccessPopup = true;
    setTimeout(() => this.showColumnSuccessPopup = false, 2000);
    this.saveData();
  }

  openColumnDeleteModal(id: string) {
    this.columnToDeleteKey = id;
    this.showColumnDeleteModal = true;
  }

  confirmColumnDelete() {
    if (!this.columnToDeleteKey) return;

    this.tasks = this.tasks.filter(t => t.status !== this.columnToDeleteKey);
    this.columns = this.columns.filter(c => c.id !== this.columnToDeleteKey);

    this.showColumnDeleteModal = false;
    this.showColumnDeleteSuccessPopup = true;
    setTimeout(() => this.showColumnDeleteSuccessPopup = false, 2000);
    this.saveData();
  }

  openEditColumn(col: any) {
    this.editingColumnId = col.id;
    this.editedColumnName = col.name;
  }

  saveColumnName(col: any) {
    if (!this.editedColumnName.trim()) return;
    col.name = this.editedColumnName;
    this.editingColumnId = null;
    this.showColumnEditSuccessPopup = true;
    setTimeout(() => this.showColumnEditSuccessPopup = false, 2000);
    this.saveData();
  }

  // ------------------ STORAGE ------------------

  saveData() {
  localStorage.setItem(`tasks_${this.currentUser}`, JSON.stringify(this.tasks));
  localStorage.setItem(`columns_${this.currentUser}`, JSON.stringify(this.columns));
}

  loadData() {
  const savedTasks = localStorage.getItem(`tasks_${this.currentUser}`);
  const savedColumns = localStorage.getItem(`columns_${this.currentUser}`);

  if (savedTasks) this.tasks = JSON.parse(savedTasks);
  if (savedColumns) this.columns = JSON.parse(savedColumns);
}

  getConnectedLists() {
    return this.columns.map(col => col.id);
  }
  toggleTheme() {
  this.isDarkMode = !this.isDarkMode;

  if (this.isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

sortByPriority(type: string) {

  if (!type) return;

  this.tasks.sort((a, b) => {
    return a.priority === type ? -1 : 1;
  });

  this.saveData();
}

sortByDate(type: string) {
  this.tasks.sort((a, b) => {
    const d1 = new Date(a.date).getTime();
    const d2 = new Date(b.date).getTime();
    return type === 'asc' ? d1 - d2 : d2 - d1;
  });

  this.saveData();
}
highlight(text: string): string {
  if (!this.searchText) return text;

  const regex = new RegExp(`(${this.searchText})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
logout() {
  localStorage.removeItem('loggedUser');
  this.router.navigate(['/login']);
}
getUserInitial(): string {
  return this.currentUser ? this.currentUser.charAt(0).toUpperCase() : '';
}


toggleUserMenu() {
  this.showUserMenu = !this.showUserMenu;
}

goToProfile() {
  alert('Profile page coming soon 😎');
}


}