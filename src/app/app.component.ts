import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgFor, NgClass, NgIf, CommonModule } from '@angular/common';
import { CdkDragDrop ,moveItemInArray,transferArrayItem} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, FormsModule, NgFor, NgClass, NgIf,DragDropModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'AgileTaskManagementPlatformwithDragandDropButton';
  showTaskModal = false;
  showDeleteModal=false;
  deleteIndex:number | null = null;
  modalMode:'add' | 'edit' = 'add';
  newTask={title:'',desc:'',priority:'Low',status:'new',date:''};
  editingIndex:number| null = null;
  newTasks: any[] = [];
  inProgressTasks: any[] = [];
  completedTasks: any[] = [];
  deliveredTasks: any[] = [];
  showSuccessPopup = false;
  showUpdatePopup = false;
  showDeletePopup = false;
  showFilter = false;
  showNewColumn = true;
showProgressColumn = true;
showCompletedColumn = true;
showDeliveredColumn = true;
showColumnPanel=false;
showColumnModal = false;
newColumnName = '';
dynamicColumns: any[] = [];
showColumnDeleteModal = false;
columnToDeleteKey: string | null = null;
showColumnSuccessPopup = false;
showColumnDeleteSuccessPopup = false;
editingColumnId: string | null = null;
editedColumnName = '';
showColumnEditSuccessPopup = false;



  tasks=[
    {title:'', desc:'',priority:'',status:'',date:''
    },
    
  ];
  
 addTask(){
  this.tasks.push({
    title: this.newTask.title,
    desc: this.newTask.desc,
    priority: this.newTask.priority,
    status: 'new',
    date: this.newTask.date
  });

  this.newTask = {title:'', desc:'', priority:'Low', status:'new', date:''};

  this.showTaskModal=false;
  this.showSuccessPopup = true;

  setTimeout(()=>{
    this.showSuccessPopup = false;
  },2000);
  this.saveData();
}
  editTask(i:number){
    this.editingIndex =i;
    this.newTask={...this.tasks[i]};
    this.saveData();
  }
  
  
   drop(event: CdkDragDrop<any[]>, status: string) {

  const draggedTask = event.item.data;

  
  draggedTask.status = status;

  
  const oldIndex = this.tasks.findIndex(t => t === draggedTask);
  this.tasks.splice(oldIndex, 1);

  
  const columnTasks = this.getTasksByStatus(status);

  if (event.currentIndex >= columnTasks.length) {
    this.tasks.push(draggedTask);
  } else {
    const targetTask = columnTasks[event.currentIndex];
    const newIndex = this.tasks.findIndex(t => t === targetTask);
    this.tasks.splice(newIndex, 0, draggedTask);
  }
  this.saveData();
}
getTasksByStatus(status:string){
  return this.tasks.filter(t => t.status === status);
}
  openAddModal(){
  this.modalMode = 'add';
  this.newTask = { title:'', desc:'', priority:'Low',status:'new',date:'' };
  this.showTaskModal = true;
}


closeModal(){
  this.showTaskModal = false;
}

cancelDelete(){
  this.deleteIndex = null;
  this.showDeleteModal = false;
}
openEditModal(i:number){
  this.modalMode = 'edit';
  this.editingIndex = i;
  this.newTask = {...this.tasks[i]};
  this.showTaskModal = true;
}  
updateTask(){
  if(this.editingIndex !== null){

    this.tasks[this.editingIndex] = {...this.newTask};

    this.editingIndex = null;

    this.showTaskModal = false;

    
    this.showUpdatePopup = true;
    setTimeout(()=> this.showUpdatePopup=false, 2000);
  }
  this.saveData();
}
openDeleteModal(i:number){
  this.deleteIndex = i;
  this.showDeleteModal = true;
}
confirmDelete(){
  if(this.deleteIndex !== null){

    this.tasks.splice(this.deleteIndex,1);
    this.deleteIndex = null;
    this.showDeleteModal = false;

    
    this.showDeletePopup = true;
    setTimeout(()=> this.showDeletePopup=false, 2000);
  }
  this.saveData();
}
sortByPriority(type:string){

  if(type === 'High'){
    this.tasks.sort((a,b)=>
      (b.priority === 'High' ? 1 : 0) -
      (a.priority === 'High' ? 1 : 0)
    );
  }

  else if(type === 'Medium'){
    this.tasks.sort((a,b)=>
      (b.priority === 'Medium' ? 1 : 0) -
      (a.priority === 'Medium' ? 1 : 0)
    );
  }

  else if(type === 'Low'){
    this.tasks.sort((a,b)=>
      (b.priority === 'Low' ? 1 : 0) -
      (a.priority === 'Low' ? 1 : 0)
    );
  }

}
sortByDate(type:string){

  this.tasks.sort((a,b)=>{
    const d1 = new Date(a.date).getTime();
    const d2 = new Date(b.date).getTime();
    return type === 'asc' ? d1-d2 : d2-d1;
  });

}



