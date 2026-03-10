import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../services/task.service';
import { ColumnService } from '../services/column.service';
import { AuthService } from '../services/auth.service';
import Chart from 'chart.js/auto';

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
 { id:'new', name:'NEW TASK', color:'#3b82f6' },
 { id:'progress', name:'IN PROGRESS', color:'#f59e0b' },
 { id:'completed', name:'COMPLETED', color:'#10b981' },
 { id:'delivered', name:'DELIVERED', color:'#8b5cf6' }
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
  showProfileModal = false;
newProfilePassword: string = '';
profileSuccessMessage: string = '';
columnColors: any = {
  new: "#3498db",
  progress: "#f39c12",
  completed: "#2ecc71",
  delivered: "#9b59b6"
};
showFullAnalytics = false;
showProfileUpdatePopup = false;
profileErrorMessage: string = '';
totalTasks:number = 0;
completedTasks:number = 0;

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
  this.currentUser = parsedUser.name;

  // Load Tasks
  this.taskService.getTasks(this.currentUser)
.subscribe(data => {

  this.tasks = data;

  // animate after tasks load
  setTimeout(() => {

    this.animateValue(
      0,
      this.getTotalTasks(),
      800,
      (v)=>this.totalTasks=v
    );

    this.animateValue(
      0,
      this.getCompletedTasks(),
      800,
      (v)=>this.completedTasks=v
    );

  },200);

});

  // Load Columns
