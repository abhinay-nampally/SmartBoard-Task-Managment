import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../services/task.service';
import { ColumnService } from '../services/column.service';
import { AuthService } from '../services/auth.service';

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
  constructor(
  private router: Router,
  private taskService: TaskService,
  private columnService: ColumnService,
  private authService: AuthService
) {}
  // ------------------ INIT ------------------
 ngOnInit() {

  const user = localStorage.getItem('currentUser');

  if (!user) {
    this.router.navigate(['/login']);
    return;
  }

  const parsedUser = JSON.parse(user);
  this.currentUser = parsedUser.email;

  // Load Tasks
  this.taskService.getTasks(this.currentUser)
    .subscribe(data => {
      this.tasks = data;
    });

  // Load Columns
  this.columnService.getColumns(this.currentUser)
    .subscribe(cols => {

      if (cols.length > 0) {
        this.columns = cols;
      }
    });
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

  const taskData = {
    ...this.newTask,
    user: this.currentUser,
    order:this.tasks.length
  };

  this.taskService.addTask(taskData)
    .subscribe(res => {

      this.tasks.push(res);

      this.showTaskModal = false;
      this.showSuccessPopup = true;
      setTimeout(() => this.showSuccessPopup = false, 2000);
    });
}

  openEditModal(index: number) {
    this.modalMode = 'edit';
    this.editingIndex = index;
    this.newTask = { ...this.tasks[index] };
    this.showTaskModal = true;
  }

 updateTask() {

  if (this.editingIndex === null) return;

  const task = this.tasks[this.editingIndex];

  this.taskService.updateTask(task.id, this.newTask)
    .subscribe(res => {

      this.tasks[this.editingIndex!] = res;

      this.showTaskModal = false;
      this.showUpdatePopup = true;
      setTimeout(() => this.showUpdatePopup = false, 2000);
    });
}

  openDeleteModal(index: number) {
    this.deleteIndex = index;
    this.showDeleteModal = true;
  }

  confirmDelete() {

  if (this.deleteIndex === null) return;

  const task = this.tasks[this.deleteIndex];

  this.taskService.deleteTask(task.id)
    .subscribe(() => {

      this.tasks.splice(this.deleteIndex!, 1);

      this.showDeleteModal = false;
      this.showDeletePopup = true;
      setTimeout(() => this.showDeletePopup = false, 2000);
    });
}

 drop(event: CdkDragDrop<any[]>, newStatus: string) {

  const draggedTask = event.item.data;

  // SAME COLUMN REORDER
  if (event.previousContainer === event.container) {

  const columnTasks = this.getTasksByStatus(newStatus);

  moveItemInArray(
    columnTasks,
    event.previousIndex,
    event.currentIndex
  );

  // 🔥 Update order for each task
  columnTasks.forEach((task, index) => {
    task.order = index;

    this.taskService.updateTask(task.id, task)
      .subscribe();
  });

  this.tasks = [
    ...this.tasks.filter(t => t.status !== newStatus),
    ...columnTasks
  ];
}

  // MOVING BETWEEN COLUMNS
  else {

    // 🔥 IMPORTANT LINE
    draggedTask.status = newStatus;

    this.taskService.updateTask(draggedTask.id, draggedTask)
      .subscribe(res => {

        // update local task array
        const index = this.tasks.findIndex(t => t.id === draggedTask.id);
        if (index !== -1) {
          this.tasks[index] = res;
        }

      });
  }
}

  // ------------------ COLUMN METHODS ------------------

  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    
  }

  openColumnModal() {
    this.newColumnName = '';
    this.showColumnModal = true;
  }

  createColumn() {

  if (!this.newColumnName.trim()) return;

  const columnData = {
    name: this.newColumnName,
    user: this.currentUser
  };

  this.columnService.createColumn(columnData)
    .subscribe((res: any) => {

      this.columns.push(res);

      this.showColumnModal = false;
      this.newColumnName = '';

      this.showColumnSuccessPopup = true;
      setTimeout(() => this.showColumnSuccessPopup = false, 2000);
    });
}
openColumnDeleteModal(id: string) {
  this.columnToDeleteKey = id;
  this.showColumnDeleteModal = true;
}
  confirmColumnDelete() {

  if (!this.columnToDeleteKey) return;

  const column = this.columns.find(c => c.id === this.columnToDeleteKey);

  if (!column) return;

  this.columnService.deleteColumn(column.id)
    .subscribe(() => {

      this.columns = this.columns.filter(c => c.id !== column.id);
      this.tasks = this.tasks.filter(t => t.status !== column.id);

      this.showColumnDeleteModal = false;
      this.showColumnDeleteSuccessPopup = true;
      setTimeout(() => this.showColumnDeleteSuccessPopup = false, 2000);
    });
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
    
  }

  // ------------------ STORAGE ------------------

  

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

  
}

sortByDate(type: string) {
  this.tasks.sort((a, b) => {
    const d1 = new Date(a.date).getTime();
    const d2 = new Date(b.date).getTime();
    return type === 'asc' ? d1 - d2 : d2 - d1;
  });

  
}
highlight(text: string): string {
  if (!this.searchText) return text;

  const regex = new RegExp(`(${this.searchText})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
logout() {

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  this.authService.logout(user.id)
    .subscribe(() => {

      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);

    });
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