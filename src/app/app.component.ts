import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { CdkDragDrop ,moveItemInArray,transferArrayItem} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, FormsModule, NgFor, NgClass, NgIf,DragDropModule],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'AgileTaskManagementPlatformwithDragandDropButton';
  showTaskModal = false;
  showDeleteModal=false;
  deleteIndex:number | null = null;
  modalMode:'add' | 'edit' = 'add';
  newTask={title:'',desc:'',priority:'Low',status:'new'};
  editingIndex:number| null = null;
  newTasks: any[] = [];
  inProgressTasks: any[] = [];
  completedTasks: any[] = [];
  deliveredTasks: any[] = [];
  showSuccessPopup = false;
  showUpdatePopup = false;
  showDeletePopup = false;



  tasks=[
    {title:'Design UI Wireframe', desc:'Create Login Page',priority:'High',status:'new'
    },
    {title:'Task Sorting Feature', desc:'Move tasks',priority:'Medium',status:'progress'
    },
    {title:'Angular Setup', desc:'Install Angular',priority:'Low',status:'completed'
    },
    {title:'User Testing', desc:'Check localhost',priority:'Low',status:'delivered'
    }
  ];
  
  addTask(){
    this.tasks.push({
      title:this.newTask.title,
      desc:this.newTask.desc,
      priority:this.newTask.priority,
      status:'new'
    });
    this.newTask={title:'',desc:'',priority:'Low',status:'new'};
    this.showTaskModal=false;
    this.showSuccessPopup = true;

    setTimeout(()=>{
    this.showSuccessPopup = false;
    },2000);


  } 
  editTask(i:number){
    this.editingIndex =i;
    this.newTask={...this.tasks[i]};
  }
  
  
    drop(event: CdkDragDrop<any[]>, status: string) {

  const draggedTask = event.item.data;

  
  if (draggedTask.status !== status) {
    draggedTask.status = status;
  }

  
  const columnTasks = this.tasks.filter(t => t.status === status);

  const fromIndex = columnTasks.findIndex(t => t === draggedTask);

  
  columnTasks.splice(fromIndex, 1);
  columnTasks.splice(event.currentIndex, 0, draggedTask);

  
  this.tasks = [
    ...this.tasks.filter(t => t.status !== status),
    ...columnTasks
  ];


}
getTasksByStatus(status: string) {
  return this.tasks.filter(task => task.status === status);
}
counterUpdated = false;

flashCounter() {
  this.counterUpdated = true;
  setTimeout(() => {
    this.counterUpdated = false;
  }, 600);
}
  openAddModal(){
  this.modalMode = 'add';
  this.newTask = { title:'', desc:'', priority:'Low',status:'new' };
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
}
  
}