isDarkMode = false;

toggleTheme() {
  this.isDarkMode = !this.isDarkMode;

  if (this.isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}
openColumnModal() {
  this.newColumnName = '';
  this.showColumnModal = true;
}

closeColumnModal() {
  this.showColumnModal = false;
}
openColumnDeleteModal(key: string) {
  this.columnToDeleteKey = key;
  this.showColumnDeleteModal = true;
}

createColumn() {

  if (!this.newColumnName.trim()) return;

  const id = this.newColumnName.toLowerCase().replace(/\s+/g, '');

  this.dynamicColumns.push({
    name: this.newColumnName,
    id: id
  });

  this.newColumnName = '';
  this.showColumnModal = false;

  this.showColumnSuccessPopup = true;

  setTimeout(() => {
    this.showColumnSuccessPopup = false;
  }, 2000);

  this.saveData();
}

confirmColumnDelete() {

  if (!this.columnToDeleteKey) return;

  this.tasks = this.tasks.filter(
    t => t.status !== this.columnToDeleteKey
  );

  this.dynamicColumns = this.dynamicColumns.filter(
    col => col.id !== this.columnToDeleteKey
  );

  if (this.columnToDeleteKey === 'new') this.showNewColumn = false;
  if (this.columnToDeleteKey === 'progress') this.showProgressColumn = false;
  if (this.columnToDeleteKey === 'completed') this.showCompletedColumn = false;
  if (this.columnToDeleteKey === 'delivered') this.showDeliveredColumn = false;

  this.columnToDeleteKey = null;
  this.showColumnDeleteModal = false;

  this.showColumnDeleteSuccessPopup = true;

  setTimeout(() => {
    this.showColumnDeleteSuccessPopup = false;
  }, 2000);

  this.saveData();
}
getConnectedLists(): string[] {

  const defaultLists = ['newList','progressList','completedList','deliveredList'];

  const dynamicLists = this.dynamicColumns.map(col => col.id);

  return [...defaultLists, ...dynamicLists];
}
ngOnInit() {
  this.loadData();
}

saveData() {
  localStorage.setItem('tasks', JSON.stringify(this.tasks));
  localStorage.setItem('dynamicColumns', JSON.stringify(this.dynamicColumns));
}

loadData() {
  const savedTasks = localStorage.getItem('tasks');
  const savedColumns = localStorage.getItem('dynamicColumns');

  if (savedTasks) {
    this.tasks = JSON.parse(savedTasks);
  }

  if (savedColumns) {
    this.dynamicColumns = JSON.parse(savedColumns);
  }
}
// EDIT COLOUM HEADER
openEditColumn(col: any) {
  this.editingColumnId = col.id;
  this.editedColumnName = col.name;
}

saveColumnName(col: any) {

  if (!this.editedColumnName.trim()) return;

  col.name = this.editedColumnName.trim();

  this.editingColumnId = null;
  this.editedColumnName = '';

  this.showColumnEditSuccessPopup = true;

  setTimeout(() => {
    this.showColumnEditSuccessPopup = false;
  }, 2000);

  this.saveData(); // if using localStorage
}

cancelColumnEdit() {
  this.editingColumnId = null;
  this.editedColumnName = '';
}

  
}