this.columnService.getColumns(this.currentUser)
  .subscribe(cols => {

    const defaultColumns = [
      { id:'new', name:'NEW TASK', color:'#3b82f6' },
      { id:'progress', name:'IN PROGRESS', color:'#f59e0b' },
      { id:'completed', name:'COMPLETED', color:'#10b981' },
      { id:'delivered', name:'DELIVERED', color:'#8b5cf6' }
    ];

    // merge default + database columns
    const merged = [...defaultColumns];

    cols.forEach((c:any)=>{
      if(!merged.find(m => m.id === c.id)){
        merged.push(c);
      }
    });

    this.columns = merged;

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
  const id = this.newColumnName.toLowerCase().replace(/\s+/g,'')+ Date.now();

if (this.columns.find(c => c.id === id)) {
  alert("Column already exists");
  return;
}

  const colors = [
 "#3b82f6",
 "#10b981",
 "#f59e0b",
 "#ef4444",
 "#8b5cf6",
 "#06b6d4"
];

const randomColor = colors[Math.floor(Math.random()*colors.length)];

const columnId =
this.newColumnName.toLowerCase().replace(/\s+/g,'') + Date.now();

const columnData = {
 id: columnId,
 name: this.newColumnName,
 color: randomColor,
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
  this.showProfileModal = true;
}
updateProfile() {
  this.profileErrorMessage = '';

  if (!this.newProfilePassword.trim()) return;

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!strongPassword.test(this.newProfilePassword)) {
    return;
  }

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // 🚨 CHECK IF SAME PASSWORD
  if (user.password === this.newProfilePassword) {
  this.profileErrorMessage = "New password cannot be same as old password";
  return;
}

  const updatedUser = {
    ...user,
    password: this.newProfilePassword
  };

  this.authService.updateUser(user.id, updatedUser)
    .subscribe(res => {

      localStorage.setItem('currentUser', JSON.stringify(res));

      this.showProfileUpdatePopup = true;

      setTimeout(() => {
        this.showProfileUpdatePopup = false;
        this.showProfileModal = false;
        this.newProfilePassword = '';
      }, 2000);

    });
}
getCompletedTasks() {
  return this.tasks.filter(
    t => t.status === 'completed' || t.status === 'delivered'
  ).length;
}

getProgress() {
  if (this.tasks.length === 0) return 0;

  return (this.getCompletedTasks() / this.tasks.length) * 100;
}
getCompletionPercent() {

  const total = this.getTotalTasks();

  if (total === 0) return 0;

  const completed = this.getCompletedTasks();

  return Math.round((completed / total) * 100);
}
getColumnProgress(status: string) {

  const total = this.getTotalTasks();

  if (total === 0) return 0;

  const count = this.getColumnTaskCount(status);

  return (count / total) * 100;
}
getColumnTaskCount(status: string) {
  return this.tasks.filter(t => t.status === status).length;
}

getColumnProgressPercent(status: string) {

  const total = this.getTotalTasks();

  if (total === 0) return 0;

  const count = this.getColumnTaskCount(status);

  return Math.round((count / total) * 100);
}
getTotalTasks() {
  let total = 0;

  this.columns.forEach(col => {
    total += this.getTasksByStatus(col.id).length;
  });

  return total;
}
getAvatarColor(): string {

  const colors = [
    "#6366f1",   // indigo
    "#3b82f6",   // blue
    "#10b981",   // green
    "#f59e0b",   // orange
    "#ef4444",   // red
    "#8b5cf6",   // purple
    "#06b6d4"    // cyan
  ];

  if (!this.currentUser) return colors[0];

  let index = this.currentUser.charCodeAt(0) % colors.length;

  return colors[index];
}
isTaskOverdue(task:any){

const today = new Date();

return new Date(task.date) < today &&
       task.status !== 'completed' &&
       task.status !== 'delivered';

}
isTaskDueSoon(task:any){

const today = new Date();

const dueDate = new Date(task.date);

const diff = (dueDate.getTime() - today.getTime()) / (1000*60*60*24);

return diff >= 0 && diff <= 2 &&
       task.status !== 'completed' &&
       task.status !== 'delivered';

}
isTaskOnTrack(task:any){

const today = new Date();

const dueDate = new Date(task.date);

const diff = (dueDate.getTime() - today.getTime()) / (1000*60*60*24);

return diff > 2 &&
       task.status !== 'completed' &&
       task.status !== 'delivered';

}
getOverdueTasks(){

return this.tasks.filter(t => this.isTaskOverdue(t)).length;

}
getColumnIcon(colId:string){

if(colId === 'new') return 'assignment';
if(colId === 'progress') return 'autorenew';
if(colId === 'completed') return 'check_circle';
if(colId === 'delivered') return 'local_shipping';

/* Any new column created by user */
return 'view_kanban';

}
openAnalytics() {

this.showFullAnalytics = true;

setTimeout(() => {

  this.initCharts();

}, 500);

}

closeAnalytics(){
  this.showFullAnalytics = false;
}
initCharts(){

const columnLabels = this.columns.map(c => c.name);
const columnData = this.columns.map(c => this.getColumnTaskCount(c.id));

new Chart("columnChart",{

type:'doughnut',

data:{
labels:columnLabels,
datasets:[{
data:columnData,
backgroundColor:this.columns.map(c => c.color)
}]
}

});

const priorityData = [
this.tasks.filter(t=>t.priority==="High").length,
this.tasks.filter(t=>t.priority==="Medium").length,
this.tasks.filter(t=>t.priority==="Low").length
];

new Chart("priorityChart",{

type:'doughnut',

data:{
labels:["High","Medium","Low"],
datasets:[{
data:priorityData,
backgroundColor:["#ef4444","#f59e0b","#10b981"]
}]
}

});

const dueData = [
this.getOverdueTasks(),
this.tasks.filter(t=>this.isTaskDueSoon(t)).length,
this.tasks.filter(t=>this.isTaskOnTrack(t)).length
];

new Chart("dueChart",{

type:'doughnut',

data:{
labels:["Overdue","Due Soon","On Track"],
datasets:[{
data:dueData,
backgroundColor:["#ef4444","#f59e0b","#10b981"]
}]
}

});

const weeklyData = [
2,4,3,5,6,3,4
];

new Chart("weeklyChart",{

type:'line',

data:{
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[{
label:"Completed Tasks",
data:weeklyData,
borderColor:"#6366f1",
fill:false
}]
}

});

}
animateValue(start:number,end:number,duration:number,callback:(value:number)=>void){

let startTimestamp:any=null;

const step=(timestamp:any)=>{

if(!startTimestamp) startTimestamp=timestamp;

const progress=Math.min((timestamp-startTimestamp)/duration,1);

const value=Math.floor(progress*(end-start)+start);

callback(value);

if(progress<1){
requestAnimationFrame(step);
}

};

requestAnimationFrame(step);

}

}